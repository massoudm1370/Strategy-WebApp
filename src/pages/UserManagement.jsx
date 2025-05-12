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
  const [editingUserIndex, setEditingUserIndex] = useState(null);
  const [filterRole, setFilterRole] = useState("همه");
  const [filterDepartment, setFilterDepartment] = useState("همه");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const savedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    setUsers(savedUsers);
    setDepartments(savedDepartments);
  }, []);

  const handleChange = (e) => setNewUser({ ...newUser, [e.target.name]: e.target.value });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.password || !newUser.department) {
      alert("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }
    const updatedUsers = [...users];
    if (editingUserIndex !== null) {
      updatedUsers[editingUserIndex] = newUser;
      setEditingUserIndex(null);
    } else {
      updatedUsers.push(newUser);
    }
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    resetForm();
  };

  const handleEdit = (index) => {
    setNewUser(users[index]);
    setEditingUserIndex(index);
  };

  const handleDeleteUser = (index) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟")) return;
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const resetForm = () => setNewUser({ name: "", email: "", username: "", password: "", role: "Viewer", department: "" });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(searchQuery) || user.email.includes(searchQuery) || user.username.includes(searchQuery);
    const matchesRole = filterRole === "همه" || user.role === filterRole;
    const matchesDepartment = filterDepartment === "همه" || user.department === filterDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const canAccess = (accessPoint) => (role) => {
    const accessRules = {
      "Admin": ["all"],
      "Department Manager": ["view", "edit_department"],
      "Viewer": ["view"]
    };
    const allowedAccess = accessRules[role] || ["view"];
    return allowedAccess.includes(accessPoint) || allowedAccess.includes("all");
  };

  return (
    <div style={{ padding: "40px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>مدیریت کاربران</h1>

      <div style={{ marginBottom: "30px", background: "white", padding: "20px", borderRadius: "8px" }}>
        <h2>{editingUserIndex !== null ? "ویرایش کاربر" : "افزودن کاربر جدید"}</h2>
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
          {departments.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
        </select>
        <button onClick={handleAddUser} style={{ marginTop: "10px", padding: "10px", backgroundColor: "#223F98", color: "white" }}>
          {editingUserIndex !== null ? "به‌روزرسانی کاربر" : "افزودن کاربر"}
        </button>
        {editingUserIndex !== null && <button onClick={resetForm} style={{ marginTop: "10px" }}>انصراف</button>}

        <div style={{ marginTop: "20px", backgroundColor: "#f0f0f0", padding: "10px" }}>
          <h3>دسترسی‌های این نقش:</h3>
          <ul>
            <li>داشبورد: {canAccess("view")(newUser.role) ? "✅ دارد" : "❌ ندارد"}</li>
            <li>اهداف دپارتمان: {canAccess("edit_department")(newUser.role) ? "✅ دارد" : "❌ ندارد"}</li>
            <li>تنظیمات سیستم: {canAccess("all")(newUser.role) ? "✅ دارد" : "❌ ندارد"}</li>
          </ul>
        </div>
      </div>

      <div>
        <input type="text" placeholder="جستجو" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="همه">همه نقش‌ها</option>
          {roles.map((role, i) => <option key={i} value={role}>{role}</option>)}
        </select>
        <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
          <option value="همه">همه دپارتمان‌ها</option>
          {departments.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
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
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.department}</td>
              <td>
                <button onClick={() => handleEdit(index)}>✏️</button>
                <button onClick={() => handleDeleteUser(index)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
