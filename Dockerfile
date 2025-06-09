FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Make sure the schema file exists
RUN ls -la prisma/

# Run database setup
RUN npm run setup

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "start"] 