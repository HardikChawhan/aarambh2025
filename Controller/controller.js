const express = require("express");
const router = express.Router();
const service = require("../Service/service");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const logger = require('../logger');

// Health check route
router.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// route for scanning the QR code
router.post(
  "/scanDay1",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const result = await service.scanStudentDay1(email);

      if (result) {
        res.status(200).json({ message: "Student found", data: result });
      } else {
        res
          .status(403)
          .json({ message: "QR code already scanned or student not found" });
      }
    } catch (error) {
      logger.error(`Error during scan: ${error.message}`);
      res.status(500).json({ message: "An error occurred", error });
    }
  }
);

router.post(
  "/scanDay2",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const result = await service.scanStudentDay2(email);

      if (result) {
        res.status(200).json({ message: "Student found", data: result });
      } else {
        res
          .status(403)
          .json({ message: "QR code already scanned or student not found" });
      }
    } catch (error) {
      logger.error(`Error during scan: ${error.message}`);
      res.status(500).json({ message: "An error occurred", error });
    }
  }
);

router.post(
  "/scanFood",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const result = await service.scanStudentFood(email);

      if (result) {
        res.status(200).json({ message: "Student found", data: result });
      } else {
        res
          .status(403)
          .json({ message: "QR code already scanned or student not found" });
      }
    } catch (error) {
      logger.error(`Error during scan: ${error.message}`);
      res.status(500).json({ message: "An error occurred", error });
    }
  }
);

// Route to change status to NOTACTIVE
router.post(
  "/validateDay1",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    const { email } = req.body;

    try {
      const result = await service.validateStudentDay1(email);
      if (result) {
        res.status(200).json({ message: "Status updated to NOTACTIVE" });
      } else {
        res.status(400).json({ message: "No active student found to update" });
      }
    } catch (error) {
      logger.error(`Error during validation: ${error.message}`);
      res.status(500).json({ message: "An error occurred", error });
    }
  }
);

router.post(
  "/validateDay2",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    const { email } = req.body;

    try {
      const result = await service.validateStudentDay2(email);
      if (result) {
        res.status(200).json({ message: "Status updated to NOTACTIVE" });
      } else {
        res.status(400).json({ message: "No active student found to update" });
      }
    } catch (error) {
      logger.error(`Error during validation: ${error.message}`);
      res.status(500).json({ message: "An error occurred", error });
    }
  }
);

router.post(
  "/validateFood",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    const { email } = req.body;

    try {
      const result = await service.validateStudentFood(email);
      if (result) {
        res.status(200).json({ message: "Status updated to NOTACTIVE" });
      } else {
        res.status(400).json({ message: "No active student found to update" });
      }
    } catch (error) {
      logger.error(`Error during validation: ${error.message}`);
      res.status(500).json({ message: "An error occurred", error });
    }
  }
);

// Route for user login
router.post("/login", [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username is required"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password is required"),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await service.authenticateUser(username, password);
    if (user) {
      res.status(200).json({ message: "Login successful", role: user.role });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Route for admin to add a user
router.post("/admin/addUser", [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username is required"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password is required"),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    await service.addUser(username, password);
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    logger.error(`Error during user addition: ${error.message}`);
    res.status(500).json({ message: "An error occurred", error });
  }
});

router.post(
  "/admin/change-password",
  [
    body("adminUsername")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Admin username is required"),
    body("adminPassword")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Admin password is required"),
    body("targetUsername")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Target username is required"),
    body("newPassword")
      .trim()
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }

    const { adminUsername, adminPassword, targetUsername, newPassword } = req.body;

    try {
      const result = await service.changePassword(adminUsername, adminPassword, targetUsername, newPassword);

      if (result) {
        res.status(200).json({ message: "Password updated successfully" });
      } else {
        res.status(403).json({ message: "Admin authentication failed or user not found" });
      }
    } catch (error) {
      logger.error(`Error during password change: ${error.message}`);
      res.status(500).json({ message: "An error occurred", error });
    }
  }
);

router.get('/admin/getUser', async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const users = await service.getAllAccessUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})

module.exports = router;
