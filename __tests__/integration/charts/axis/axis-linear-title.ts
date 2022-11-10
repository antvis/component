import { Group, Image, Text } from '@antv/g';
import { axisWarper } from '../../utils';

export const AxisLinearTitle = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: new Array(10).fill(0).map((_, i, arr) => ({ value: i / (arr.length - 1), label: '' })),
    lineLineWidth: 5,
    tickLineWidth: 5,
    title: 'title',
    titleFill: 'red',
    titleFontSize: 20,
    titleFontWeight: 'bold',
    titleSpacing: 5,
    labelFormatter: () => '',
  });

  createAxis({ startPos: [50, 50], endPos: [500, 50] });
  createAxis({ startPos: [50, 100], endPos: [500, 100], titleAlign: 'middle' });
  createAxis({ startPos: [50, 150], endPos: [500, 150], titleAlign: 'end' });
  createAxis({ startPos: [500, 300], endPos: [50, 300], titlePosition: 'top' });
  createAxis({ startPos: [500, 350], endPos: [50, 350], titleAlign: 'middle', titlePosition: 'top' });
  createAxis({ startPos: [500, 400], endPos: [50, 400], titleAlign: 'end', titlePosition: 'top' });

  createAxis({ startPos: [600, 50], endPos: [600, 450], titlePosition: 'left' });
  createAxis({ startPos: [650, 50], endPos: [650, 450], titlePosition: 'left', titleAlign: 'middle' });
  createAxis({ startPos: [700, 50], endPos: [700, 450], titlePosition: 'left', titleAlign: 'end' });
  createAxis({ startPos: [750, 50], endPos: [750, 450], titlePosition: 'right' });
  createAxis({ startPos: [800, 450], endPos: [800, 50], titlePosition: 'right', titleAlign: 'middle' });
  createAxis({ startPos: [850, 450], endPos: [850, 50], titlePosition: 'right', titleAlign: 'end' });

  const title = new Group({ style: {} });
  title.appendChild(
    new Image({
      style: {
        src: 'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
        height: 30,
        width: 30,
        anchor: '0.5 0.5',
      },
    })
  );
  title.appendChild(
    new Text({
      style: {
        text: "I'm title",
        transform: 'translate(20, 0)',
      },
    })
  );

  createAxis({
    startPos: [500, 500],
    endPos: [50, 500],
    title,
    titleAlign: 'start',
    titlePosition: 'top',
  });

  return group;
};
