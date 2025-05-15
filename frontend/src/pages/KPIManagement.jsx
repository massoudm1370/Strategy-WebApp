import { useState, useEffect } from "react";

export default function KPIManagement() {
  const [kpis, setKpis] = useState([]);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [target, setTarget] = useState("");
  const [formula, setFormula] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${baseUrl}/kpis`)
      .then(res => res.json())
      .then(setKpis)
      .catch(err => console.error("خطا در دریافت KPIها:", err));
  }, [baseUrl]);

  const handleAddKPI = () => {
    if (!name.trim() || !unit.trim() || !target.trim()) {
      alert("لطفاً تمام فیلدها را تکمیل کنید.");
      return;
    }

    const newKpi = { name, unit, target: Number(target), formula };
    setIsSubmitting(true);

    fetch(`${baseUrl}/kpis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newKpi)
    })
      .then(res => res.json())
      .then(saved => {
        setKpis([...kpis, saved]);
        setName("");
        setUnit("");
        setTarget("");
        setFormula("");
      })
      .catch(err => console.error("خطا در افزودن KPI:", err))
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteKPI = (id) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این KPI را حذف کنید؟")) return;

    fetch(`${baseUrl}/kpis/${id}`, { method: 'DELETE' })
      .then(() => {
        setKpis(kpis.filter(kpi => kpi.id !== id));
      })
      .catch(err => console.error("خطا در حذف KPI:", err));
  };

  return (
    <div style={{ padding: "20px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif" }}>
      <h1>مدیریت شاخص‌های کلیدی عملکرد (KPI)</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>عنوان شاخص:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "10px" }} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>واحد سنجش:</label>
        <input value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: "100%", padding: "10px" }} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>هدف:</label>
        <input value={target} onChange={(e) => setTarget(e.target.value)} type="number" style={{ width: "100%", padding: "10px" }} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>فرمول یا توضیح:</label>
        <textarea value={formula} onChange={(e) => setFormula(e.target.value)} style={{ width: "100%", padding: "10px" }} />
      </div>

      <button
        onClick={handleAddKPI}
        disabled={isSubmitting}
        style={{
          padding: "10px 20px",
          backgroundColor: isSubmitting ? "#ccc" : "#223F98",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isSubmitting ? "not-allowed" : "pointer"
        }}
      >
        {isSubmitting ? "در حال ارسال..." : "افزودن شاخص"}
      </button>

      <h2 style={{ marginTop: "30px" }}>لیست شاخص‌ها</h2>
      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>عنوان</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>واحد</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>هدف</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>فرمول/توضیح</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((kpi) => (
            <tr key={kpi.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>{kpi.name}</td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>{kpi.unit}</td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>{kpi.target}</td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>{kpi.formula}</td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                <button
                  onClick={() => handleDeleteKPI(kpi.id)}
                  style={{ background: "red", color: "white", border: "none", borderRadius: "3px", padding: "5px 10px", cursor: "pointer" }}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
