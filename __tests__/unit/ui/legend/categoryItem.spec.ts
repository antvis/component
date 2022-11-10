import { CategoryItem } from '../../../../src/ui/legend/category/item';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(500, 'svg', true);

const categoryItem = new CategoryItem({
  style: {
    x: 30,
    y: 30,
    width: 50,
    height: 30,
    marker: 'circle',
    markerFill: 'red',
    label: 'name',
    labelFontSize: 12,
    labelOpacity: 1,
    labelTextBaseline: 'middle',
    labelFill: 'red',
    spacing: [6, 4],
    value: 'value',
    valueFontSize: 12,
    valueOpacity: 1,
    valueFill: 'red',
    backgroundFill: 'rgba(245, 0, 31, 0.1)',
  },
});

canvas.appendChild(categoryItem);

describe.skip('CategoryItem', () => {
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

  it('new CategoryItem({}) returns a categoryItem with specified itemWidth and itemHeight', () => {
    categoryItem.update({ width: 100, height: 60 });
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
      // width: null,
      // maxItemWidth: 60,
      // label: null,
      value: 'long long long long',
    });
    const background = categoryItem.querySelector('.legend-item-background')! as any;
    const container = categoryItem.querySelector('.legend-item-container')! as any;
    let valueShape = categoryItem.querySelector('.legend-item-value')! as any;
    expect(background.getLocalBounds().halfExtents[0] * 2).not.toBeGreaterThan(60);
    expect(valueShape.style.text.endsWith('...')).toBe(true);
    expect(valueShape.getLocalBounds().halfExtents[0] * 2).toBeLessThan(60 - 8 - 4);

    categoryItem.update({ label: 'name name long long' });
    const nameShape = categoryItem.querySelector('.legend-item-name')! as any;
    expect(nameShape.style.text.endsWith('...')).toBe(true);
    expect(container.getLocalBounds().halfExtents[0] * 2).not.toBeGreaterThan(120);
    expect(background.getLocalBounds().halfExtents[0] * 2).not.toBeGreaterThan(120);

    categoryItem.update({
      value: 'value value long long',
      label: 'name name long long',
    });
    valueShape = categoryItem.querySelector('.legend-item-value')! as any;
    expect(valueShape.getLocalBounds().max[0]).not.toBeGreaterThan(120);
    expect(valueShape.style.text.endsWith('...')).toBe(true);
    expect(nameShape.style.text.endsWith('...')).toBe(true);

    categoryItem.update({ value: 'value', label: 'name' });
    expect(valueShape.style.text.endsWith('...')).toBe(false);
    expect(nameShape.style.text.endsWith('...')).toBe(false);
  });
});
