import { useState, useEffect } from "react";

export default function Collaboration() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  const handleAddNote = () => {
    if (!noteText.trim() && !file) return;
    const newNote = { text: noteText, fileName: file ? file.name : null };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNoteText("");
    setFile(null);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
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
        {notes.map((note, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {note.text && <p>{note.text}</p>}
            {note.fileName && <p>📎 {note.fileName}</p>}
            <button
              onClick={() => handleDeleteNote(index)}
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
