# 🛍️ SoleMate - Django E-Commerce Website

## Features
- ✅ Multi-seller marketplace
- ✅ Product listings with categories, search & filters
- ✅ Shopping cart with coupon support
- ✅ Razorpay payment integration
- ✅ Order tracking with status updates
- ✅ REST API (Django REST Framework)
- ✅ Seller dashboard with sales analytics
- ✅ Admin panel (Django built-in)
- ✅ Modern Tailwind CSS UI

---

## 🚀 Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Create `.env` File
Create a `.env` file in project root:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser
```bash
python manage.py createsuperuser
```

### 6. Run Server
```bash
python manage.py runserver
```

---

## 📱 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/login/` | Get auth token |
| GET | `/api/products/` | List all products |
| GET | `/api/products/?search=phone` | Search products |
| GET | `/api/products/{slug}/` | Product detail |
| GET | `/api/products/{slug}/reviews/` | Product reviews |
| GET | `/api/categories/` | All categories |
| GET | `/api/orders/` | My orders (auth required) |

### API Authentication
```bash
# Get token
curl -X POST /api/auth/login/ -d '{"email":"...", "password":"..."}'

# Use token
curl -H "Authorization: Token your_token" /api/orders/
```

---

## 🏗️ Project Structure
```
ecommerce/
├── apps/
│   ├── users/          # Auth, profiles, addresses
│   ├── products/       # Products, categories, reviews
│   ├── cart/           # Shopping cart
│   ├── orders/         # Orders + Razorpay payment
│   ├── sellers/        # Seller dashboard
│   ├── coupons/        # Discount coupons
│   └── api/            # REST API
├── templates/          # HTML templates (Tailwind CSS)
├── ecommerce/          # Django settings & URLs
├── requirements.txt
└── manage.py
```

---

## 💳 Razorpay Test Cards
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: 1234

---

## 📝 Notes
- Go to `/admin/` to manage products, users, coupons
- Sellers need admin approval (`is_approved=True`) to sell
- Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`
 
 
 deploye test

