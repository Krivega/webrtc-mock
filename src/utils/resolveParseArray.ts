// @ts-nocheck
import flow from 'lodash/flow';
import curryRight from 'lodash/curryRight';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import property from 'lodash/property';
import parseObject from './parseObject';

const resolveParseArray = <T = any>(prop: string) => {
  const parseArray = flow(
    parseObject,
    (arr) => {
      return sortBy(arr, property(prop));
    },
    // @ts-ignore
    curryRight(map)(parseObject)
  ) as (array: T[]) => T[];

  return parseArray;
};

export default resolveParseArray;
