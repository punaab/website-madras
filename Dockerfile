FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Copy prisma directory first
COPY prisma ./prisma/

# Install dependencies without running postinstall
RUN npm install --ignore-scripts

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.production.prisma

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