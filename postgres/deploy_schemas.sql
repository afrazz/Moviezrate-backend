-- Deply fresh database tables

\i '/docker-entrypoint-initdb.d/tables/users.sql';
\i '/docker-entrypoint-initdb.d/tables/login.sql';

-- img-20200731-wa0023