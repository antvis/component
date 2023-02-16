import { Group, Rect } from '@antv/g';
import { deepAssign } from '../../../../src/util';
import { Title } from '../../../../src/ui/title';

export const TitleDemo = () => {
  const group = new Group({});

  const createTitle = (argsRect = {}, argsTitle = {}) => {
    const g = group.appendChild(new Group());
    const content = g.appendChild(
      new Rect({
        style: {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          fill: 'red',
          ...argsRect,
        },
      })
    );
    content.appendChild(
      new Title({
        style: deepAssign(
          {
            style: { width: 100, height: 100, text: 'left top' },
          },
          argsTitle
        ),
      })
    );
  };

  createTitle({ x: 50, y: 50 });
  createTitle({ x: 50, y: 150, fill: 'orange' }, { style: { text: 'left', position: 'left', spacing: 10 } });
  createTitle({ x: 50, y: 250, fill: 'green' }, { style: { text: 'left bottom', position: 'left-bottom' } });
  createTitle({ x: 50, y: 350, fill: 'pink' }, { style: { text: 'inner', position: 'i' } });

  createTitle({ x: 200, y: 50, fill: 'blue' }, { style: { text: 'right top', position: 'right-top' } });
  createTitle({ x: 200, y: 150, fill: 'purple' }, { style: { text: 'right', position: 'right', spacing: 10 } });
  createTitle(
    { x: 200, y: 250, fill: 'yellow' },
    { style: { text: 'right bottom', position: 'right-bottom', spacing: [10, 10] } }
  );

  createTitle({ x: 400, y: 50, fill: 'blue' }, { style: { text: 'top', position: 'top', spacing: 10 } });
  createTitle({ x: 400, y: 150, fill: 'purple' }, { style: { text: 'bottom', position: 'bottom' } });
  createTitle(
    { x: 400, y: 300, width: 200, height: 200, fill: 'pink' },
    { style: { text: 'left top start', position: 'left-top', textAlign: 'start' } }
  );
  createTitle(
    { x: 600, y: 50, width: 200, height: 200, fill: 'pink' },
    {
      style: {
        text: 'left top start',
        position: 'left-top',
        transform: 'rotate(90)',
        textAlign: 'start',
        textBaseline: 'bottom',
      },
    }
  );

  return group;
};
