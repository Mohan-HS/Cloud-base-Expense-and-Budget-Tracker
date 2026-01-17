# Cloud-Based Expense and Budget Tracker

A full-stack, cloud-ready expense tracking application built with  
**Next.js (App Router)**, **Node.js**, and **PostgreSQL**.

This repository represents **Expense Tracker v1**.  
Budget and analytics features are planned for future versions.

---

## 🚀 Features (v1)

### 🔐 Authentication & Security
- User signup and login
- JWT-based authentication
- JWT tokens are issued **only on login**
- Protected frontend routes
- Protected backend APIs
- Secure ownership checks (users can access only their own data)
- Logout support

---

### 💸 Expense Management
- Add expenses with title, amount, category, and date
- View all expenses for the authenticated user
- Edit existing expenses
- Delete expenses with confirmation
- Consistent and stable date handling (DD-MM-YYYY in UI)

---

### 🖥 Frontend
- Built with **Next.js (App Router)**
- TypeScript-based components
- Login & signup pages
- Protected dashboard
- Expense CRUD UI
- Centralized API service layer
- Dark theme UI
- Responsive layout

---

### ⚙️ Backend
- Node.js + Express
- PostgreSQL database
- JWT authentication middleware
- Modular route structure
- Stable REST API contracts
- Environment-based configuration

---

### 🧑‍💻 Developer Experience
- Clean repository structure
- `.env.example` provided
- Proper `.gitignore`
- ESLint + Prettier configured
- End-to-end working locally
- Ready for CI/CD

---

## 🧱 Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Fetch-based service abstraction

### Backend
- Node.js
- Express
- JWT Authentication

### Database
- PostgreSQL

### Tooling
- Git
- ESLint
- Prettier
- CI (planned)
- CD (planned)

---

## 🔐 Authentication Flow (v1)

The authentication system follows a clean, production-grade design:

### 1. Signup
- User registers with name, email, and password
- Account is created in the database
- **No JWT is issued at signup**
- User is redirected to the login page

### 2. Login
- User logs in using email and password
- Backend validates credentials
- JWT token is issued
- Token is stored on the client
- User is redirected to the dashboard

### 3. Protected Access
- JWT is required for all expense-related APIs
- Backend enforces ownership checks
- Unauthorized access is rejected

This separation ensures a secure and predictable authentication lifecycle.

---

## 📡 API Contract (v1)

### Authentication

#### POST `/api/auth/signup`

**Request**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
Response

{
  "message": "User created successfully"
}
---
POST /api/auth/login

Request

{
  "email": "string",
  "password": "string"
}


Response

{
  "token": "jwt-token"
}
---
Expenses
GET /api/expenses

Response

Expense[]
---
POST /api/expenses

Request

{
  "title": "string",
  "amount": number,
  "category": "string",
  "expense_date": "YYYY-MM-DD"
}


Response
---
Expense

PUT /api/expenses/:id

Request

{
  "title": "string",
  "amount": number,
  "category": "string",
  "expense_date": "YYYY-MM-DD"
}


Response
---
Expense

DELETE /api/expenses/:id

Response
{
  "message": "Expense deleted successfully"
}
Response
```

##


### 📸 Screenshots
### Dashboard – Expense List
> Shows the list of user expenses with edit and delete actions.

![Dashboard Screenshot](./screenshots/Dashboard.png)

### Add / Edit Expense
> Shows the expense form with date handling and edit mode.

![Edit Expense Screenshot](./screenshots/Edit Expense.png)




## ⚙️ Local Setup
Prerequisites

Node.js (LTS recommended)

PostgreSQL

Git

## Backend Setup
  cd expense-backend
  npm install
  npm run dev

## Frontend Setup
  cd expense-frontend
  npm install
  npm run dev


## Configure environment variables using .env.example.

📌 Project Status

Expense Tracker v1 complete

Authentication stable

Expense CRUD complete

UI/UX finalized for v1

CI ready

CD planned next

🔮 Future Improvements

Monthly and category-based budgets

Expense analytics and summaries

Charts and visual insights

Deployment automation (CD)

OAuth login options
