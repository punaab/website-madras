-- Create admin user with hashed password (Madras2024!)
INSERT INTO "User" (
    "id",
    "name",
    "email",
    "password",
    "role",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'Sean Layton',
    'sean@madras.co.nz',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBAQHxQZxQYQHy', -- Hashed version of 'Madras2024!'
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE SET
    "name" = EXCLUDED.name,
    "password" = EXCLUDED.password,
    "role" = EXCLUDED.role,
    "updatedAt" = CURRENT_TIMESTAMP; 