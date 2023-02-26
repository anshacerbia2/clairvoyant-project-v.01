import { dayShortNames, monthFullNames } from "../consts";

export const getTotalDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstLastDayIndexInMonth = (
  year: number,
  month: number
): number[] => {
  const currentDate = new Date();
  const firstDayIndex = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const lastDayIndex = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDay();
  return [firstDayIndex, lastDayIndex];
};

export const getLastDateLastMonth = (year: number, month: number): number => {
  return new Date(2023, new Date().getMonth(), 0).getDate();
};

export const getLastDayIndexLastMonth = (
  year: number,
  month: number
): number => {
  return new Date(2023, new Date().getMonth(), 0).getDay();
};

export const getDayList = (year: number, month: number) => {
  const totalDays = getTotalDaysInMonth(year, month);
  console.log(totalDays, year, month);

  const [firstDayIndex, lastDayIndex] = getFirstLastDayIndexInMonth(
    year,
    month
  );
  const lastDateLastMonth = getLastDateLastMonth(year, month);
  const dayList: number[] = [];

  // Add date last month
  for (let l = lastDateLastMonth; l > lastDateLastMonth - firstDayIndex; l--) {
    dayList.push(l);
  }
  // Add date current month
  for (let c = 1; c <= totalDays; c++) {
    dayList.push(c);
  }
  // Add date next month
  for (let n = 1; n <= 6 - lastDayIndex; n++) {
    dayList.push(n);
  }

  return dayList;
};
