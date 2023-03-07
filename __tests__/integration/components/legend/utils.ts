export { Category, Continuous } from '../../../../src/ui/legend';
export { CategoryItem } from '../../../../src/ui/legend/category/item';
export { CategoryItems } from '../../../../src/ui/legend/category/items';
export { smooth } from '../../../../src/ui/marker/symbol';

export const createItemData = (num: number) => {
  return new Array(num).fill(0).map((d: any, i: number) => ({
    id: `${i + 1}`,
    label: `${i + 1}-label`,
    value: `${i + 1}-value`,
    extInfo: 'further text',
  }));
};
