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

## 🔐 Password Reset Setup

To enable password reset functionality:

1. **Supabase Auth Configuration:**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your production domain to **Site URL**
   - Add `/reset-password` to **Additional Redirect URLs**
   - Ensure your domain is in **CORS Origins**

2. **Vercel Environment Variables:**
   - After updating Supabase settings, redeploy on Vercel
   - Ensure `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are set

3. **Testing Password Reset:**
   - Use the "Forgot password?" button on the login page
   - Check email for reset link
   - Set new password on reset page

## 🔧 Supabase Auth Configuration

**IMPORTANT:** Configure Supabase Auth settings for production deployment:

### **Site URL:**
```
https://nil-matchup-deploy.vercel.app
```

### **Additional Redirect URLs:**
```
https://nil-matchup-deploy.vercel.app
https://nil-matchup-deploy.vercel.app/auth/callback
https://nil-matchup-deploy.vercel.app/reset-password
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/reset-password
```

### **CORS Origins:**
```
https://nil-matchup-deploy.vercel.app
http://localhost:3000
```

### **Steps:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set Site URL to your Vercel domain
3. Add all redirect URLs above
4. Add both hosts to CORS Origins
5. Save changes
6. Redeploy on Vercel after environment variable changes

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