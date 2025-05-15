import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = process.env.REACT_APP_API_URL;

// ✅ تابع محاسبه درصد موفقیت را اضافه کنید
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

  const groupedKR = relatedKeyResults.reduce((acc, kr) => {
    if (!acc[kr.department]) acc[kr.department] = [];
    acc[kr.department].push(kr);
    return acc;
  }, {});

  // ✅ محاسبه وضعیت دپارتمان‌ها براساس درصد موفقیت
  const departmentSuccess = departmentGoals.reduce((acc, kr) => {
    if (!acc[kr.department]) acc[kr.department] = { total: 0, low: 0, medium: 0, high: 0 };
    const success = calculateSuccessPercentage(kr.ytd, kr.currentStatus, kr.target, kr.failure);
    acc[kr.department].total += 1;
    if (success < 40) acc[kr.department].low += 1;
    else if (success >= 40 && success < 80) acc[kr.department].medium += 1;
    else if (success >= 80) acc[kr.department].high += 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: "40px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>داشبورد استراتژیک</h1>
      <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
        <button onClick={() => setShowExportOptions(!showExportOptions)} style={{ padding: "10px 20px", backgroundColor: "#223F98", color: "white", border: "none", borderRadius: "5px" }}>
          دریافت گزارش
        </button>
        {showExportOptions && (
          <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ddd", borderRadius: "5px" }}>
            <button onClick={exportToPDF} style={{ display: "block", padding: "10px 20px" }}>خروجی PDF</button>
            <button onClick={exportToExcel} style={{ display: "block", padding: "10px 20px" }}>خروجی Excel</button>
          </div>
        )}
      </div>

      <div id="dashboard-content">
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
          <InfoCard title="چشم‌انداز" content={strategyInfo.vision} />
          <InfoCard title="ماموریت" content={strategyInfo.mission} />
          <InfoCard title="ارزش‌ها" content={strategyInfo.core_values} />
        </div>

        <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <Filter label="سال" value={filterYear} onChange={setFilterYear} options={availableYears} />
          <Filter label="نیمسال" value={filterHalf} onChange={setFilterHalf} options={["همه", "H1", "H2"]} />
          <Filter label="هدف سازمانی" value={filterOrganizationalGoal} onChange={(val) => {
            setFilterOrganizationalGoal(val);
            setSelectedOrganizationalGoal(val);
          }} options={organizationalGoals.map(g => g.title)} />
          <Filter label="دپارتمان" value={filterDepartment} onChange={setFilterDepartment} options={["همه", ...departments.map(d => d.name)]} />
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
          <StatCard label="اهداف سازمانی" value={filteredOrganizationalGoals.length} color="#223F98" />
          <StatCard label="نتایج کلیدی" value={departmentGoals.length} color="#223F98" />
          <StatCard label="دپارتمان‌ها" value={departments.length} color="#223F98" />
          <StatCard label="کاربران" value={users.length} color="#223F98" />
          <StatCard label="تعداد اهداف دپارتمانی" value={departmentGoals.length} color="#223F98" />
        </div>

        {selectedOrganizationalGoal && (
          <div style={{ marginBottom: "30px" }}>
            <h2>لیست دپارتمان‌ها و نتایج کلیدی برای هدف "{selectedOrganizationalGoal}"</h2>
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              {relatedDepartments.length === 0 ? (
                <p style={{ padding: "20px", textAlign: "center" }}>هیچ دپارتمانی به این هدف متصل نیست</p>
              ) : (
                relatedDepartments.map(dept => (
                  <div key={dept} style={{ borderBottom: "1px solid #eee" }}>
                    <div style={{ padding: "15px 20px", backgroundColor: "#fafafa", fontWeight: "bold" }}>{dept}</div>
                    <div style={{ padding: "10px 20px", backgroundColor: "#fff" }}>
                      {groupedKR[dept]?.length > 0 ? (
                        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                          {groupedKR[dept].map((kr, idx) => (
                            <li key={idx} style={{ marginBottom: "10px", borderBottom: "1px dashed #eee", paddingBottom: "10px" }}>
                              <strong>{kr.title}</strong> <br />
                              <span>وزن: {kr.weight || "نامشخص"}%</span> |
                              <span>تارگت: {kr.target || "نامشخص"}</span> |
                              <span>عدم دستیابی: {kr.failure || "نامشخص"}</span>
                              <details style={{ marginTop: "10px" }}>
                                <summary>جزئیات</summary>
                                <div style={{ padding: "10px", border: "1px dashed #ccc" }}>
                                  <p><strong>وضعیت موجود:</strong> {kr.currentStatus}</p>
                                  <p><strong>YTD:</strong> {kr.ytd}</p>
                                  <p><strong>درصد موفقیت:</strong> {calculateSuccessPercentage(kr.ytd, kr.currentStatus, kr.target, kr.failure).toFixed(1)}%</p>
                                </div>
                              </details>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ marginBottom: "0" }}>هیچ نتیجه کلیدی ثبت نشده است.</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h2>وضعیت دپارتمان‌ها براساس درصد موفقیت</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>دپارتمان</th>
                <th>کمتر از 40% (در حالت ریسک)</th>
                <th>40-80% (در حال انجام)</th>
                <th>100% (تکمیل شده)</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => {
                const stats = departmentSuccess[dept.name] || { total: 0, low: 0, medium: 0, high: 0 };
                return (
                  <tr key={dept.name}>
                    <td>{dept.name}</td>
                    <td style={{ color: "#dc3545" }}>{stats.low}</td>
                    <td style={{ color: "#343a40" }}>{stats.medium}</td>
                    <td style={{ color: "#28a745" }}>{stats.high}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, content }) {
  return (
    <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 5px rgba(0,0,0,0.1)", minWidth: "200px" }}>
      <h2>{title}</h2>
      <p>{content || "اطلاعات ثبت نشده است"}</p>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ flex: "1", backgroundColor: color, color: "white", padding: "20px", borderRadius: "8px", textAlign: "center", minWidth: "150px" }}>
      <h3>{label}</h3>
      <p style={{ fontSize: "24px" }}>{value}</p>
    </div>
  );
}

function Filter({ label, value, onChange, options }) {
  return (
    <div>
      <label>{label}:</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: "5px 10px", margin: "5px 0" }}>
        <option value="">همه</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}