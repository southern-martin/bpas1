import fs from "fs";
import path from "path";

const LOG_FILE = "/tmp/bpas-backend.log";

function write(level, message) {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch {
    // Fallback to console if file write fails
    // eslint-disable-next-line no-console
    console.error("Failed to write log file", message);
  }
}

export function logInfo(msg) {
  // eslint-disable-next-line no-console
  console.log(msg);
  write("info", msg);
}

export function logError(msg) {
  // eslint-disable-next-line no-console
  console.error(msg);
  write("error", msg);
}
