
const mysql = require('mysql2/promise');

// MySQL connection pool
let pool;

// Create connection pool
const connectToDatabase = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'styleshop',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

// Get database connection
const getDb = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return pool;
};

module.exports = { connectToDatabase, getDb };
