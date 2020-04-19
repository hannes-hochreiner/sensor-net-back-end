export class Repo {
  constructor(pool, uuid) {
    this._pool = pool;
    this._uuid = uuid;
  }

  async putMessage(role, msg) {
    return this._pgWrapper(role, async client => {
      if (msg.type !== 'rfm') {
        throw new Error(`Unknown message type "${msg.type}"`);
      }

      let equipment = await this._getOrCreateObject(client, 'equipment', {
        _id: this._uuid(),
        _rev: this._uuid(),
        id: msg.message.mcuId,
        info: null
      });
      let measurement = {
        _id: this._uuid(),
        _rev: this._uuid(),
        ts: new Date(msg.timestamp),
        _equipment_id: equipment._id,
        index: msg.message.index,
        rssi: this._parseFloat(msg.rssi)
      };

      await this._insertObject(client, 'measurement', measurement);

      for (let measIdx in msg.message.measurements) {
        let sensor = await this._getOrCreateObject(client, 'sensor', {
          _id: this._uuid(),
          _rev: this._uuid(),
          id: msg.message.measurements[measIdx].sensorId,
          info: null
        });

        for (let paraKey in msg.message.measurements[measIdx].parameters) {
          let parameterType = await this._getOrCreateObject(client, 'parameter_type', {
            _id: this._uuid(),
            _rev: this._uuid(),
            id: paraKey,
            unit: msg.message.measurements[measIdx].parameters[paraKey].unit,
            info: null
          }, ['id', 'unit']);
          await this._insertObject(client, 'parameter', {
            _id: this._uuid(),
            _rev: this._uuid(),
            _measurement_id: measurement._id,
            _parameter_type_id: parameterType._id,
            _sensor_id: sensor._id,
            val: msg.message.measurements[measIdx].parameters[paraKey].value
          });
        }
      }
    });
  }

  _parseFloat(obj) {
    let res = Number.parseFloat(obj);
    
    if (Number.isNaN(res)) {
      throw new Error(`"${obj}" cannot be converted into a number.`);
    }

    return res;
  }

  async _getOrCreateObject(client, objectType, newObject, idFields) {
    let idColumns = idFields || ['id'];
    let obj = (await client.query(`SELECT * FROM ${objectType} WHERE ${idColumns.map((val, idx) => `${val} = $${idx+1}`).join(' AND ')}`, idColumns.map(val => newObject[val]))).rows[0];

    
    if (typeof obj == 'undefined') {
      obj = newObject;
      await this._insertObject(client, objectType, newObject);
    }

    return obj;
  }

  async _insertObject(client, objectType, newObject) {
    await client.query(`INSERT INTO ${objectType} (${Object.getOwnPropertyNames(newObject).join(',')}) VALUES (${Object.getOwnPropertyNames(newObject).map((_val, idx) => { return '$' + (idx+1); }).join(',')})`, Object.getOwnPropertyNames(newObject).map(val => {return newObject[val];}));
  }

  async getMeasurementDataByStartEndTime(role, startTime, endTime) {
    return this._pgWrapper(role, async client => {
      return (await client.query(`SELECT m._id as _measurement_id, m.ts, m.index, m.rssi, m._equipment_id, p._id as _parameter_id, p._parameter_type_id, p._sensor_id, p.val FROM measurement m LEFT JOIN parameter p ON m._id = p._measurement_id WHERE m.ts >= $1 AND m.ts < $2`, [startTime, endTime])).rows;
    });
  }

  async getAllEquipment(role) {
    return this._pgWrapper(role, async client => {
      return (await client.query('SELECT * FROM equipment')).rows;
    });
  }

  async getAllSensors(role) {
    return this._pgWrapper(role, async client => {
      return (await client.query('SELECT * FROM sensor')).rows;
    });
  }

  async getAllParameterTypes(role) {
    return this._pgWrapper(role, async client => {
      return (await client.query('SELECT * FROM parameter_type')).rows;
    });
  }

  async _pgWrapper(role, fun) {
    const client = await this._pool.connect();

    try {
      await client.query(`SET ROLE ${role}`);
      await client.query(`BEGIN`);
      let res = await fun(client);
      await client.query('COMMIT');
      await client.query('RESET ROLE');

      return res;
    } catch(error) {
      try {
        await client.query('ROLLBACK');
        await client.query('RESET ROLE');
      } finally {
        throw error;
      }
    } finally {
      client.release();
    }
  }
}
