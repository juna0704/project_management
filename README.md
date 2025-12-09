
# Full-Stack Application Architecture  
### Next.js (Frontend) + Express.js (Backend) + Prisma ORM

A scalable, type-safe full-stack application built using **Next.js** for the UI and **Express.js + TypeScript + Prisma** for backend services.  
Designed with clean architecture principles to support production-ready deployment.

---

## 1. Tech Stack Overview

### **Frontend**
- Next.js 14 (App Router)
- React 18
- Material UI (MUI)
- Redux Toolkit + Redux Persist
- Axios
- Recharts (Data visualization)
- Gantt Task React (Task visualization)
- Tailwind CSS (Utility-first styling)
- Prettier Plugin (Formatting)

### **Backend**
- Express.js (REST API)
- TypeScript
- Prisma ORM
- PostgreSQL (Recommended)
- Helmet, CORS, Morgan (Security + Logging)
- dotenv (Environment variables)

---

## 2. Folder Structure

```

root/
│
├── client/               # Frontend (Next.js)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/               # Backend (Express + Prisma)
│   ├── src/
│   ├── prisma/
│   ├── dist/
│   ├── package.json
│   └── ...
│
└── README.md

````

---

## 3. Prerequisites

Ensure the following are installed:

- Node.js 18+
- npm or yarn
- PostgreSQL (or any SQL DB supported by Prisma)
- Prisma CLI

---

## 4. Backend Setup

### **Install dependencies**
```bash
cd server
npm install
````

### **Create `.env` file**

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=5000
```

### **Initialize Prisma**

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed   # optional
```

### **Run backend**

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm run build
npm start
```

Backend runs at:
**[http://localhost:5000](http://localhost:5000)**

---

## 5. Frontend Setup

### **Install dependencies**

```bash
cd ../client
npm install
```

### **Create `.env.local`**

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### **Run frontend**

```bash
npm run dev
```

Frontend runs at:
**[http://localhost:3000](http://localhost:3000)**

---

## 6. Run Client & Server Together (Optional)

From project root:

```bash
npx concurrently "cd server && npm run dev" "cd client && npm run dev"
```

---

## 7. Build for Production

### **Backend**

```bash
cd server
npm run build
```

### **Frontend**

```bash
cd client
npm run build
npm start
```

---

## 8. Scripts Reference

### **Server Scripts**

| Script          | Description                         |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start Express server in development |
| `npm run build` | Compile TypeScript into `dist/`     |
| `npm start`     | Run compiled server                 |
| `npm run seed`  | Seed database via Prisma            |

### **Client Scripts**

| Script          | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start Next.js in development mode |
| `npm run build` | Build production bundle           |
| `npm start`     | Run production build              |
| `npm run lint`  | Run ESLint                        |

---

## 9. Environment Variables Overview

| Variable              | Location            | Description          |
| --------------------- | ------------------- | -------------------- |
| `DATABASE_URL`        | `server/.env`       | DB connection string |
| `PORT`                | `server/.env`       | Backend port         |
| `NEXT_PUBLIC_API_URL` | `client/.env.local` | URL for backend API  |



## 13. Author

**Junaid Ali Khan**
Email: **[junaidalikhan0704@gmail.com](mailto:junaidalikhan0704@gmail.com)**
