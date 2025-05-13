import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaCogs, FaExchangeAlt, FaClipboardList, FaBullseye, FaChartLine, FaProjectDiagram, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [goalsMenuOpen, setGoalsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", department: "" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setUserInfo({ name: user.name, department: user.department });
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید خارج شوید؟")) {
      localStorage.removeItem("loggedInUser");
      navigate("/");
    }
  };

  return (
    <aside style={{ width: "240px", backgroundColor: "#223F98", color: "white", padding: "20px", height: "100vh", position: "fixed", right: 0, top: 0 }}>
      
      {/* مشخصات کاربر */}
      <div style={{ marginBottom: "20px", borderBottom: "1px solid white", paddingBottom: "10px" }}>
        <h3 style={{ margin: "0 0 5px 0" }}>{userInfo.name || "کاربر مهمان"}</h3>
        <p style={{ margin: 0 }}>{userInfo.department || "بدون دپارتمان"}</p>
      </div>

      {/* منوها */}
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/dashboard" style={linkStyle}><FaHome /> داشبورد</Link></li>
          <li><Link to="/strategy" style={linkStyle}><FaBullseye /> طراحی استراتژی</Link></li>

          <li style={{ cursor: "pointer" }} onClick={() => setGoalsMenuOpen(!goalsMenuOpen)}>
            <div style={linkStyle}><FaClipboardList /> مدیریت اهداف <FaChevronDown style={{ fontSize: "10px", marginRight: "auto", transform: goalsMenuOpen ? "rotate(180deg)" : "none" }} /></div>
          </li>
          {goalsMenuOpen && (
            <ul style={{ listStyle: "none", paddingRight: "15px" }}>
              <li><Link to="/goals/organizational" style={linkStyle}>اهداف سازمان</Link></li>
              <li><Link to="/goals/departmental" style={linkStyle}>اهداف دپارتمان</Link></li>
            </ul>
          )}

          <li><Link to="/kpi" style={linkStyle}><FaChartLine /> مخزن KPI</Link></li>
          <li><Link to="/collaboration" style={linkStyle}><FaProjectDiagram /> همکاری</Link></li>
          <li><Link to="/users" style={linkStyle}><FaUsers /> مدیریت کاربران</Link></li>
          <li><Link to="/departments" style={linkStyle}><FaCogs /> مدیریت دپارتمان‌ها</Link></li>
          <li><Link to="/integrations" style={linkStyle}><FaExchangeAlt /> یکپارچه‌سازی</Link></li>
        </ul>
      </nav>

      {/* دکمه خروج */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#c0392b",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}
      >
        <FaSignOutAlt /> خروج
      </button>
    </aside>
  );
}

const linkStyle = { display: "flex", alignItems: "center", gap: "10px", color: "white", textDecoration: "none", padding: "8px 0" };
