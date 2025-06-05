# Madras Website

A modern website with an admin portal for content management, built with Next.js and deployed on Railway.app.

## Features

- Responsive frontend with dynamic content sections
- Admin portal for content management
- Authentication using NextAuth.js
- PostgreSQL database with Prisma ORM
- Deployed on Railway.app

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Railway.app account
- GitHub account

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/punaab/website-madras.git
   cd website-madras
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="your_postgresql_connection_string"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Create an admin user:
   ```bash
   npx prisma db seed
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

## Railway.app Deployment

1. Create a new project on Railway.app
2. Connect your GitHub repository
3. Add the following environment variables in Railway.app:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

4. Deploy the project

## Admin Portal

Access the admin portal at `/admin` after deployment. Use the credentials created during the database seeding process.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 