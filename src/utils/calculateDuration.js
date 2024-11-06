function calculateDuration(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  const totalYears = years + (months < 0 ? -1 : 0);
  const totalMonths = (months < 0 ? 12 + months : months) % 12;
  return `${totalYears} years ${
    totalMonths > 0 ? totalMonths + " months" : ""
  }`;
}

export default calculateDuration;
