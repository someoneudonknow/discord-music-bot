"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (type, message) => {
    const prefix = {
        info: "[INFO]",
        error: "[ERROR]",
        warn: "[WARNNING]",
    };
    console[type](`${prefix[type]} ${message}`);
};
