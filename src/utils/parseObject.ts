const parseObject = <T = Record<string, unknown>>(object: T): T => {
  return JSON.parse(JSON.stringify(object)) as T;
};

export default parseObject;
