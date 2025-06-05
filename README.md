# MileMaven - Car Rental Website

MileMaven is a comprehensive car rental platform built with Next.js, offering reliable and affordable vehicle rental solutions for personal and corporate needs in Kenya.

## Features

- **Modern UI/UX**: Clean, responsive design with black and red branding
- **Car Listings**: Browse and filter available vehicles
- **Booking System**: Complete booking flow with date/time selection
- **User Authentication**: JWT-based login and registration
- **Admin Dashboard**: Manage cars and bookings
- **AI Assistant**: Smart chatbot for car recommendations
- **Contact System**: Contact form with business information
- **Mobile Responsive**: Optimized for all device sizes

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (schema provided)
- **Authentication**: JWT tokens
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd milemaven-car-rental
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Update the environment variables in `.env.local`:
\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/milemaven"
JWT_SECRET="your-super-secret-jwt-key-here"
OPENAI_API_KEY="your-openai-api-key" # Optional for AI assistant
\`\`\`

5. Set up the database:
\`\`\`bash
# Run the SQL scripts in the scripts/ folder
psql -d milemaven -f scripts/database-schema.sql
psql -d milemaven -f scripts/seed-data.sql
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
milemaven-car-rental/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── book/              # Booking pages
│   ├── cars/              # Car listing pages
│   ├── contact/           # Contact page
│   ├── login/             # Authentication pages
│   └── register/
├── components/            # Reusable React components
├── lib/                   # Utility functions and contexts
├── scripts/               # Database scripts
├── public/                # Static assets
└── styles/                # Global styles
\`\`\`

## Key Components

### Authentication
- JWT-based authentication system
- User registration and login
- Protected routes for bookings
- Admin role management

### Car Management
- Car listing with filtering and search
- Individual car detail pages
- Admin car management (CRUD operations)
- Availability tracking

### Booking System
- Date and time selection
- Location pickup/dropoff
- Price calculation
- Booking confirmation

### AI Assistant
- Rule-based chatbot for car recommendations
- Expandable to integrate with OpenAI API
- Context-aware suggestions

## API Endpoints

- `GET /api/cars` - Get all cars
- `GET /api/cars/[id]` - Get specific car
- `POST /api/cars` - Create new car (admin)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `POST /api/contact` - Submit contact form
- `POST /api/ai-assistant` - AI chat responses

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `cars` - Vehicle inventory
- `bookings` - Rental bookings
- `contact_messages` - Contact form submissions

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

\`\`\`env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
OPENAI_API_KEY="your-openai-api-key"
\`\`\`

## Development Guidelines

### Adding New Features

1. Create components in the `components/` directory
2. Add API routes in `app/api/`
3. Use TypeScript for type safety
4. Follow the existing design patterns
5. Ensure mobile responsiveness

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the black and red color scheme
- Maintain consistent spacing and typography
- Ensure accessibility standards

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email info@milemaven.co.ke or contact our development team.
