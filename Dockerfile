FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Run database setup
RUN npm run setup

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "start"] 