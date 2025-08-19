import parseObject from './parseObject';

const resolveParseArray = <T = Record<string, unknown>>(property: keyof T) => {
  const parseArray = (array: T[]) => {
    const parsedArray: T[] = array.map((item) => {
      return parseObject(item);
    });

    parsedArray.sort((a, b) => {
      // @ts-ignore
      return Number.parseFloat(a[property]) - Number.parseFloat(b[property]);
    });

    return parsedArray;
  };

  return parseArray;
};

export default resolveParseArray;
