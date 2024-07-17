const parseObject = <T = Record<string, unknown>>(object: T): T => {
  return structuredClone(object);
};

export default parseObject;
