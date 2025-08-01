# 🏈 NILMatch - NIL Deal Platform

A comprehensive platform connecting college athletes with businesses for Name, Image, and Likeness (NIL) deals.

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure signup/login for athletes and businesses
- **Profile Management** - Complete profiles with verification
- **Deal Creation & Management** - End-to-end deal lifecycle
- **Payment Processing** - Secure payments with 5% service fee
- **Real-time Messaging** - In-app communication
- **Legal Document Signing** - Digital signature system
- **Content Verification** - Post upload and verification
- **Payment History** - Complete transaction tracking

### Advanced Features
- **Smart Deal Templates** - Pre-built deal structures
- **Auto Ad Proof Tool** - Automated content verification
- **Micro-Coaching** - Educational content for athletes
- **Search & Discovery** - Advanced filtering and matching
- **Notifications** - Email and SMS alerts
- **PWA Support** - Mobile app-like experience
- **Real-time Updates** - Live deal and message updates

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **React Query** - Data fetching
- **Stripe Elements** - Payment processing

### Backend
- **Supabase** - Database, Auth, Storage
- **Stripe** - Payment processing
- **Netlify Functions** - Serverless backend
- **SendGrid/Resend** - Email service
- **Twilio** - SMS service

### Infrastructure
- **Netlify** - Hosting and deployment
- **Supabase** - Database and real-time
- **Stripe** - Payment infrastructure

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Netlify account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd nil-matchup
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Email Service
REACT_APP_SENDGRID_API_KEY=your-sendgrid-api-key
REACT_APP_SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# SMS Service
REACT_APP_TWILIO_ACCOUNT_SID=your-twilio-account-sid
REACT_APP_TWILIO_AUTH_TOKEN=your-twilio-auth-token
REACT_APP_TWILIO_PHONE_NUMBER=+1234567890

# App Configuration
REACT_APP_APP_NAME=NILMatch
REACT_APP_APP_URL=https://yourdomain.com
```

### 4. Database Setup
1. Create a Supabase project
2. Run the SQL schema in `database-schema.sql`
3. Set up storage buckets for files
4. Configure Row Level Security (RLS)

### 5. Stripe Setup
1. Create a Stripe account
2. Get your publishable and secret keys
3. Set up webhook endpoints
4. Configure payment methods

### 6. Run Development Server
```bash
npm start
```

The app will be available at `http://localhost:3000`

## 🗄️ Database Schema

The app uses the following main tables:
- `users` - User authentication and basic info
- `athletes` - Athlete profiles and details
- `businesses` - Business profiles and details
- `deals` - NIL deals and transactions
- `messages` - Real-time messaging
- `payments` - Payment records
- `legal_documents` - Signed legal documents
- `notifications` - User notifications
- `posts` - NIL content posts
- `disputes` - Dispute resolution

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Copy your project URL and anon key
3. Run the database schema
4. Set up storage buckets
5. Configure authentication providers

### Stripe Setup
1. Create a Stripe account
2. Get your API keys
3. Set up webhook endpoints
4. Configure payment methods
5. Test the payment flow

### Email/SMS Setup
1. Set up SendGrid or Resend for emails
2. Set up Twilio for SMS
3. Configure webhook endpoints
4. Test notification delivery

## 🚀 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Upload build folder to your hosting provider
```

## 📱 PWA Features

The app includes Progressive Web App features:
- Offline support
- Push notifications
- App-like experience
- Background sync
- Install prompt

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- Secure payment processing with Stripe
- Input validation and sanitization
- HTTPS enforcement
- Content Security Policy (CSP)
- XSS protection

## 📊 Analytics & Monitoring

- User behavior tracking
- Deal performance metrics
- Payment analytics
- Error tracking with Sentry
- Performance monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📈 Performance Optimization

- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization

## 🔄 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout

### Deals
- `GET /deals` - Get user deals
- `POST /deals` - Create new deal
- `PUT /deals/:id` - Update deal
- `DELETE /deals/:id` - Delete deal

### Payments
- `POST /payments/create-intent` - Create payment intent
- `POST /payments/confirm` - Confirm payment
- `GET /payments/history` - Get payment history

### Messages
- `GET /messages/:dealId` - Get deal messages
- `POST /messages` - Send message
- `PUT /messages/:id/read` - Mark as read

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@nilmatch.com or create an issue in the repository.

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core functionality
- ✅ Payment processing
- ✅ Real-time messaging
- ✅ Legal document signing

### Phase 2 (Next)
- 🔄 Advanced search and filtering
- 🔄 AI-powered matching
- 🔄 Mobile app development
- 🔄 Advanced analytics

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Advanced compliance tools
- 📋 Marketplace features
- 📋 API for third-party integrations

## 📞 Contact

- **Email**: contact@nilmatch.com
- **Website**: https://nilmatch.com
- **Support**: support@nilmatch.com

---

Built with ❤️ for the NIL community 