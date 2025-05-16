import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import styles from "./DashboardStyles";

const API_URL = process.env.REACT_APP_API_URL;

// محاسبه درصد موفقیت
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
  // ... (حالت‌ها و useEffect‌های قبلی بدون تغییر)
  const [strategyInfo, setStrategyInfo] = useState({ vision: "", mission: "", core_values: "" });
  const [organizationalGoals, setOrganizationalGoals] = useState([]);
  const [departmentGoals, setDepartmentGoals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterHalf, setFilterHalf] = useState("همه");
  const [filterOrganizationalGoal, setFilterOrganizationalGoal] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedOrganizationalGoal, setSelectedOrganizationalGoal] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/strategy`)
      .then(res => res.json())
      .then(data => setStrategyInfo(data || { vision: "", mission: "", core_values: "" }));
    fetch(`${API_URL}/goals`)
      .then(res => res.json())
      .then(data => {
        setOrganizationalGoals(data || []);
        setDepartmentGoals(data || []);
      });
    fetch(`${API_URL}/departments`)
      .then(res => res.json())
      .then(data => setDepartments(data || []));
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data || []));
  }, []);

  const availableYears = [...new Set([...organizationalGoals.map(g => g.year), ...departmentGoals.map(kr => kr.year)])];
  const filteredOrganizationalGoals = organizationalGoals.filter(g => 
    (!filterYear || g.year === filterYear) && 
    (filterHalf === "همه" || g.halfYear === filterHalf) &&
    (filterDepartment === "همه" || g.department === filterDepartment)
  );
  const relatedDepartments = [...new Set(departmentGoals.filter(kr => kr.title === selectedOrganizationalGoal).map(kr => kr.department))];
  const relatedKeyResults = departmentGoals.filter(kr => kr.title === selectedOrganizationalGoal);
  const groupedKR = relatedKeyResults.reduce((acc, kr) => {
    if (!acc[kr.department]) acc[kr.department] = [];
    acc[kr.department].push(kr);
    return acc;
  }, {});
  
  // محاسبه وضعیت دپارتمان‌ها براساس درصد موفقیت
  const departmentSuccess = departmentGoals.reduce((acc, kr) => {
    if (!acc[kr.department]) acc[kr.department] = { total: 0, low: 0, medium: 0, high: 0 };
    const success = calculateSuccessPercentage(kr.ytd, kr.currentStatus, kr.target, kr.failure);
    acc[kr.department].total += 1;
    if (success < 40) acc[kr.department].low += 1;
    else if (success >= 40 && success < 80) acc[kr.department].medium += 1;
    else if (success >= 80) acc[kr.department].high += 1;
    return acc;
  }, {});

  // توابع گزارش‌گیری
  const exportToExcel = () => {
    const summary = [
      { "چشم‌انداز": strategyInfo.vision },
      { "ماموریت": strategyInfo.mission },
      { "ارزش‌ها": strategyInfo.core_values },
      { "دپارتمان‌ها": departments.length },
      { "کاربران": users.length },
      { "اهداف سازمانی": filteredOrganizationalGoals.length }
    ];
    const worksheet = XLSX.utils.json_to_sheet([...summary, ...relatedKeyResults]);
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
    <div style={styles.container}>
      {/* هدر با اطلاعات کاربری */}
      <header style={styles.header}>
        <div style={styles.userInfo}>
          <span>مدیر راهبردی</span>
          <img src="/avatar.png" alt="پروفایل" style={styles.avatar} />
        </div>
        <div style={styles.actions}>
          <button onClick={() => setShowExportOptions(!showExportOptions)} style={styles.exportButton}>
            دریافت گزارش
          </button>
          <input type="search" placeholder="جستجو..." style={styles.searchInput} />
        </div>
      </header>

      {/* بخش فیلترها */}
      <div style={styles.filterBar}>
        <Filter label="دپارتمان" value={filterDepartment} onChange={setFilterDepartment} options={["همه", ...departments.map(d => d.name)]} />
        <Filter label="سال" value={filterYear} onChange={setFilterYear} options={availableYears} />
        <Filter label="نیمسال" value={filterHalf} onChange={setFilterHalf} options={["همه", "H1", "H2"]} />
        <Filter label="هدف سازمانی" value={selectedOrganizationalGoal} onChange={(val) => {
          setSelectedOrganizationalGoal(val);
          setFilterOrganizationalGoal(val);
        }} options={organizationalGoals.map(g => g.title)} />
      </div>

      {/* بخش KPI ها */}
      <section style={styles.kpiSection}>
        <KPICard title="همکاری تیمی" value="85%" icon="👥" progress={85} />
        <KPICard title="اقدامات فعال" value="24" icon="✅" progress={60} />
        <KPICard title="اهداف استراتژیک" value="12/15" icon="🎯" progress={80} />
        <KPICard title="KPI تکمیل" value="76%" icon="📊" progress={76} />
      </section>

      {/* بخش خلاصه KPI ها */}
      <section style={styles.summarySection}>
        <div style={styles.kpiSummary}>
          <CircularProgress value={96} label="رضایت مشتری" color="#4CAF50" />
          <CircularProgress value={80} label="درآمد" color="#2196F3" />
          <CircularProgress value={85} label="نرخ تبدیل" color="#FFC107" />
          <CircularProgress value={75} label="بهره‌وری" color="#E91E63" />
        </div>

        <div style={styles.strategicGoals}>
          <h2 style={styles.sectionTitle}>پیشرفت اهداف استراتژیک</h2>
          <GoalProgress goal="افزایش سهم بازار" progress={85} date="1402/06/30" />
          <GoalProgress goal="کاهش هزینه‌های عملیاتی" progress={60} date="1402/09/30" />
          <GoalProgress goal="افزایش رضایت مشتریان" progress={45} date="1402/12/29" />
          <GoalProgress goal="توسعه محصول جدید" progress={25} date="1402/11/30" />
          <GoalProgress goal="بهبود فرآیندهای داخلی" progress={75} date="1402/08/30" />
        </div>
      </section>

      {/* بخش اقدامات پیش رو */}
      <section style={styles.actionSection}>
        <div style={styles.actionList}>
          <ActionItem title="بهروزرسانی گزارش پیشرفت استراتژی فصلی" responsible="مدیر استراتژی" status="pending" />
          <ActionItem title="بررسی های بخش فروش KPI" responsible="مدیر فروش" status="in-progress" />
          <ActionItem title="جلسه بررسی پیشرفت پروژه‌های استراتژیک" responsible="تیم مدیریت" status="completed" />
          <ActionItem title="تهیه گزارش تحلیل رقبا" responsible="تیم بازاریابی" status="delayed" />
          <ActionItem title="بازگری اهداف استراتژیک سهماهه" responsible="هیئت مدیره" status="pending" />
        </div>

        <div style={styles.activityLog}>
          <ActivityItem user="علی محمدی" time="1 ساعت پیش" message="کامنت جدید در مورد پیشرفت پروژه بازاریابی دیجیتال اضافه کرد." />
          <ActivityItem user="سارا رضا" time="3 ساعت پیش" message="افراد 'بهینه‌سازی فرآیند فروش' را تکمیل کرد." />
          <ActivityItem user="سیستم" time="5 ساعت پیش" message="هشدار: 'نرخ تبدیل مشتریان' به زیر آستانه هدف رسیده است." />
          <ActivityItem user="محمد کرمی" time="دیروز" message="گزارش جدید 'تحلیل بازار رقابتی' را بارگذاری کرد." />
        </div>
      </section>

      {/* بخش اطلاعات استراتژیک */}
      <div style={styles.strategySection}>
        <div style={styles.strategyCard}>
          <h3 style={styles.cardTitle}>چشم‌انداز</h3>
          <p>{strategyInfo.vision || "اطلاعاتی ثبت نشده است"}</p>
        </div>
        <div style={styles.strategyCard}>
          <h3 style={styles.cardTitle}>ماموریت</h3>
          <p>{strategyInfo.mission || "اطلاعاتی ثبت نشده است"}</p>
        </div>
        <div style={styles.strategyCard}>
          <h3 style={styles.cardTitle}>ارزش‌ها</h3>
          <p>{strategyInfo.core_values || "اطلاعاتی ثبت نشده است"}</p>
        </div>
      </div>

// ✅ بخش جدول وضعیت دپارتمان‌ها جایگزین شود با:
<table style={styles.departmentTable}>
  <thead>
    <tr style={{ backgroundColor: "#223F98", color: "white" }}>
      <th style={{ padding: "12px", textAlign: "center" }}>دپارتمان</th>
      <th style={{ padding: "12px", textAlign: "center" }}>کمتر از 40% (ریسک)</th>
      <th style={{ padding: "12px", textAlign: "center" }}>40-80% (در حال انجام)</th>
      <th style={{ padding: "12px", textAlign: "center" }}>بیش از 80% (تکمیل شده)</th>
    </tr>
  </thead>
  <tbody>
    {departments.map((dept) => {
      const stats = departmentSuccess[dept.name] || { total: 0, low: 0, medium: 0, high: 0 };
      return (
        <tr key={dept.name}>
          <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{dept.name}</td>
          <td style={{ padding: "12px", border: "1px solid #ddd", color: "#f44336", textAlign: "center" }}>{stats.low}</td>
          <td style={{ padding: "12px", border: "1px solid #ddd", color: "#ff9800", textAlign: "center" }}>{stats.medium}</td>
          <td style={{ padding: "12px", border: "1px solid #ddd", color: "#4caf50", textAlign: "center" }}>{stats.high}</td>
        </tr>
      );
    })}
  </tbody>
</table>


      {/* مدل پنجره گزارش */}
      {showExportOptions && (
        <div style={styles.exportModal}>
          <button onClick={exportToPDF} style={styles.modalButton}>خروجی PDF</button>
          <button onClick={exportToExcel} style={styles.modalButton}>خروجی Excel</button>
        </div>
      )}
    </div>
  );
}

// مولفه‌های جدید
function KPICard({ title, value, icon, progress }) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiIcon}>{icon}</div>
      <div style={styles.kpiContent}>
        <h3 style={styles.kpiTitle}>{title}</h3>
        <p style={styles.kpiValue}>{value}</p>
        <progress max="100" value={progress} style={styles.progressBar}></progress>
      </div>
    </div>
  );
}

function CircularProgress({ value, label, color }) {
  return (
    <div style={styles.circularProgress}>
      <svg viewBox="0 0 100 100" style={{ width: '100px', height: '100px' }}>
        <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="10" fill="none" />
        <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="10" fill="none"
          style={{ strokeDasharray: '282.743', strokeDashoffset: '282.743', transform: `rotate(-90deg)`, transformOrigin: '50% 50%' }}
        />
      </svg>
      <div style={styles.circularLabel}>{label}</div>
      <div style={styles.circularValue}>{value}%</div>
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

function ActionItem({ title, responsible, status }) {
  const statusColors = {
    pending: "#ffcc00",
    "in-progress": "#2196f3",
    completed: "#4caf50",
    delayed: "#f44336"
  };
  
  return (
    <div style={styles.actionItem}>
      <div style={{ ...styles.statusDot, backgroundColor: statusColors[status] }}></div>
      <div style={styles.actionInfo}>
        <p>{title}</p>
        <small>مسئول: {responsible}</small>
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
// ✅ تعریف کامپوننت Filter
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
