export interface Location {
  longitude: number,
  latitude: number
}

export interface PathElement extends Location {
  timestamp: Date
}

export interface ScheduleDto {
  // Pattern - ^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$
  start: string,

  // Pattern - ^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$
  end: string
}

export type ScheduleKey = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";
export type Schedule = Record<ScheduleKey, ScheduleDto>;

export const scheduleKeyFromNum: Record<number, ScheduleKey> = {
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY"
};

export const getEmptySchedule = () => ({
  "MONDAY": { start: "", end: "" },
  "TUESDAY": { start: "", end: "" },
  "WEDNESDAY": { start: "", end: "" },
  "THURSDAY": { start: "", end: "" },
  "FRIDAY": { start: "", end: "" }
}) as Schedule;

export const scheduleToDate = (key: string) => {
  let day = 0;

  for (let i = 1; i < 6; ++i) {
    if (scheduleKeyFromNum[i] === key) {
      day = i;
      i = 6;
    }
  }

  if (day === 0) {
    return null;
  }

  const today = new Date();
  const numOfDay = today.getDay();
  const diff = day - numOfDay;
  return new Date(new Date().setDate(today.getDate() + diff - (numOfDay === 0 ? 7 : 0)));
};

export const toScheduleKey: (x: string) => ScheduleKey = (x: string) => {
  switch (x) {
    case "MONDAY":
      return "MONDAY";
    case "TUESDAY":
      return "TUESDAY";
    case "WEDNESDAY":
      return "WEDNESDAY";
    case "THURSDAY":
      return "THURSDAY";
    default:
      return "FRIDAY";
  }
};

export const formatSchedule = (x: Readonly<Schedule>) => {
  const copy: Schedule = { ...x };

  for (const index in x) {
    const tmp = copy[toScheduleKey(index)];

    if (!tmp.start || !tmp.end) {
      delete copy[toScheduleKey(index)];
    }
  }

  return copy;
};

export const loadSchedule = (x: Readonly<Record<string, ScheduleDto>>) => {
  const copy: Schedule = getEmptySchedule();

  for (const index in x) {
    const tmp = x[toScheduleKey(index)];
    
    if (tmp.start && tmp.end) {
      copy[toScheduleKey(index)] = tmp;
    }
  }

  return copy;
};
