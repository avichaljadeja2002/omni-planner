import { Field } from "@/components/Types";

// export const IPAddr = "http://34.204.83.156:8080" // For AWS
export const IPAddr = "http://137.112.196.212:8080" // For local testing on laptop

export const repeatingData = [
  { label: 'Daily', value: 1 },
  { label: 'Weekly', value: 2 },
  { label: 'Monthly', value: 3 },
  { label: 'Yearly', value: 4 },
];

export const roundTimeQuarterHour = (): Date => {
  const timeToReturn = new Date();

  timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
  timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
  timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15);
  return timeToReturn;
}

export const getEventIcon = (eventType: string) => {
  switch (eventType.toLowerCase()) {
    case 'finance':
      return 'wallet-outline';
    case 'calendar':
      return 'calendar-outline';
    case 'health':
      return 'fitness-outline';
    case 'meal':
      return 'fast-food-outline';
    default:
      return 'help-outline';
  }
};

export const getPageName = (page: string) => {
  switch (page) {
    case 'mainFinanceTracker':
      return 'viewFinanceEvents';
    case 'mainHealthTracker':
      return 'viewHealthEvents';
    case 'mainMealTracker':
      return 'viewMealEvents';
    case 'mainCalendarEvents':
      return 'viewCalendarEvents';
    default:
      return 'Home';
  }
};

export const getPageFromEventType = (eventType: any) => {
  switch (eventType) {
    case 'health':
      return 'mainHealthTracker';
    case 'meal':
      return 'mainMealTracker';
    case 'calendar':
      return 'mainCalendarEvents';
    case 'finance':
      return 'mainFinanceTracker';
    default:
      return eventType;
  }
}


export const calendarFields: Field[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_time', label: 'Time', type: 'time' },
  { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
];

export const healthFields: Field[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_time', label: 'Time', type: 'time' },
  { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
];

export const mealFields: Field[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_time', label: 'Time', type: 'time' },
  { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
  { name: 'ingredients', label: 'Ingredients', type: 'multi-select' },
];

export const financeFields: Field[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_time', label: 'Time', type: 'time' },
  { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
  { name: 'money', label: 'Money', type: 'number' }
];