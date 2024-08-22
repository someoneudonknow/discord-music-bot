export default (number: number): string => {
  const numStr: string = number.toString();
  const lastDigit: number = parseInt(numStr.charAt(numStr.length - 1));
  let postFix: string = "";

  if (lastDigit === 1) {
    postFix = "st";
  } else if (lastDigit === 2) {
    postFix = "nd";
  } else if (lastDigit === 3) {
    postFix = "rd";
  } else {
    postFix = "th";
  }

  return `${numStr}${postFix}`;
};
