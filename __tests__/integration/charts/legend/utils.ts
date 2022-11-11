export { Category, Continuous } from '../../../../src/ui/legend';
export { CategoryItem } from '../../../../src/ui/legend/category/item';
export { CategoryItems } from '../../../../src/ui/legend/category/items';
export { smooth } from '../../../../src/ui/marker/symbol';

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
