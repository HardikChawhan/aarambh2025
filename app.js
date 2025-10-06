const cluster = require('cluster');
const os = require('os');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const controller = require('./Controller/controller');

// Get the number of CPU cores
const numCPUs = os.cpus().length;

// Limit workers on cloud platforms to avoid DB connection exhaustion
// On Render, use fewer workers to stay within connection limits
const isProduction = process.env.NODE_ENV === 'production';
const maxWorkers = isProduction ? 2 : Math.min(numCPUs, 4);

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);
  console.log(`Starting ${maxWorkers} workers...`);

  // Fork workers (limited to avoid DB connection pool exhaustion)
  for (let i = 0; i < maxWorkers; i++) {
    cluster.fork();
  }

  // Restart the worker if it crashes
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });

} else {
  // Worker processes handle incoming requests
  const app = express();
  const PORT = process.env.PORT || 8001;
  const HOST = process.env.HOST || '0.0.0.0'; // Bind to 0.0.0.0 for cloud deployments

  // Use helmet for security
  app.use(helmet());

  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  });

  // Apply rate limiting middleware
  app.use(limiter);

  // Middleware to parse incoming requests with JSON
  app.use(express.json());

  // CORS configuration to allow access from all platforms
  app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));

  // Using controller for routes
  app.use('/', controller);

  // 404 route handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  // Start the server
  app.listen(PORT, HOST, () => {
    console.log(`Worker process ${process.pid} is running on http://${HOST}:${PORT}`);
  });

  // Graceful shutdown of workers
  process.on('SIGTERM', () => {
    console.log(`Worker ${process.pid} shutting down gracefully...`);
    process.exit();
  });
}
