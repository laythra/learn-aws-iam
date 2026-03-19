const storage = {
  getKey: (key: string, defaultVal: string = '') => {
    return window.localStorage.getItem(key) || defaultVal;
  },
  setKey: (key: string, value: string) => {
    window.localStorage.setItem(key, value);
  },
  removeKey: (key: string) => {
    window.localStorage.removeItem(key);
  },
};

export default storage;
