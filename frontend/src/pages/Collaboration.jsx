import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function Collaboration() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [file, setFile] = useState(null);
  const [recipientDepartment, setRecipientDepartment] = useState("");
  const [recipientUser, setRecipientUser] = useState("");
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/collaboration`).then(res => res.json()).then(setNotes);
    fetch(`${API_URL}/departments`).then(res => res.json()).then(setDepartments);
    fetch(`${API_URL}/users`).then(res => res.json()).then(setUsers);
  }, []);

  const handleAddNote = () => {
    if (!noteText.trim() && !file) return alert("لطفاً یادداشت یا فایل وارد کنید.");
    if (!recipientDepartment) return alert("لطفاً یک دپارتمان را انتخاب کنید.");

    const recipient = recipientUser || recipientDepartment;
    const formData = new FormData();
    formData.append("text", noteText);
    formData.append("recipient", recipient);
    if (file) formData.append("file", file);

    fetch(`${API_URL}/collaboration`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(savedNote => {
        setNotes([...notes, savedNote]);
        setNoteText("");
        setFile(null);
        setRecipientDepartment("");
        setRecipientUser("");
      })
      .catch(err => console.error("خطا در ذخیره یادداشت:", err));
  };

  const handleDeleteNote = (id) => {
    fetch(`${API_URL}/collaboration/${id}`, { method: "DELETE" })
      .then(() => setNotes(notes.filter(note => note.id !== id)))
      .catch(err => console.error("خطا در حذف یادداشت:", err));
  };

  return (
    <div style={{ padding: "20px", marginRight: "5px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>ماژول همکاری و گزارش‌دهی</h1>

      <div style={{ marginBottom: "20px", background: "white", padding: "20px", borderRadius: "8px" }}>
        <select value={recipientDepartment} onChange={(e) => { setRecipientDepartment(e.target.value); setRecipientUser(""); }}
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px" }}>
          <option value="">انتخاب دپارتمان</option>
          {departments.map(dept => <option key={dept.id} value={dept.name}>مدیر {dept.name}</option>)}
        </select>

        {recipientDepartment && (
          <select value={recipientUser} onChange={(e) => setRecipientUser(e.target.value)}
            style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px" }}>
            <option value="">تمام کاربران {recipientDepartment}</option>
            {users.filter(user => user.department === recipientDepartment).map(user => (
              <option key={user.id} value={user.name}>{user.name}</option>
            ))}
          </select>
        )}

        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)}
          placeholder="یادداشت خود را بنویسید..."
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px", minHeight: "80px" }} />

        <input type="file" onChange={(e) => setFile(e.target.files[0])}
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px" }} />

        <button onClick={handleAddNote}
          style={{ padding: "12px 24px", backgroundColor: "#223F98", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          ارسال یادداشت
        </button>
      </div>

      <h2>لیست یادداشت‌ها</h2>
      <ul style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
        {notes.map(note => (
          <li key={note.id} style={{ marginBottom: "10px" }}>
            {note.recipient && <p>🧑‍💼 گیرنده: {note.recipient}</p>}
            {note.text && <p>{note.text}</p>}
            {note.fileName && <p>📎 {note.fileName}</p>}
            <button onClick={() => handleDeleteNote(note.id)}
              style={{ background: "red", color: "white", border: "none", borderRadius: "3px", padding: "5px 10px", cursor: "pointer" }}>
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
