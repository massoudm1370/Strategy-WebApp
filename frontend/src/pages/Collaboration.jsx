import { useState, useEffect } from "react";

// تعریف آدرس بک‌اند از .env یا Render
const API_URL = process.env.REACT_APP_API_URL;

export default function Collaboration() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [file, setFile] = useState(null);

  // دریافت یادداشت‌ها در بارگذاری اولیه صفحه
  useEffect(() => {
    fetch(`${API_URL}/collaboration`)
      .then((res) => res.json())
      .then((data) => setNotes(data || []))
      .catch((err) => console.error("خطا در دریافت یادداشت‌ها:", err));
  }, []);

  // افزودن یادداشت جدید
  const handleAddNote = () => {
    if (!noteText.trim() && !file) return;

    const newNote = { text: noteText, fileName: file ? file.name : null };

    fetch(`${API_URL}/collaboration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    })
      .then((res) => res.json())
      .then((savedNote) => {
        setNotes([...notes, savedNote]);
        setNoteText("");
        setFile(null);
      })
      .catch((err) => console.error("خطا در ذخیره یادداشت:", err));
  };

  // حذف یادداشت
  const handleDeleteNote = (id) => {
    fetch(`${API_URL}/collaboration/${id}`, { method: "DELETE" })
      .then(() => {
        setNotes(notes.filter((note) => note.id !== id));
      })
      .catch((err) => console.error("خطا در حذف یادداشت:", err));
  };

  return (
    <div style={{ padding: "20px", marginRight: "5px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>ماژول همکاری و گزارش‌دهی</h1>

      {/* فرم افزودن یادداشت */}
      <div style={{ marginBottom: "20px", background: "white", padding: "20px", borderRadius: "8px" }}>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="یادداشت خود را بنویسید..."
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px", minHeight: "80px" }}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ width: "95%", padding: "12px", margin: "5px 0 15px", border: "1px solid #ddd", borderRadius: "6px" }}
        />
        <button
          onClick={handleAddNote}
          style={{ padding: "12px 24px", backgroundColor: "#223F98", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          ارسال یادداشت
        </button>
      </div>

      {/* لیست یادداشت‌ها */}
      <h2>لیست یادداشت‌ها</h2>
      <ul style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
        {notes.map((note) => (
          <li key={note.id} style={{ marginBottom: "10px" }}>
            {note.text && <p>{note.text}</p>}
            {note.fileName && <p>📎 {note.fileName}</p>}
            <button
              onClick={() => handleDeleteNote(note.id)}
              style={{ background: "red", color: "white", border: "none", borderRadius: "3px", padding: "5px 10px", cursor: "pointer" }}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
