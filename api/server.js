const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple consultation endpoint for now
app.post('/api/consultation', async (req, res) => {
  try {
    const { name, email, phone, interest, timestamp } = req.body;

    // Validation
    if (!name || !email || !phone || !interest) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    console.log('✅ Consultation received:', { name, email, phone, interest, timestamp });

    // For now, just return success
    // Later will integrate Google Sheets and email
    return res.status(200).json({
      success: true,
      message: 'Consultation request received successfully!',
      data: { name, email, phone, interest, timestamp }
    });
  } catch (error) {
    console.error('❌ Error handling consultation:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📧 Consultation endpoint: POST http://localhost:${PORT}/api/consultation`);
  console.log(`🏥 Health check: GET http://localhost:${PORT}/health\n`);
});
