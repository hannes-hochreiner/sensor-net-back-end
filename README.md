# sensor-net-back-end
Back end for the Sensor Net project.

# Example Message
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

# Database
Postgres was chosen as the database.
The database is run in a container using sql scripts for administration.
Example scripts for the database administration can be found in the folder "pg-scripts".
Below are examples for different tasks:

*create container*
```
docker run --rm --name pg -e POSTGRES_DB=sensornet -e POSTGRES_PASSWORD=sensornet --network pgnet -p 5432:5432 postgres:alpine
```
*create schema*
```
docker run --rm --name pg2 -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet -f /opt/pg-init/init.sql
```
*create users*
```
docker run --rm --name pg2 -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet -f /opt/pg-init/users.sql
```
*grants*
```
docker run --rm --name pg2 -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet -f /opt/pg-init/grants.sql
```
*backup*
```
docker run --rm --name pg2 -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine sh -c "pg_dump postgresql://postgres:sensornet@pg:5432/sensornet | gzip > /opt/pg-init/backup.sql.gz"
```
*restore*
```
docker run --rm --name pg2 -v `pwd`/pg-scripts:/opt/pg-init:z --network pgnet postgres:alpine sh -c "psql postgresql://postgres:sensornet@pg:5432 -f /opt/pg-init/create-template0-db.sql; gunzip -c /opt/pg-init/backup.sql.gz | cat /opt/pg-init/users.sql - | psql postgresql://postgres:sensornet@pg:5432/sensornet"
```
*interactive*
```
docker run -it --rm --name pg2 --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet
```
