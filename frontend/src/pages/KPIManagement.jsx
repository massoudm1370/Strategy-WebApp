import { useState, useEffect } from "react";

export default function KPIManagement() {
  const [kpis, setKpis] = useState([]);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [target, setTarget] = useState("");
  const [formula, setFormula] = useState("");

  useEffect(() => {
    fetch('/api/kpis')
      .then(res => res.json())
      .then(setKpis)
      .catch(err => console.error("خطا در دریافت KPIها:", err));
  }, []);

  const handleAddKPI = () => {
    const newKpi = { name, unit, target, formula };
    fetch('/api/kpis', {
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
      .catch(err => console.error("خطا در افزودن KPI:", err));
  };

  const handleDeleteKPI = (id) => {
    fetch(`/api/kpis/${id}`, { method: 'DELETE' })
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

      <button onClick={handleAddKPI} style={{ padding: "10px 20px", backgroundColor: "#223F98", color: "white", border: "none", borderRadius: "5px" }}>
        افزودن شاخص
      </button>

      <h2 style={{ marginTop: "30px" }}>لیست شاخص‌ها</h2>
      <ul>
        {kpis.map((kpi) => (
          <li key={kpi.id} style={{ marginBottom: "10px" }}>
            <strong>{kpi.name}</strong> - واحد: {kpi.unit} - هدف: {kpi.target} - {kpi.formula}
            <button onClick={() => handleDeleteKPI(kpi.id)} style={{ marginRight: "10px", background: "red", color: "white", border: "none", borderRadius: "3px", padding: "3px 7px" }}>
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
