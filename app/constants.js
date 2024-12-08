// export const IPAddr = "http://34.204.83.156:8080" // For AWS
export const IPAddr = "http://127.0.0.1:8080" // For local testing on laptop
export const logging = false;

export const repeatingData = [
    { label: 'Daily', value: '1' },
    { label: 'Weekly', value: '2' },
    { label: 'Monthly', value: '3' },
    { label: 'Yearly', value: '4' },
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