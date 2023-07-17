export const useTimeRemaining = (endTime: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const remainingSeconds = endTime - currentTime;

  return remainingSeconds;
};
