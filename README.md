# EduPulse — Student Feedback System Frontend

A modern React + Vite frontend for the Student Feedback System, featuring role-based dashboards for Students, Teachers, and Admins.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework + build tool |
| Tailwind CSS | Utility-first styling |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| Context API | Auth state management |
| lucide-react | Icon library |

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- Spring Boot backend running on `http://localhost:8080`

### 2. Install Dependencies
```bash
cd feedback-frontend
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

App runs at **http://localhost:5173**

### 4. Build for Production
```bash
npm run build
```

---

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Student | alice@feedback.com | admin123 |
| Teacher | john.smith@feedback.com | admin123 |
| Admin | admin@feedback.com | admin123 |

---

## Folder Structure

```
src/
├── api/                  # Axios API calls per domain
│   ├── axiosInstance.js  # Base axios config + JWT interceptor
│   ├── authApi.js
│   ├── feedbackApi.js
│   ├── courseApi.js
│   └── userApi.js
│
├── components/
│   └── common/           # Shared reusable components
│       ├── ConfirmDialog.jsx
│       ├── EmptyState.jsx
│       ├── PageHeader.jsx
│       ├── Spinner.jsx
│       ├── StarRating.jsx
│       ├── StatCard.jsx
│       └── Toast.jsx
│
├── context/
│   └── AuthContext.jsx   # Auth state + login/logout/register
│
├── layouts/
│   ├── DashboardLayout.jsx  # Main shell with sidebar + navbar
│   ├── Sidebar.jsx          # Role-based navigation sidebar
│   └── Navbar.jsx           # Top bar with breadcrumb + avatar
│
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── student/
│   │   ├── StudentDashboard.jsx
│   │   ├── SubmitFeedback.jsx
│   │   └── MyFeedback.jsx
│   ├── teacher/
│   │   ├── TeacherDashboard.jsx
│   │   ├── CourseFeedback.jsx
│   │   └── TeacherReport.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageFeedback.jsx
│   │   ├── ManageUsers.jsx
│   │   └── ManageCourses.jsx
│   └── Unauthorized.jsx
│
├── routes/
│   └── ProtectedRoute.jsx  # Role-gated route wrapper
│
├── App.jsx                 # Route definitions
├── main.jsx                # App entry point
└── index.css               # Tailwind + global design tokens
```

---

## Features by Role

### 🎓 Student
- Dashboard with stats and available courses
- Submit feedback with star ratings and comments
- View all previously submitted feedback

### 📚 Teacher
- Dashboard with course performance overview
- Browse feedback per course with rating filters
- Detailed performance report with visual bars

### 🛡️ Admin
- System summary with all metrics
- Full feedback table with search + delete
- User management with role filters
- Course creation and deletion

---

## Design System

- **Theme**: Dark ink (near-black) with violet accent
- **Font**: Sora (body + UI) + JetBrains Mono (code/IDs)
- **Colors**: Violet for primary, Teal for success, Amber for ratings, Rose for errors
- **Animations**: CSS `animate-slide-up` and `animate-fade-in` on page load
