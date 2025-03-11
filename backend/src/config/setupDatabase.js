const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function setupDatabase() {
  let connection;
  try {
    console.log('Connecting to MySQL server...');
    console.log('Connection details:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });

    // First connect without database to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      multipleStatements: true
    });

    console.log('Connected to MySQL server successfully.');

    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('Schema file read successfully.');

    console.log('Executing schema...');
    const [results] = await connection.query(schema);
    console.log('Schema execution results:', results);
    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Error setting up database:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed.');
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
}

setupDatabase(); 
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function setupDatabase() {
  let connection;
  try {
    console.log('Connecting to MySQL server...');
    console.log('Connection details:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });

    // First connect without database to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      multipleStatements: true
    });

    console.log('Connected to MySQL server successfully.');

    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('Schema file read successfully.');

    console.log('Executing schema...');
    const [results] = await connection.query(schema);
    console.log('Schema execution results:', results);
    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Error setting up database:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed.');
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
}

setupDatabase(); 
 