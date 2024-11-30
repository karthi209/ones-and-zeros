const { Pool } = require('pg');

const pool = new Pool({
    user: 'karthi209',
    password: 'Telecaster@1959',
    host: '144.126.254.165',
    port: 5432,
    database: 'onesandzeros'
});

module.exports = pool;