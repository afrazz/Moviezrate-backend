BEGIN TRANSACTION;

CREATE TABLE login (
    id serial PRIMARY KEY,
    name text UNIQUE NOT NULL,
    hash varchar(100) NOT NULL
);

COMMIT;