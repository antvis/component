import { CategoryItems, CategoryItemsStyleProps } from '../../../../src/ui/legend/categoryItems';
import { createCanvas } from '../../../utils/render';
import { LEGEND_ITEMS } from './data';

const canvas = createCanvas(800);

const ITEMS: CategoryItemsStyleProps['items'] = LEGEND_ITEMS.map((d) => {
  return {
    ...d,
    value: d,
    itemMarker: { symbol: 'circle', style: { fill: d.color }, size: 8 },
    itemName: { content: d.name },
  };
});

describe('CategoryItems', () => {
  it('new CategoryItems({..}) should draw a category items group.', () => {
    const group = new CategoryItems({
      style: {
        orient: 'horizontal',
        items: ITEMS,
        maxWidth: 220,
        pageButtonSize: 10,
        pageSpacing: 8,
      },
    });

    canvas.appendChild(group);
    const buttonGroup = group.querySelector('.page-button-group')! as any;
    expect(buttonGroup.style.visibility).toBe('visible');

    // @ts-ignore
    expect(group.clipView.getLocalBounds().halfExtents[0] * 2).toBe(
      220 - 8 - buttonGroup.getLocalBounds().halfExtents[0] * 2 - 1
    );
    group.destroy();
  });

  it('new CategoryItems({..}) should draw a vertical category items group.', () => {
    const group = new CategoryItems({
      style: {
        y: 50,
        orient: 'vertical',
        items: ITEMS,
        maxHeight: 116,
        pageTextStyle: { fill: 'red' },
        pageSpacing: 8,
        pageButtonSize: 10,
      },
    });

    canvas.appendChild(group);
    const buttonGroup = group.querySelector('.page-button-group')! as any;
    // @ts-ignore
    expect(group.clipView.getLocalBounds().halfExtents[1] * 2).toBe(
      116 - 8 - buttonGroup.getLocalBounds().halfExtents[1] * 2
    );

    group.update({ pageFormatter: (c: number, t: number) => `${c} // ${t}`, pageTextStyle: { fill: 'black' } });
    expect(group.querySelector('.page-info')!.style.text).toBe('1 // 3');

    group.update({ orient: 'horizontal' });
    expect(buttonGroup.style.visibility).not.toBe('visible');
    group.destroy();
  });

  it('new CategoryItems({..}) support autoWrap in horizontal orient.', () => {
    const group = new CategoryItems({
      style: {
        y: 50,
        orient: 'horizontal',
        items: ITEMS,
        maxHeight: 20,
        maxWidth: 320,
        autoWrap: true,
        // maxRows: 3,
      },
    });

    canvas.appendChild(group);

    expect(group.querySelectorAll('.page-button')![0].style.symbol).toBe('up');
    expect(group.querySelectorAll('.page-button')![1].style.symbol).toBe('down');
    group.destroy();
  });

  it('new CategoryItems({..}) do not support autoWrap in vertical orient.', () => {
    const group = new CategoryItems({
      style: {
        y: 140,
        orient: 'vertical',
        items: ITEMS,
        maxHeight: 116,
        maxWidth: 320,
        autoWrap: true,
      },
    });

    canvas.appendChild(group);

    expect(group.querySelectorAll('.page-button')![0].style.symbol).toBe('up');
    expect(group.querySelectorAll('.page-button')![1].style.symbol).toBe('down');
    group.destroy();
  });
});
