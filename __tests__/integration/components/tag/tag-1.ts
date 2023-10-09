import { Group } from '@antv/g';
import { Tag } from '../../../../src';

export const Tag1 = () => {
  const group = new Group();

  group.appendChild(
    new Tag({
      style: {
        x: 100,
        y: 100,
        text: 'G2',
      },
    })
  );

  group.appendChild(
    new Tag({
      style: {
        x: 200,
        y: 100,
        text: 'G6',
        backgroundFill: '#DBF1B7',
        labelFill: 'red',
        marker: {
          size: 8,
          symbol: 'diamond',
          stroke: '#5B8FF9',
        },
      },
    })
  );

  const tag = group.appendChild(
    new Tag({
      style: {
        x: 300,
        y: 100,
        text: 'L7',
        radius: 6,
        padding: [6, 24],
      },
    })
  );

  tag.addEventListener('mouseenter', () => {
    tag.update({
      backgroundFill: '#5B8FF9',
    });
  });

  tag.addEventListener('mouseleave', () => {
    tag.update({
      backgroundFill: '#DBF1B7',
    });
  });

  return group;
};
