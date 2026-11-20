# Hostel Management Portal

A full-stack hostel management application with a **Node.js/Express and MySQL backend** and a **React/TypeScript frontend**. The application includes student and staff workflows for rooms, allocations, applications, complaints, attendance, feedback, and administration.

## Repository layout

\`\`\`text
Hostal_Management_Portal/
├── backend/
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── models/            # Sequelize models
│   │   ├── routes/            # Express API routes
│   │   ├── middleware/        # Request/auth middleware
│   │   ├── migrations/        # Database migration scripts
│   │   └── index.js           # API server entry point
│   ├── .env.example           # Backend environment template
│   └── package.json
├── frontend/
│   ├── src/                   # React app, pages, components, API client
│   ├── vite.config.ts
│   └── package.json
├── DEPLOY_RENDER.md
└── render.yaml
\`\`\`

## Requirements

- A compatible Node.js version for the project's Vite 7 frontend (and npm).
- A MySQL database you can access locally or remotely.
- Two terminals to run the API and frontend separately.

## Local development

### 1. Configure and start the backend

\`\`\`bash
cd backend
npm install
\`\`\`

Copy \`backend/.env.example\` to \`backend/.env\` (from inside \`backend/\`, run \`cp .env.example .env\` on macOS/Linux, or copy the file manually on Windows). Update the values for your own database and local environment. At minimum, review:

\`\`\`dotenv
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hostel_management_db
DB_USER=root
DB_PASSWORD=your-local-database-password
DB_SSL=false
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
DB_SYNC_ON_STARTUP=true
\`\`\`

\`DB_PORT\` is your **actual** MySQL port (for example, some XAMPP installations use \`3307\`). Create the MySQL database if needed and check its schema/data requirements before starting. Never commit a real \`.env\` file or credentials. Review the migration and seed scripts before running them on existing data.

Start the API:

\`\`\`bash
npm run dev
\`\`\`

By default, the API listens at \`http://localhost:5000\`. Its \`GET /health\` endpoint returns HTTP 200 once the database is connected, or HTTP 503 while it is unavailable.

### 2. Start the frontend

Open a second terminal:

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

The Vite development server is configured for **http://localhost:5173**. The frontend API client defaults to \`http://localhost:5000/api\` during local development. To use a different backend, set \`VITE_API_BASE_URL\` in a local \`frontend/.env\` file (for example, \`VITE_API_BASE_URL=http://localhost:5000/api\`) and restart Vite.

### 3. Verify

- Visit \`http://localhost:5000/health\` and confirm the database is connected.
- Open \`http://localhost:5173\` and test the relevant workflows.
- If API requests fail, confirm the backend port, frontend API base URL, MySQL settings, and allowed CORS origin (\`FRONTEND_URL\`).

## API route groups

The Express server mounts these route prefixes (individual operations and access requirements are defined in \`backend/src/routes/\`):

\`\`\`text
/api/auth        /api/students     /api/rooms       /api/allocations
/api/student     /api/admin        /api/complaints  /api/requests
/api/attendance  /api/payments     /api/staff       /api/applications
/api/hostels     /api/dashboard    /api/messages   /api/feedback
\`\`\`

Most application endpoints depend on a working database. Authentication and authorization requirements vary by route.

## Useful commands

| Folder | Command | Purpose |
| --- | --- | --- |
| \`backend/\` | \`npm run dev\` | Start API with nodemon |
| \`backend/\` | \`npm start\` | Start API with Node.js |
| \`frontend/\` | \`npm run dev\` | Start Vite development server |
| \`frontend/\` | \`npm run build\` | Run TypeScript checks and build |
| \`frontend/\` | \`npm run preview\` | Preview a production build |

**Testing status:** \`backend/package.json\` currently has a placeholder \`npm test\` script; the frontend has no \`npm run lint\` script. Avoid treating those as passing test suites.

## Deployment

See [DEPLOY_RENDER.md](DEPLOY_RENDER.md) for the Render Blueprint setup and required production environment variables. Do not use development secrets or automatic database schema synchronization in production without reviewing the risks.

## Project status

Educational/portfolio project. If setup or documented behavior differs from the current implementation, please open an issue with reproduction steps.
