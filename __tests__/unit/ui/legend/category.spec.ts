import { DisplayObject, Group } from '@antv/g';
import { Category } from '../../../../src/ui/legend';
import { CategoryItem } from '../../../../src/ui/legend/categoryItem';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(800, 'svg');

describe('Category legend', () => {
  const items = [
    { name: 'Chrome', value: '7.08%', color: '#5B8FF9' },
    { name: 'Firefox', value: '4.12%', color: '#61DDAA' },
    { name: 'Safari', value: '25.45%', color: '#65789B' },
    { name: 'Android Long Long', value: '56.3%', color: '#F6BD16' },
    { name: 'iOS', value: '12.56%', color: '#7262fd' },
  ];
  it('new Category({}) returns a displayObject contains background and innerContent', () => {
    const category = canvas.appendChild(new Category({ style: { items: [] } }));

    expect(category.childNodes.length).toBe(2);
    category.destroy();
  });

  it('Category background', () => {
    const category = new Category({ style: { items, padding: [2, 4], backgroundStyle: { fill: 'pink' } } });
    canvas.appendChild(category);

    const background = category.querySelector('.legend-background') as DisplayObject;
    const container = category.querySelector('.legend-container') as Group;
    expect(background.style.fill).toBe('pink');
    expect(container.getLocalPosition()[0]).toBe(background.getLocalPosition()[0] + 4);
    expect(container.getLocalPosition()[1]).toBe(background.getLocalPosition()[1] + 2);
    expect(container.getBBox().width).toBe(background.style.width - 8);

    category.destroy();
  });

  it('Category Title, support html', () => {
    const category = new Category({ style: { items, title: { content: 'Legend title', spacing: 0 } } });
    canvas.appendChild(category);

    let title = category.querySelector('.legend-title') as DisplayObject;
    const innerGroup = category.querySelector('.legend-inner-group') as DisplayObject;
    const min = Math.min.apply(
      null,
      innerGroup!.childNodes.map((child: any) => child.getLocalBounds().min[1])
    );
    expect(title.getBBox().bottom).toBe(innerGroup.getBBox().top - min);
    expect(title.style.text).toBe('Legend title');

    category.update({ title: { style: { fill: 'red' } } });
    title = category.querySelector('.legend-title') as DisplayObject;
    expect(title.style.fill).toBe('red');

    category.update({
      title: {
        useHTML: true,
        height: 50,
        content: '<div style="width:200px;">Legend Item <span>ICON</span></div>',
      },
    });
    expect(innerGroup.getBBox().top).toBe(50 + min);

    category.update({ title: { useHTML: false } });
    title = category.querySelector('.legend-title') as DisplayObject;
    expect(title.tagName).toBe('text');
    category.destroy();
  });

  it('Category LegendItem, contains background, marker, name and value.', () => {
    const category = new Category({ style: { items } });
    canvas.appendChild(category);

    const legendItems = category.querySelectorAll('.legend-item') as Group[];
    expect(legendItems.length).toBe(items.length);
    expect(legendItems[0].childNodes.length).toBe(2);
    const [marker, name, value] = (legendItems[0].querySelector('.legend-item-container') as any)
      .childNodes as DisplayObject[];
    expect(marker.className).toBe('legend-item-marker');
    expect(name.className).toBe('legend-item-name');
    expect(value.className).toBe('legend-item-value');

    expect(marker.style.fill).toBe(items[0].color);
    expect(name.style.text).toBe(items[0].name);
    expect(value.style.text).toBe(items[0].value);

    category.update({
      itemMarker: { size: 8 },
      itemName: { spacing: 4 },
      itemPadding: [2, 4],
      itemBackgroundStyle: { fill: 'pink' },
    });
    expect(legendItems.every((item) => item.getLocalPosition()[1] === 0)).toBe(true);
    legendItems[0].emit('mousemove', {});
    expect(legendItems[0]!.getLocalPosition()[1] === 0).toBe(true);
    expect(marker.getLocalPosition()[0]).toBe(4);
    expect(name.getLocalPosition()[0]).toBe(8 + 4);
    category.destroy();
  });

  it('new Category({style:{...}}) support itemSpacing config.', () => {
    const category = canvas.appendChild(new Category({ style: { items, spacing: [4, 4] } }));
    const legendItems = category.querySelectorAll('.legend-item') as any[];
    expect(legendItems.every((item) => item.getLocalPosition()[1] === 0)).toBe(true);

    let [item0, item1] = legendItems;
    expect(item0.getBBox().right + 4).toBe(item1.getBBox().left);

    category.update({ orient: 'vertical' });
    [item0, item1] = category.querySelectorAll('.legend-item') as any[];
    expect(item0.getBBox().bottom + 4).toBe(item1.getBBox().top);
    category.destroy();
  });

  it('item support maxItemWidth, itemWidth and itemHeight', () => {
    const category = canvas.appendChild(
      new Category({
        style: { items, maxItemWidth: 150, itemBackgroundStyle: { fill: 'pink' } },
      })
    );
    const legendItem = category.querySelectorAll('.legend-item')[3] as any;
    // todo
    expect(legendItem.getBBox().width).toBeLessThan(150 + 1.5);
    expect(legendItem.getBBox().width).toBeGreaterThan(148);
    expect(legendItem.querySelector('.legend-item-name').style.text.endsWith('...')).toBeTruthy();

    category.update({ items, itemWidth: 100, spacing: [6, 0], itemPadding: [2, 4] });
    const [, item1, item2] = category.querySelectorAll('.legend-item') as any[];
    expect(item1.getBBox().x).toBeCloseTo(100 + 6, -1);
    expect(item2.getBBox().x).toBeCloseTo(100 * 2 + 12, -1);
    category.update({ itemHeight: 40 });
    expect(item1.getBBox().height).toBeCloseTo(40);
    category.destroy();
  });

  it('Category itemBackground', () => {
    const category = new Category({ style: { items } });
    canvas.appendChild(category);

    category.update({
      itemPadding: [2, 4],
      itemBackgroundStyle: { fill: 'pink', active: { fill: 'rgba(0,0,0,0.03)' } },
    });
    const [bg1, bg2] = category.querySelectorAll('.legend-item-background');
    (bg1 as any).emit('mousemove', {});
    expect(bg1.style.fill).toBe('rgba(0,0,0,0.03)');
    expect(bg2.style.fill).toBe('pink');
    category.destroy();
  });

  it('Category itemName', () => {
    const category = canvas.appendChild(
      new Category({
        style: {
          items,
          itemWidth: 120,
          itemName: {
            style: {
              fill: 'grey',
              active: { fill: 'black' },
              unselected: { fill: 'red' },
            },
          },
        },
      })
    );
    const [name1, name2, name3] = category.querySelectorAll('.legend-item-name');
    (name2 as any).emit('mousemove', {});
    category.setItemState('legend-item-2', 'unselected');
    expect(name1.style.fill).toBe('grey');
    expect(name2.style.fill).toBe('black');
    expect(name3.style.fill).toBe('red');
    category.destroy();
  });

  it('Category itemValue, support align', () => {
    const category = canvas.appendChild(
      new Category({
        style: {
          y: 50,
          orient: 'vertical',
          items,
          itemWidth: 120,
          itemValue: {
            align: 'right',
            style: {
              fill: 'grey',
              active: { fill: 'black' },
              unselected: { fill: 'red' },
            },
          },
        },
      })
    );
    const [value1, value2, value3] = category.querySelectorAll('.legend-item-value') as any[];
    value2.emit('mousemove', {});
    category.setItemState('legend-item-2', 'unselected');
    expect(value1.style.fill).toBe('grey');
    expect(value2.style.fill).toBe('black');
    expect(value3.style.fill).toBe('red');
    category.destroy();
  });

  it('Category state', () => {
    const category = canvas.appendChild(
      new Category({ style: { items: items.map((d) => ({ ...d, state: 'selected' })) } })
    );

    const [item0] = category.querySelectorAll('.legend-item') as CategoryItem[];
    // Inherit default style.
    expect(item0!.querySelector('.legend-item-marker')!.style.fill).toBe(items[0].color);

    // Specify selected style.
    category.update({ itemMarker: { style: { fill: 'red', unselected: { fill: 'grey' } } } });
    expect(item0!.querySelector('.legend-item-marker')!.style.fill).toBe('red');
    item0.setState('unselected');
    expect(item0!.querySelector('.legend-item-marker')!.style.fill).toBe('grey');

    category.update({ itemName: { style: { fill: 'green', unselected: { fill: 'blue' } } } });
    item0.setState('selected');
    expect(item0!.querySelector('.legend-item-name')!.style.fill).toBe('green');
    item0.setState('unselected');
    expect(item0!.querySelector('.legend-item-name')!.style.fill).toBe('blue');

    category.update({ itemValue: { style: { fill: 'pink', unselected: { fill: 'blue' } } } });
    item0.setState('selected');
    expect(item0!.querySelector('.legend-item-value')!.style.fill).toBe('pink');
    item0.setState('unselected');
    expect(item0!.querySelector('.legend-item-value')!.style.fill).toBe('blue');
    category.destroy();
  });

  it('Category support flipPage and autoWrap', () => {
    const category = canvas.appendChild(
      new Category({
        style: {
          title: { content: 'Legend title' },
          items,
          maxWidth: 280,
          spacing: [8, 4],
          itemBackgroundStyle: {
            active: {
              fill: 'rgba(0,0,0,0.03)',
            },
          },
        },
      })
    );
    let [item0, item1, item2] = category.querySelectorAll('.legend-item') as any[];
    expect(item0.getBBox().right + 8).toBe(item1.getBBox().left);

    category.update({ autoWrap: true, maxRows: 3 });
    [item0, item1, item2] = category.querySelectorAll('.legend-item') as any[];
    expect(item2.getBBox().x).toBe(0);

    category.update({ orient: 'vertical' });
    expect(category.querySelector('.page-button-group')!.style.visibility).toBe('hidden');

    category.update({ orient: 'vertical', maxHeight: 78 });
    expect(category.querySelector('.page-button-group')!.style.visibility).toBe('visible');

    category.destroy();
  });
});
