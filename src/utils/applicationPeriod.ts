// Application period is open from April (3) to September (8)
const START_MONTH = 3; // April (0-based, i.e., 0 = January, 3 = April)
const END_MONTH = 8;   // September (0-based, i.e., 0 = January, 8 = September)

export const isApplicationPeriod = (): boolean => {
  const currentMonth = new Date().getMonth();
  return currentMonth >= START_MONTH && currentMonth <= END_MONTH;
};

export const getNextApplicationPeriod = (): string => {
  const currentMonth = new Date().getMonth();
  
  // If we're in the application period, return the current month
  if (isApplicationPeriod()) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[currentMonth];
  }
  
  // If we're before the application period, return April
  if (currentMonth < START_MONTH) {
    return 'April';
  }
  
  // If we're after the application period, return April (next year)
  return 'April';
};

export const getApplicationMessage = (): string => {
  if (isApplicationPeriod()) {
    return "Applications are currently open! Join our team now.";
  }
  
  const currentMonth = new Date().getMonth();
  if (currentMonth < START_MONTH) {
    return `Applications are currently closed. Next application period opens in April.`;
  } else {
    return `Applications are currently closed. Next application period opens in April.`;
  }
}; 