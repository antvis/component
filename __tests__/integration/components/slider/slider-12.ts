import { Group } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';
import { timeout } from '../../utils';

export const Slider12 = () => {
  const group = new Group({ style: { width: 550, height: 50 } });

  const slider = group.appendChild(
    new Slider({
      style: {
        trackSize: 16,
        trackFill: '#416180',
        trackFillOpacity: 1,
        selectionFill: '#5B8FF9',
        selectionFillOpacity: 0.15,
        handleIconSize: 10,
        handleIconFill: '#f7f7f7',
        handleIconFillOpacity: 1,
        handleIconStroke: '#000',
        handleIconStrokeOpacity: 0.25,
        handleIconLineWidth: 1,
        handleIconRadius: 2,
        handleLabelFill: '#000',
        handleLabelFillOpacity: 0.45,
        handleLabelFontSize: 12,
        handleLabelFontWeight: 'normal',
        x: 10,
        y: 10,
        trackLength: 510,
        orientation: 'horizontal',
        animate: {
          duration: 300,
        },
      },
    })
  );

  timeout(() => {
    slider.setValues([0.2, 0.8]);
  }, 500);

  return group;
};

Slider12.tags = ['缩略条', '迷你图', '文本'];
