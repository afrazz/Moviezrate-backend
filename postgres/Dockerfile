FROM postgres:10.13-alpine
ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD deploy_schemas.sql/ docker-entrypoint-initdb.d