
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Login and Dashboards
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import StaffDashboard from "./components/StaffDashboard";

// Student
import StudentForm from "./components/StudentForm";
import ViewStudents from "./components/ViewStudents";
import StudentProfile from "./components/StudentProfile";

// ============================================
// PROTECT ROUTES USING LOCAL STORAGE
// ============================================

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  if (!isLoggedIn || !userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (userRole === "staff") {
      return <Navigate to="/staff/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

// ============================================
// APP
// ============================================

function App() {
  const protect = (element, roles = ["admin", "staff"]) => (
    <ProtectedRoute allowedRoles={roles}>
      {element}
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin/dashboard"
          element={protect(<AdminDashboard />, ["admin"])}
        />

        {/* ADMIN STUDENTS */}

        <Route
          path="/admin/students/manage"
          element={protect(<ViewStudents role="admin" />, ["admin"])}
        />

        <Route
          path="/students/profile/:id"
          element={protect(<StudentProfile />)}
        />

        {/* STAFF DASHBOARD */}

        <Route
          path="/staff/dashboard"
          element={protect(<StaffDashboard />, ["staff"])}
        />

        {/* STAFF STUDENTS */}

        <Route
          path="/staff/students/manage"
          element={protect(<ViewStudents role="staff" />, ["staff"])}
        />

        <Route
          path="/students/add"
          element={protect(<StudentForm />, ["staff"])}
        />

        <Route
          path="/students/edit/:id"
          element={protect(<StudentForm />, ["staff"])}
        />

        {/* PAGE NOT FOUND */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
