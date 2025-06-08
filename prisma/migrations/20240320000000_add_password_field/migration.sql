-- Add password field to User model
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Create a default admin user with password 'admin123' (hashed)
UPDATE "User"
SET "password" = '$2b$10$8K1p/a0dR1xqM8K1p/a0dR1xqM8K1p/a0dR1xqM8K1p/a0dR1xqM'
WHERE "email" = 'admin@madras.com'; 