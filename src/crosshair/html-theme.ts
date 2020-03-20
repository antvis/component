import Theme from '../util/theme';

// tooltip 相关 dom 的 css 类名
import * as CssConst from './css-const';

export default {
  // css style for tooltip
  [`${CssConst.CONTAINER_CLASS}`]: {
    position: 'relative',
    'pointer-events': 'none'
  },
  [`${CssConst.CROSSHAIR_LINE}`]: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  [`${CssConst.CROSSHAIR_TEXT}`]: {
    position: 'absolute',
    color: Theme.textColor,
    fontFamily: Theme.fontFamily,
  }
};