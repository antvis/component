import { Ribbon } from '@/ui/legend/continuous/ribbon';
import { Group } from '@antv/g';
import { Quantize } from '@antv/scale';

export const RibbonDemo = () => {
  const group = new Group({});

  const createRibbon = (args: any = {}) => {
    return group.appendChild(
      new Ribbon({
        style: {
          x: 100,
          y: 100,
          type: 'color',
          orient: 'horizontal',
          size: 30,
          len: 200,
          ...args,
        },
      })
    );
  };

  createRibbon();

  createRibbon({ y: 150, type: 'size' });

  const color = [
    '#d0e3fa',
    '#acc7f6',
    '#8daaf2',
    '#6d8eea',
    '#4d73cd',
    '#325bb1',
    '#5a3e75',
    '#8c3c79',
    '#e23455',
    '#e7655b',
  ];

  createRibbon({
    y: 200,
    orient: 'vertical',
    color,
  });

  const quantize = new Quantize({
    domain: [0, 1],
    range: color,
  });
  const interpolate = (index: number) => quantize.map(index);

  createRibbon({ x: 150, y: 200, type: 'size', orient: 'vertical', range: [0.2, 0.8], color: interpolate });

  createRibbon({
    x: 300,
    y: 200,
    type: 'size',
    orient: 'vertical',
    range: [0.2, 0.8],
    color: color.slice(4),
    block: true,
    blocks: 5,
  });

  const ribbon = createRibbon({ x: 350, y: 150, type: 'color', color, block: true, blocks: 10 });

  ribbon.style.range = [0.4, 0.8];

  createRibbon({ x: 350, y: 150, type: 'color', color, block: true, blocks: 10, len: 400 });

  return group;
};
