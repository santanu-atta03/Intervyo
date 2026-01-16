# Intervyo Deployment Guide

Complete guide for deploying Intervyo to production.

---

## 🚀 Quick Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)
**Best for:** Quick deployment with free tier options

### Option 2: AWS (Full Stack)
**Best for:** Production-grade, scalable deployment

### Option 3: Docker + VPS
**Best for:** Full control and cost optimization

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] All required `.env` variables configured
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Database connection string is valid
- [ ] All API keys are set up
- [ ] CORS origins are configured for production domains

### 2. Security
- [ ] Helmet.js security headers enabled
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced
- [ ] Environment variables not exposed in client

### 3. Database
- [ ] MongoDB Atlas cluster created (or alternative)
- [ ] Database indexes optimized
- [ ] Backup strategy in place
- [ ] Connection pool configured

### 4. Performance
- [ ] Compression middleware enabled
- [ ] Static assets optimized
- [ ] API response caching implemented
- [ ] Database queries optimized

---

## 🔧 Deployment: Vercel + Render

### Backend Deployment (Render)

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository

2. **Create Web Service**
   ```
   Name: intervyo-backend
   Environment: Node
   Build Command: cd Backend && npm install
   Start Command: cd Backend && npm start
   ```

3. **Configure Environment Variables**
   Go to "Environment" tab and add all variables from `.env.example`:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   CLIENT_URL=https://your-frontend.vercel.app
   FRONTEND_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   PORT=5000
   GROQ_API_KEY=your_groq_key
   OPENAI_API_KEY=your_openai_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://intervyo-backend.onrender.com`

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure Frontend**
   
   Create `Frontend/.env.production`:
   ```env
   VITE_API_URL=https://intervyo-backend.onrender.com/api
   VITE_SOCKET_URL=https://intervyo-backend.onrender.com
   ```

3. **Deploy to Vercel**
   ```bash
   cd Frontend
   vercel --prod
   ```

4. **Configure Domain (Optional)**
   - Add custom domain in Vercel dashboard
   - Update CORS settings in backend

5. **Update Backend CORS**
   Update `allowedOrigins` in `Backend/index.js`:
   ```javascript
   const allowedOrigins = [
     "https://your-domain.com",
     "https://your-domain.vercel.app",
   ];
   ```

---

## 🐳 Docker Deployment

### 1. Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
# Backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
# Frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./Backend
    restart: always
    environment:
      MONGODB_URI: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/intervyo?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      PORT: 5000
      CLIENT_URL: ${CLIENT_URL}
      GROQ_API_KEY: ${GROQ_API_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    ports:
      - "5000:5000"
    depends_on:
      mongodb:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./Frontend
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    environment:
      VITE_API_URL: ${BACKEND_URL}/api

volumes:
  mongo_data:
```

### 3. Deploy with Docker Compose

```bash
# Create .env file for docker-compose
cat > .env << EOF
MONGO_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-domain.com
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key
BACKEND_URL=https://api.your-domain.com
EOF

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## ☁️ AWS Deployment

### Architecture
```
Route 53 (DNS)
  ↓
CloudFront (CDN)
  ↓
ALB (Load Balancer)
  ↓
ECS (Container Service) or EC2
  ↓
RDS or MongoDB Atlas
```

### 1. Database Setup (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create cluster
3. Configure network access (whitelist IP ranges)
4. Create database user
5. Get connection string

### 2. Backend Deployment (Elastic Beanstalk)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd Backend
eb init -p node.js-18 intervyo-backend --region us-east-1

# Create environment
eb create intervyo-backend-prod --instance-type t3.medium

# Deploy
eb deploy

# Configure environment variables
eb setenv MONGODB_URI=your_mongodb_uri \
  JWT_SECRET=your_jwt_secret \
  NODE_ENV=production \
  CLIENT_URL=https://your-domain.com
```

### 3. Frontend Deployment (S3 + CloudFront)

```bash
# Build frontend
cd Frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://intervyo-frontend --delete

# Create CloudFront distribution
# (Use AWS Console or CloudFormation)

# Invalidate cache after updates
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

---

## 🔐 SSL/TLS Configuration

### Let's Encrypt (Free SSL)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 📊 Monitoring & Logging

### 1. Application Monitoring

**PM2 (Process Manager):**
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start Backend/index.js --name intervyo-backend

# Monitor
pm2 monit

# View logs
pm2 logs

# Setup auto-restart on system reboot
pm2 startup
pm2 save
```

### 2. Error Tracking

**Sentry Integration:**
```bash
npm install @sentry/node
```

```javascript
// Backend/index.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### 3. Uptime Monitoring

Services to consider:
- [UptimeRobot](https://uptimerobot.com) - Free tier available
- [Pingdom](https://www.pingdom.com)
- AWS CloudWatch

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Backend Dependencies
        run: cd Backend && npm ci
      
      - name: Run Tests
        run: cd Backend && npm test
        env:
          NODE_ENV: test
          MONGODB_URI: ${{ secrets.TEST_MONGODB_URI }}
          JWT_SECRET: ${{ secrets.TEST_JWT_SECRET }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: cd Frontend && npm ci
      
      - name: Build
        run: cd Frontend && npm run build
        env:
          VITE_API_URL: ${{ secrets.PROD_API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./Frontend
          vercel-args: '--prod'
```

---

## 🔍 Post-Deployment Verification

### Health Checks
```bash
# Backend health
curl https://your-backend-url/api/health

# Expected response:
# {"status":"ok","services":{"database":"connected","server":"ok"}}

# Frontend
curl -I https://your-frontend-url
# Expected: 200 OK
```

### Load Testing
```bash
# Install k6
brew install k6  # macOS
# or snap install k6  # Linux

# Run load test
k6 run scripts/load-test.js
```

### Security Scan
```bash
# Run npm audit
npm audit --audit-level=moderate

# Check for outdated packages
npm outdated
```

---

## 🚨 Troubleshooting

### Common Issues

**1. CORS Errors**
- Check `allowedOrigins` in backend
- Verify frontend URL matches exactly (no trailing slash)
- Check preflight OPTIONS requests

**2. Database Connection Issues**
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions

**3. Environment Variables Not Loading**
- Verify `.env` file exists
- Check for typos in variable names
- Ensure `dotenv.config()` is called early

**4. Rate Limiting Too Strict**
- Adjust limits in production
- Consider IP whitelisting for known clients
- Implement authenticated rate limits

---

## 📈 Scaling Strategies

### Horizontal Scaling
- Use load balancer (AWS ALB, Nginx)
- Run multiple backend instances
- Implement sticky sessions for WebSocket

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for heavy read workloads
- Implement caching (Redis)

### CDN for Static Assets
- Use CloudFront, Cloudflare, or Fastly
- Cache static files and API responses
- Implement cache invalidation strategy

---

## 💰 Cost Optimization

### Free Tier Recommendations
- **Database:** MongoDB Atlas (512MB free)
- **Backend:** Render (750 hours/month free) or Railway
- **Frontend:** Vercel (unlimited personal projects)
- **Storage:** Cloudinary (25GB free)
- **Monitoring:** UptimeRobot (50 monitors free)

### Production Cost Estimates

**Small Scale (< 1000 users):**
- Database: $0-10/month
- Backend: $7-25/month
- Frontend: Free
- Total: ~$10-35/month

**Medium Scale (1000-10k users):**
- Database: $25-100/month
- Backend: $25-100/month
- CDN: $10-50/month
- Total: ~$60-250/month

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)

---

## 🆘 Support

Need deployment help?
- GitHub Issues: [Report Issue](https://github.com/santanu-atta03/Intervyo/issues)
- Email: support@intervyo.xyz
- Documentation: https://intervyo.xyz/docs
