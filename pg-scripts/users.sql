CREATE ROLE sys LOGIN NOINHERIT PASSWORD 'sys';
CREATE ROLE ingres NOINHERIT;
CREATE ROLE spa NOINHERIT;
GRANT ingres TO sys;
GRANT spa TO sys;
