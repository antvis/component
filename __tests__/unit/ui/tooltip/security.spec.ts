import { Tooltip } from '../../../../src/ui/tooltip';

describe('Tooltip security', () => {
  it('escapes default content when update renders title and items', () => {
    const tooltip = new Tooltip({
      style: {
        container: { x: 0, y: 0 },
        bounding: null,
      },
    });
    const title = '<img src=x onerror="alert(1)">';
    const name = '<svg onload="alert(2)"></svg>';
    const value = '"><script>alert(3)</script>\'';
    const index = '0" onmouseover="alert(4)';
    const data = [
      {
        name,
        value,
        index,
        color: 'red" onmouseover="alert(5)',
      },
    ];

    tooltip.update({
      title,
      data,
    });

    const element = tooltip.HTMLTooltipElement;
    const nameElement = element.querySelector('.tooltip-list-item-name-label');
    const valueElement = element.querySelector('.tooltip-list-item-value');
    const markerElement = element.querySelector('.tooltip-list-item-marker') as HTMLElement;
    const itemElement = element.querySelector('.tooltip-list-item');

    expect(element.querySelector('.tooltip-title')?.textContent).toBe(title);
    expect(nameElement?.textContent).toBe(name);
    expect(valueElement?.textContent).toBe(value);
    expect(nameElement?.getAttribute('title')).toBe(name);
    expect(valueElement?.getAttribute('title')).toBe(value);
    expect(itemElement?.getAttribute('data-index')).toBe(index);
    expect(markerElement.getAttribute('onmouseover')).toBeNull();
    expect(element.querySelector('img, svg, script')).toBeNull();
    expect(element.querySelector('[onerror], [onload], [onmouseover]')).toBeNull();
    expect(tooltip.attributes.title).toBe(title);
    expect(tooltip.attributes.data[0]).toMatchObject({ name, value, index });

    tooltip.update({ title, data });
    expect(element.querySelector('.tooltip-title')?.textContent).toBe(title);
    expect(element.querySelector('.tooltip-title')?.innerHTML).not.toContain('&amp;lt;');
    expect(element.querySelector('.tooltip-list-item-name-label')?.textContent).toBe(name);
    expect(element.querySelector('.tooltip-list-item-value')?.textContent).toBe(value);
    expect(element.querySelector('.tooltip-list-item')?.getAttribute('data-index')).toBe(index);
  });

  it('keeps default structure and normal content unchanged', () => {
    const tooltip = new Tooltip({
      style: {
        container: { x: 0, y: 0 },
        bounding: null,
        title: 'Category A',
        data: [{ name: 'Sales', value: 275, color: '#5b8ff9' }],
      },
    });
    const element = tooltip.HTMLTooltipElement;

    expect(element.querySelector('.tooltip-title')?.textContent).toBe('Category A');
    expect(element.querySelector('.tooltip-list-item-name-label')?.textContent).toBe('Sales');
    expect(element.querySelector('.tooltip-list-item-value')?.textContent).toBe('275');
    expect((element.querySelector('.tooltip-list-item-marker') as HTMLElement).style.background).not.toBe('black');
    expect(element.querySelectorAll('ul > li')).toHaveLength(1);
  });

  it('prevents attribute injection through colors', () => {
    const tooltip = new Tooltip({
      style: {
        container: { x: 0, y: 0 },
        bounding: null,
        data: [
          { name: 'Attribute injection', value: 1, color: 'red" onmouseover="alert(1)' },
          { name: 'Element injection', value: 2, color: 'red"></span><img src=x onerror="alert(2)' },
        ],
      },
    });
    const element = tooltip.HTMLTooltipElement;
    const markers = Array.from(element.querySelectorAll('.tooltip-list-item-marker')) as HTMLElement[];

    expect(markers).toHaveLength(2);
    expect(element.querySelector('[onmouseover]')).toBeNull();
    expect(element.querySelector('[onerror]')).toBeNull();
    expect(element.querySelector('img')).toBeNull();
  });

  it('preserves static HTML in a custom template while escaping its dynamic data', () => {
    const tooltip = new Tooltip({
      style: {
        container: { x: 0, y: 0 },
        bounding: null,
        title: '<title-data>',
        data: [{ name: '<name-data>', value: '<value-data>', index: '0" onmouseover="alert(1)' as any }],
        template: {
          title: '<section class="tooltip-title"></section>',
          item: `<li class="tooltip-list-item custom-item" data-index="{index}">
            <strong class="custom-name">{name}</strong>
            <em class="custom-value">{value}</em>
          </li>`,
        },
      },
    });
    const element = tooltip.HTMLTooltipElement;

    expect(element.querySelector('.tooltip-title')).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('.custom-item')).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('.custom-name')?.textContent).toBe('<name-data>');
    expect(element.querySelector('.custom-value')?.textContent).toBe('<value-data>');
    expect(element.querySelector('.custom-item')?.getAttribute('data-index')).toBe('0" onmouseover="alert(1)');
    expect(element.querySelector('[onmouseover]')).toBeNull();
  });

  it('preserves explicit string custom content', () => {
    const tooltip = new Tooltip({
      style: {
        container: { x: 0, y: 0 },
        bounding: null,
      },
    });

    tooltip.update({ content: '<strong data-custom-content="string">Custom HTML</strong>' });

    expect(tooltip.HTMLTooltipElement.querySelector('[data-custom-content="string"]')?.tagName).toBe('STRONG');
  });

  it('preserves explicit HTMLElement custom content', () => {
    const tooltip = new Tooltip({
      style: {
        container: { x: 0, y: 0 },
        bounding: null,
      },
    });
    const content = document.createElement('strong');
    content.textContent = '<custom-content>';

    tooltip.update({ content });

    expect(tooltip.HTMLTooltipElement.firstElementChild).toBe(content);
  });
});
