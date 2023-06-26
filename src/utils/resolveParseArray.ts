// @ts-nocheck
import parseObject from './parseObject';

const resolveParseArray = <T>(prop: string) => {
  const parseArray = (array: T[]) => {
    const parsedArray: T[] = array.map(parseObject);

    parsedArray.sort((a, b) => {
      return parseFloat(a[prop]) - parseFloat(b[prop]);
    });

    return parsedArray;
  };

  return parseArray;
};

export default resolveParseArray;
