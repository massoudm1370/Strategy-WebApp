import { useState, useEffect } from "react";

export default function GoalSetting() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("در حال انجام");
  const [department, setDepartment] = useState("");
  const [owner, setOwner] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("goals")) || [];
    const savedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setGoals(savedGoals);
    setDepartments(savedDepartments);
    setUsers(savedUsers);
  }, []);

  const handleAddGoal = () => {
    if (!title.trim()) return;
    const newGoal = { title, status, department, owner, startDate, endDate };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));

    // Reset fields
    setTitle("");
    setStatus("در حال انجام");
    setDepartment("");
    setOwner("");
    setStartDate("");
    setEndDate("");
  };

  const handleDeleteGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));
  };

  return (
    <div style={{ padding: "40px", marginRight: "10px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>تعریف اهداف</h1>

      {/* فرم افزودن هدف */}
      <div style={{ marginBottom: "20px", background: "white", padding: "20px", borderRadius: "8px" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان هدف"
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px" }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px" }}
        >
          <option value="در حال انجام">در حال انجام</option>
          <option value="تکمیل شده">تکمیل شده</option>
          <option value="متوقف شده">متوقف شده</option>
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px" }}
        >
          <option value="">انتخاب دپارتمان</option>
          {departments.map((dep, index) => (
            <option key={index} value={dep.name}>{dep.name}</option>
          ))}
        </select>

        <select
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px" }}
        >
          <option value="">انتخاب مسئول</option>
          {users.map((user, index) => (
            <option key={index} value={user.name}>{user.name} ({user.department})</option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px" }}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px" }}
        />

        <button
          onClick={handleAddGoal}
          style={{ padding: "12px 24px", backgroundColor: "#223F98", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          افزودن هدف
        </button>
      </div>

      {/* لیست اهداف */}
      <h2>لیست اهداف</h2>
      <ul style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
        {goals.map((goal, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {goal.title} - وضعیت: {goal.status} - دپارتمان: {goal.department} - مسئول: {goal.owner} - از {goal.startDate} تا {goal.endDate}
            <button
              onClick={() => handleDeleteGoal(index)}
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
