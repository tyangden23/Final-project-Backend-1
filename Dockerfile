# Use official Node.js LTS image as base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (only production dependencies if you want)
RUN npm install

# Copy all project files into the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your app listens on
EXPOSE 3000

# Command to run your app
CMD ["node", "dist/server.js"]