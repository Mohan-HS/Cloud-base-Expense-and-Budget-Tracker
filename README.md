# Cloud-based Expense and Budget Tracker

A full-stack, cloud-ready expense tracking application built with **Next.js (App Router)**, **Node.js**, and **PostgreSQL**.  
This repository currently represents **Expense Tracker v1**, with budget features planned for future versions.

---

## 🚀 Features (v1)

### Authentication & Security
- User signup and login
- JWT-based authentication
- Protected routes (frontend & backend)
- Secure ownership checks for all expenses

### Expense Management
- Add, view, update, and delete expenses
- Expenses scoped strictly to the authenticated user
- Clean API contracts with typed responses

### Frontend
- Built with Next.js (App Router)
- Login & signup pages
- Protected dashboard
- Add expense form
- Logout flow
- Service-based API layer

### Backend
- Node.js + Express architecture
- PostgreSQL database
- Modular service and controller layers
- Stable REST API routes
- Environment-based configuration

### Developer Experience
- Clean repo structure
- `.env.example` provided
- `.gitignore` configured correctly
- ESLint + Prettier
- End-to-end working locally

---

## 🧱 Tech Stack

**Frontend**
- Next.js (App Router)
- TypeScript
- Axios / Fetch (service layer)

**Backend**
- Node.js
- Express
- JWT Authentication

**Database**
- PostgreSQL

**Tooling**
- ESLint
- Prettier
- Git
- (CI to be added)

---
## API Contract (v1)

### Authentication

POST /api/auth/signup  
Request:
{
  name: string,
  email: string,
  password: string
}

Response:
{
  token: string
}

POST /api/auth/login  
Request:
{
  email: string,
  password: string
}

Response:
{
  token: string
}

---

### Expenses

GET /api/expenses  
Response:
Expense[]

POST /api/expenses  
Request:
{
  title: string,
  amount: number,
  category?: string,
  expense_date: string
}

Response:
Expense

PUT /api/expenses/:id  
Request:
Partial<Expense>

Response:
Expense

DELETE /api/expenses/:id  
Response:
204 No Content


## ⚙️ Local Setup

### Prerequisites
- Node.js (LTS recommended)
- PostgreSQL
- Git

---


