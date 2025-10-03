const dal = require("../DAL/dal");
const bcrypt = require("bcrypt");

async function scanStudentDay1(email) {
  const sanitizedData = {
    email: sanitizeInput(email),
  };

  const student = await dal.findActiveStudentDay1(sanitizedData);
  return student;
}

async function scanStudentDay2(email) {
  const sanitizedData = {
    email: sanitizeInput(email),
  };

  const student = await dal.findActiveStudentDay2(sanitizedData);
  return student;
}

async function scanStudentFood(email) {
  const sanitizedData = {
    email: sanitizeInput(email),
  };

  const student = await dal.findActiveStudentFood(sanitizedData);
  return student;
}

async function validateStudentDay1(email) {
  const sanitizedData = {
    email: sanitizeInput(email),
  };

  const updated = await dal.updateStudentStatusDay1(sanitizedData);
  return updated;
}

async function validateStudentDay2(email) {
  const sanitizedData = {
    email: sanitizeInput(email),
  };

  const updated = await dal.updateStudentStatusDay2(sanitizedData);
  return updated;
}

async function validateStudentFood(email) {
  const sanitizedData = {
    email: sanitizeInput(email),
  };

  const updated = await dal.updateStudentStatusFood(sanitizedData);
  return updated;
}

async function authenticateUser(username, password) {
  const admin = await dal.findAdminByUsername(username); 
  if (admin && bcrypt.compareSync(password, admin.password)) {
    return { role: "admin" }; // Logged in as admin
  }

  const user = await dal.findUserByUsername(username);
  if (user && bcrypt.compareSync(password, user.password)) {
    return { role: "user" }; // Logged in as user
  }

  return null; // Invalid credentials
}

async function addUser(username, password) {
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
  await dal.addUser(username, hashedPassword);
}

async function changePassword(adminUsername, adminPassword, targetUsername, newPassword) {
  const sanitizedAdminUsername = sanitizeInput(adminUsername);
  const sanitizedAdminPassword = sanitizeInput(adminPassword);
  const sanitizedTargetUsername = sanitizeInput(targetUsername);
  const sanitizedNewPassword = sanitizeInput(newPassword);

  const admin = await dal.findAdminByUsername(sanitizedAdminUsername); // Updated to use correct function

  if (!admin) {
    return null; // Admin not found
  }

  const isAdminMatch = await bcrypt.compare(sanitizedAdminPassword, admin.password); // Correctly compare hashed passwords

  if (!isAdminMatch) {
    return null; // Admin password is incorrect
  }

  const user = await dal.findAccessByUsername(sanitizedTargetUsername);

  if (!user) {
    return null; // Target user not found
  }

  const hashedNewPassword = await bcrypt.hash(sanitizedNewPassword, 10);
  return await dal.updateAccessPassword(sanitizedTargetUsername, hashedNewPassword);
}

async function getAllAccessUsers() {
  try {
    const users = await dal.fetchAccessUsers();
    if (!users) {
      throw new Error('No users found.');
    }
    return users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}


// Sanitize input function
function sanitizeInput(input) {
  return String(input).replace(/['"]/g, ""); // Basic sanitization example
}

module.exports = {
  scanStudentDay1,
  scanStudentDay2,
  scanStudentFood,
  validateStudentDay1,
  validateStudentDay2,
  validateStudentFood,
  authenticateUser,
  addUser,
  changePassword,
  getAllAccessUsers
};
