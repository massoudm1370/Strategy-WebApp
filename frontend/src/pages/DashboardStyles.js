// DashboardStyles.js
const styles = {
  container: {
    fontFamily: "Vazirmatn, sans-serif",
    direction: "rtl",
    padding: "2rem",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem"
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ddd"
  },
  actions: {
    display: "flex",
    gap: "1rem"
  },
  exportButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#223F98",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  searchInput: {
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  filterBar: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    marginBottom: "2rem"
  },
  kpiSection: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    marginBottom: "2rem"
  },
  kpiCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    textAlign: "center"
  },
  kpiIcon: {
    fontSize: "2rem"
  },
  kpiContent: {
    marginTop: "0.5rem"
  },
  kpiTitle: {
    fontSize: "1.1rem"
  },
  progressBar: {
    width: "100%",
    height: "10px",
    margin: "0.5rem 0",
    backgroundColor: "#e0e0e0"
  },
  circularProgress: {
    position: "relative",
    width: "150px",
    height: "150px",
    margin: "1rem",
    textAlign: "center"
  },
  circularLabel: {
    fontSize: "0.9rem",
    marginTop: "0.5rem"
  },
  circularValue: {
    fontSize: "1.2rem",
    fontWeight: "bold"
  },
  goalItem: {
    margin: "1rem 0",
    position: "relative"
  },
  actionItem: {
    display: "flex",
    alignItems: "center",
    margin: "1rem 0"
  },
  statusDot: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    marginRight: "1rem"
  },
  actionInfo: {
    flex: 1
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    margin: "1rem 0"
  },
  userAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    marginRight: "1rem"
  },
  activityContent: {
    flex: 1
  },
  strategySection: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "2rem"
  },
  strategyCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  cardTitle: {
    color: "#223F98",
    marginBottom: "1rem"
  },
  departmentStatus: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginTop: "2rem"
  },
  departmentTable: {
    width: "100%",
    borderCollapse: "collapse"
  },
  sectionTitle: {
    color: "#223F98",
    marginBottom: "1.5rem"
  },
exportModal: {
  position: "absolute",  // ✅ نمایش زیر دکمه
  top: "50px",           // ✅ فاصله از بالا (متناسب با موقعیت دکمه تنظیم کنید)
  right: "10px",         // ✅ چسبیده به سمت راست دکمه
  background: "#fff",
  border: "1px solid #ddd",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  borderRadius: "4px",
  zIndex: 1000,
  padding: "10px"
}
,
  modalButton: {
    display: "block",
    width: "100%",
    padding: "0.5rem",
    margin: "0.5rem 0",
    cursor: "pointer"
  }
};

export default styles;
