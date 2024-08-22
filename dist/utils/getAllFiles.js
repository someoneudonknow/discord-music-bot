"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
exports.default = (dir, folderOnly = false) => {
    const fileNames = [];
    const files = (0, fs_1.readdirSync)(dir, { withFileTypes: true });
    for (const file of files) {
        const path = (0, path_1.join)(dir, file.name);
        if (folderOnly) {
            if (file.isDirectory()) {
                fileNames.push(path);
            }
        }
        else {
            if (file.isFile()) {
                fileNames.push(path);
            }
        }
    }
    return fileNames;
};
