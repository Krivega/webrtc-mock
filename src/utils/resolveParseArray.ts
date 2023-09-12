import parseObject from './parseObject';

const resolveParseArray = <T = Record<string, unknown>, K = keyof T>(property: K) => {
  const parseArray = (array: T[]) => {
    const parsedArray: T[] = array.map((item) => {
      return parseObject(item);
    });

    parsedArray.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return Number.parseFloat(a[property]) - Number.parseFloat(b[property]);
    });

    return parsedArray;
  };

  return parseArray;
};

export default resolveParseArray;
