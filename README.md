# 🏈 NIL Matchup - College Athlete Business Platform

Connecting college athletes with local businesses for meaningful partnerships and opportunities.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nil-matchup-app)

### **Prerequisites:**
- GitHub account
- Vercel account
- Supabase account
- Stripe account

### **Deployment Steps:**

1. **Fork/Clone this repository**
2. **Set up environment variables in Vercel:**
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   REACT_APP_STRIPE_WEBHOOK_SECRET=your_webhook_secret
   REACT_APP_JWT_SECRET=your_jwt_secret
   REACT_APP_ENCRYPTION_KEY=your_encryption_key
   ```
3. **Deploy with Vercel**

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📋 Features

- **Athlete Profiles** - Complete athlete portfolios
- **Business Listings** - Local business opportunities
- **Smart Templates** - Pre-built deal templates
- **Secure Messaging** - Direct communication
- **Payment Processing** - Stripe integration
- **Document Signing** - Legal compliance
- **Real-time Notifications** - Instant updates

## 🔧 Tech Stack

- **Frontend:** React.js, CSS3, HTML5
- **Backend:** Supabase (Database & Auth)
- **Payments:** Stripe
- **Deployment:** Vercel
- **Security:** JWT, Encryption, Rate Limiting

## 📱 Environment Variables

Required environment variables for deployment:

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` |
| `REACT_APP_STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `REACT_APP_JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `REACT_APP_ENCRYPTION_KEY` | Data encryption key | `32-char-key` |

## 🔒 Security Features

- End-to-end encryption
- JWT authentication
- Rate limiting
- Input validation
- XSS protection
- GDPR compliance

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email: jadenselby01@gmail.com

---

**Built with ❤️ for college athletes and local businesses** 