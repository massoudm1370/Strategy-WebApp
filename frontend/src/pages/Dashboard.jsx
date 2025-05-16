import styles from "./DashboardStyles";
import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = process.env.REACT_APP_API_URL;

// ✅ تابع محاسبه درصد موفقیت
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
  // ✅ تعریف حالت‌ها
  const [strategyInfo, setStrategyInfo] = useState({ vision: "", mission: "", core_values: "" });
  const [organizationalGoals, setOrganizationalGoals] = useState([]);
  const [departmentGoals, setDepartmentGoals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [kpiRepository, setKpiRepository] = useState([]);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterHalf, setFilterHalf] = useState("همه");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedOrganizationalGoal, setSelectedOrganizationalGoal] = useState("");

  // ✅ دریافت داده‌ها از API
  useEffect(() => {
  fetch(`${API_URL}/strategy`).then(res => res.json()).then(data => setStrategyInfo(data || {}));
  fetch(`${API_URL}/goals`).then(res => res.json()).then(data => setOrganizationalGoals(data || []));
  fetch(`${API_URL}/department-goals`).then(res => res.json()).then(data => setDepartmentGoals(data || []));

    fetch(`${API_URL}/departments`).then(res => res.json()).then(data => setDepartments(data || []));
    fetch(`${API_URL}/users`).then(res => res.json()).then(data => setUsers(data || []));
    fetch(`${API_URL}/kpis`).then(res => res.json()).then(data => setKpiRepository(data || []));
  }, []);
  // ✅ فیلتر اهداف سازمانی
  const availableYears = [...new Set([...organizationalGoals.map(g => g.year), ...departmentGoals.map(kr => kr.year)])];
  const filteredOrganizationalGoals = organizationalGoals.filter(g =>
    (!filterYear || g.year === filterYear) &&
    (filterHalf === "همه" || g.halfYear === filterHalf) &&
    (filterDepartment === "همه" || g.department === filterDepartment)
  );

  // ✅ وضعیت موفقیت دپارتمان‌ها
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



  // ✅ تابع خروجی اکسل
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

  // ✅ تابع خروجی PDF
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

      {/* نوار بالا */}
      <header style={styles.header}>
        <div style={styles.actions}>
          <button onClick={() => setShowExportOptions(!showExportOptions)} style={styles.exportButton}>دریافت گزارش</button>
          <input type="search" placeholder="جستجو..." style={styles.searchInput} />
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

      {/* راهنمای KPI ها */}
      <p style={{ marginTop: "20px", marginBottom: "10px", color: "#555", textAlign: "right" }}>
        آمار زیر بر اساس آخرین اطلاعات کاربران، اهداف، Key Result ها و KPIهای ثبت‌شده در سیستم نمایش داده می‌شود.
      </p>

      {/* کارت‌های KPI */}
      <section style={styles.kpiSection}>
        <KPICard title="تعداد کاربران" value={`${users.length}`} icon="👥" />
        <KPICard title="تعداد Key Result های ثبت‌شده" value={`${departmentGoals.length}`} icon="✅"/>
        <KPICard title="تعداد اهداف سازمانی ثبت‌شده" value={`${organizationalGoals.length}`} icon="🎯" />
        <KPICard title="تعداد KPIهای ثبت‌شده در مخزن" value={`${kpiRepository.length}`} icon="📊" />
      </section>
      {/* راهنمای وضعیت دپارتمان‌ها */}
      <p style={{ marginTop: "20px", marginBottom: "10px", color: "#555", textAlign: "right" }}>
        وضعیت زیر براساس تعداد اهداف ثبت‌شده برای هر دپارتمان و درصد موفقیت آن‌ها محاسبه شده است.
      </p>

      {/* جدول وضعیت دپارتمان‌ها */}
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

      {/* بخش پیشرفت اهداف و کامنت‌ها */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* پیشرفت اهداف */}
        <div style={{ flex: 1 }}>
          <h2>پیشرفت اهداف استراتژیک</h2>
          {filteredOrganizationalGoals.map(goal => {
          const progressPercent = Math.round(calculateSuccessPercentage(goal.ytd, goal.currentStatus, goal.target, goal.failure));
           return (
           <div key={goal.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}>
            <strong>🎯 {goal.title}</strong>
          <p>درصد موفقیت: {progressPercent}%</p>
          </div>
           );
          })}
        </div>

        {/* کامنت‌ها */}
        <div style={{ flex: 1 }}>
          <h2>کامنت‌ها</h2>
          {users.slice(0, 4).map((user, idx) => (
            <ActivityItem
              key={idx}
              user={user.name}
              time="1 ساعت پیش"
              message={`کامنت جدیدی در مورد ${filteredOrganizationalGoals[idx]?.title || "هدف سازمانی"} اضافه کرد.`}
            />
          ))}
        </div>
      </div>
      {/* پنجره گزارش‌گیری */}
      {showExportOptions && (
<div style={styles.actions}>
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
</div>
  );
}

// ✅ مولفه کارت KPI
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

// ✅ مولفه نمایش پیشرفت اهداف
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

// ✅ مولفه نمایش آیتم‌های فعالیت
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

// ✅ مولفه فیلترها
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
