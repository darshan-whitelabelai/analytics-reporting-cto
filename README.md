# SaaS Analytics Platform

A modern, full-stack SaaS analytics platform built with Nest.js (backend) and React with TypeScript (frontend) in a monorepo structure.

## 🏗️ Project Structure

```
.
├── backend/              # Nest.js Backend API
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # API Controllers
│   │   ├── entities/    # TypeORM Entities
│   │   ├── modules/     # Feature Modules
│   │   ├── services/    # Business Logic Services
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable Components
│   │   ├── pages/       # Page Components
│   │   ├── services/    # API Services
│   │   ├── hooks/       # Custom React Hooks
│   │   ├── types/       # TypeScript Types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml   # Local development services
├── package.json         # Root workspace configuration
└── README.md
```

## 🚀 Tech Stack

### Backend
- **Framework:** Nest.js 10.x
- **Language:** TypeScript
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT with Passport
- **API Documentation:** Swagger/OpenAPI
- **Validation:** Joi, class-validator

### Frontend
- **Framework:** React 18.x
- **Language:** TypeScript (strict mode)
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** TanStack Query (React Query)
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Utilities:** date-fns

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (for local database)
- PostgreSQL 15 (if not using Docker)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd saas-analytics-platform
```

### 2. Install dependencies

```bash
npm install
```

This will install dependencies for both backend and frontend workspaces.

### 3. Setup environment variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start PostgreSQL (using Docker)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- pgAdmin on port 5050 (http://localhost:5050)

**pgAdmin credentials:**
- Email: admin@admin.com
- Password: admin

## 🏃 Running the Application

### Development Mode

**Start both frontend and backend concurrently:**
```bash
npm run dev
```

**Or start them separately:**

Backend (runs on http://localhost:3001):
```bash
npm run backend:dev
```

Frontend (runs on http://localhost:3000):
```bash
npm run frontend:dev
```

### Production Mode

**Build both applications:**
```bash
npm run build
```

**Start backend in production mode:**
```bash
npm run backend:start:prod
```

**Serve frontend build:**
```bash
cd frontend && npm run preview
```

## 📚 API Documentation

Once the backend is running, you can access the Swagger API documentation at:
- http://localhost:3001/api/docs

## 🧪 Testing

**Backend tests:**
```bash
npm run backend:test
```

**Frontend tests:**
```bash
npm run frontend:test
```

## 📖 Available Scripts

### Root Level
- `npm run dev` - Start both backend and frontend in development mode
- `npm run backend:dev` - Start backend in development mode
- `npm run frontend:dev` - Start frontend in development mode
- `npm run build` - Build both applications
- `npm run backend:build` - Build backend
- `npm run frontend:build` - Build frontend
- `npm run backend:test` - Run backend tests
- `npm run frontend:test` - Run frontend tests

### Backend Specific
- `npm run start` - Start in production mode
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run test:cov` - Run tests with coverage

### Frontend Specific
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 🗄️ Database

### Connection Details (Development)
- Host: localhost
- Port: 5432
- Database: saas_analytics
- Username: postgres
- Password: postgres

### Migrations

The backend is configured with `synchronize: true` for development, which automatically syncs your entities with the database. 

**⚠️ Important:** Disable `synchronize` in production and use proper migrations.

## 🔐 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3001
API_PREFIX=api

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=saas_analytics

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=7d

CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=SaaS Analytics Platform
VITE_APP_VERSION=1.0.0
```

## 🏗️ Project Architecture

### Backend Architecture
- **Controllers:** Handle HTTP requests and responses
- **Services:** Contain business logic
- **Entities:** Define database models using TypeORM
- **Modules:** Organize features into cohesive units
- **Config:** Centralized configuration management

### Frontend Architecture
- **Pages:** Top-level route components
- **Components:** Reusable UI components
- **Services:** API integration and external services
- **Hooks:** Custom React hooks for shared logic
- **Types:** TypeScript type definitions

## 🔒 Security Features

- JWT-based authentication
- Environment variable management
- CORS configuration
- Input validation with class-validator
- SQL injection protection via TypeORM
- XSS protection

## 🚧 Development Guidelines

1. **Code Style:** Follow the ESLint and Prettier configurations
2. **Commits:** Write clear, descriptive commit messages
3. **Types:** Use TypeScript strictly, avoid `any` types
4. **Testing:** Write tests for critical business logic
5. **Documentation:** Document complex logic and APIs

## 📝 License

This project is licensed under the UNLICENSED license.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using Nest.js and React
