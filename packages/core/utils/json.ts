export const jsonStringify = (str: any, ...rst: any[]) => {
  return JSON.stringify(
    str,
    (key, value) => {
      if (typeof value === 'function') {
        return `__function__${value.toString()}__function__`;
      }
      return value;
    },
    ...rst
  );
};

export const jsonParse = (str: string) => {
  return JSON.parse(str, (key, value) => {
    if (typeof value === 'string' && value.startsWith('__function__')) {
      const reg = /__function__(?<fun>[\s\S]*)__function__/;
      const funGroup = value.match(reg);

      const fun = funGroup?.groups!.fun;
      if (fun) {
        // eslint-disable-next-line no-new-func
        return new Function(
          `
          const ctx = this
          return ${fun}
          `
        )();
      }
      // eslint-disable-next-line no-new-func
      return new Function();
    }
    return value;
  });
};
