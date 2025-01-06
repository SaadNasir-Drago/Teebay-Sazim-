# Teebay Application

Teebay is a platform for renting, buying, and selling products, built using **Next.js**, **Node.js**, **GraphQL**, and **PostgreSQL**.

---

## Prerequisites

Ensure the following tools are installed on your system:

- **Node.js** (v14 or later)
- **npm** (v6 or later)
- **PostgreSQL**

---

## Getting Started

Follow the steps below to set up and run the Teebay application locally.

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/teebay.git
cd teebay
```

---

### 2. Backend Setup

#### a. Navigate to the `backend` folder:
```bash
cd backend
```

#### b. Install dependencies:
```bash
npm install
```

#### c. Create a `.env` file:
Create a `.env` file in the `backend` folder with the following content:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/teebay_db"
```
Replace `username`, `password`, and `teebay_db` with your PostgreSQL credentials and database name.

#### d. Start the backend server:
```bash
npm run dev
```

The backend server will run on and expose the GraphQL API at **`http://localhost:4000/graphql`**.

---

### 3. Frontend Setup

#### a. Open a new terminal.

#### b. Navigate to the `frontend` folder:
```bash
cd frontend
```

#### c. Install dependencies:
```bash
npm install
```

#### d. Start the frontend development server:
```bash
npm run dev
```

The frontend application will run on **`http://localhost:3000`**.

---

### 4. Access the Application

1. Open your web browser and navigate to: **`http://localhost:3000`**
2. Ensure both the **frontend** and **backend** servers are running simultaneously.

---

## Additional Information

- **GraphQL API**: Accessible at **`http://localhost:4000/graphql`**.
- **Database Configuration**: Managed via **Prisma** in the `backend` folder.
- **Default Ports**:
  - Frontend: `3000`
  - Backend: `4000`

---

## Troubleshooting

- **Backend Errors**: Check the terminal where the backend server is running for detailed error messages.
- **Frontend Errors**: Check the browser console or the terminal running the frontend server.
- **Database Connection Issues**:
  - Verify the `DATABASE_URL` in the `.env` file.
  - Ensure PostgreSQL is running and accessible.

---

### You're ready to start using **Teebay**! 🎉

---
