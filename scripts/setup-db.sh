#!/bin/bash

# Generate Prisma client
npx prisma generate --schema=prisma/schema.production.prisma

# Run migrations
npx prisma migrate deploy --schema=prisma/schema.production.prisma

# Seed the database
npx prisma db seed 