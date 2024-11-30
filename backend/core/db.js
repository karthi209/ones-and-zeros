// In development, load .env file (only if it exists)
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '../../.env' });
}

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,        // These will be set either from .env in dev or GitHub secrets in prod
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => {
    console.error('Database connection failed:', err.stack);
    process.exit(1);  // Exit the process with a non-zero status if connection fails
  });

module.exports = pool;
