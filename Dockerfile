# Use an official lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (npm ci is faster and more reliable for CI/CD and Docker)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (defaults to 3000 if not set in ENV)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]