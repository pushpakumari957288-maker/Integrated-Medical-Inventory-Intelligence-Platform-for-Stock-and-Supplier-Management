# 🏥 Integrated Medical Inventory Intelligence Platform

### Stock and Supplier Management System

A comprehensive, full-featured **Medical Inventory Management Platform** built with **React + Vite** that provides real-time stock monitoring, supplier management, expiry tracking, and intelligent alerts for healthcare facilities.

---

## 🚀 Features Completed

### ✅ Feature 1: Authentication & User Role Management Service
- **Login / Register** with email & password
- **OAuth2 SSO** simulation (Google Health, Microsoft Azure AD)
- **Forgot Password** with OTP verification (OTP: `7842`)
- **JWT Token Inspector** — view decoded token payload
- **Role-Based Access Control (RBAC)** — Admin, Pharmacist, Inventory Manager, Doctor, Nurse
- **10-Permission Matrix** — granular permission toggles per role
- **User Directory** — Add, Edit, Suspend, Activate staff accounts
- **Audit Trail Logging** — tracks all login, CRUD, and security events

### ✅ Feature 2: Medicine Inventory Management Service
- **Medicine Catalog** — full CRUD (Create, Read, Update, Delete)
- **Category Management** — therapeutic drug classification with storage guidelines
- **Multi-Batch Tracking** — batch numbers, manufacturing dates, expiry dates, purchase costs
- **Stock Status Engine** — automatic `IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK` classification
- **Expiry Status Engine** — automatic `VALID`, `EXPIRING_SOON`, `EXPIRED` detection
- **Search & Filter** — filter by name, code, category, stock status, expiry status
- **Editable Stock & Expiry** — directly edit total stock quantity and nearest expiry date

### ✅ Feature 3: Supplier & Purchase Order Management Service
- **Supplier Directory** — vendor profiles with contact info, tax ID, payment terms
- **Supplier Performance Metrics** — rating, on-time delivery rate, lead time, total orders
- **Purchase Order (PO) Workflow** — Create PO → `PENDING` → `APPROVED` → `SHIPPED` → `DELIVERED`
- **Auto-Restock on Delivery** — when PO status is marked `DELIVERED`, medicine stock automatically increases
- **Search & Status Filtering** — filter suppliers by name, status, and performance

### ✅ Feature 4: Stock Monitoring, Alerts & Admin Dashboard
- **Real-Time Notification Engine** — navbar bell icon with live unread badge count
- **Alert Categories** — Critical (Out of Stock), Warning (Low Stock), Expiry (Expiring Soon / Expired)
- **Top Emergency Ticker Banner** — auto-displays critical out-of-stock and expired medication alerts
- **Stock Adjustment Engine** — record stock IN/OUT movements with audit trail
- **1-Click Restock PO Generator** — instantly create purchase orders from alert items
- **Admin Dashboard with 8 Analytics Pillars:**
  1. Stock Overview (total items, valuation, depletion radar)
  2. Low Stock Items
  3. Expiry Tracker
  4. Supplier Analytics
  5. Purchase History
  6. Reports & Export (CSV & JSON download)
  7. User Management summary
  8. System Monitoring

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 + Vite |
| **Routing** | React Router DOM v6 |
| **Icons** | Lucide React |
| **Styling** | Custom CSS (Glassmorphism, Dark Theme) |
| **State Management** | React Context API + localStorage |
| **Data Layer** | In-memory mock services with localStorage persistence |

---

## 📁 Project Structure

```
SpringboadProject/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── StatCard.jsx
│       │   ├── MedicineModal.jsx
│       │   └── ViewMedicineModal.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── InventoryPage.jsx
│       │   ├── SuppliersPage.jsx
│       │   ├── AlertsPage.jsx
│       │   ├── UsersPage.jsx
│       │   └── ProfilePage.jsx
│       └── services/
│           └── api.js
└── .gitignore
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/springboardmentor7777/Integrated-Medical-Inventory-Intelligence-Platform-for-Stock-and-Supplier-Management.git

# Navigate to the frontend directory
cd Integrated-Medical-Inventory-Intelligence-Platform-for-Stock-and-Supplier-Management/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000/`

### Default Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medistock.com | any password |
| Pharmacist | pharm@medistock.com | any password |
| Manager | manager@medistock.com | any password |

---

## 🎨 UI Highlights

- **Dark Glassmorphism Theme** — premium, modern healthcare aesthetic
- **Responsive Layout** — sidebar navigation with collapsible design
- **Micro-Animations** — smooth transitions, hover effects, and loading states
- **Real-Time Badge Updates** — notification bell with live unread count
- **Emergency Alert Banner** — top ticker for critical stock/expiry warnings
- **Export Functionality** — download reports as CSV or JSON

---

## 📊 Architecture

The platform follows a **microservices-inspired frontend architecture** with 5 dedicated service modules:

1. 🟢 **Authentication Service** — Login, Registration, OAuth2, JWT
2. 🔵 **User & Role Management Service** — Staff directory, RBAC, Permissions
3. 🟡 **Medicine Inventory Management Service** — Catalog, Categories, Batches
4. 🟣 **Supplier Management Service** — Vendors, Purchase Orders, Auto-Restock
5. 🔴 **Stock Monitoring Service** — Alerts, Adjustments, Threshold Detection

---

## 📝 License

This project is developed as part of the **Springboard Mentorship Program**.

---

## 👨‍💻 Author

**Shaikh Rizwan** — [GitHub Profile](https://github.com/shaikhrizwan988010-lang)
