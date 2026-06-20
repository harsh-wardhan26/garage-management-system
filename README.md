# Garage Management System (MERN OS)

A premium, production-ready MERN Stack Operations Dashboard designed for automotive workshop management, vehicle registers, customer profiles, and service repair orders.

---

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Material UI (MUI) + MUI Data Grid
- **State Management**: Redux Toolkit (RTK)
- **API Client**: Axios with automatic JWT bearer token injection interceptors
- **Form Validation**: React Hook Form + Yup schemas
- **Charts & Reports**: Recharts (Revenue, Service Load trends)
- **Backend API**: Node.js + Express.js (ES Modules syntax enabled)
- **Database**: MongoDB + Mongoose schemas
- **Security**: JSON Web Tokens (JWT) + Bcryptjs password hashing
- **Deployment**: Docker & Docker Compose support, ready for Railway (Backend) & Vercel (Frontend)

---

## 📂 Project Structure

```
garage-management-system/
├── garage-backend/         # Express API Server
│   ├── src/
│   │   ├── config/         # Database connection scripts
│   │   ├── controllers/    # API Request handlers (Auth, Customers, Vehicles, Services)
│   │   ├── middleware/     # JWT Protections & RBAC authorizations
│   │   ├── models/         # Mongoose Data Schemas (User, Customer, Vehicle, ServiceRequest)
│   │   └── routes/         # Express routers
│   ├── Dockerfile
│   ├── nodemon.json
│   ├── server.js
│   └── package.json
│
├── garage-frontend/        # React SPA Application
│   ├── src/
│   │   ├── components/     # UI Modal dialog forms & Detail views
│   │   ├── pages/          # Core views (Dashboard, Customers, Vehicles, Services, Auth)
│   │   ├── services/       # Axios API client setups
│   │   ├── store/          # Redux Toolkit store & authentication slice
│   │   └── styles/         # Global index styles
│   ├── Dockerfile
│   ├── nginx.conf          # Nginx production reverse proxy setup
│   ├── vercel.json         # Vercel SPA routing fallback configurations
│   ├── vite.config.ts
│   └── package.json
│
└── docker-compose.yml       # Orchestration file mapping services
```

---

## ⚙️ Environment Variable Setup

Create a `.env` file in `garage-backend/` matching the parameters below:

```env
# Backend server port
PORT=5000

# MongoDB database connection string
MONGO_URI=mongodb://localhost:27017/garage_management

# JWT Secret keys for auth signature token generations
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Node environment settings (production / development)
NODE_ENV=development
```

---

## 💻 Local Installation Steps

### 1. Prerequisite Checks
Make sure you have [Node.js (v20+)](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed and running locally.

### 2. Backend Setup
1. Open terminal and navigate to the backend folder:
   ```bash
   cd garage-backend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file and adjust variables.
4. Launch the local development server with hot-reload enabled:
   ```bash
   npm run dev
   ```
   *(Server boots up on `http://localhost:5000`)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd garage-frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Launch Vite development server:
   ```bash
   npm run dev
   ```
   *(Frontend app runs on `http://localhost:3000`)*

---

## 🐳 Running with Docker

You can run the entire system (MongoDB database, Express backend, and React/Nginx frontend) containerized under a shared bridge network.

Launch the orchestrator from the root project folder:
```bash
docker-compose up --build
```
- **Web App Interface**: accessible on `http://localhost:3000`
- **Backend API Server**: accessible on `http://localhost:5000`
- **MongoDB Instance**: mapped to port `27017`

---

## 🌐 Deployment Guides

### 1. Backend Deployment: Railway

[Railway](https://railway.app/) is recommended for containerized backend databases and APIs.

1. Create a **New Project** on Railway.
2. Provision a **MongoDB Database** service. Copy the connection string provided.
3. Add a new **GitHub Repo** service linking your `garage-backend` codebase.
4. In the service settings, configure **Environment Variables**:
   - `MONGO_URI`: *Paste the provisioning MongoDB connection string here*
   - `JWT_SECRET`: *Generate a secure cryptokey string*
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
5. Railway reads the `Dockerfile` inside the directory and deploys the container automatically.

---

### 2. Frontend Deployment: Vercel

Vercel is optimized for building and serving static frontend SPAs.

> [!WARNING]
> Because static frontend SPAs rely on client-side routing, reloading pages directly on nested paths (e.g. `/customers`) will return Vercel 404 errors. We have configured the `vercel.json` file in `garage-frontend/` to automatically rewrite fallbacks to `index.html` to prevent this issue.

1. Install Vercel CLI or link your repository directly on the [Vercel Dashboard](https://vercel.com/).
2. Set the root directory of the Vercel project to `garage-frontend/`.
3. Select **Vite** as the framework preset.
4. Set build command: `npm run build` and output directory: `dist`.
5. Set environment proxy or update baseURL inside `api.ts` if deploying separately.
6. Deploy!

---

## 📖 API Endpoint Documentation

All endpoints (except login/register) require JWT authorization. Send token inside headers: `Authorization: Bearer <JWT_TOKEN>`.

### Authentication Endpoints
| Verb | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user. Default role: Mechanic. |
| `POST` | `/api/auth/login` | Public | Authenticate user & get signed JWT token. |
| `GET` | `/api/auth/me` | Protected | Fetch profile details of logged-in user. |
| `GET` | `/api/auth/mechanics` | Protected | Fetch list of users registered with Mechanic roles. |

### Customer Management
| Verb | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/customers` | Admin/Manager/Receptionist | Add a new customer profile. |
| `PUT` | `/api/customers/:id` | Admin/Manager/Receptionist | Edit customer parameters. |
| `DELETE` | `/api/customers/:id` | Admin/Manager | Delete customer profile. |
| `GET` | `/api/customers/:id` | Protected | View details of a customer. |
| `GET` | `/api/customers` | Protected | View list of customers (supports `?search=query`). |

### Vehicle Management
| Verb | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/vehicles` | Admin/Manager/Receptionist | Add new vehicle linked to a customer. |
| `PUT` | `/api/vehicles/:id` | Admin/Manager/Receptionist | Edit vehicle specifications. |
| `DELETE` | `/api/vehicles/:id` | Admin/Manager | Delete vehicle record. |
| `GET` | `/api/vehicles/:id` | Protected | View vehicle details populated with owner. |
| `GET` | `/api/vehicles/:id/history` | Protected | View historical service logs for vehicle. |
| `GET` | `/api/vehicles` | Protected | View all registered vehicles. |

### Service Request Management
| Verb | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/services` | Admin/Manager/Receptionist | Open a new repair/service job card request. |
| `PUT` | `/api/services/:id` | Admin/Manager/Receptionist | Edit job card labor rates and parts items list. |
| `PATCH` | `/api/services/:id/mechanic` | Admin/Manager | Allocate/assign a mechanic to a request. |
| `PATCH` | `/api/services/:id/status` | Admin/Manager/Mechanic/Receptionist | Transition status flow of the repair work. |
| `GET` | `/api/services/:id` | Protected | View complete billing & progress of a service. |
| `GET` | `/api/services` | Protected | View all active/historical service requests. |
| `GET` | `/api/services/vehicle/:vehicleId` | Protected | View all service history matching a vehicle ID. |

---

## 📸 Screenshots

*(Add screenshots here to display application interface dashboards)*

| Operating Dashboard | Customer Registry (Data Grid) |
|---|---|
| ![Dashboard Mockup](https://raw.githubusercontent.com/username/project/main/screenshots/dashboard.png) | ![Data Grid Mockup](https://raw.githubusercontent.com/username/project/main/screenshots/datagrid.png) |
