// In development, load .env file (only if it exists)

if (process.env.NODE_ENV != 'production') {
  const path = require('path');
  const envPath = path.resolve(__dirname, '../.env');
  console.log(`Loading .env file from: ${envPath}`);
  require('dotenv').config({ path: envPath });
}
  
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,        // These will be set either from .env in dev or GitHub secrets in prod
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = pool;