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

# Build the application
RUN npm run build

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Running database setup..."' >> /app/start.sh && \
    echo 'echo "Current directory: $(pwd)"' >> /app/start.sh && \
    echo 'echo "Listing prisma directory:"' >> /app/start.sh && \
    echo 'ls -la prisma/' >> /app/start.sh && \
    echo 'echo "Running migrations..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy --schema=prisma/schema.production.prisma' >> /app/start.sh && \
    echo 'echo "Running database seed..."' >> /app/start.sh && \
    echo 'npx prisma db seed --schema=prisma/schema.production.prisma' >> /app/start.sh && \
    echo 'echo "Verifying database setup..."' >> /app/start.sh && \
    echo 'npx prisma db pull --schema=prisma/schema.production.prisma' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the application
CMD ["sh", "/app/start.sh"] 