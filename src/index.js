import {default as express} from 'express';
import {dbGroup, putMessage, getMeasurementDataByStartEndTime, getAllEquipment, getAllSensors, getAllParameterTypes} from './middleware';
import {Pool} from 'pg';
import {v4 as uuid} from 'uuid';
import {Repo} from './repo';

const app = express();
const port = process.env.PORT || 8080;
const repo = new Repo(new Pool(), uuid);
const options = {repo: repo};

app.use(express.json());
app.use(dbGroup);
// curl -H 'Content-Type: application/json' -H 'x-groups: db:ingres' -X PUT -d '{"type":"rfm","rssi":"-87","timestamp":"2020-04-18T15:59:56.071Z","message":{"mcuId": "mcuId1","index": 1524,"measurements":[{"sensorId":"be01","parameters":{"temperature":{"value":25.68000030517578,"unit":"°C"},"relativeHumidity":{"value":33.9677734375,"unit":"%"},"pressure":{"value":1001.1699829101562,"unit":"mbar"}}}]}}' localhost:8080/message
// curl -H 'Content-Type: application/json' -H 'x-groups: db:ingres' -X PUT -d '{"type":"rfm","rssi":"-82","timestamp":"2020-04-30T15:59:56.071Z","message":{"mcuId": "mcuId1","index": 1525,"measurements":[{"sensorId":"be01","parameters":{"temperature":{"value":23.68000030517578,"unit":"°C"},"relativeHumidity":{"value":35.9677734375,"unit":"%"},"pressure":{"value":1002.1699829101562,"unit":"mbar"}}}]}}' localhost:8080/message
app.put('/message', putMessage(options));
// curl -H 'x-groups: db:spa' localhost:8080/measurement_data?startTime=2020-04-12T00:00:00.000Z\&endTime=2020-12-12T00:00:00.000Z
app.get('/measurement_data',getMeasurementDataByStartEndTime(options));
// curl -H 'x-groups: db:spa' localhost:8080/equipment
app.get('/equipment', getAllEquipment(options));
// curl -H 'x-groups: db:spa' localhost:8080/sensor
app.get('/sensor', getAllSensors(options));
// curl -H 'x-groups: db:spa' localhost:8080/parameter_type
app.get('/parameter_type', getAllParameterTypes(options));

app.listen(port, () => console.log(`Sensor Net back end listening at http://localhost:${port}`));
