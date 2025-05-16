import moment from 'jalali-moment';
import { useState, useEffect } from "react";

export default function OrganizationalGoalsManagement() {
  // States
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    failure: "",
    currentStatus: "",
    ytd: "",
    year: moment().jYear(),
    half: "H1",
    calculationMethod: "",
    weight: "",
    unit: "",
    definitionOfDone: ""
  });
  const [filterBySuccess, setFilterBySuccess] = useState("all");
  const baseUrl = process.env.REACT_APP_API_URL;

  // States for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);

  // States for KPI repository
  const [kpiList, setKpiList] = useState([]);
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [loadingKpi, setLoadingKpi] = useState(false);

  // ✅ افزودن وضعیت جدید برای ردیابی تغییرات دستی عنوان
  const [isTitleManual, setIsTitleManual] = useState(false);

  // Load data from API on mount
  useEffect(() => {
    // Load organizational goals
    fetch(`${baseUrl}/goals`)
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch((error) => {
        console.error('❌ خطا در دریافت اهداف از سرور:', error);
        setGoals([]);
      });

    // Load KPI repository
    const fetchKpiList = async () => {
      setLoadingKpi(true);
      try {
        const response = await fetch(`${baseUrl}/kpis`);
        const data = await response.json();
        setKpiList(data);
      } catch (error) {
        console.error('خطا در دریافت لیست KPI:', error);
      } finally {
        setLoadingKpi(false);
      }
    };
    fetchKpiList();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
    
    // ✅ اگر عنوان ویرایش شود، وضعیت دستی تنظیم می‌شود
    if (name === "title") {
      setIsTitleManual(true);
    }
  };

  // Calculate YTD automatically from currentStatus if not manually entered
  const calculateAutoYTD = (currentStatus) => {
    return currentStatus || "";
  };

  // Calculate success percentage using YTD if available
  const calculateSuccessPercentage = (ytdValue, currentStatus, target, failure) => {
    const valueToUse = ytdValue || currentStatus;
    if (!valueToUse || !target || !failure) return 0;
    const valueNum = parseFloat(valueToUse);
    const targetNum = parseFloat(target);
    const failureNum = parseFloat(failure);
    if (isNaN(valueNum) || isNaN(targetNum) || isNaN(failureNum)) return 0;
    
    const range = Math.max(Math.abs(targetNum - failureNum), 0);
    if (range === 0) return 0;
    
    let progress = 0;
    if (targetNum > failureNum) {
      if (valueNum <= failureNum) return 0;
      if (valueNum >= targetNum) return 100;
      progress = valueNum - failureNum;
    } else {
      if (valueNum >= failureNum) return 0;
      if (valueNum <= targetNum) return 100;
      progress = failureNum - valueNum;
    }
    
    const percentage = (progress / range) * 100;
    return Math.max(0, Math.min(percentage, 100));
  };

  // Handle add/edit goal
const handleSaveGoal = () => {
  const requiredFields = [
    { name: "عنوان", value: newGoal.title },
    { name: "تارگت", value: newGoal.target },
    { name: "عدم دستیابی", value: newGoal.failure },
    { name: "وضعیت موجود", value: newGoal.currentStatus },
    { name: "سال", value: newGoal.year },
    { name: "نیمسال", value: newGoal.half },
    { name: "وزن", value: newGoal.weight },
  ];

  const missingField = requiredFields.find(f => !f.value || f.value.toString().trim() === "");
  if (missingField) {
    alert(`لطفاً ${missingField.name} را وارد نمایید.`);
    return;
  }

  const weightValue = parseFloat(newGoal.weight) || 0;
  const totalWeight = goals.reduce((sum, goal) => sum + (parseFloat(goal.weight) || 0), 0);

  if (isEditing) {
    if (totalWeight - (goals.find(g => g.id === editingGoalId)?.weight || 0) + weightValue > 100) {
      alert("مجموع وزن‌ها نمی‌تواند بیشتر از 100% شود.");
      return;
    }

    fetch(`${baseUrl}/goals/${editingGoalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGoal)
    })
      .then(res => {
        if (!res.ok) throw new Error('خطا در ذخیره در سرور');
        return res.json();
      })
      .then(updatedGoal => {
        const updatedGoals = goals.map(goal =>
          goal.id === editingGoalId ? updatedGoal : goal
        );
        setGoals(updatedGoals);
        resetForm();
      })
      .catch(err => {
        console.error('❌ خطا در به‌روزرسانی هدف:', err);
        alert('خطا در ذخیره در سرور');
      });
  } else {
    if (totalWeight + weightValue > 100) {
      alert("مجموع وزن‌ها نمی‌تواند بیشتر از 100% شود.");
      return;
    }

    fetch(`${baseUrl}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGoal)
    })
      .then(res => {
        if (!res.ok) throw new Error('خطا در ذخیره در سرور');
        return res.json();
      })
      .then(savedGoal => {
        const updatedGoals = [...goals, savedGoal];
        setGoals(updatedGoals);
        resetForm();
      })
      .catch(err => {
        console.error('❌ خطا در ذخیره هدف:', err);
        alert('خطا در ذخیره در سرور');
      });
  }
};


  // Reset form
  const resetForm = () => {
    setNewGoal({
      title: "",
      target: "",
      failure: "",
      currentStatus: "",
      ytd: "",
      year: moment().jYear(),
      half: "H1",
      calculationMethod: "",
      weight: "",
      unit: "",
      definitionOfDone: ""
    });
    setIsEditing(false);
    setEditingGoalId(null);
    setSelectedKpi(null);
    setIsTitleManual(false); // ✅ بازنشانی وضعیت دستی
  };

  // Delete goal
  const handleDelete = (goalId) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این هدف را حذف کنید؟")) return;
    
    fetch(`${baseUrl}/goals/${goalId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(result => {
        console.log('🗑️ حذف انجام شد:', result);
        if (result.success) {
          const updatedGoals = goals.filter(goal => goal.id !== goalId);
          setGoals(updatedGoals);
        } else {
          alert('خطا در حذف هدف');
        }
      })
      .catch(err => {
        console.error('❌ خطا در حذف هدف:', err);
        alert('خطا در برقراری ارتباط با سرور');
      });
  };

  // Edit goal
  const handleEdit = (goalId) => {
    const goalToEdit = goals.find(goal => goal.id === goalId);
    if (!goalToEdit) return;
    setNewGoal({ ...goalToEdit });
    setIsEditing(true);
    setEditingGoalId(goalId);
  };

  // Handle KPI selection
  useEffect(() => {
    if (selectedKpi && kpiList.length > 0) {
      const selectedKpiData = kpiList.find(kpi => kpi.id === selectedKpi);
      if (selectedKpiData) {
        setNewGoal(prev => ({
          ...prev,
          // ✅ فقط اگر عنوان دستی تغییر نکرده باشد، عنوان KPI را قرار ده
          title: isTitleManual ? prev.title : selectedKpiData.title,
          target: selectedKpiData.target,
          failure: selectedKpiData.failure,
          unit: selectedKpiData.unit,
          calculationMethod: selectedKpiData.calculationMethod || "",
          definitionOfDone: selectedKpiData.definitionOfDone || ""
        }));
      }
    }
  }, [selectedKpi, kpiList, isTitleManual]); // ✅ وابستگی به isTitleManual

  // Progress bar component
  const ProgressBar = ({ percentage }) => {
    const color = percentage >= 80 ? '#28a745' : 
                  percentage >= 50 ? '#ffc107' : '#dc3545';
    
    return (
      <div style={{ 
        width: '100%', 
        height: '12px', 
        backgroundColor: '#e9ecef', 
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            width: `${Math.min(100, Math.max(0, percentage))}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    );
  };

  // Filtered goals based on success percentage
  const filteredGoals = goals.filter(goal => {
    const successPercentage = calculateSuccessPercentage(
      goal.ytd,
      goal.currentStatus,
      goal.target,
      goal.failure
    );
    
    switch (filterBySuccess) {
      case "low":
        return successPercentage < 40;
      case "medium":
        return successPercentage >= 40 && successPercentage < 80;
      case "high":
        return successPercentage >= 80;
      default:
        return true;
    }
  });

  return (
    <div style={{ 
      padding: "20px", 
      direction: "rtl", 
      fontFamily: "Vazirmatn, sans-serif",
      maxWidth: "1400px",
      margin: "0 auto"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>مدیریت اهداف سازمان</h1>
      
      {/* Form Section */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "20px",
        marginBottom: "40px"
      }}>
        <div style={{ 
          padding: "20px", 
          border: "1px solid #e0e0e0", 
          borderRadius: "10px"
        }}>
          <h2 style={{ marginBottom: "20px" }}>فرم ثبت هدف</h2>
          
          {/* KPI Selection */}
          <div style={{ marginBottom: "15px" }}>
            <label>انتخاب هدف از مخزن:</label>
            <select
              value={selectedKpi}
              onChange={(e) => setSelectedKpi(e.target.value)}
              disabled={loadingKpi}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginTop: "5px"
              }}
            >
              <option value="">-- انتخاب کنید --</option>
              {kpiList.map(kpi => (
                <option key={kpi.id} value={kpi.id}>{kpi.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input 
              name="title"
              placeholder="عنوان هدف *"
              value={newGoal.title}
              onChange={handleChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            <input 
              name="target"
              placeholder="تارگت (عدد)"
              value={newGoal.target}
              onChange={handleChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            <input 
              name="failure"
              placeholder="عدم دستیابی (عدد)"
              value={newGoal.failure}
              onChange={handleChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            <input 
              name="currentStatus"
              placeholder="وضعیت موجود (عدد)"
              value={newGoal.currentStatus}
              onChange={handleChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            <input 
              name="ytd"
              placeholder="YTD (اختیاری)"
              value={newGoal.ytd}
              onChange={handleChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <select 
                name="year"
                value={newGoal.year}
                onChange={handleChange}
                style={{ 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "5px"
                }}
              >
                {Array.from({ length: 5 }, (_, i) => moment().jYear() - 2 + i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select 
                name="half"
                value={newGoal.half}
                onChange={handleChange}
                style={{ 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "5px"
                }}
              >
                <option value="H1">نیمسال اول</option>
                <option value="H2">نیمسال دوم</option>
              </select>
            </div>
            <input 
              name="calculationMethod"
              placeholder="نحوه محاسبه"
              value={newGoal.calculationMethod}
              onChange={handleChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            <input 
              name="unit"
              placeholder="واحد"
              value={newGoal.unit}
              onChange={handleChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            <input 
              name="weight"
              placeholder="وزن از کل اهداف (%)"
              value={newGoal.weight}
              onChange={handleChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            <textarea 
              name="definitionOfDone"
              placeholder="تعریف از انجام شده"
              value={newGoal.definitionOfDone}
              onChange={handleChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px",
                minHeight: "100px"
              }}
            />
            <button 
              onClick={handleSaveGoal} 
              style={{ 
                backgroundColor: "#223F98", 
                color: "white", 
                padding: "10px", 
                border: "none", 
                borderRadius: "5px",
                fontSize: "16px"
              }}
            >
              {isEditing ? "به‌روزرسانی هدف" : "ذخیره هدف"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter Section */}
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <label htmlFor="successFilter" style={{ marginLeft: "10px" }}>فیلتر بر اساس وضعیت:</label>
        <select
          id="successFilter"
          value={filterBySuccess}
          onChange={(e) => setFilterBySuccess(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "14px"
          }}
        >
          <option value="all">همه اهداف</option>
          <option value="low">پایین (زیر 40%)</option>
          <option value="medium">متوسط (40%-80%)</option>
          <option value="high">بالا (بیش از 80%)</option>
        </select>
      </div>
      
      {/* Results Table */}
      <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>لیست اهداف سازمان</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          marginTop: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>عنوان</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>سال</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>نیمسال</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>تارگت</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>عدم دستیابی</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>واحد</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>وزن</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>وضعیت موجود</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>YTD</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>درصد موفقیت</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredGoals.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                  هیچ هدفی یافت نشد
                </td>
              </tr>
            ) : (
              filteredGoals.map((goal, index) => {
                const autoYTD = calculateAutoYTD(goal.currentStatus);
                const ytdValue = goal.ytd || autoYTD;
                const successPercentage = calculateSuccessPercentage(
                  ytdValue,
                  goal.currentStatus,
                  goal.target,
                  goal.failure
                );
                
                return (
                  <tr key={index}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{goal.title}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{goal.year}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{goal.half === "H1" ? "نیمسال اول" : "نیمسال دوم"}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{goal.target}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{goal.failure}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{goal.unit}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{goal.weight}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{goal.currentStatus}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <input
                        type="text"
                        value={goal.ytd || ""}
                        onChange={(e) => {
                          const updatedGoals = [...goals];
                          updatedGoals[index].ytd = e.target.value;
                          setGoals(updatedGoals);
                          localStorage.setItem("organizationalGoals", JSON.stringify(updatedGoals));
                        }}
                        placeholder={autoYTD || "دستی"}
                        style={{ 
                          padding: "5px", 
                          border: "1px solid #ccc", 
                          borderRadius: "4px",
                          width: "80px",
                          textAlign: "center"
                        }}
                      />
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <ProgressBar percentage={successPercentage} />
                        <div style={{ textAlign: "center" }}>
                          {successPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        <button 
                          onClick={() => handleEdit(goal.id)} 
                          style={{ 
                            backgroundColor: "#4CAF50", 
                            color: "white", 
                            border: "none", 
                            padding: "6px 10px", 
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >ویرایش</button>
                        <button 
                          onClick={() => handleDelete(goal.id)} 
                          style={{ 
                            backgroundColor: "#f44336", 
                            color: "white", 
                            border: "none", 
                            padding: "6px 10px", 
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >حذف</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}