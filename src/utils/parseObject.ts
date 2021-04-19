const parseObject = (obj: Record<string, unknown>) => {
  return JSON.parse(JSON.stringify(obj));
};

export default parseObject;
