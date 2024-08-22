import { readdirSync } from "fs";
import { join } from "path";

export default (dir: string, folderOnly: boolean = false): string[] => {
  const fileNames: string[] = [];
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const path = join(dir, file.name);

    if (folderOnly) {
      if (file.isDirectory()) {
        fileNames.push(path);
      }
    } else {
      if (file.isFile()) {
        fileNames.push(path);
      }
    }
  }

  return fileNames;
};
