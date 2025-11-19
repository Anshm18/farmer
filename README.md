# FarmerHub - Farmer-Vendor Marketplace

A full-stack Next.js marketplace platform connecting farmers and vendors directly with location-based search powered by Google Maps API and JWT authentication.

## Features

- **Farmer Dashboard**: Manage produce listings, track inventory, and respond to vendor orders
- **Vendor Marketplace**: Browse and purchase directly from farmers with location-based discovery
- **Google Maps Integration**: Location-based search to find nearby farms
- **JWT Authentication**: Secure user authentication for farmers and vendors
- **Real-time Notifications**: Incoming order alerts for farmers
- **Order Management**: Complete order tracking from placement to delivery

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Maps**: Google Maps API
- **Database**: MongoDB with geospatial indexing

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB connection string
- Google Maps API key

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the database setup script:
\`\`\`bash
npm run setup-db
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   ├── products/       # Product CRUD operations
│   │   ├── orders/         # Order management
│   │   └── notifications/  # Notification endpoints
│   ├── farmer/
│   │   ├── dashboard/      # Farmer main dashboard
│   │   └── orders/         # Farmer incoming orders
│   ├── vendor/
│   │   ├── marketplace/    # Vendor product browsing
│   │   ├── marketplace-with-map/ # Map-based browsing
│   │   └── orders/         # Vendor order history
│   ├── login/              # Login page
│   └── register/           # Registration page
├── components/
│   ├── auth-form.tsx       # Shared auth form
│   ├── location-map.tsx    # Google Maps component
│   └── notifications-badge.tsx # Notification UI
├── lib/
│   ├── mongodb.ts          # MongoDB connection
│   ├── auth.ts             # JWT and password utilities
│   └── utils.ts            # Shared utilities
└── types/
    └── index.ts            # TypeScript interfaces
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with optional location filtering)
- `POST /api/products` - Create new product (farmers only)

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order (vendors only)
- `PATCH /api/orders/[id]` - Update order status (farmers only)

### Notifications
- `GET /api/notifications` - Get user notifications

## User Flows

### Farmer Flow
1. Register as a farmer with location
2. Dashboard: Add/manage products
3. View incoming orders from vendors
4. Update order status (pending → confirmed → shipped → delivered)

### Vendor Flow
1. Register as a vendor
2. Browse marketplace or use map view to find nearby farms
3. Search and filter products
4. Place orders
5. Track order history

## Key Features Implementation

### Location-Based Search
Uses MongoDB's geospatial indexing with 2dsphere to enable location-based queries within a specified radius.

### JWT Authentication
Tokens include user ID, email, and role (farmer/vendor) with 7-day expiration.

### Order Management
Complete order lifecycle tracking with status progression: pending → confirmed → shipped → delivered.

## Development

### Database Setup
Run the setup script to create collections and indexes:
\`\`\`bash
npm run setup-db
\`\`\`

### Testing the Marketplace

1. Create a farmer account
2. Add some products
3. Create a vendor account
4. Browse and place orders
5. Go back to farmer account to confirm/ship orders

## Deployment

Deploy to Vercel:
\`\`\`bash
npm run deploy
\`\`\`

Or push to GitHub and connect to Vercel for automatic deployments.

## Required Environment Variables for Deployment

- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secure random string for JWT signing
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key

## Future Enhancements

- Payment integration (Stripe)
- Reviews and ratings system
- Product images and media
- Real-time chat between farmers and vendors
- Advanced filtering and sorting
- Analytics dashboard
- Mobile app

## License

MIT
