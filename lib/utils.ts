import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatBytes = (bytes:number) => {
  if (bytes < 1024) {
    return bytes + " Bytes";
  } else if (bytes < 1048576) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1073741824) {
    return (bytes / 1048576).toFixed(2) + " MB";
  } else if (bytes < 1099511627776) {
    return (bytes / 1073741824).toFixed(2) + " GB";
  } else if (bytes < 1125899906842624) {
    return (bytes / 1099511627776).toFixed(2) + " TB";
  } else {
    return (bytes / 1125899906842624).toFixed(2) + " PB";
  }
};

export const timeConvert = (ms: number) => {
if (ms < 0) {
  return "Invalid input";
}

// Convert milliseconds to seconds
let seconds = Math.floor(ms / 1000);

// Convert seconds to minutes
let minutes = Math.floor(seconds / 60);
seconds %= 60;

// Convert minutes to hours
let hours = Math.floor(minutes / 60);
minutes %= 60;

if (hours > 0) {
  return `${hours} hour${hours > 1 ? "s" : ""}${
    minutes > 0 ? ` and ${minutes} minute${minutes > 1 ? "s" : ""} 🚀` : ""
  }`;
} else if (minutes > 0) {
  return `${minutes} minute${minutes > 1 ? "s" : ""}${
    seconds > 0 ? ` and ${seconds} second${seconds > 1 ? "s" : ""} 🚀` : ""
  }`;
}
if (seconds > 1) {
  return `${seconds} second${seconds !== 1 ? "s" : ""} 🚀`;
} else {
  return `instantly ⚡`;
}
}