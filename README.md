# Motoverse

A modern car dealership management platform built with Next.js 15.

## Overview

Motoverse is a comprehensive car dealership management system that allows dealers to manage their inventory, handle test drive requests, and showcase their vehicles in a modern web interface.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS 4
  - Shadcn UI (Component Library)
- **Form Management**:
  - React Hook Form
  - Zod Validation Schemas
- **State Management**: React Server Components

### Backend
- **ORM**: Prisma
- **Database**: PostgreSQL
- **API**: Next.js Server Actions
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary

## Features

- Car inventory management
- Dealership administration
- Test drive scheduling
- Featured cars showcase
- Real-time status updates
- Administrative dashboard
- Role-based access control
- Image management
- Form validations

## Default Admin Access

- **Email**: admin@motoverse.com
- **Password**: Password123@

## Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- Cloudinary account
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/motoverse.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

4. Configure the following in your `.env`:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_URL="your-cloudinary-url"
```

5. Run database migrations:
```bash
npx prisma db push
```

6. Seed the admin user:
```bash
npx prisma db seed
```

7. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
motoverse/
├── app/
│   ├── (auth)/
│   ├── (routes)/
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/
│   └── forms/
├── lib/
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
└── types/
```

## Key Directories

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/types` - TypeScript type definitions

## Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
