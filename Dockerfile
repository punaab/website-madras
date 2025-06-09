FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Debug: List files to verify schema exists
RUN echo "Listing prisma directory contents:"
RUN ls -la prisma/
RUN echo "Listing prisma/schema.production.prisma contents:"
RUN cat prisma/schema.production.prisma

# Run database setup
RUN npm run setup

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "start"] 