# sensor-net-back-end
Back end for the Sensor Net project.

This package provides a server that allows to persist new measurement data, obtain the data for a time interval, and get all equipment, sensors, and parameter types.

# API
For all requests, the response will have the status 200 and, when appropriate, contain a JSON object with the property "result" containing an array of result objects.
In the case of errors, the response will have the status 500 and will contain a JSON object with property "error" containing the error.

## PUT /message
The message is expected as a JSON object in the body.

*Example Message*
```json
{
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
          "temperature": { "value": 25.68000030517578, "unit": "°C" },
          "relativeHumidity": { "value": 33.9677734375, "unit": "%" },
          "pressure": { "value": 1001.1699829101562, "unit": "mbar" }
        }
      }
    ]
  }
}
```
*Example Query*
```shell
curl -H 'Content-Type: application/json' -H 'x-groups: db:ingres' -X PUT -d '{"type":"rfm","rssi":"-87","timestamp":"2020-04-18T15:59:56.071Z","message":{"mcuId": "mcuId1","index": 1524,"measurements":[{"sensorId":"be01","parameters":{"temperature":{"value":25.68000030517578,"unit":"°C"},"relativeHumidity":{"value":33.9677734375,"unit":"%"},"pressure":{"value":1001.1699829101562,"unit":"mbar"}}}]}}' localhost:8080/message
```
## GET /measurement_data?startTime=\<startTime as string>&endTime=\<endTime as string>
Start and end times are required.
They are expected to be ISO 8601 string.
*Example Query*
```shell
curl -H 'x-groups: db:spa' localhost:8080/measurement_data?startTime=2020-04-12T00:00:00.000Z\&endTime=2020-12-12T00:00:00.000Z
```
## GET /equipment
*Example Query*
```shell
curl -H 'x-groups: db:spa' localhost:8080/equipment
```
## GET /sensor
*Example Query*
```shell
curl -H 'x-groups: db:spa' localhost:8080/sensor
```
## GET /parameter_type
*Example Query*
```shell
curl -H 'x-groups: db:spa' localhost:8080/parameter_type
```

# Database
Postgres was chosen as the database.
The database is run in a container using sql scripts for administration.
Example scripts for the database administration can be found in the folder "pg-scripts".
Below are examples for different tasks:

*create container*
```shell
docker run --rm --name pg -e POSTGRES_DB=sensornet -e POSTGRES_PASSWORD=sensornet --network pgnet -p 5432:5432 postgres:alpine
```
*create schema*
```shell
docker run --rm --name pg2 -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet -f /opt/pg-init/init.sql
```
*create users*
```shell
docker run --rm --name pg2 -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet -f /opt/pg-init/users.sql
```
*grants*
```shell
docker run --rm --name pg2 -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet -f /opt/pg-init/grants.sql
```
*backup*
```shell
docker run --rm --name pg2 -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine sh -c "pg_dump postgresql://postgres:sensornet@pg:5432/sensornet | gzip > /opt/pg-init/backup.sql.gz"
```
*restore*
```shell
docker run --rm --name pg2 -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine sh -c "psql postgresql://postgres:sensornet@pg:5432 -f /opt/pg-init/create-template0-db.sql; gunzip -c /opt/pg-init/backup.sql.gz | cat /opt/pg-init/users.sql - | psql postgresql://postgres:sensornet@pg:5432/sensornet"
```
*interactive*
```shell
docker run -it --rm --name pg2 --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet
```
# Installation
In a Docker environment, the back end can be set up as follows:
```shell
docker run -d --name pg -e POSTGRES_DB=sensornet -e POSTGRES_PASSWORD=sensornet --network pgnet postgres:alpine

docker run --rm -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine sh -c "cat /opt/pg-init/init.sql /opt/pg-init/users.sql /opt/pg-init/grants.sql | psql postgresql://postgres:sensornet@pg:5432/sensornet"

docker run -d --name server -e PGHOST=pg -e PGDATABASE=sensornet -e PGUSER=sys -e PGPASSWORD=sys -p 8080:8080 --network pgnet h0h4/sensor-net-back-end
```
The example queries listed in the API section can then be run against the server.
