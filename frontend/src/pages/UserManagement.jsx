import { useState, useEffect } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles] = useState(["Admin", "Department Manager", "Viewer"]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "Viewer",
    department: ""
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [filterRole, setFilterRole] = useState("همه");
  const [filterDepartment, setFilterDepartment] = useState("همه");
  const [searchQuery, setSearchQuery] = useState("");
const baseUrl = process.env.REACT_APP_API_URL;

useEffect(() => {
  fetch(`${baseUrl}/users`)
    .then(res => res.json())
    .then(setUsers)
    .catch(err => console.error("خطا در دریافت کاربران", err));

  fetch(`${baseUrl}/departments`)
    .then(res => res.json())
    .then(setDepartments)
    .catch(err => console.error("خطا در دریافت دپارتمان‌ها", err));
}, []);


  const handleChange = (e) => setNewUser({ ...newUser, [e.target.name]: e.target.value });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.password || !newUser.department) {
      alert("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }

    const url = editingUserId ? `/api/users/${editingUserId}` : '/api/users';
    const method = editingUserId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(saved => {
        if (editingUserId) {
          setUsers(users.map(u => u.id === editingUserId ? saved : u));
        } else {
          setUsers([...users, saved]);
        }
        resetForm();
      })
      .catch(err => console.error("خطا در ذخیره کاربر", err));
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setEditingUserId(user.id);
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟")) return;

    fetch(`/api/users/${id}`, { method: 'DELETE' })
      .then(() => setUsers(users.filter(u => u.id !== id)))
      .catch(err => console.error("خطا در حذف کاربر", err));
  };

  const resetForm = () => {
    setNewUser({ name: "", email: "", username: "", password: "", role: "Viewer", department: "" });
    setEditingUserId(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(searchQuery) || user.email.includes(searchQuery) || user.username.includes(searchQuery);
    const matchesRole = filterRole === "همه" || user.role === filterRole;
    const matchesDepartment = filterDepartment === "همه" || user.department === filterDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const canAccess = (accessPoint) => (role) => {
    const accessRules = { "Admin": ["all"], "Department Manager": ["view", "edit_department"], "Viewer": ["view"] };
    const allowedAccess = accessRules[role] || ["view"];
    return allowedAccess.includes(accessPoint) || allowedAccess.includes("all");
  };

  return (
    <div style={{ padding: "40px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>مدیریت کاربران</h1>

      <div style={{ marginBottom: "30px", background: "white", padding: "20px", borderRadius: "8px" }}>
        <h2>{editingUserId ? "ویرایش کاربر" : "افزودن کاربر جدید"}</h2>
        <input name="name" value={newUser.name} onChange={handleChange} placeholder="نام و نام خانوادگی" />
        <input name="email" value={newUser.email} onChange={handleChange} placeholder="ایمیل" />
        <input name="username" value={newUser.username} onChange={handleChange} placeholder="نام کاربری" />
        <input name="password" type="password" value={newUser.password} onChange={handleChange} placeholder="رمز عبور" />
        <select name="role" value={newUser.role} onChange={handleChange}>
          <option value="Viewer">مشاهده‌گر</option>
          <option value="Department Manager">مدیر دپارتمان</option>
          <option value="Admin">مدیر سیستم</option>
        </select>
        <select name="department" value={newUser.department} onChange={handleChange}>
          <option value="">انتخاب دپارتمان</option>
          {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
        <button onClick={handleAddUser} style={{ marginTop: "10px", padding: "10px", backgroundColor: "#223F98", color: "white" }}>
          {editingUserId ? "به‌روزرسانی کاربر" : "افزودن کاربر"}
        </button>
        {editingUserId && <button onClick={resetForm} style={{ marginTop: "10px" }}>انصراف</button>}
      </div>

      <div>
        <input type="text" placeholder="جستجو" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="همه">همه نقش‌ها</option>
          {roles.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
          <option value="همه">همه دپارتمان‌ها</option>
          {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
      </div>

      <h2>لیست کاربران</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>نام</th>
            <th>ایمیل</th>
            <th>نام کاربری</th>
            <th>نقش</th>
            <th>دپارتمان</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.department}</td>
              <td>
                <button onClick={() => handleEdit(user)}>✏️</button>
                <button onClick={() => handleDeleteUser(user.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
