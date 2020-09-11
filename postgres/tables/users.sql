BEGIN TRANSACTION;

CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(100),
    favouritemovie VARCHAR(100),
    favouriteactor VARCHAR(100),
    joined TIMESTAMP NOT NULL
);

COMMIT;