const storagePrefix = 'learn_aws_iam_';

const storage = {
  getKey: (key: string, defaultVal: string = '') => {
    return window.localStorage.getItem(`${storagePrefix}${key}` as string) || defaultVal;
  },
  setKey: (key: string, value: string) => {
    window.localStorage.setItem(`${storagePrefix}${key}`, value);
  },
  removeKey: (key: string) => {
    window.localStorage.removeItem(`${storagePrefix}${key}`);
  },
};

export default storage;
