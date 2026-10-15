const path = require('path');
const { Client } = require('../../../backend/node_modules/pg');
const envPath = path.resolve(__dirname, '../../../backend/.env');
require('../../../backend/node_modules/dotenv').config({ path: envPath });

console.log('Using .env at:', envPath);
console.log('DATABASE_URL starts with:', (process.env.DATABASE_URL || '').substring(0, 25));

async function checkDb() {
  console.log('Testing connection to DATABASE_URL in .env...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    const res = await client.query('SELECT current_database(), current_user, version();');
    console.log('Connected to database successfully!');
    console.log('DB Name:', res.rows[0].current_database);
    console.log('User:', res.rows[0].current_user);
    console.log('Version:', res.rows[0].version.split(' on ')[0]);
    await client.end();
  } catch (err) {
    console.error('Database connection check failed:', err.code, err);
  }
}

checkDb();
