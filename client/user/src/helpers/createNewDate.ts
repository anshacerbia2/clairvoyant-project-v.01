export const createNewDate = (
  year: number,
  month: number,
  date: number
): Date => {
  return new Date(year, month, date);
};

export const dateToStringWithSlash = (date: Date): string => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
