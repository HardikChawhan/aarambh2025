const db = require("../db");

// Finding active student by name, and email
async function findActiveStudent({ email }) {
  const query =
    'SELECT * FROM users WHERE email = ? AND status = "ACTIVE"';
  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, result) => {
      if (err) {
        return reject(err);
      }

      if (result.length > 0) {
        resolve(result[0]);
      } else {
        resolve(null);
      }
    });
  });
}

// Updating student status to NOTACTIVE
async function updateStudentStatus({ email }) {
  const query =
    'UPDATE users SET status = "NOTACTIVE" WHERE email = ? AND status = "ACTIVE"';

  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result.affectedRows > 0);
    });
  });
}

async function findAdminByUsername(username) {
  const query = 'SELECT * FROM admin WHERE username = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [username], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result[0] || null); // Return admin record or null
    });
  });
}

// Find a user by username
async function findUserByUsername(username) {
  const query = 'SELECT * FROM access WHERE username = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [username], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result[0] || null); // Return user record or null
    });
  });
}

// Adding a new user
async function addUser(username, password) {
  const query = 'INSERT INTO access (username, password) VALUES (?, ?)';
  return new Promise((resolve, reject) => {
    db.query(query, [username, password], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

async function findAccessByUsername(username) {
  const query = 'SELECT * FROM access WHERE username = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [username], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result[0] || null);
    });
  });
}

async function updateAccessPassword(username, newPassword) {
  const query = 'UPDATE access SET password = ? WHERE username = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [newPassword, username], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result.affectedRows > 0);
    });
  });
}

async function fetchAccessUsers() {
  const query = 'SELECT username FROM access';
  return new Promise((resolve,reject)=>{
    db.query(query,(err,result)=>{
      if(err){
        return reject(err);
      }
      resolve(result || null);
    });
  });
}

module.exports = {
  findActiveStudent,
  updateStudentStatus,
  findAdminByUsername,
  findUserByUsername,
  addUser,
  findAccessByUsername,
  updateAccessPassword,
  fetchAccessUsers
};
