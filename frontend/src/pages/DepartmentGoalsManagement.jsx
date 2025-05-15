import moment from 'jalali-moment'; // ✅ اضافه شده برای تبدیل سال به شمسی
import { useState, useEffect } from "react";

export default function DepartmentGoalsManagement() {
  // States
  const [departments, setDepartments] = useState([]);
  const [organizationalGoals, setOrganizationalGoals] = useState([]);
  const [departmentGoals, setDepartmentGoals] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedOrgGoal, setSelectedOrgGoal] = useState(""); // برای اهداف سازمان
  const [selectedRepoGoal, setSelectedRepoGoal] = useState(""); // ✅ برای اهداف مخزن
  const [selectedYear, setSelectedYear] = useState(moment().jYear()); // ✅ تغییر: سال شمسی
  const [selectedHalf, setSelectedHalf] = useState("H1");
  const [newKeyResult, setNewKeyResult] = useState({
    keyResult: "",
    weight: "",
    target: "",
    failure: "",
    unit: "",
    baseline: "",
    calculationMethod: "",
    definitionOfDone: "",
    monthlyProgress: ["", "", "", "", "", ""],
    ytd: "",
    finalAchievement: "",
    status: ""
  });
  const [selectedFilterDepartment, setSelectedFilterDepartment] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // Track editing state
  const [goalType, setGoalType] = useState("org"); // ✅ نوع هدف: "org" یا "repo"
  
  // ✅ States for goal repository
  const [goalRepoList, setGoalRepoList] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(false);
  
  const baseUrl = process.env.REACT_APP_API_URL;

  // Load data from API
  useEffect(() => {
    // Load departments, organizational goals, and department goals
    Promise.all([
      fetch(`${baseUrl}/departments`).then(res => res.json()),
      fetch(`${baseUrl}/goals`).then(res => res.json()),
      fetch(`${baseUrl}/department-goals`).then(res => res.json())
    ])
      .then(([deptData, goalData, dGoalData]) => {
        setDepartments(deptData);
        setOrganizationalGoals(goalData);
        setDepartmentGoals(dGoalData);
      })
      .catch(err => console.error('❌ خطا در دریافت اطلاعات:', err));
      
    // ✅ Load goal repository
    const fetchGoalRepoList = async () => {
      setLoadingRepo(true);
      try {
        const response = await fetch(`${baseUrl}/goal-repo`); // فرض می‌کنیم endpoint مخزن اهداف در /goal-repo قرار دارد
        const data = await response.json();
        setGoalRepoList(data);
      } catch (error) {
        console.error('خطا در دریافت لیست مخزن اهداف:', error);
      } finally {
        setLoadingRepo(false);
      }
    };
    fetchGoalRepoList();
  }, []);

  // ✅ Handle goal type selection
  useEffect(() => {
    if (goalType === "org") {
      setSelectedRepoGoal("");
    } else {
      setSelectedOrgGoal("");
    }
  }, [goalType]);

  // ✅ Handle repository goal selection
  useEffect(() => {
    if (selectedRepoGoal && goalRepoList.length > 0) {
      const selectedGoal = goalRepoList.find(goal => goal.id === selectedRepoGoal);
      if (selectedGoal) {
        setNewKeyResult(prev => ({
          ...prev,
          keyResult: selectedGoal.title,
          target: selectedGoal.target,
          failure: selectedGoal.failure,
          unit: selectedGoal.unit,
          calculationMethod: selectedGoal.calculationMethod || "",
          definitionOfDone: selectedGoal.definitionOfDone || ""
        }));
      }
    }
  }, [selectedRepoGoal, goalRepoList]);

  // Handle input changes
  const handleKRChange = (e) => {
    setNewKeyResult({ ...newKeyResult, [e.target.name]: e.target.value });
  };

  // Handle monthly progress changes
  const handleMonthChange = (index, value) => {
    const updatedProgress = [...newKeyResult.monthlyProgress];
    updatedProgress[index] = value;
    setNewKeyResult({ ...newKeyResult, monthlyProgress: updatedProgress });
  };

  // Reset form
  const resetForm = () => {
    setNewKeyResult({
      keyResult: "",
      weight: "",
      target: "",
      failure: "",
      unit: "",
      baseline: "",
      calculationMethod: "",
      definitionOfDone: "",
      monthlyProgress: ["", "", "", "", "", ""],
      ytd: "",
      finalAchievement: "",
      status: ""
    });
    setSelectedDepartment("");
    setSelectedOrgGoal("");
    setSelectedRepoGoal(""); // ✅ ریست کردن انتخاب مخزن
    setGoalType("org"); // ✅ بازنشانی نوع هدف
  };

  // Add/edit key result
  const handleAddKeyResult = () => {
    // ✅ اعتبارسنجی: باید یکی از دو گزینه انتخاب شود
    if (!newKeyResult.keyResult || !selectedDepartment || (!selectedOrgGoal && !selectedRepoGoal)) {
      alert("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }
    
    const weightValue = parseFloat(newKeyResult.weight) || 0;
    const totalWeight = departmentGoals
      .filter(goal => goal.department === selectedDepartment)
      .reduce((sum, goal) => sum + (parseFloat(goal.weight) || 0), 0);
      
    if (totalWeight + weightValue > 100) {
      alert(`مجموع وزن‌ها برای دپارتمان "${selectedDepartment}" نمی‌تواند بیشتر از 100% شود.`);
      return;
    }
    
    // ✅ تعیین عنوان هدف بر اساس نوع انتخابی
    const selectedOrgGoalTitle = goalType === "org" 
      ? organizationalGoals.find(g => g.title === selectedOrgGoal)?.title || selectedOrgGoal
      : goalRepoList.find(g => g.id === selectedRepoGoal)?.title || "";
    
    const newEntry = {
      department: selectedDepartment,
      orgGoalTitle: selectedOrgGoalTitle,
      year: selectedYear,
      half: selectedHalf,
      goalType, // ✅ ذخیره نوع هدف
      ...newKeyResult
    };
    
    const url = editingIndex !== null 
      ? `${baseUrl}/department-goals/${editingIndex}` 
      : `${baseUrl}/department-goals`;
      
    fetch(url, {
      method: editingIndex !== null ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    })
    .then(res => {
      if (!res.ok) throw new Error('API Error');
      return fetch(`${baseUrl}/department-goals`).then(res => res.json());
    })
    .then(updatedData => {
      setDepartmentGoals(updatedData);
      resetForm();
      setEditingIndex(null);
    })
    .catch(err => {
      console.error(err);
      alert(`خطا در ${editingIndex !== null ? 'به‌روزرسانی' : 'افزودن'} Key Result`);
    });
  };

  // Delete key result
  const handleDelete = (id) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این مورد را حذف کنید؟")) return;
    
    fetch(`${baseUrl}/department-goals/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const updatedGoals = departmentGoals.filter(goal => goal.id !== id);
          setDepartmentGoals(updatedGoals);
        }
      })
      .catch(err => {
        console.error('❌ خطا در حذف هدف دپارتمان:', err);
        alert('خطا در حذف هدف دپارتمان از سرور');
      });
  };

  // Edit key result
  const handleEdit = (id) => {
    const krToEdit = departmentGoals.find(goal => goal.id === id);
    if (!krToEdit) return;
    
    setSelectedDepartment(krToEdit.department);
    setSelectedYear(krToEdit.year);
    setSelectedHalf(krToEdit.half);
    setGoalType(krToEdit.goalType || "org"); // ✅ تنظیم نوع هدف
    
    // ✅ تنظیم انتخاب مربوط به نوع هدف
    if (krToEdit.goalType === "org") {
      setSelectedOrgGoal(krToEdit.orgGoalTitle);
      setSelectedRepoGoal("");
    } else {
      setSelectedRepoGoal(krToEdit.orgGoalTitle); // ✅ فرض بر این است که orgGoalTitle برای مخزن استفاده می‌شود
      setSelectedOrgGoal("");
    }
    
    setNewKeyResult({
      keyResult: krToEdit.keyResult,
      weight: krToEdit.weight,
      target: krToEdit.target,
      failure: krToEdit.failure,
      unit: krToEdit.unit,
      baseline: krToEdit.baseline,
      calculationMethod: krToEdit.calculationMethod,
      definitionOfDone: krToEdit.definitionOfDone,
      monthlyProgress: krToEdit.monthlyProgress,
      ytd: krToEdit.ytd || "",
      finalAchievement: krToEdit.finalAchievement,
      status: krToEdit.status
    });
    
    setEditingIndex(id);
  };

  // Calculate YTD automatically from last filled month
  const calculateAutoYTD = (monthlyProgress) => {
    return monthlyProgress.reduceRight((last, val) => val !== "" ? val : last, "");
  };

  // Calculate success percentage using YTD if available
  const calculateSuccessPercentage = (ytdValue, monthlyProgress, target, failure) => {
    const valueToUse = ytdValue || calculateAutoYTD(monthlyProgress);
    if (!valueToUse || !target || !failure) return 0;
    
    const valueNum = parseFloat(valueToUse);
    const targetNum = parseFloat(target);
    const failureNum = parseFloat(failure);
    
    if (isNaN(valueNum) || isNaN(targetNum) || isNaN(failureNum)) return 0;
    
    if (targetNum <= failureNum) return 0;
    if (valueNum >= targetNum) return 100;
    if (valueNum <= failureNum) return 0;
    
    return ((valueNum - failureNum) / (targetNum - failureNum)) * 100;
  };

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

  // Filtered goals based on selected department
  const filteredGoals = selectedFilterDepartment
    ? departmentGoals.filter(goal => goal.department === selectedFilterDepartment)
    : departmentGoals;

  return (
    <div style={{ 
      padding: "20px", 
      direction: "rtl", 
      fontFamily: "Vazirmatn, sans-serif",
      maxWidth: "1400px",
      margin: "0 auto"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>مدیریت اهداف دپارتمان‌ها</h1>
      
      {/* Form Section */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "20px",
        marginBottom: "40px"
      }}>
        {/* Left Column */}
        <div style={{ 
          padding: "20px", 
          border: "1px solid #e0e0e0", 
          borderRadius: "10px"
        }}>
          <h2 style={{ marginBottom: "20px" }}>فرم ثبت Key Result</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            >
              <option value="">انتخاب دپارتمان</option>
              {departments.map((d, index) => (
                <option key={index} value={d.name}>{d.name}</option>
              ))}
            </select>
            
            {/* ✅ قسمت انتخاب نوع هدف */}
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <label>
                <input
                  type="radio"
                  checked={goalType === "org"}
                  onChange={() => setGoalType("org")}
                />
                هدف سازمان
              </label>
              <label>
                <input
                  type="radio"
                  checked={goalType === "repo"}
                  onChange={() => setGoalType("repo")}
                />
                از مخزن اهداف
              </label>
            </div>
            
            {/* ✅ انتخاب هدف سازمان یا مخزن بسته به نوع انتخاب */}
            {goalType === "org" ? (
              <select 
                value={selectedOrgGoal}
                onChange={(e) => setSelectedOrgGoal(e.target.value)}
                style={{ 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "5px"
                }}
              >
                <option value="">انتخاب هدف سازمان</option>
                {organizationalGoals.map((g, index) => (
                  <option key={index} value={g.title}>{g.title}</option>
                ))}
              </select>
            ) : (
              <select 
                value={selectedRepoGoal}
                onChange={(e) => setSelectedRepoGoal(e.target.value)}
                disabled={loadingRepo}
                style={{ 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "5px"
                }}
              >
                <option value="">انتخاب هدف از مخزن</option>
                {goalRepoList.map(goal => (
                  <option key={goal.id} value={goal.id}>{goal.name}</option>
                ))}
              </select>
            )}
            
            <div style={{ display: "flex", gap: "10px" }}>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
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
                value={selectedHalf}
                onChange={(e) => setSelectedHalf(e.target.value)}
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
              name="keyResult"
              placeholder="عنوان Key Result *"
              value={newKeyResult.keyResult}
              onChange={handleKRChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            
            <input 
              name="weight"
              placeholder="وزن (%)"
              value={newKeyResult.weight}
              onChange={handleKRChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            
            <input 
              name="target"
              placeholder="تارگت"
              value={newKeyResult.target}
              onChange={handleKRChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            
            <input 
              name="unit"
              placeholder="واحد"
              value={newKeyResult.unit}
              onChange={handleKRChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div style={{ 
          padding: "20px", 
          border: "1px solid #e0e0e0", 
          borderRadius: "10px"
        }}>
          <h2 style={{ marginBottom: "20px" }}>اطلاعات تکمیلی</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input 
              name="failure"
              placeholder="عدم دستیابی"
              value={newKeyResult.failure}
              onChange={handleKRChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            
            <input 
              name="baseline"
              placeholder="مبنا"
              value={newKeyResult.baseline}
              onChange={handleKRChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            
            <input 
              name="calculationMethod"
              placeholder="نحوه محاسبه"
              value={newKeyResult.calculationMethod}
              onChange={handleKRChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px"
              }}
            />
            
            <textarea 
              name="definitionOfDone"
              placeholder="تعریف از انجام شده"
              value={newKeyResult.definitionOfDone}
              onChange={handleKRChange}
              style={{ 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "5px",
                minHeight: "100px"
              }}
            />
            
            <div style={{ marginTop: "10px" }}>
              <div style={{ marginBottom: "10px" }}>پیشرفت ماهانه</div>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(6, 1fr)", 
                gap: "10px"
              }}>
                {newKeyResult.monthlyProgress.map((progress, index) => (
                  <input
                    key={index}
                    placeholder={`ماه ${index + 1}`}
                    value={progress}
                    onChange={(e) => handleMonthChange(index, e.target.value)}
                    style={{ 
                      padding: "8px", 
                      border: "1px solid #ccc", 
                      borderRadius: "5px"
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button 
                onClick={handleAddKeyResult} 
                style={{ 
                  flex: 1,
                  backgroundColor: "#223F98", 
                  color: "white", 
                  padding: "10px", 
                  border: "none", 
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              >
                ذخیره Key Result
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Department Filter */}
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <label htmlFor="departmentFilter" style={{ marginLeft: "10px" }}>فیلتر بر اساس دپارتمان:</label>
        <select
          id="departmentFilter"
          value={selectedFilterDepartment}
          onChange={(e) => setSelectedFilterDepartment(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "14px"
          }}
        >
          <option value="">همه دپارتمان‌ها</option>
          {departments.map((d, index) => (
            <option key={index} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>
      
      {/* Results Table */}
      <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>لیست Key Results</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          marginTop: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>دپارتمان</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>هدف سازمان</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>نتایج کلیدی</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>وزن (%)</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>تارگت</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>عدم دستیابی</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>واحد</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>پیشرفت ماهانه</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>YTD</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>درصد موفقیت</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredGoals.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                  هیچ داده‌ای یافت نشد
                </td>
              </tr>
            ) : (
              filteredGoals.map((kr, index) => {
                const autoYTD = calculateAutoYTD(kr.monthlyProgress);
                const ytdValue = kr.ytd || autoYTD;
                const successPercentage = calculateSuccessPercentage(
                  ytdValue, 
                  kr.monthlyProgress, 
                  kr.target, 
                  kr.failure
                );
                
                return (
                  <tr key={index}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{kr.department}</td>
                    
                    {/* ✅ نمایش عنوان هدف بر اساس نوع انتخابی */}
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {kr.orgGoalTitle}
                    </td>
                    
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{kr.keyResult}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{kr.weight}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{kr.target}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{kr.failure}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{kr.unit}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {kr.monthlyProgress.filter(Boolean).length > 0 ? (
                        <div style={{ display: "flex", gap: "5px" }}>
                          {kr.monthlyProgress.filter(Boolean).map((m, idx) => (
                            <span key={idx} style={{ 
                              padding: "3px 6px",
                              backgroundColor: "#f0f0f0",
                              borderRadius: "4px"
                            }}>{m}</span>
                          ))}
                        </div>
                      ) : "-"}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <input
                        type="text"
                        value={kr.ytd || ""}
                        onChange={(e) => {
                          const updatedGoals = [...departmentGoals];
                          updatedGoals.find(g => g === kr).ytd = e.target.value;
                          setDepartmentGoals(updatedGoals);
                          localStorage.setItem("departmentGoals", JSON.stringify(updatedGoals));
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
                          onClick={() => handleEdit(kr.id)}
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
                          onClick={() => handleDelete(kr.id)} 
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