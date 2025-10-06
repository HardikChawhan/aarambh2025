const { Pool } = require('pg');

// Determine if we're in production (cloud environment)
const isProduction = process.env.NODE_ENV === 'production';

// Adjust pool size based on environment
// In production with clustering, use fewer connections per worker
const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Required for Render and most cloud PostgreSQL services
  },
  // Reduced pool size to avoid exceeding DB connection limits with multiple workers
  max: isProduction ? 5 : 10, // Max 5 connections per worker in production
  min: 1, // Minimum connections to keep open
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// setting up connection pool for PostgreSQL
const pool = new Pool(poolConfig);

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL Database:', err);
    process.exit(1);  // Exit process if DB connection fails
  }
  console.log('Connected to PostgreSQL Database.');
  release();
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = pool;