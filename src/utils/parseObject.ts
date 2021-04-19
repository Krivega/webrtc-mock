const parseObject = (obj: Object) => {
  return JSON.parse(JSON.stringify(obj));
};

export default parseObject;
