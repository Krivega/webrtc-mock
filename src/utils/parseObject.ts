const parseObject = <T = Record<string, unknown>>(object: T): T => {
  // eslint-disable-next-line unicorn/prefer-structured-clone
  return JSON.parse(JSON.stringify(object)) as T;
};

export default parseObject;
