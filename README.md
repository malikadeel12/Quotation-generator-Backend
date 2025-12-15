# NexLead Quotation Generator - Backend

Node.js + Express + MongoDB backend API for the NexLead Quotation Generator.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexlead_quotations
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

3. Make sure MongoDB is running

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Add-ons
- `GET /api/addons` - Get all add-ons
- `POST /api/addons` - Create add-on (Admin)
- `PUT /api/addons/:id` - Update add-on (Admin)
- `DELETE /api/addons/:id` - Delete add-on (Admin)

### Bundles
- `GET /api/bundles` - Get all bundles
- `POST /api/bundles` - Create bundle (Admin)
- `PUT /api/bundles/:id` - Update bundle (Admin)
- `DELETE /api/bundles/:id` - Delete bundle (Admin)

### Quotations
- `GET /api/quotations` - Get all quotations
- `GET /api/quotations/:id` - Get quotation by ID
- `POST /api/quotations` - Create quotation
- `PATCH /api/quotations/:id/status` - Update quotation status

### PDF
- `GET /api/pdf/:id` - Download quotation as PDF

### Admin
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user

