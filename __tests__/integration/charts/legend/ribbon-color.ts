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
        style: {
          type: 'color',
          orient: 'horizontal',
          size: 30,
          len: 200,
          ...args,
        },
      })
    );
  };

  createRibbon({ color: ['#f00', '#0f0', '#00f'] });

  createRibbon({ y: 30, color: ['red', 'green', 'blue'] });

  createRibbon({ y: 60, color: ['gray', 'lightgray'] });

  createRibbon({ y: 90, color: ['pink'] });

  createRibbon({ y: 120, color: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'] });

  createRibbon({ y: 150, color: ['rgb(255, 0, 0)', '#0f0', 'rgb(0, 0, 255)'] });

  createRibbon({ y: 180, color: ['rgba(255, 0, 0, 0)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 1)'] });

  createRibbon({ x: 200, len: 210, orient: 'vertical', color: ['#f00', '#0f0', '#00f'] });

  createRibbon({ x: 230, len: 210, orient: 'vertical', color: ['red', 'green', 'blue'] });

  createRibbon({ x: 260, len: 210, orient: 'vertical', color: ['gray', 'lightgray'] });

  createRibbon({ x: 290, len: 210, orient: 'vertical', color: ['pink'] });

  createRibbon({ x: 320, len: 210, orient: 'vertical', color: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'] });

  createRibbon({ x: 350, len: 210, orient: 'vertical', color: ['rgb(255, 0, 0)', '#0f0', 'rgb(0, 0, 255)'] });

  createRibbon({
    x: 380,
    len: 210,
    orient: 'vertical',
    color: ['rgba(255, 0, 0, 0)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 1)'],
  });

  return group;
};
