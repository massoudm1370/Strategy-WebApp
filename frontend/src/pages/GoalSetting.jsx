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
const baseUrl = process.env.REACT_APP_API_URL;

useEffect(() => {
  fetch(`${baseUrl}/goals`)
    .then(res => res.json())
    .then(setGoals)
    .catch(err => console.error("خطا در دریافت اهداف", err));

  fetch(`${baseUrl}/departments`)
    .then(res => res.json())
    .then(setDepartments)
    .catch(err => console.error("خطا در دریافت دپارتمان‌ها", err));

  fetch(`${baseUrl}/users`)
    .then(res => res.json())
    .then(setUsers)
    .catch(err => console.error("خطا در دریافت کاربران", err));
}, []);

const handleAddGoal = () => {
  if (!title.trim()) return;

  const newGoal = { title, status, department, owner, startDate, endDate };

  fetch(`${baseUrl}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGoal)
  })
    .then(res => res.json())
    .then(saved => {
      setGoals([...goals, saved]);
      resetForm();
    })
    .catch(err => console.error("خطا در افزودن هدف", err));
};


  const handleDeleteGoal = (id) => {
    fetch(`/api/goals/${id}`, { method: 'DELETE' })
      .then(() => {
        setGoals(goals.filter(goal => goal.id !== id));
      })
      .catch(err => console.error("خطا در حذف هدف", err));
  };

  const resetForm = () => {
    setTitle("");
    setStatus("در حال انجام");
    setDepartment("");
    setOwner("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div style={{ padding: "40px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>تعریف اهداف</h1>
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان هدف" style={{ width: "100%", marginBottom: "10px" }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
          <option value="در حال انجام">در حال انجام</option>
          <option value="تکمیل شده">تکمیل شده</option>
          <option value="متوقف شده">متوقف شده</option>
        </select>
        <select value={department} onChange={(e) => setDepartment(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
          <option value="">انتخاب دپارتمان</option>
          {departments.map((dep) => <option key={dep.id} value={dep.name}>{dep.name}</option>)}
        </select>
        <select value={owner} onChange={(e) => setOwner(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
          <option value="">انتخاب مسئول</option>
          {users.map((user) => <option key={user.id} value={user.name}>{user.name} ({user.department})</option>)}
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
        <button onClick={handleAddGoal} style={{ padding: "10px 20px", backgroundColor: "#223F98", color: "white" }}>افزودن هدف</button>
      </div>

      <h2>لیست اهداف</h2>
      <ul style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
        {goals.map((goal) => (
          <li key={goal.id} style={{ marginBottom: "10px" }}>
            {goal.title} - وضعیت: {goal.status} - دپارتمان: {goal.department} - مسئول: {goal.owner} - از {goal.startDate} تا {goal.endDate}
            <button onClick={() => handleDeleteGoal(goal.id)} style={{ marginRight: "10px", background: "red", color: "white" }}>حذف</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
