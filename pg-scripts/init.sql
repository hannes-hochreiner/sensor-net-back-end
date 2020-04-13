CREATE TABLE equipment (
  _id uuid PRIMARY KEY,
  id varchar(64) UNIQUE NOT NULL,
  info varchar(128)
);

CREATE TABLE sensor (
  _id uuid PRIMARY KEY,
  id varchar(64) UNIQUE NOT NULL,
  info varchar(128)
);

CREATE TABLE parameter_type (
  _id uuid PRIMARY KEY,
  id varchar(64) UNIQUE NOT NULL,
  unit varchar(8),
  info varchar(128)
);

CREATE TABLE measurement (
  _id uuid PRIMARY KEY,
  ts timestamp with time zone,
  _equipment_id uuid REFERENCES equipment (_id),
  index integer,
  rssi float
);

CREATE TABLE parameter (
  _id uuid PRIMARY KEY,
  _measurement_id uuid REFERENCES measurement (_id),
  _parameter_type_id uuid REFERENCES parameter_type (_id),
  _sensor_id uuid REFERENCES sensor (_id),
  val float
);

create index measurement_ts on measurement(ts);
create index parameter_measurement_id on parameter(_measurement_id);
