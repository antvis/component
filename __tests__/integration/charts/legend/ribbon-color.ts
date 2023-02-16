import { Group } from '@antv/g';
import { deepAssign } from '../../../../src/util';
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
        style: deepAssign(
          {
            style: { type: 'color', orientation: 'horizontal', size: 30, length: 200 },
          },
          args
        ),
      })
    );
  };

  createRibbon({ style: { color: ['#f00', '#0f0', '#00f'] } });

  createRibbon({ style: { y: 30, color: ['red', 'green', 'blue'] } });

  createRibbon({ style: { y: 60, color: ['gray', 'lightgray'] } });

  createRibbon({ style: { y: 90, color: ['pink'] } });

  createRibbon({ style: { y: 120, color: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'] } });

  createRibbon({ style: { y: 150, color: ['rgb(255, 0, 0)', '#0f0', 'rgb(0, 0, 255)'] } });

  createRibbon({ style: { y: 180, color: ['rgba(255, 0, 0, 0)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 1)'] } });

  createRibbon({ style: { x: 200, length: 210, orientation: 'vertical', color: ['#f00', '#0f0', '#00f'] } });

  createRibbon({ style: { x: 230, length: 210, orientation: 'vertical', color: ['red', 'green', 'blue'] } });

  createRibbon({ style: { x: 260, length: 210, orientation: 'vertical', color: ['gray', 'lightgray'] } });

  createRibbon({ style: { x: 290, length: 210, orientation: 'vertical', color: ['pink'] } });

  createRibbon({
    style: {
      x: 320,
      length: 210,
      orientation: 'vertical',
      color: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'],
    },
  });

  createRibbon({
    style: { x: 350, length: 210, orientation: 'vertical', color: ['rgb(255, 0, 0)', '#0f0', 'rgb(0, 0, 255)'] },
  });

  createRibbon({
    style: {
      x: 380,
      length: 210,
      orientation: 'vertical',
      color: ['rgba(255, 0, 0, 0)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 1)'],
    },
  });

  return group;
};
