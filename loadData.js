const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function loadDataFromCSV() {
  // Get database configuration from .env file
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  console.log('Connecting to database...');
  
  // Create database connection
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    return;
  }

  const results = [];
  const csvFilePath = path.resolve(__dirname, 'users.csv'); // Update path if needed

  console.log(`Reading CSV file from: ${csvFilePath}`);

  // Read and parse the CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`CSV file parsed. Found ${results.length} records to import.`);
      
      try {
        // Process each row from the CSV
        for (const row of results) {
          // Prepare the SQL query with placeholders
          const query = `
            INSERT INTO users 
            (email, username, prn, phone_no, Faculty, Department, Year, statusday1, statusday2, statusfood) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          // Extract values ensuring they match the order in the query
          const values = [
            row.email,
            row.username,
            row.prn,
            row.phone_no,
            row.Faculty,
            row.Department,
            row.Year,
            row.statusday1 || 0, // Default to 0 if null
            row.statusday2 || 0, // Default to 0 if null
            row.statusfood || 0  // Default to 0 if null
          ];
          
          // Execute the query
          await connection.execute(query, values);
        }
        
        console.log(`Successfully imported ${results.length} records to the database`);
      } catch (error) {
        console.error('Error importing data:', error);
      } finally {
        // Close the database connection
        await connection.end();
        console.log('Database connection closed');
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

// Execute the function
loadDataFromCSV();