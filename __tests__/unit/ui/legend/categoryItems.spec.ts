import { CategoryItems } from '../../../../src/ui/legend/categoryItems';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(800);

describe('CategoryItems', () => {
  const items = Array(10)
    .fill(null)
    .map((_, idx) => ({
      id: `${idx}`,
      itemMarker: { symbol: 'circle', size: 10, style: { default: { fill: 'red' } } },
      itemName: { content: `Item-${idx} ${Math.random()}`, spacing: 4 },
    }));

  it('new CategoryItems({..}) should draw a category items group.', () => {
    const group = new CategoryItems({
      style: {
        orient: 'horizontal',
        items,
        maxWidth: 220,
      },
    });

    canvas.appendChild(group);
    expect(group.querySelector('.page-button')!.style.visibility).toBe('visible');

    group.style.pageButtonSize = 10;
    group.style.pageInfoWidth = 40;
    group.style.pageSpacing = 8;
    // @ts-ignore
    expect(group.clipView.getLocalBounds().halfExtents[0] * 2).toBe(220 - 40 - 10 * 2 - 8);
  });

  it('new CategoryItems({..}) should draw a vertical category items group.', () => {
    const group = new CategoryItems({
      style: {
        y: 50,
        orient: 'vertical',
        items,
        maxHeight: 116,
        pageTextStyle: { fill: 'red' },
        pageButtonStyle: { default: { fill: 'red' }, disabled: { fill: 'pink' } },
      },
    });

    canvas.appendChild(group);

    group.style.pageButtonSize = 10;
    group.style.pageInfoWidth = 40;
    group.style.pageSpacing = 8;
    // @ts-ignore
    expect(group.clipView.getLocalBounds().halfExtents[1] * 2).toBe(116 - 10 - 8);

    group.style.pageFormatter = (c: number, t: number) => `${c} // ${t}`;
    group.style.pageTextStyle = { fill: 'black' };

    expect(group.querySelector('.page-info')!.style.text).toBe('1 // 2');

    group.style.orient = 'horizontal';
    expect(group.querySelector('.page-button')!.style.visibility).not.toBe('visible');
    group.destroy();
  });

  it('new CategoryItems({..}) support autoWrap in horizontal orient.', () => {
    const group = new CategoryItems({
      style: {
        y: 50,
        orient: 'horizontal',
        items,
        maxHeight: 116,
        maxWidth: 320,
        autoWrap: true,
        maxRows: 3,
      },
    });

    canvas.appendChild(group);

    group.style.orient = 'horizontal';
    expect(group.querySelectorAll('.page-button')![0].style.symbol).toBe('up');
    expect(group.querySelectorAll('.page-button')![1].style.symbol).toBe('down');
    group.destroy();
  });

  it('new CategoryItems({..}) do not support autoWrap in vertical orient.', () => {
    const group = new CategoryItems({
      style: {
        y: 140,
        orient: 'vertical',
        items,
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
