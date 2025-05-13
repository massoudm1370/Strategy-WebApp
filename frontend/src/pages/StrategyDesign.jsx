import { useState, useEffect } from "react";

export default function StrategyDesign() {
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [coreValues, setCoreValues] = useState("");

  useEffect(() => {
    fetch("/api/strategy")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setVision(data.vision || "");
          setMission(data.mission || "");
          setCoreValues(data.core_values || "");  // اصلاح نام فیلد دریافتی
        }
      })
      .catch((err) => console.error("❌ خطا در دریافت اطلاعات:", err));
  }, []);

  const handleSave = () => {
    const strategyData = { vision, mission, core_values: coreValues };

    fetch("/api/strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(strategyData),
    })
      .then((res) => res.json())
      .then(() => alert("اطلاعات با موفقیت در سرور ذخیره شد"))
      .catch((err) => {
        console.error("❌ خطا در ذخیره اطلاعات:", err);
        alert("خطا در ذخیره اطلاعات در سرور");
      });
  };

  return (
    <div style={{ padding: "20px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif" }}>
      <h1>طراحی استراتژی</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>چشم‌انداز:</label>
        <textarea value={vision} onChange={(e) => setVision(e.target.value)} style={{ width: "100%", padding: "10px" }} rows="3" />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>ماموریت:</label>
        <textarea value={mission} onChange={(e) => setMission(e.target.value)} style={{ width: "100%", padding: "10px" }} rows="3" />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>ارزش‌ها:</label>
        <textarea value={coreValues} onChange={(e) => setCoreValues(e.target.value)} style={{ width: "100%", padding: "10px" }} rows="3" />
      </div>

      <button onClick={handleSave} style={{ padding: "10px 20px", backgroundColor: "#223F98", color: "white", border: "none", borderRadius: "5px" }}>
        ذخیره
      </button>
    </div>
  );
}
