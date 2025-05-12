import { useState, useEffect } from "react";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");

  useEffect(() => {
    const savedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartments(savedDepartments);
  }, []);

  const handleAddDepartment = () => {
    if (!departmentName.trim()) return;
    const newDepartment = { name: departmentName };
    const updatedDepartments = [...departments, newDepartment];
    setDepartments(updatedDepartments);
    localStorage.setItem("departments", JSON.stringify(updatedDepartments));
    setDepartmentName("");
  };

  const handleDeleteDepartment = (index) => {
    const updatedDepartments = departments.filter((_, i) => i !== index);
    setDepartments(updatedDepartments);
    localStorage.setItem("departments", JSON.stringify(updatedDepartments));
  };

  return (
    <div style={{ padding: "40px", marginRight: "10px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>مدیریت دپارتمان‌ها</h1>

      {/* فرم افزودن دپارتمان */}
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

      {/* لیست دپارتمان‌ها */}
      <h2>لیست دپارتمان‌ها</h2>
      <ul style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
        {departments.map((dep, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {dep.name}
            <button
              onClick={() => handleDeleteDepartment(index)}
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
