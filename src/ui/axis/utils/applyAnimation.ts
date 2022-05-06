import { DisplayObject, ElementEvent } from '@antv/g';
import { assign, get, noop } from '@antv/util';
import { assignNonempty } from './helper';

const DEFAULT_ANIMATE_OPTIONS = {
  update: {
    duration: 400,
    easing: 'easeQuadInOut',
  },
  enter: {
    duration: 400,
    easing: 'easeQuadInOut',
  },
  leave: {
    duration: 350,
    easing: 'easeQuadIn',
  },
};

// To see: https://g-next.antv.vision/zh/docs/api/animation#options
type AnimateOptions = any;

function fadeIn(shape: DisplayObject, animateOptions: AnimateOptions) {
  const { fillOpacity, strokeOpacity = 0, opacity = fillOpacity } = shape.style;
  const keyframes = [
    { fillOpacity: 0, strokeOpacity: 0, opacity: 0 },
    assignNonempty({}, { fillOpacity, strokeOpacity, opacity }),
  ];
  shape.animate(keyframes, animateOptions);
}

function fadeOut(shape: DisplayObject, animateOptions: AnimateOptions) {
  const { fillOpacity, strokeOpacity = 0, opacity = fillOpacity } = shape.style;
  const keyframes = [
    assignNonempty({}, { fillOpacity, strokeOpacity, opacity }),
    { fillOpacity: 0, strokeOpacity: 0, opacity: 0 },
  ];
  const animation = shape.animate(keyframes, animateOptions);
  animation!.onfinish = function () {
    shape.remove();
  };
}

function pathIn(shape: DisplayObject, animateOptions: AnimateOptions) {
  // @ts-ignore
  const length = shape.getTotalLength();
  const keyframes = [{ lineDash: [0, length] }, { lineDash: [length, 0] }] as any[];
  shape.animate(keyframes, animateOptions);
}

const ANIMATION = { fadeIn, fadeOut, pathIn };

export function applyAnimation(
  shape: DisplayObject,
  stage: 'enter' | 'leave',
  type: string,
  cfg?: AnimateOptions
): void {
  const options = assign({}, get(DEFAULT_ANIMATE_OPTIONS, stage), { fill: 'both' }, cfg);
  const animation = get(ANIMATION, type, noop);
  if (stage === 'enter') {
    shape.addEventListener(ElementEvent.MOUNTED, () => {
      animation(shape, options);
    });
  } else {
    animation(shape, options);
  }
}
