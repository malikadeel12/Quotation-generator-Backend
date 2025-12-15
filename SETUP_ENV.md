# Environment Setup

## Create .env File

Backend folder mein `.env` file create karein with following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexlead_quotations
JWT_SECRET=nexlead_super_secret_jwt_key_2024_change_in_production
NODE_ENV=development
```

## Quick Steps:

1. Backend folder mein jao
2. `.env` naam ki file create karein (no extension)
3. Upar wala content copy-paste karein
4. Backend server restart karein

## Important Notes:

- `JWT_SECRET` - Yeh important hai authentication ke liye
- Production mein strong secret key use karein
- `.env` file git mein commit nahi hoti (security ke liye)

