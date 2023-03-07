import { Group } from '@antv/g';
import { Quantize } from '@antv/scale';
import { Ribbon } from '../../../../src/ui/legend/continuous/ribbon';

export const RibbonDemo = () => {
  const group = new Group({
    style: {
      width: 750,
      height: 400,
    },
  });

  const createRibbon = (args: any = {}) => {
    return group.appendChild(
      new Ribbon({
        style: {
          x: 100,
          y: 100,
          type: 'color',
          orientation: 'horizontal',
          size: 30,
          length: 200,
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

  createRibbon({ y: 200, orientation: 'vertical', color });

  const quantize = new Quantize({
    domain: [0, 1],
    range: color,
  });
  const interpolate = (index: number) => quantize.map(index);

  createRibbon({
    x: 150,
    y: 200,
    type: 'size',
    orientation: 'vertical',
    range: [0.2, 0.8],
    color: interpolate,
  });

  const createPartition = (num: number) => new Array(num).fill(0).map((n, i, arr) => i / (arr.length - 1));

  createRibbon({
    x: 300,
    y: 200,
    type: 'size',
    orientation: 'vertical',
    range: [0.2, 0.8],
    color: color.slice(4),
    block: true,
    partition: createPartition(6),
  });

  createRibbon({ x: 350, y: 100, type: 'color', color, partition: createPartition(10), length: 400 });

  createRibbon({
    x: 350,
    y: 150,
    type: 'color',
    color,
    block: true,
    partition: createPartition(11),
    length: 400,
  });

  createRibbon({ x: 350, y: 200, type: 'size', color, partition: createPartition(10), length: 400 });

  createRibbon({
    x: 350,
    y: 250,
    type: 'size',
    color,
    block: true,
    partition: createPartition(11),
    length: 400,
  });

  createRibbon({
    x: 350,
    y: 300,
    type: 'color',
    color,
    partition: createPartition(10),
    length: 400,
    range: [0.2, 0.8],
  });

  const ribbon = createRibbon({
    x: 350,
    y: 350,
    type: 'color',
    color,
    block: true,
    length: 400,
    partition: createPartition(10),
  });

  ribbon.update({
    range: [0.4, 0.8],
  });

  return group;
};
