FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build frontend assets
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 