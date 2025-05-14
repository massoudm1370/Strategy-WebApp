import { useState, useEffect } from "react";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${baseUrl}/departments`)
      .then(res => res.json())
      .then(setDepartments)
      .catch(err => console.error("خطا در دریافت دپارتمان‌ها:", err));
  }, []);

  const handleAddDepartment = () => {
    if (!departmentName.trim()) return;

    const newDepartment = { name: departmentName };

    fetch(`${baseUrl}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDepartment)
    })
      .then(res => res.json())
      .then(saved => {
        setDepartments([...departments, saved]);
        setDepartmentName("");
      })
      .catch(err => console.error("خطا در افزودن دپارتمان:", err));
  };

  const handleDeleteDepartment = (id) => {
    fetch(`${baseUrl}/departments/${id}`, { method: 'DELETE' })
      .then(() => {
        setDepartments(departments.filter(d => d.id !== id));
      })
      .catch(err => console.error("خطا در حذف دپارتمان:", err));
  };

  return (
    <div style={{ padding: "40px", marginRight: "10px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>مدیریت دپارتمان‌ها</h1>

      <div style={{ marginBottom: "20px", background: "white", padding: "20px", borderRadius: "8px" }}>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="نام دپارتمان"
          style={{ width: "100%", padding: "12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "6px" }}
        />
        <button
          onClick={handleAddDepartment}
          style={{ padding: "12px 24px", backgroundColor: "#223F98", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          افزودن دپارتمان
        </button>
      </div>

      <h2>لیست دپارتمان‌ها</h2>
      <ul style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
        {departments.map((dep) => (
          <li key={dep.id} style={{ marginBottom: "10px" }}>
            {dep.name}
            <button
              onClick={() => handleDeleteDepartment(dep.id)}
              style={{ marginRight: "10px", background: "red", color: "white", border: "none", borderRadius: "3px", padding: "3px 7px", cursor: "pointer" }}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
