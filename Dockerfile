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

# Create a startup script
RUN echo '#!/bin/sh\n\
echo "Running database setup..."\n\
npx prisma migrate deploy --schema=prisma/schema.production.prisma\n\
npx prisma db seed\n\
echo "Starting application..."\n\
npm start' > /app/start.sh && chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"] 