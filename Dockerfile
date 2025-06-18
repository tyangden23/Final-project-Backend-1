# Step 1: Use official Node.js image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy rest of the app code
COPY . .

# Step 5: Build TypeScript code
RUN npm run build

# Step 6: Expose the port your app runs on (change if needed)
EXPOSE 3000

# Step 7: Run the compiled app
CMD ["node", "dist/server.js"]
