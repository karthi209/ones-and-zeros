const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: '!#t!LbP6Ppjeqj&B',
    host: '192.168.0.12',
    port: 5432,
    database: 'postgres'
});

module.exports = pool;