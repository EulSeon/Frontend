function convertSecondsToMinute(seconds: number) {
  let min = String(Math.floor(seconds / 60));
  let sec = String(Math.floor(seconds % 60));

  if (min.length !== 2) {
    min = '0' + min;
  }
  if (sec.length !== 2) {
    sec = '0' + sec;
  }

  return { min, sec };
}

export default convertSecondsToMinute;
