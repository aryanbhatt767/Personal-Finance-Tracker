#  FinTrack — Full-Stack Finance Tracker

A full-stack expense tracker built with **Spring Boot** (backend) and **React + Vite** (frontend), featuring JWT authentication, bcrypt password hashing, 14+ REST APIs.

---

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth       | JWT (jjwt 0.12), BCrypt                         |
| Database   | H2 (dev) / MySQL (prod)                         |
| Frontend   | React 18, Vite, React Router v6                 |
| Charts     | Chart.js + react-chartjs-2                      |
| HTTP       | Axios                                           |

---

## 🚀 Getting Started

### Backend

```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔐 REST API Endpoints (14+)

### Auth
| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | /api/auth/register    | Register · bcrypt · return JWT |
| POST   | /api/auth/login       | Login · validate · return JWT  |

### Users
| Method | Endpoint       | Description            |
|--------|----------------|------------------------|
| GET    | /api/users/me  | Get profile (JWT req)  |
| PUT    | /api/users/me  | Update name/email      |
| DELETE | /api/users/me  | Delete account         |

### Transactions
| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| GET    | /api/transactions         | List all (filterable) |
| GET    | /api/transactions/:id     | Get single            |
| POST   | /api/transactions         | Create new            |
| PUT    | /api/transactions/:id     | Update                |
| DELETE | /api/transactions/:id     | Delete                |

### Analytics
| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| GET    | /api/analytics/summary      | Income/expense totals |
| GET    | /api/analytics/categories   | Category breakdown    |
| GET    | /api/analytics/monthly      | Month-by-month trend  |

### Budgets
| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | /api/budgets      | List budgets      |
| POST   | /api/budgets      | Create/update     |
| PUT    | /api/budgets/:id  | Update budget     |
| DELETE | /api/budgets/:id  | Delete budget     |

---

## ✨ Features

- **JWT Auth** — Stateless authentication with Bearer tokens
- **BCrypt** — Passwords hashed with strength factor 10
- **Dashboard** — Balance, income, expense, savings rate cards
- **Line Chart** — Smooth animated income vs expense trend
- **Transactions** — Full CRUD with search, filter by type/date
- **Budget Tracker** — Per-category progress bars with alerts
- **Analytics** — Monthly trends, category breakdowns, API map
- **Profile** — User info and full API reference

---

## 🗂 Project Structure

```
finance-tracker/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/fintrack/
│       ├── FinanceTrackerApplication.java
│       ├── model/          User, Transaction, Budget
│       ├── repository/     JPA repositories with custom queries
│       ├── service/        Business logic
│       ├── controller/     REST controllers
│       ├── security/       JwtService, JwtAuthFilter
│       ├── config/         SecurityConfig, GlobalExceptionHandler
│       └── dto/            Request/Response DTOs
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx           Router setup
        ├── context/          AuthContext (JWT state)
        ├── services/         Axios API service
        ├── pages/            Dashboard, Transactions, Budget, Analytics, Profile
        ├── components/       Layout, MetricCard, AddTransactionModal, PageHeader
        └── utils.js          Formatters, category helpers
```

---

## 🔧 Switch to MySQL (Production)

In `application.properties`, comment out H2 and uncomment:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fintrackdb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```
