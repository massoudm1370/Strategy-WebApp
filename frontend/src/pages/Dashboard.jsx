import styles from "./DashboardStyles";
import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
console.log("✅ Dashboard component loaded");
const API_URL = process.env.REACT_APP_API_URL;

// 📌 هشدار اهداف سازمانی
const OrgGoalsAlerts = () => {
  const [alerts, setAlerts] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/goals/alerts`)
      .then((res) => setAlerts(res.data.alerts))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAlerts, []);

  return (
    <AlertCard
      title="⚠️ هشدار عملکرد اهداف سازمانی"
      content={loading ? "در حال بارگذاری..." : alerts || "هیچ هشداری وجود ندارد."}
      onRefresh={fetchAlerts}
    />
  );
};

// 📌 هشدار اهداف دپارتمانی
const DeptGoalsAlerts = () => {
  const [alerts, setAlerts] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/department-goals/alerts`)
      .then((res) => setAlerts(res.data.alerts))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAlerts, []);

  return (
    <AlertCard
      title="⚠️ هشدار عملکرد اهداف دپارتمانی"
      content={loading ? "در حال بارگذاری..." : alerts || "هیچ هشداری وجود ندارد."}
      onRefresh={fetchAlerts}
    />
  );
};

// 📌 کامپوننت مشترک کارت هشدار با دکمه بروزرسانی
const AlertCard = ({ title, content, onRefresh }) => (
  <div
    style={{
      backgroundColor: "#FFF8E1",
      border: "1px solid #FFD54F",
      borderRadius: "8px",
      padding: "15px",
      marginTop: "20px",
      direction: "rtl",
      textAlign: "right",
    }}
  >
    <h3 style={{ color: "#F57C00", marginBottom: "10px" }}>{title}</h3>
    <p>{content}</p>
    <button
      onClick={onRefresh}
      style={{
        marginTop: "10px",
        backgroundColor: "#FFD54F",
        border: "none",
        padding: "5px 10px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      🔄 بروزرسانی
    </button>
  </div>
);

export { OrgGoalsAlerts, DeptGoalsAlerts };

// تابع محاسبه درصد موفقیت
const calculateSuccessPercentage = (ytdValue, currentStatus, target, failure) => {
  const valueToUse = ytdValue || currentStatus;
  if (!valueToUse || !target || !failure) return 0;
  const valueNum = parseFloat(valueToUse);
  const targetNum = parseFloat(target);
  const failureNum = parseFloat(failure);
  if (isNaN(valueNum) || isNaN(targetNum) || isNaN(failureNum)) return 0;
  if (targetNum <= failureNum) return 0;
  if (valueNum >= targetNum) return 100;
  if (valueNum <= failureNum) return 0;
  return ((valueNum - failureNum) / (targetNum - failureNum)) * 100;
};

export default function Dashboard() {
  const [strategyInfo, setStrategyInfo] = useState({ vision: "", mission: "", core_values: "" });
  const [organizationalGoals, setOrganizationalGoals] = useState([]);
  const [departmentGoals, setDepartmentGoals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [kpiRepository, setKpiRepository] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [showInbox, setShowInbox] = useState(false);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterHalf, setFilterHalf] = useState("همه");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedOrganizationalGoal, setSelectedOrganizationalGoal] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/strategy`).then(res => res.json()).then(setStrategyInfo);
    fetch(`${API_URL}/goals`).then(res => res.json()).then(setOrganizationalGoals);
    fetch(`${API_URL}/department-goals`).then(res => res.json()).then(setDepartmentGoals);
    fetch(`${API_URL}/departments`).then(res => res.json()).then(setDepartments);
    fetch(`${API_URL}/users`).then(res => res.json()).then(setUsers);
    fetch(`${API_URL}/kpis`).then(res => res.json()).then(setKpiRepository);
    fetch(`${API_URL}/messages`)
      .then(res => res.json())
      .then(data => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const userMessages = data.filter(msg => msg.recipient === loggedInUser?.name && !msg.read);
        setMessages(data || []);
        setUnreadMessages(userMessages || []);
      });
  }, []);

  const availableYears = [...new Set([...organizationalGoals.map(g => g.year), ...departmentGoals.map(kr => kr.year)])];

  const filteredOrganizationalGoals = organizationalGoals.filter(g =>
    (!filterYear || g.year === filterYear) &&
    (filterHalf === "همه" || g.halfYear === filterHalf) &&
    (filterDepartment === "همه" || g.department === filterDepartment)
  );

  const departmentSuccess = departments.reduce((acc, dept) => {
    const relatedGoals = departmentGoals.filter(kr => kr.department === dept.name);
    acc[dept.name] = { total: relatedGoals.length, low: 0, medium: 0, high: 0 };
    relatedGoals.forEach(kr => {
      const success = calculateSuccessPercentage(kr.ytd, kr.currentStatus, kr.target, kr.failure);
      if (success < 40) acc[dept.name].low += 1;
      else if (success >= 40 && success < 80) acc[dept.name].medium += 1;
      else if (success >= 80) acc[dept.name].high += 1;
    });
    return acc;
  }, {});

  const exportToExcel = () => {
    const summary = [
      { "چشم‌انداز": strategyInfo.vision },
      { "ماموریت": strategyInfo.mission },
      { "ارزش‌ها": strategyInfo.core_values },
      { "دپارتمان‌ها": departments.length },
      { "کاربران": users.length },
      { "اهداف سازمانی": filteredOrganizationalGoals.length }
    ];
    const worksheet = XLSX.utils.json_to_sheet([...summary, ...departmentGoals]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "داشبورد");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "داشبورد_استراتژیک.xlsx");
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    const input = document.getElementById("dashboard-content");
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("داشبورد_استراتژیک.pdf");
      setShowExportOptions(false);
    });
  };

  return (
    <div style={styles.container} id="dashboard-content">
      <header style={styles.header}>
        <div style={{ ...styles.actions, position: "relative" }}>
          <button onClick={() => setShowExportOptions(!showExportOptions)} style={styles.exportButton}>
            دریافت گزارش
          </button>
          {showExportOptions && (
            <div style={styles.exportModal}>
              <button onClick={exportToPDF} style={styles.modalButton}>خروجی PDF</button>
              <button onClick={exportToExcel} style={styles.modalButton}>خروجی Excel</button>
            </div>
          )}
          <input type="search" placeholder="جستجو..." style={styles.searchInput} />
          <div style={{ position: "relative", marginLeft: "20px", cursor: "pointer" }} title="صندوق پیام‌ها">
            <span onClick={() => setShowInbox(!showInbox)}>📨</span>
            {unreadMessages.length > 0 && (
              <span style={{
                position: "absolute",
                top: "-5px",
                right: "-10px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px"
              }}>
                {unreadMessages.length}
              </span>
            )}
            {showInbox && (
              <div style={{
                position: "absolute",
                top: "30px",
                right: "0",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "5px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                zIndex: 1000,
                width: "300px",
                maxHeight: "200px",
                overflowY: "auto",
                textAlign: "right",
                padding: "10px"
              }}>
                {unreadMessages.length === 0 && <p>هیچ پیام جدیدی ندارید.</p>}
                {unreadMessages.map((msg, idx) => (
                  <div key={msg.id || idx} style={{ borderBottom: "1px solid #eee", padding: "5px 0" }}>
                    <strong>از: {msg.sender}</strong><br />
                    {msg.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* بخش چشم‌انداز، ماموریت و ارزش‌ها */}
      <div style={styles.strategySection}>
        <div style={styles.strategyCard}><h3>چشم‌انداز</h3><p>{strategyInfo.vision || "اطلاعاتی ثبت نشده است"}</p></div>
        <div style={styles.strategyCard}><h3>ماموریت</h3><p>{strategyInfo.mission || "اطلاعاتی ثبت نشده است"}</p></div>
        <div style={styles.strategyCard}><h3>ارزش‌ها</h3><p>{strategyInfo.core_values || "اطلاعاتی ثبت نشده است"}</p></div>
      </div>

      {/* فیلترها */}
      <div style={styles.filterBar}>
        <Filter label="دپارتمان" value={filterDepartment} onChange={setFilterDepartment} options={["همه", ...departments.map(d => d.name)]} />
        <Filter label="سال" value={filterYear} onChange={setFilterYear} options={availableYears} />
        <Filter label="نیمسال" value={filterHalf} onChange={setFilterHalf} options={["همه", "H1", "H2"]} />
      </div>

      <section style={styles.kpiSection}>
        <KPICard title="تعداد کاربران" value={`${users.length}`} icon="👥"/>
        <KPICard title="تعداد Key Result های ثبت‌شده" value={`${departmentGoals.length}`} icon="✅"/>
        <KPICard title="تعداد اهداف سازمانی ثبت‌شده" value={`${organizationalGoals.length}`} icon="🎯"/>
        <KPICard title="تعداد KPIهای ثبت‌شده در مخزن" value={`${kpiRepository.length}`} icon="📊" />
      </section>

      <table style={styles.departmentTable}>
        <thead>
          <tr style={{ backgroundColor: "#223F98", color: "white" }}>
            <th>دپارتمان</th>
            <th>کمتر از 40% (ریسک)</th>
            <th>40-80% (در حال انجام)</th>
            <th>بیش از 80% (تکمیل شده)</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => {
            const stats = departmentSuccess[dept.name] || { total: 0, low: 0, medium: 0, high: 0 };
            return (
              <tr key={dept.name}>
                <td>{dept.name}</td>
                <td style={{ color: "#f44336", textAlign: "center" }}>{stats.low}</td>
                <td style={{ color: "#ff9800", textAlign: "center" }}>{stats.medium}</td>
                <td style={{ color: "#4caf50", textAlign: "center" }}>{stats.high}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ flex: 1 }}>
{/* بخش پیشرفت استراتژیک */}
<div className="strategic-progress-section">
  <h2>پیشرفت وضعیت راهبردی اهداف سازمانی 🎯</h2>

  {/* هشدار اهداف سازمانی */}
  <OrgGoalsAlerts />

  {/* هشدار اهداف دپارتمانی */}
  <DeptGoalsAlerts />

  {/* ادامه محتوای قبلی این بخش */}
</div>


        </div>
        <div style={{ flex: 1 }}>
          <h2>پیام‌های ارسالی</h2>
          {messages.slice(-4).reverse().map((msg, idx) => (
            <ActivityItem
              key={msg.id || idx}
              user={`ارسال‌کننده: ${msg.sender || "نامشخص"}`}
              time={`زمان ارسال: ${msg.createdAt || "نامشخص"}`}
              message={`گیرنده: ${msg.recipient || "نامشخص"} - ${msg.text || ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, progress }) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiIcon}>{icon}</div>
      <div style={styles.kpiContent}>
        <h3>{title}</h3>
        <p>{value}</p>
        <progress max="100" value={progress} style={styles.progressBar}></progress>
      </div>
    </div>
  );
}

function GoalProgress({ goal, progress, date }) {
  return (
    <div style={styles.goalItem}>
      <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
      <div style={styles.goalDetails}>
        <p>{goal}</p>
        <small>تاریخ هدف: {date}</small>
      </div>
    </div>
  );
}

function ActivityItem({ user, time, message }) {
  return (
    <div style={styles.activityItem}>
      <div style={styles.userAvatar}></div>
      <div style={styles.activityContent}>
        <p><strong>{user}</strong> {time}</p>
        <p>{message}</p>
      </div>
    </div>
  );
}

function Filter({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      >
        {options.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}