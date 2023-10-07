import { Group } from '@antv/g';
import { Ribbon } from '../../../../src/ui/legend/continuous/ribbon';

export const RibbonColor = () => {
  const group = new Group({
    style: {
      width: 410,
      height: 210,
    },
  });

  const createRibbon = (args: any = {}) => {
    return group.appendChild(
      new Ribbon({
        style: { type: 'color', orientation: 'horizontal', size: 30, length: 200, ...args },
      })
    );
  };

  createRibbon({ color: ['#f00', '#0f0', '#00f'] });

  createRibbon({ x: 0, y: 30, color: ['red', 'green', 'blue'] });

  createRibbon({ x: 0, y: 60, color: ['gray', 'lightgray'] });

  createRibbon({ x: 0, y: 90, color: ['pink'] });

  createRibbon({ x: 0, y: 120, color: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'] });

  createRibbon({ x: 0, y: 150, color: ['rgb(255, 0, 0)', '#0f0', 'rgb(0, 0, 255)'] });

  createRibbon({
    x: 0,
    y: 180,
    color: ['rgba(255, 0, 0, 0)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 1)'],
  });

  createRibbon({ x: 200, y: 0, length: 210, orientation: 'vertical', color: ['#f00', '#0f0', '#00f'] });

  createRibbon({ x: 230, y: 0, length: 210, orientation: 'vertical', color: ['red', 'green', 'blue'] });

  createRibbon({ x: 260, y: 0, length: 210, orientation: 'vertical', color: ['gray', 'lightgray'] });

  createRibbon({ x: 290, y: 0, length: 210, orientation: 'vertical', color: ['pink'] });

  createRibbon({
    x: 320,
    y: 0,
    length: 210,
    orientation: 'vertical',
    color: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'],
  });

  createRibbon({
    x: 350,
    y: 0,
    length: 210,
    orientation: 'vertical',
    color: ['rgb(255, 0, 0)', '#0f0', 'rgb(0, 0, 255)'],
  });

  createRibbon({
    x: 380,
    y: 0,
    length: 210,
    orientation: 'vertical',
    color: ['rgba(255, 0, 0, 0)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 1)'],
  });

  return group;
};
