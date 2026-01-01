# 💰 Coin Coach - Personal Finance Tracker

**Coin Coach** is a modern, full-stack personal finance application designed to help users track their income, expenses, and savings goals. Built with the **PERN stack** (PostgreSQL, Express, React, Node.js) and enhanced with **Redis** for high-performance caching.

## 🚀 Live Demo
- **Frontend:** [https://coin-coach-two.vercel.app](https://coin-coach-two.vercel.app)
- **Backend API:** [https://coin-coach-api.onrender.com](https://coin-coach-api.onrender.com)

---

## ✨ Features

- **📊 Interactive Dashboard:** Real-time overview of current balance, total income, and expenses.
- **💸 Transaction Management:** Add, edit, and delete transactions with ease. Support for categories and dates.
- **📈 Advanced Analytics:** Visual charts (Pie & Bar) for category breakdowns and monthly financial trends.
- **⚡ High Performance:** Uses **Redis** caching to serve analytics data instantly, reducing database load.
- **🌍 Dynamic Currency:** Support for multiple global currencies (USD, INR, EUR, GBP, etc.).
- **🔐 Secure Authentication:** JWT-based user authentication and secure password hashing.
- **📱 Responsive Design:** Fully optimized for desktop and mobile devices.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** CSS Modules / Vanilla CSS
- **Charts:** Chart.js, React-Chartjs-2
- **Routing:** React Router DOM
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Sequelize
- **Database:** PostgreSQL (Cloud hosted on Neon)
- **Caching:** Redis (Cloud hosted on Upstash)
- **Authentication:** JSON Web Tokens (JWT), Bcrypt

---

## ⚙️ Local Setup Guide

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud URL)
- Redis (Local or Cloud URL)

### 1. Clone the Repository
```bash
git clone https://github.com/iamitabhshukla/Coin-Coach.git
cd Coin-Coach
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create a .env file
cp .env.example .env
```
**Configure your `.env` file:**
```env
PORT=5000
DATABASE_URL=postgres://user:pass@localhost:5432/coin_coach
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Run Database Migrations:**
```bash
npx sequelize-cli db:migrate
```

**Start the Server:**
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal.
```bash
cd frontend
npm install

# Create a .env file
cp .env.example .env
```
**Configure your `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Start the Frontend:**
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ☁️ Deployment

### Backend (Render)
1.  Connect GitHub repo to Render.
2.  Set Root Directory to `backend`.
3.  Set Build Command: `npm install`.
4.  Set Start Command: `node server.js`.
5.  Add Environment Variables (`DATABASE_URL`, `REDIS_URL`, etc.).

### Frontend (Vercel)
1.  Connect GitHub repo to Vercel.
2.  Set Root Directory to `frontend`.
3.  Add Environment Variable: `VITE_API_URL` pointing to your Render backend.
4.  Deploy!

---

## 📂 Project Structure

```
Coin-Coach/
├── backend/            # Express Server & API Roots
│   ├── config/         # DB & Redis Configuration
│   ├── src/
│   │   ├── controllers/# Business Logic
│   │   ├── models/     # Sequelize Models
│   │   ├── routes/     # API Endpoints
│   │   └── middleware/ # Auth & Validation
│   └── package.json
│
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── context/    # Global State (Auth, Currency)
│   │   ├── pages/      # Main Application Views
│   │   └── api/        # Axios Setup
│   └── vite.config.js
│
└── README.md           # Project Documentation
```

---

## 🛡️ Security

- **Helmet:** Sets secure HTTP headers.
- **CORS:** Configured to allow requests only from trusted frontends.
- **Rate Limiting:** Prevents brute-force attacks on API endpoints.
- **Input Validation:** Server-side validation for all incoming data.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License

This project is open-source and available under the MIT License.
