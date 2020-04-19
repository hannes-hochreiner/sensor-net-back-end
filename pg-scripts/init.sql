CREATE TABLE equipment (
  _id uuid PRIMARY KEY,
  _rev uuid,
  id varchar(64) UNIQUE NOT NULL,
  info varchar(128)
);

CREATE TABLE sensor (
  _id uuid PRIMARY KEY,
  _rev uuid,
  id varchar(64) UNIQUE NOT NULL,
  info varchar(128)
);

CREATE TABLE parameter_type (
  _id uuid PRIMARY KEY,
  _rev uuid,
  id varchar(64) UNIQUE NOT NULL,
  unit varchar(8),
  info varchar(128)
);

CREATE TABLE measurement (
  _id uuid PRIMARY KEY,
  _rev uuid,
  ts timestamp with time zone,
  _equipment_id uuid REFERENCES equipment (_id),
  index integer,
  rssi float
);

CREATE TABLE parameter (
  _id uuid PRIMARY KEY,
  _rev uuid,
  _measurement_id uuid REFERENCES measurement (_id),
  _parameter_type_id uuid REFERENCES parameter_type (_id),
  _sensor_id uuid REFERENCES sensor (_id),
  val float
);

CREATE UNIQUE INDEX measurement_unique ON measurement(ts, _equipment_id, index);
CREATE UNIQUE INDEX parameter_unique ON parameter(_measurement_id, _parameter_type_id, _sensor_id);
