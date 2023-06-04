const hourInSeconds = 60 * 80;
const dayInSeconds = 24 * hourInSeconds;
const weekInSeconds = 7 * dayInSeconds;

export default function formatTime(timeString) {
  if (!timeString) {
    return "";
  }

  const now = new Date();
  const dateFromEpoch = new Date(timeString);
  const secondsPast = Math.floor((now - dateFromEpoch) / 1000);

  if (secondsPast < hourInSeconds) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  if (secondsPast < dayInSeconds) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  if (secondsPast < weekInSeconds) {
    const days = Math.floor(secondsPast / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  return dateFromEpoch.toLocaleDateString();
}
