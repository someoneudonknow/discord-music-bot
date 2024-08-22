export default (time: string = "0"): number => {
  if (typeof time !== "string" || !/^\d{1,2}(:\d{1,2}){0,2}$/.test(time)) {
    return 0;
  }

  const parts = time.split(":").map(Number).reverse();
  const [seconds = 0, minutes = 0, hours = 0] = parts;

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
};
