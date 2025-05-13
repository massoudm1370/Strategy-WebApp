import { useState, useEffect } from "react";

export default function Integrations() {
  const [apis, setApis] = useState([]);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    fetch('/api/integrations')
      .then(res => res.json())
      .then(setApis)
      .catch(err => console.error("خطا در دریافت یکپارچگی‌ها:", err));
  }, []);

  const handleAddApi = () => {
    if (!apiUrl.trim()) return;

    fetch('/api/integrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: apiUrl })
    })
      .then(res => res.json())
      .then(saved => {
        setApis([...apis, saved]);
        setApiUrl("");
      })
      .catch(err => console.error("خطا در ثبت یکپارچگی:", err));
  };

  const handleDeleteApi = (id) => {
    fetch(`/api/integrations/${id}`, { method: 'DELETE' })
      .then(() => {
        setApis(apis.filter(api => api.id !== id));
      })
      .catch(err => console.error("خطا در حذف یکپارچگی:", err));
  };

  const handleTestApi = (url) => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          alert("اتصال موفق بود");
        } else {
          alert("خطا در اتصال");
        }
      })
      .catch(() => alert("خطا در اتصال"));
  };

  return (
    <div style={{ padding: "20px", direction: "rtl", fontFamily: "Vazirmatn, sans-serif" }}>
      <h1>مدیریت یکپارچگی‌ها</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="آدرس API را وارد کنید"
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />
        <button
          onClick={handleAddApi}
          style={{ padding: "10px 20px", backgroundColor: "#223F98", color: "white", border: "none", borderRadius: "5px" }}
        >
          ثبت یکپارچگی
        </button>
      </div>

      <h2>لیست یکپارچگی‌ها</h2>
      <ul>
        {apis.map((api) => (
          <li key={api.id} style={{ marginBottom: "10px" }}>
            {api.url}
            <button
              onClick={() => handleTestApi(api.url)}
              style={{ marginRight: "10px", background: "#27ae60", color: "white", border: "none", borderRadius: "3px", padding: "3px 7px" }}
            >
              تست اتصال
            </button>
            <button
              onClick={() => handleDeleteApi(api.id)}
              style={{ marginRight: "10px", background: "red", color: "white", border: "none", borderRadius: "3px", padding: "3px 7px" }}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
