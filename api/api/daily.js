export default function handler(req, res) {
  const now = new Date();
  const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  const todayIndex = daysSinceEpoch % 20;
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);
  const secondsUntilMidnight = Math.floor((tomorrow - now) / 1000)
