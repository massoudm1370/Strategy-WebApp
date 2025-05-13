import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard() {
  const [strategyInfo, setStrategyInfo] = useState({ vision: "", mission: "", core_values: "" });
  const [organizationalGoals, setOrganizationalGoals] = useState([]);
  const [departmentGoals, setDepartmentGoals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterHalf, setFilterHalf] = useState("همه");
  const [filterOrganizationalGoal, setFilterOrganizationalGoal] = useState("");
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Load data from backend
  useEffect(() => {
    fetch("/api/strategy")
      .then(res => res.json())
      .then(data => setStrategyInfo(data || { vision: "", mission: "", core_values: "" }));

    fetch("/api/goals")
      .then(res => res.json())
      .then(data => {
        setOrganizationalGoals(data || []);
        setDepartmentGoals(data || []);  // Assuming same API returns both for now
      });

    fetch("/api/departments")
      .then(res => res.json())
      .then(data => setDepartments(data || []));

    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data || []));
  }, []);

  const availableYears = [...new Set([...organizationalGoals.map(g => g.year), ...departmentGoals.map(kr => kr.year)])];
  const filteredOrganizationalGoals = organizationalGoals.filter(g => (!filterYear || g.year == filterYear) && (filterHalf === "همه" || g.halfYear === filterHalf));
  const relatedDepartments = [...new Set(departmentGoals.filter(kr => kr.title === filterOrganizationalGoal).map(kr => kr.department))];
  const relatedKeyResults = departmentGoals.filter(kr => kr.title === filterOrganizationalGoal);

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
          <Filter label="هدف سازمانی" value={filterOrganizationalGoal} onChange={setFilterOrganizationalGoal} options={organizationalGoals.map(g => g.title)} />
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
          <StatCard label="اهداف سازمانی" value={filteredOrganizationalGoals.length} color="#223F98" />
          <StatCard label="نتایج کلیدی" value={departmentGoals.length} color="#223F98" />
          <StatCard label="دپارتمان‌ها" value={departments.length} color="#223F98" />
          <StatCard label="کاربران" value={users.length} color="#223F98" />
        </div>

        {filterOrganizationalGoal && (
          <div style={{ marginBottom: "30px" }}>
            <h2>لیست دپارتمان‌ها و نتایج کلیدی</h2>
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              {relatedDepartments.length === 0 ? (
                <p style={{ padding: "20px", textAlign: "center" }}>هیچ دپارتمانی به این هدف متصل نیست</p>
              ) : (
                relatedDepartments.map(dept => (
                  <div key={dept} style={{ borderBottom: "1px solid #eee" }}>
                    <div style={{ padding: "15px 20px", backgroundColor: "#fafafa", fontWeight: "bold" }}>
                      {dept}
                    </div>
                    <div style={{ padding: "10px 20px", backgroundColor: "#fff" }}>
                      {groupedKR[dept]?.length > 0 ? (
                        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                          {groupedKR[dept].map((kr, idx) => (
                            <li key={idx} style={{ marginBottom: "10px", borderBottom: "1px dashed #eee", paddingBottom: "10px" }}>
                              <strong>{kr.title}</strong> <br />
                              <span>وزن: {kr.weight || "نامشخص"}%</span> |
                              <span>تارگت: {kr.target || "نامشخص"}</span> |
                              <span>عدم دستیابی: {kr.failure || "نامشخص"}</span>
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
      </div>
    </div>
  );
}

// Info Card Component
function InfoCard({ title, content }) {
  return (
    <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 5px rgba(0,0,0,0.1)", minWidth: "200px" }}>
      <h2>{title}</h2>
      <p>{content || "اطلاعات ثبت نشده است"}</p>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, color }) {
  return (
    <div style={{ flex: "1", backgroundColor: color, color: "white", padding: "20px", borderRadius: "8px", textAlign: "center", minWidth: "150px" }}>
      <h3>{label}</h3>
      <p style={{ fontSize: "24px" }}>{value}</p>
    </div>
  );
}

// Filter Component
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
