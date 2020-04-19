import {Repo} from '../bld/repo';
import {SequenceSpy} from './sequenceSpy';

describe('Repo', () => {
  it('can parse a number', () => {
    let repo = new Repo();

    expect(repo._parseFloat('3.2')).toEqual(3.2);
    expect(repo._parseFloat(3.2)).toEqual(3.2);
  });

  it('can put a message into the database (1)', async () => {
    let msg = {
      "type": "rfm",
      "rssi": "-87",
      "timestamp": "2020-04-18T15:59:56.071Z",
      "message": {
        "mcuId": "005a0000-33373938-17473634",
        "index": 1524,
        "measurements": [
          {
            "sensorId": "be01",
            "parameters": {
              "temperature": { "value": 25.68000030517578, "unit": "°C" }
            }
          }
        ]
      }
    };
    let mockUUID = new MockUUID();
    let mockPool = {
      connect: function() {
        return new SequenceSpy([
          {name: 'query', args: ['SET ROLE testRole']},
          {name: 'query', args: ['BEGIN']},
          {name: 'query', args: ['SELECT * FROM equipment WHERE id = $1', ['005a0000-33373938-17473634']], return: {rows: [{_id: 'equId1'}]}},
          {name: 'query', args: ['INSERT INTO measurement (_id,_rev,ts,_equipment_id,index,rssi) VALUES ($1,$2,$3,$4,$5,$6)', [2,3,new Date('2020-04-18T15:59:56.071Z'),'equId1',1524,-87]]},
          {name: 'query', args: ['SELECT * FROM sensor WHERE id = $1', ['be01']], return: {rows: [{_id: 'sensorId1'}]}},
          {name: 'query', args: ['SELECT * FROM parameter_type WHERE id = $1 AND unit = $2', ['temperature', '°C']], return: {rows: [{_id: 'partypeId1'}]}},
          {name: 'query', args: ['INSERT INTO parameter (_id,_rev,_measurement_id,_parameter_type_id,_sensor_id,val) VALUES ($1,$2,$3,$4,$5,$6)', [8,9,2,'partypeId1','sensorId1',25.68000030517578]]},
          {name: 'query', args: ['COMMIT']},
          {name: 'query', args: ['RESET ROLE']},
          {name: 'release'},
        ]);
      }
    };
    let repo = new Repo(mockPool, mockUUID.uuid.bind(mockUUID));
    await repo.putMessage('testRole', msg);
  });

  it('can put a message into the database (2)', async () => {
    let msg = {
      "type": "rfm",
      "rssi": "-87",
      "timestamp": "2020-04-18T15:59:56.071Z",
      "message": {
        "mcuId": "005a0000-33373938-17473634",
        "index": 1524,
        "measurements": [
          {
            "sensorId": "be01",
            "parameters": {
              "temperature": { "value": 25.68000030517578, "unit": "°C" }
            }
          }
        ]
      }
    };
    let mockUUID = new MockUUID();
    let mockPool = {
      connect: function() {
        return new SequenceSpy([
          {name: 'query', args: ['SET ROLE testRole']},
          {name: 'query', args: ['BEGIN']},
          {name: 'query', args: ['SELECT * FROM equipment WHERE id = $1', ['005a0000-33373938-17473634']], return: {rows: []}},
          {name: 'query', args: ['INSERT INTO equipment (_id,_rev,id,info) VALUES ($1,$2,$3,$4)', [0,1,'005a0000-33373938-17473634',null]]},
          {name: 'query', args: ['INSERT INTO measurement (_id,_rev,ts,_equipment_id,index,rssi) VALUES ($1,$2,$3,$4,$5,$6)', [2,3,new Date('2020-04-18T15:59:56.071Z'),0,1524,-87]]},
          {name: 'query', args: ['SELECT * FROM sensor WHERE id = $1', ['be01']], return: {rows: []}},
          {name: 'query', args: ['INSERT INTO sensor (_id,_rev,id,info) VALUES ($1,$2,$3,$4)', [4,5,'be01',null]]},
          {name: 'query', args: ['SELECT * FROM parameter_type WHERE id = $1 AND unit = $2', ['temperature','°C']], return: {rows: []}},
          {name: 'query', args: ['INSERT INTO parameter_type (_id,_rev,id,unit,info) VALUES ($1,$2,$3,$4,$5)', [6,7,'temperature','°C',null]]},
          {name: 'query', args: ['INSERT INTO parameter (_id,_rev,_measurement_id,_parameter_type_id,_sensor_id,val) VALUES ($1,$2,$3,$4,$5,$6)', [8,9,2,6,4,25.68000030517578]]},
          {name: 'query', args: ['COMMIT']},
          {name: 'query', args: ['RESET ROLE']},
          {name: 'release'},
        ]);
      }
    };
    let repo = new Repo(mockPool, mockUUID.uuid.bind(mockUUID));
    await repo.putMessage('testRole', msg);
  });

  it('can get all equipment', async () => {
    let mockUUID = new MockUUID();
    let mockPool = {
      connect: function() {
        return new SequenceSpy([
          {name: 'query', args: ['SET ROLE testRole']},
          {name: 'query', args: ['BEGIN']},
          {name: 'query', args: ['SELECT * FROM equipment'], return: {rows: ['test1', 'test2']}},
          {name: 'query', args: ['COMMIT']},
          {name: 'query', args: ['RESET ROLE']},
          {name: 'release'},
        ]);
      }
    };
    let repo = new Repo(mockPool, mockUUID.uuid.bind(mockUUID));
    expect(await repo.getAllEquipment('testRole')).toEqual(['test1', 'test2']);
  });

  it('can get all sensors', async () => {
    let mockUUID = new MockUUID();
    let mockPool = {
      connect: function() {
        return new SequenceSpy([
          {name: 'query', args: ['SET ROLE testRole']},
          {name: 'query', args: ['BEGIN']},
          {name: 'query', args: ['SELECT * FROM sensor'], return: {rows: ['test1', 'test2']}},
          {name: 'query', args: ['COMMIT']},
          {name: 'query', args: ['RESET ROLE']},
          {name: 'release'},
        ]);
      }
    };
    let repo = new Repo(mockPool, mockUUID.uuid.bind(mockUUID));
    expect(await repo.getAllSensors('testRole')).toEqual(['test1', 'test2']);
  });

  it('can get all parameter types', async () => {
    let mockUUID = new MockUUID();
    let mockPool = {
      connect: function() {
        return new SequenceSpy([
          {name: 'query', args: ['SET ROLE testRole']},
          {name: 'query', args: ['BEGIN']},
          {name: 'query', args: ['SELECT * FROM parameter_type'], return: {rows: ['test1', 'test2']}},
          {name: 'query', args: ['COMMIT']},
          {name: 'query', args: ['RESET ROLE']},
          {name: 'release'},
        ]);
      }
    };
    let repo = new Repo(mockPool, mockUUID.uuid.bind(mockUUID));
    expect(await repo.getAllParameterTypes('testRole')).toEqual(['test1', 'test2']);
  });

  it('can get measurement data in a time interval', async () => {
    let startDate = new Date('2020-01-01 12:00');
    let endDate = new Date('2020-01-31 12:00');
    let mockUUID = new MockUUID();
    let mockPool = {
      connect: function() {
        return new SequenceSpy([
          {name: 'query', args: ['SET ROLE testRole']},
          {name: 'query', args: ['BEGIN']},
          {name: 'query', args: ['SELECT m._id as _measurement_id, m.ts, m.index, m.rssi, m._equipment_id, p._id as _parameter_id, p._parameter_type_id, p._sensor_id, p.val FROM measurement m LEFT JOIN parameter p ON m._id = p._measurement_id WHERE m.ts >= $1 AND m.ts < $2', [startDate, endDate]], return: {rows: ['test1', 'test2']}},
          {name: 'query', args: ['COMMIT']},
          {name: 'query', args: ['RESET ROLE']},
          {name: 'release'},
        ]);
      }
    };
    let repo = new Repo(mockPool, mockUUID.uuid.bind(mockUUID));
    expect(await repo.getMeasurementDataByStartEndTime('testRole', startDate, endDate)).toEqual(['test1', 'test2']);
  });
});

class MockUUID {
  constructor() {
    this._uuid = 0;
  }

  uuid() {
    return this._uuid++;
  }
}
