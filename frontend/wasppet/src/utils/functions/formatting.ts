import { VAR } from "../variables";


export const formatDate = (date: string) => {
  const JSdate = new Date(date);
  const formattedDate = new Intl.DateTimeFormat("en-US").format(JSdate);

  return formattedDate;
};

export const formatDateTime = (date: string) => {
  const JSdate = new Date(`${date}T00:00:00`);
  const formattedDateTime = JSdate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    //hour: "2-digit",
    //minute: "2-digit",
    //hour12: false, // Use the 24 hours format
  });

  return formattedDateTime;
};

export const relativeDateFormat = (dateString: string) => {
  const date = VAR.DateTime.fromISO(dateString);
  const now = VAR.DateTime.now();
  const relativeDate = date.toRelative({base:now})
  return relativeDate;
}
