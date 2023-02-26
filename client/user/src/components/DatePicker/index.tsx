import React, { useState } from "react";
import { getDayList } from "./utils";

type IDatePickerProps = {
  currentMonth: number;
  currentYear: number;
};
// {}: IDatePickerProps
export default function DatePicker() {
  const [date, setDate] = useState<IDatePickerProps>({
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
  });
  console.log(date);

  return (
    <div style={{ position: "absolute", top: "-300px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "repeat(7, 1fr)",
          width: 300,
          height: 300,
        }}
      >
        {getDayList(date.currentYear, date.currentMonth).map((date) => {
          return (
            <div>
              <div>{date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
