FROM node:18-alpine

# Install OpenSSL and other required dependencies
RUN apk add --no-cache openssl openssl-dev libc6-compat

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Copy prisma directory first
COPY prisma ./prisma/

# Install dependencies without running postinstall
RUN npm install --ignore-scripts

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Set up environment variables for build
ARG DATABASE_PUBLIC_URL
ENV DATABASE_PUBLIC_URL=$DATABASE_PUBLIC_URL

# Run migrations before build
RUN npx prisma migrate deploy

# Build the application
RUN npm run build

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Running database setup..."' >> /app/start.sh && \
    echo 'echo "Current directory: $(pwd)"' >> /app/start.sh && \
    echo 'echo "Listing prisma directory:"' >> /app/start.sh && \
    echo 'ls -la prisma/' >> /app/start.sh && \
    echo 'echo "Running database seed..."' >> /app/start.sh && \
    echo 'npx prisma db seed' >> /app/start.sh && \
    echo 'echo "Verifying database setup..."' >> /app/start.sh && \
    echo 'npx prisma db pull' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"] 