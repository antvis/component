export { Category, Continuous } from '@/ui/legend';
export { CategoryItem } from '@/ui/legend/category/item';
export { CategoryItems } from '@/ui/legend/category/items';
export { smooth } from '@/ui/marker/symbol';

export const createItemCfg = (args: any) => {
  return {
    width: 100,
    height: 30,
    label: 'label',
    value: 'value',
    markerFill: 'red',
    labelFill: 'red',
    valueFill: 'green',
    backgroundFill: '#f7f7f7',
    ...args,
  };
};
