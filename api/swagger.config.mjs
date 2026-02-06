import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quantum Leap Labs API',
      version: '1.0.0',
      description: 'API documentation for Quantum Leap Labs backend services with Zoho CRM, Zoho Sheets, and Email integrations',
      contact: {
        name: 'Quantum Leap Labs',
        url: 'https://quantumleaplabs.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'http://localhost:8080/api',
        description: 'Development server (via Vite proxy)',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Consultation',
        description: 'Consultation form submission endpoints',
      },
    ],
    components: {
      schemas: {
        ConsultationRequest: {
          type: 'object',
          required: ['name', 'email', 'phone', 'interest'],
          properties: {
            name: {
              type: 'string',
              description: 'Full name of the person',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'john.doe@example.com',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
              example: '+1234567890',
            },
            interest: {
              type: 'string',
              description: 'Area of interest',
              example: 'Quantum Computing Course',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Submission timestamp (auto-generated if not provided)',
              example: '2026-01-28T10:30:00Z',
            },
          },
        },
        ConsultationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the operation was successful',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Consultation submitted successfully!',
            },
            results: {
              type: 'object',
              description: 'Detailed results of each integration',
              properties: {
                zoho: {
                  type: 'boolean',
                  description: 'Whether the submission was added to Zoho CRM',
                  example: true,
                },
                zohoSheets: {
                  type: 'boolean',
                  description: 'Whether the submission was added to Zoho Sheets',
                  example: true,
                },
                confirmationEmail: {
                  type: 'boolean',
                  description: 'Whether confirmation email was sent to user',
                  example: true,
                },
                adminEmail: {
                  type: 'boolean',
                  description: 'Whether notification email was sent to admin',
                  example: true,
                },
                errors: {
                  type: 'array',
                  description: 'List of any errors encountered',
                  items: {
                    type: 'string',
                  },
                  example: [],
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Always false for errors',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Missing required fields: name, email, phone, interest',
            },
            error: {
              type: 'string',
              description: 'Detailed error information (only in development mode)',
              example: 'Validation error',
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Server status',
              example: 'ok',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Current server timestamp',
              example: '2026-01-28T10:30:00Z',
            },
            zohoSheetId: {
              type: 'string',
              description: 'Zoho Sheet configuration status',
              example: '✅ Configured',
            },
            adminEmail: {
              type: 'string',
              description: 'Admin email configuration status',
              example: '✅ Configured',
            },
          },
        },
      },
    },
  },
  apis: ['./api/server.mjs'],
};

export const swaggerSpec = swaggerJsdoc(options);
