// Postgres
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

// Redis
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URI);

module.exports = {
    db,
    redisClient
}