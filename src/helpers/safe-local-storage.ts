const safeLocalStorage = {
  setItem: (key: string, value: string) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  getItem: (key: string) => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
  },
  removeItem: (key: string) => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  },
  clear: () => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  },
};

export default safeLocalStorage;
