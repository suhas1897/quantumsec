# Swagger API Documentation

## Overview
Swagger/OpenAPI documentation has been implemented for the Quantum Leap Labs backend API. This provides an interactive API testing interface.

## Access Swagger UI

Once your backend server is running, access the Swagger documentation at:

**📚 http://localhost:3001/api-docs**

## Features

✅ **Interactive API Testing** - Test API endpoints directly from the browser
✅ **Request/Response Schemas** - View detailed data models
✅ **Live Examples** - See example requests and responses
✅ **Try It Out** - Execute real API calls with custom parameters

## Endpoints Documented

### Health Check
- **GET** `/health` - Check server status and configuration

### Consultation
- **POST** `/api/consultation` - Submit consultation requests

## Usage

1. **Start the backend server:**
   ```bash
   npm run server
   ```

2. **Open Swagger UI in your browser:**
   ```
   http://localhost:3001/api-docs
   ```

3. **Test the API:**
   - Click on any endpoint to expand it
   - Click "Try it out" button
   - Fill in the request parameters
   - Click "Execute" to send the request
   - View the response

## Example: Testing Consultation Endpoint

1. Navigate to http://localhost:3001/api-docs
2. Find the **POST /api/consultation** endpoint
3. Click "Try it out"
4. Enter sample data:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "phone": "+1234567890",
     "interest": "Quantum Computing Course"
   }
   ```
5. Click "Execute"
6. View the response with integration results

## Swagger JSON

The OpenAPI specification is also available as JSON:
**http://localhost:3001/api-docs.json**

## Files Created

- `api/swagger.config.ts` - Swagger configuration for TypeScript server
- `api/swagger.config.mjs` - Swagger configuration for ES Module server
- Both `api/server.ts` and `api/server.mjs` updated with Swagger middleware

## Integration Details

The Swagger documentation includes:
- Request validation schemas
- Response schemas
- Error response formats
- Detailed descriptions for all fields
- Integration status for Zoho CRM, Zoho Sheets, and Email notifications

## Benefits

- **API Testing** - No need for Postman or curl commands
- **Documentation** - Always up-to-date API documentation
- **Development** - Faster development and debugging
- **Collaboration** - Easy for team members to understand API
