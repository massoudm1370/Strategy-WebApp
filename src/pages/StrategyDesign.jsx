import { useState, useEffect } from "react";

export default function StrategyDesign() {
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [values, setValues] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("strategyInfo")) || {};
    setVision(saved.vision || "");
    setMission(saved.mission || "");
    setValues(saved.values || "");
  }, []);

  const handleSave = () => {
    const data = { vision, mission, values };
    localStorage.setItem("strategyInfo", JSON.stringify(data));
    alert("اطلاعات با موفقیت ذخیره شد");
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
        <textarea value={values} onChange={(e) => setValues(e.target.value)} style={{ width: "100%", padding: "10px" }} rows="3" />
      </div>

      <button onClick={handleSave} style={{ padding: "10px 20px", backgroundColor: "#223F98", color: "white", border: "none", borderRadius: "5px" }}>
        ذخیره
      </button>
    </div>
  );
}
