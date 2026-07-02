# 🧭 Career Compass AI

**Career Compass AI** is a comprehensive, full-stack MERN application designed to help college students streamline their placement preparation, organize job applications, identify skill gaps, and track their readiness for technical and HR interviews.

🚀 **Live Site:** [Career Compass AI](https://career-compass-ai-beta-bice.vercel.app/)

---

## 🌟 Key Features

- 📊 **Placement Readiness Score:** A dynamic scoring system calculated based on profile completion, projects, DSA practice, application volume, and target role skill alignment.
- 💼 **Job Application Tracker:**
  - Multiple Views: **Table View**, **Kanban Board** (with drag-and-drop support), and a **Smart Timeline**.
  - Track stages: *Interested, Applied, Online Assessment, Technical Interview, HR Interview, Offer Received, Rejected*.
  - Export application data to PDF.
- 🎯 **Skill Gap Analyzer:**
  - Compares your current skills against pre-configured recruiter benchmarks for target roles (e.g., Software Engineer, Data Scientist, Frontend Developer).
  - Offers a **Personalized Roadmap** with direct links to official documentation and learning resources.
- 📝 **Notes Vault & Interview Prep:** Organize interview prep materials, bookmarks, and placement strategies in one central dashboard.
- 🏆 **Achievement Badges:** Gamify your preparation by unlocking milestones like *First Application*, *10 Applications Tracked*, *Profile Champion*, and *Skill Mastery*.
- 🌓 **Dynamic Theme:** Responsive glassmorphism interface supporting both Dark and Light modes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Routing:** React Router DOM (v7)
- **HTTP Client:** Axios
- **Styling:** Custom Glassmorphic CSS (Vanilla)
- **Icons:** Lucide React
- **Charts:** Chart.js & React-Chartjs-2

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) with BcryptJS hashing
- **File Uploads:** Multer (for resume upload)

---

## 📁 Folder Structure

```
career-compass-ai/
├── backend/                  # Express.js Server
│   ├── config/               # Database Connection configuration
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Authentication & Upload middleware
│   ├── models/               # MongoDB Mongoose schemas
│   ├── routes/               # Express endpoints
│   ├── seed.js               # Database seeder script
│   └── server.js             # Server entry point
└── frontend/                 # React client
    ├── public/               # Static assets
    └── src/                  # Source files
        ├── components/       # Reusable UI components
        ├── context/          # Auth Context provider
        ├── pages/            # View pages (Dashboard, Tracker, Skill Gap, etc.)
        └── utils/            # Helper utilities (axios configuration, PDF exports)
```

---

## ⚙️ Local Installation & Setup

### Prerequisites
- Node.js installed locally.
- A free MongoDB Atlas Cluster. (Follow [MongoDB Atlas Setup Guide](./MONGODB_ATLAS_SETUP.md) if needed).

### 1. Clone the repository and navigate to the project
```bash
cd career-compass-ai
```

### 2. Configure the Backend
1. Go to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_jwt_key
   ```
4. Seed the database with target placement roles:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   *The backend will run on `http://localhost:5000`.*

### 3. Configure the Frontend
1. Open a new terminal and go to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 🌐 Deployment Configuration

### Backend (Render)
- Deploy your backend code to Render.
- Add the environment variables:
  - `MONGO_URI`: Your MongoDB Atlas connection string.
  - `JWT_SECRET`: A secure key for JWT.

### Frontend (Vercel)
- Deploy your frontend repository to Vercel.
- Configure the environment variable:
  - `VITE_API_URL`: Your deployed Render backend URL (e.g., `https://your-backend.onrender.com`).
