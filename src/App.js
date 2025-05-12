import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import StrategyDesign from "./pages/StrategyDesign";
import KPIManagement from "./pages/KPIManagement";
import Collaboration from "./pages/Collaboration";
import UserManagement from "./pages/UserManagement";
import DepartmentManagement from "./pages/DepartmentManagement";
import Integrations from "./pages/Integrations";
import OrganizationalGoalsManagement from "./pages/OrganizationalGoalsManagement";
import DepartmentGoalsManagement from "./pages/DepartmentGoalsManagement";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/*" element={
          <div style={{ display: "flex", direction: "rtl" }}>
            <Sidebar />
            <main style={{ flex: 1, padding: "20px", marginRight: "240px" }}>
              <Routes>
                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="strategy" element={<ProtectedRoute><StrategyDesign /></ProtectedRoute>} />
                <Route path="kpi" element={<ProtectedRoute><KPIManagement /></ProtectedRoute>} />
                <Route path="collaboration" element={<ProtectedRoute><Collaboration /></ProtectedRoute>} />
                <Route path="users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="departments" element={<ProtectedRoute><DepartmentManagement /></ProtectedRoute>} />
                <Route path="integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
                <Route path="goals/organizational" element={<ProtectedRoute><OrganizationalGoalsManagement /></ProtectedRoute>} />
                <Route path="goals/departmental" element={<ProtectedRoute><DepartmentGoalsManagement /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}
