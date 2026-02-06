/**
 * Simple Express Server Setup
 * 
 * This is a basic example of how to set up an Express server with the consultation API.
 * 
 * Installation:
 * npm install express cors dotenv google-apis nodemailer
 * npm install --save-dev @types/express @types/node ts-node
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import consultationRoutes from './api/routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', consultationRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Consultation API available at http://localhost:${PORT}/api/consultation`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('📝 Note: Make sure environment variables are configured in .env file');
  }
});

export default app;
