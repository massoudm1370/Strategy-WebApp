import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-jalaali";

export default function JalaliLikeDatePicker() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div style={{ direction: "rtl", padding: "50px" }}>
      <h1>تست تاریخ انتخابی</h1>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy/MM/dd"
      />
      <p>تاریخ انتخاب شده (میلادی): {moment(selectedDate).format("YYYY/MM/DD")}</p>
      <p>تاریخ شمسی : {moment(selectedDate).format("jYYYY/jMM/jDD")}</p>
    </div>
  );
}
