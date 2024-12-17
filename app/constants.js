// export const IPAddr = "http://34.204.83.156:8080" // For AWS
export const IPAddr = "http://137.112.196.177:8080" // For local testing on laptop
export const logging = true;

export const repeatingData = [
    { label: 'Daily', value: 1 },
    { label: 'Weekly', value: 2 },
    { label: 'Monthly', value: 3 },
    { label: 'Yearly', value: 4 },
  ];

export  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);

    if (hour === 0) {
      return `12:${minutes} AM`;
    } else if (hour < 12) {
      return `${hour}:${minutes} AM`;
    } else if (hour === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hour - 12}:${minutes} PM`;
    }
  };

export const getPageName = (page) => {
    switch(page){
        case 'finance':
            return 'Finance';
        case 'healthTracker':
            return 'Health';
        case 'mealTracker':
            return 'Meal';
        case 'calendarEvents':
            return 'Calendar';
        default:
            return 'Home';
    }
}