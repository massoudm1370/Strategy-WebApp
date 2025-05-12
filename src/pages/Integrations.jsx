import { useState, useEffect } from "react";

export default function Integrations() {
  const [apis, setApis] = useState([]);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    const savedApis = JSON.parse(localStorage.getItem("apis")) || [];
    setApis(savedApis);
  }, []);

  const handleAddApi = () => {
    if (!apiUrl.trim()) return;
    const updatedApis = [...apis, { url: apiUrl }];
    setApis(updatedApis);
    localStorage.setItem("apis", JSON.stringify(updatedApis));
    setApiUrl("");
  };

  const handleDeleteApi = (index) => {
    const updatedApis = apis.filter((_, i) => i !== index);
    setApis(updatedApis);
    localStorage.setItem("apis", JSON.stringify(updatedApis));
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
        {apis.map((api, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {api.url}
            <button
              onClick={() => handleTestApi(api.url)}
              style={{ marginRight: "10px", background: "#27ae60", color: "white", border: "none", borderRadius: "3px", padding: "3px 7px" }}
            >
              تست اتصال
            </button>
            <button
              onClick={() => handleDeleteApi(index)}
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
