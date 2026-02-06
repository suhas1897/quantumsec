# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the frontend (Vite)
RUN npm run build

# Environment
ENV NODE_ENV=production

# Railway will provide PORT, default to 3000
ENV PORT=3000
EXPOSE 3000

# Start the backend server
CMD ["npm", "run", "server"]
