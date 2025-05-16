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

function ProtectedLayout({ children }) {
  return (
    <div style={{ display: "flex", direction: "rtl" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "20px", marginRight: "240px" }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedRoute>
          <ProtectedLayout>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="strategy" element={<StrategyDesign />} />
              <Route path="kpi" element={<KPIManagement />} />
              <Route path="collaboration" element={<Collaboration />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="departments" element={<DepartmentManagement />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="goals/organizational" element={<OrganizationalGoalsManagement />} />
              <Route path="goals/departmental" element={<DepartmentGoalsManagement />} />
            </Routes>
          </ProtectedLayout>
        </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
