# Use an official Node runtime as the base image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Print debug information
RUN pwd && ls -la

# Expose the port the app runs on
EXPOSE 5173

# Start the application with verbose output
CMD ["sh", "-c", "pwd && ls -la && npm run dev -- --host 0.0.0.0 --port 5173"]