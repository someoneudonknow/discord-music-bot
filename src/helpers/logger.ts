export default (type: "info" | "error" | "warn", message: string): void => {
  const prefix = {
    info: "[INFO]",
    error: "[ERROR]",
    warn: "[WARNNING]",
  };
  console[type](`${prefix[type]} ${message}`);
};
