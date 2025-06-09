# Madras Ward Website

A modern, responsive website for the Madras Ward of The Church of Jesus Christ of Latter-day Saints.

## Features

- Responsive design for all devices
- Photo slideshow gallery
- Admin dashboard for content management
- User authentication and authorization
- Content management system
- Photo upload and management
- Modern UI with smooth animations

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- NextAuth.js
- React

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/madras-ward.git
cd madras-ward
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Access

To access the admin dashboard:
1. Navigate to `/admin/login`
2. Use the default admin credentials (created during seeding)
3. Manage content, photos, and users through the dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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

## Editor Integration

This project uses TinyMCE for rich text editing in the admin dashboard. The TinyMCE API key and integration details can be managed via your TinyMCE account.

**TinyMCE API Source:** [https://www.tiny.cloud/my-account/integrate/#html](https://www.tiny.cloud/my-account/integrate/#html) 