const bcrypt = require('bcrypt');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const username = 'hardik';
const password = 'hardik'; // Replace with your desired password

bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  const query = 'INSERT INTO admin (username, password) VALUES (?, ?)';
  db.query(query, [username, hashedPassword], (error, results) => {
    if (error) {
      console.error('Error inserting admin:', error);
      return;
    }
    console.log('Admin user added successfully!');
  });

  db.end(); // Close the database connection
});
