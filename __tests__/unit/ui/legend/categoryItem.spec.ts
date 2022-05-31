import { CategoryItem } from '../../../../src/ui/legend/categoryItem';
import { createCanvas } from '../../../utils/render';
import { delay } from '../../../utils/delay';

const canvas = createCanvas(500, 'svg', true);

const categoryItem = new CategoryItem({
  style: {
    x: 30,
    y: 30,
    state: 'selected',
    id: '1',
    padding: 2,
    itemMarker: {
      size: 8,
      symbol: 'circle',
      style: {
        fill: 'red',
        active: {
          opacity: 0.9,
          fill: 'green',
        },
        disabled: {
          fill: 'green',
        },
      },
    },
    itemName: {
      style: {
        fontSize: 12,
        opacity: 1,
        textBaseline: 'middle',
        fill: 'red',
        active: {
          fontSize: 12,
          opacity: 0.9,
          fill: 'green',
        },
        disabled: {
          fill: 'green',
        },
      },
      spacing: 6,
      content: 'name',
    },
    itemValue: {
      style: {
        fontSize: 12,
        opacity: 1,
        fill: 'red',
        active: {
          fontSize: 12,
          opacity: 0.9,
          fill: 'green',
        },
        disabled: {
          fill: 'green',
        },
      },
      spacing: 4,
      content: 'value',
    },
    backgroundStyle: {
      fill: 'rgba(245, 0, 31, 0.1)',
      active: {
        fill: 'rgba(67, 195, 119, 0.1)',
      },
      disabled: {
        fill: 'rgba(245, 0, 31, 0.1)',
      },
    },
  },
});

canvas.appendChild(categoryItem);

describe('CategoryItem', () => {
  it('new CategoryItem({}) returns a categoryItem with default style.', () => {
    const marker = categoryItem.querySelector('.legend-item-marker')! as any;
    expect(marker.attr('fill')).toBe('red');
    expect(marker.attr('size')).toBe(8);
    const nameShape = categoryItem.querySelector('.legend-item-name')! as any;
    const valueShape = categoryItem.querySelector('.legend-item-value')! as any;
    expect(nameShape.attr('fill')).toBe('red');
    expect(valueShape.attr('fill')).toBe('red');
    const background = categoryItem.querySelector('.legend-item-background')! as any;
    expect(background.attr('fill')).toBe('rgba(245, 0, 31, 0.1)');
  });

  it('new CategoryItem({}) returns a categoryItem with default layout.', () => {
    const marker = categoryItem.querySelector('.legend-item-marker')! as any;
    const nameShape = categoryItem.querySelector('.legend-item-name')! as any;
    const valueShape = categoryItem.querySelector('.legend-item-value')! as any;
    const background = categoryItem.querySelector('.legend-item-background')! as any;
    const container = categoryItem.querySelector('.legend-item-container')! as any;

    expect(marker.getLocalBounds().max[0] + 6).toBe(nameShape.getLocalBounds().min[0]);
    expect(nameShape.getLocalBounds().max[0] + 4).toBe(valueShape.getLocalBounds().min[0]);
    expect(background.getLocalBounds().min[0] + 2).toBe(container.getLocalBounds().min[0]);
    expect(background.getLocalBounds().max[0] - 2).toBe(container.getLocalBounds().max[0]);
    expect(background.getBounds().center[1]).toBe(marker.getBounds().center[1]);
    expect(background.getBounds().center[1]).toBe(nameShape.getBounds().center[1]);
    expect(background.getBounds().center[1]).toBe(valueShape.getBounds().center[1]);
  });

  it('new CategoryItem({}) returns a categoryItem with disabled state.', () => {
    categoryItem.setState('disabled');
    const marker = categoryItem.querySelector('.legend-item-marker')! as any;
    const nameShape = categoryItem.querySelector('.legend-item-name')! as any;
    const valueShape = categoryItem.querySelector('.legend-item-value')! as any;
    const background = categoryItem.querySelector('.legend-item-background')! as any;

    expect(marker.attr('fill')).toBe('green');
    expect(nameShape.attr('fill')).toBe('green');
    expect(valueShape.attr('fill')).toBe('green');
    expect(background.attr('fill')).toBe('rgba(245, 0, 31, 0.1)');
  });

  it('new CategoryItem({}) returns a categoryItem trigger active style when mousemove.', () => {
    categoryItem.setState('selected');
    categoryItem.emit('mousemove', {});
    const marker = categoryItem.querySelector('.legend-item-marker')! as any;
    const nameShape = categoryItem.querySelector('.legend-item-name')! as any;
    const background = categoryItem.querySelector('.legend-item-background')! as any;

    expect(marker.attr('fill')).toBe('green');
    expect(marker.attr('opacity')).toBe(0.9);
    expect(nameShape.attr('fill')).toBe('green');
    expect(nameShape.attr('opacity')).toBe(0.9);
    expect(nameShape.attr('fill')).toBe('green');
    expect(nameShape.attr('opacity')).toBe(0.9);
    expect(background.attr('fill')).toBe('rgba(67, 195, 119, 0.1)');
  });

  it('new CategoryItem({}) returns a categoryItem with specified itemWidth and itemHeight', () => {
    categoryItem.update({ itemWidth: 100, itemHeight: 60, itemMarker: { size: 4 } });
    const container = categoryItem.querySelector('.legend-item-container')! as any;
    const background = categoryItem.querySelector('.legend-item-background')! as any;

    expect(categoryItem.getLocalBounds().halfExtents[0] * 2).toBe(100);
    expect(categoryItem.getLocalBounds().halfExtents[1] * 2).toBe(60);
    // 垂直居中
    expect(background.getLocalBounds().center[1]).toBe(container.getLocalBounds().center[1]);
    // 横向不居中
    expect(background.getLocalBounds().min[0] + 2).toBe(container.getLocalBounds().min[0]);
  });

  it('new CategoryItem({}) returns a categoryItem with specified maxItemWidth', () => {
    categoryItem.update({
      itemWidth: null,
      maxItemWidth: 60,
      itemName: null,
      itemValue: { content: 'long long long long' },
    });
    const background = categoryItem.querySelector('.legend-item-background')! as any;
    const container = categoryItem.querySelector('.legend-item-container')! as any;
    let valueShape = categoryItem.querySelector('.legend-item-value')! as any;
    expect(background.getLocalBounds().halfExtents[0] * 2).not.toBeGreaterThan(60);
    expect(valueShape.style.text.endsWith('...')).toBe(true);
    expect(valueShape.getLocalBounds().halfExtents[0] * 2).toBeLessThan(60 - 8 - 4);

    categoryItem.update({ maxItemWidth: 120, itemValue: null, itemName: { content: 'name name long long' } });
    const nameShape = categoryItem.querySelector('.legend-item-name')! as any;
    expect(nameShape.style.text.endsWith('...')).toBe(true);
    expect(container.getLocalBounds().halfExtents[0] * 2).not.toBeGreaterThan(120);
    expect(background.getLocalBounds().halfExtents[0] * 2).not.toBeGreaterThan(120);

    categoryItem.update({
      maxItemWidth: 120,
      itemValue: { content: 'value value long long' },
      itemName: { content: 'name name long long' },
    });
    valueShape = categoryItem.querySelector('.legend-item-value')! as any;
    expect(valueShape.getLocalBounds().max[0]).not.toBeGreaterThan(120);
    expect(valueShape.style.text.endsWith('...')).toBe(true);
    expect(nameShape.style.text.endsWith('...')).toBe(true);

    categoryItem.update({ maxItemWidth: 120, itemValue: { content: 'value' }, itemName: { content: 'name' } });
    expect(valueShape.style.text.endsWith('...')).toBe(false);
    expect(nameShape.style.text.endsWith('...')).toBe(false);
  });
});
