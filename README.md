# sensor-net-back-end
Back end for the Sensor Net project.

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
docker run --rm --name pg2 -v /home/hannes/2020_Archive/2020_programming/pgtest/postgres-init:/opt/pg-init:z --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet -f /opt/pg-init/sensornet-init.sql
```
*create users*
```
docker run --rm --name pg2 -v /home/hannes/2020_Archive/2020_programming/pgtest/postgres-init:/opt/pg-init:z --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet -f /opt/pg-init/users.sql
```
*grants*
```
docker run --rm --name pg2 -v /home/hannes/2020_Archive/2020_programming/pgtest/postgres-init:/opt/pg-init:z --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet -f /opt/pg-init/grants.sql
```
*backup*
```
docker run --rm --name pg2 -v /home/hannes/2020_Archive/2020_programming/pgtest/postgres-init:/opt/pg-init:z --network pgnet postgres:alpine sh -c "pg_dump postgresql://postgres:sensornet@pg:5432/sensornet | gzip > /opt/pg-init/backup.sql.gz"
```
*restore*
```
docker run --rm --name pg2 -v /home/hannes/2020_Archive/2020_programming/pgtest/postgres-init:/opt/pg-init:z --network pgnet postgres:alpine sh -c "psql postgresql://postgres:sensornet@pg:5432 -f /opt/pg-init/create-template0-db.sql; gunzip -c /opt/pg-init/backup.sql.gz | cat /opt/pg-init/users.sql - | psql postgresql://postgres:sensornet@pg:5432/sensornet"
```
*interactive*
```
docker run -it --rm --name pg2 --network pgnet postgres:alpine psql postgresql://postgres:sensornet@pg:5432/sensornet
```
