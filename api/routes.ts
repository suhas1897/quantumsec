import express, { Request, Response } from 'express';
import { handleConsultationSubmission } from './consultation';

const router = express.Router();

/**
 * POST /api/consultation
 * Handle consultation form submission
 */
router.post('/consultation', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, interest, timestamp } = req.body;

    // Validation
    if (!name || !email || !phone || !interest) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    // Process submission
    const result = await handleConsultationSubmission({
      name,
      email,
      phone,
      interest,
      timestamp: timestamp || new Date().toISOString(),
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
