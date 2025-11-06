import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import configurations
import { connectDB } from './config/database.js';
import blockchainConfig from './config/blockchain.js';
import ipfsConfig from './config/ipfs.js';

// Import services
import contractService from './services/contractService.js';
import eventListener from './services/eventListener.js';
import ipfsService from './services/ipfsService.js';
import storyService from './services/storyService.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import applicationRoutes from './routes/applications.js';
import milestoneRoutes from './routes/milestones.js';
// Additional routes will be imported here

// Import utilities
import logger from './utils/logger.js';

/**
 * Initialize Express Application
 */
const app = express();

/**
 * Security Middleware
 */
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Prevent MongoDB injection

/**
 * CORS Configuration
 */
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Compression Middleware
 */
app.use(compression());

/**
 * Logging Middleware
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

/**
 * Rate Limiting
 */
app.use('/api/', apiLimiter);

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'IP Escrow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/milestones', milestoneRoutes);
// app.use('/api/ip', ipAssetRoutes);
// app.use('/api/disputes', disputeRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/webhooks', webhookRoutes);

/**
 * Root Endpoint
 */
app.get('/', (req, res) => {
  res.json({
    name: 'IP Escrow Backend API',
    version: '1.0.0',
    description: 'Backend API for blockchain-based freelance platform with IP escrow',
    documentation: '/api-docs',
    health: '/health',
  });
});

/**
 * 404 Handler
 */
app.use(notFound);

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Initialize Services and Start Server
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('✅ Database connected');

    // Initialize blockchain connection
    await blockchainConfig.initialize();
    logger.info('✅ Blockchain connection initialized');

    // Initialize contract service
    await contractService.initialize();
    logger.info('✅ Contract service initialized');

    // Initialize IPFS service
    await ipfsService.initialize();
    logger.info('✅ IPFS service initialized');

    // Initialize Story Protocol service
    await storyService.initialize();
    logger.info('✅ Story Protocol service initialized');

    // Start event listener (DISABLED temporarily due to RPC filter expiration issues)
    // The RPC node expires filters faster than ethers.js polls them
    // This causes "filter not found" errors but doesn't affect functionality
    // TODO: Implement webhook-based event listening or use different polling strategy
    // await eventListener.initialize();
    // await eventListener.startListening();
    logger.info('⚠️  Event listener disabled (use webhooks or manual sync for production)');

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      logger.info(`📝 API URL: http://localhost:${PORT}`);
      logger.info(`💊 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      // Stop accepting new requests
      server.close(() => {
        logger.info('HTTP server closed');
      });

      // Stop event listener
      // eventListener.stopListening();  // Disabled - see above

      // Close database connection
      const { disconnectDB } = await import('./config/database.js');
      await disconnectDB();

      logger.info('Graceful shutdown completed');
      process.exit(0);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (error) => {
      logger.error('Unhandled Rejection:', error);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
