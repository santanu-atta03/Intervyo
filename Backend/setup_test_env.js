import fs from "fs";

const envContent = `
PORT=5000
MONGODB_URL=mongodb://localhost:27017/intervyo_test
GOOGLE_CLIENT_ID=dummy_google_id
GOOGLE_CLIENT_SECRET=dummy_google_secret
GITHUB_CLIENT_ID=dummy_github_id
GITHUB_CLIENT_SECRET=dummy_github_secret
GROQ_API_KEY=dummy_groq_key
RESEND_API_KEY=re_123456789
CLIENT_URL=http://localhost:5173
JWT_SECRET=supersecretkey
MAIL_USER=test@example.com
MAIL_PASS=password
FRONTEND_URL=http://localhost:5173
`.trim();

fs.writeFileSync(".env", envContent);
console.log(".env file created/updated with dummy values.");
