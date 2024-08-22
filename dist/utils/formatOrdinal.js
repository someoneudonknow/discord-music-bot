"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (number) => {
    const numStr = number.toString();
    const lastDigit = parseInt(numStr.charAt(numStr.length - 1));
    let postFix = "";
    if (lastDigit === 1) {
        postFix = "st";
    }
    else if (lastDigit === 2) {
        postFix = "nd";
    }
    else if (lastDigit === 3) {
        postFix = "rd";
    }
    else {
        postFix = "th";
    }
    return `${numStr}${postFix}`;
};
