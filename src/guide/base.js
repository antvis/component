const Util = require('../util');
const Component = require('../component');

const KEYWORDS = [ 'min', 'max', 'median', 'start', 'end' ];

function getFirstScale(scales) {
  let firstScale;
  Util.each(scales, scale => {
    if (scale) {
      firstScale = scale;
      return false;
    }
  });
  return firstScale;
}

class Guide extends Component {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      xScales: null,
      yScales: null,
      el: null
    });
  }

  render() {}

  /**
   * clear container
   * @override
   */
  clear() {
    const self = this;
    const el = self.get('el');
    el && el.remove();
  }

  /**
   * show or hide
   * @protected
   * @param {Boolean} visible true means show, false means hide
   */
  changeVisible(visible) {
    const self = this;
    self.set('visible', visible);
    const el = self.get('el');

    if (!el) return;
    if (el.set) {
      el.set('visible', visible);
    } else {
      el.style.display = visible ? '' : 'none';
    }
  }

  /**
   * calculate the canvas coordinate value
   * @protected
   * @param  {Coordinate} coord  the instance of Coordinate class
   * @param  {Object | Array | Function} position the value need to convert
   * @param  {Boolean} needConvert wether convert to canvas coord
   * @return {Object} return the result
   */
  parsePoint(coord, position, needConvert = true) {
    const self = this;
    const xScales = self.get('xScales');
    const yScales = self.get('yScales');
    if (Util.isFunction(position)) {
      position = position(xScales, yScales);
    }

    let x;
    let y;

    if (Util.isArray(position)) { // Array，suuport for mixing of keyword, percent and value
      x = self._getNormalizedValue(position[0], getFirstScale(xScales));
      y = self._getNormalizedValue(position[1], getFirstScale(yScales), 'y');
    } else {
      for (const field in position) {
        const value = position[field];
        if (xScales[field]) {
          x = self._getNormalizedValue(value, xScales[field]);
        }

        if (yScales[field]) {
          y = self._getNormalizedValue(value, yScales[field]);
        }
      }
    }

    if (needConvert) {
      return coord.convert({
        x,
        y
      });
    }

    return {
      x,
      y
    };
  }

  /**
   * Normalized the value
   * @param  {String | Number} val   param
   * @param  {Scale} scale the instance of Scale
   * @param  {String} direct which axis dose the value in
   * @return {Number}       return the normalized value
   */
  _getNormalizedValue(val, scale, direct) {
    let result;
    if (Util.indexOf(KEYWORDS, val) !== -1) { // keyword
      let scaleValue;
      if (val === 'start') { // the start of coordinate
        result = 0;
      } else if (val === 'end') {
        result = 1;
      } else if (val === 'median') {
        scaleValue = scale.isCategory ? (scale.values.length - 1) / 2 : (scale.min + scale.max) / 2;
        result = scale.scale(scaleValue);
      } else {
        if (scale.isCategory) {
          scaleValue = (val === 'min') ? 0 : (scale.values.length - 1);
        } else {
          scaleValue = scale[val];
        }
        result = scale.scale(scaleValue);
      }
    } else if (Util.isString(val) && val.indexOf('%') !== -1) { // percent, just like '50%'
      val = parseFloat(val) / 100;
      result = direct === 'y' ? (1 - val) : val; // origin point is top-left
    } else { // 数值
      result = scale.scale(val);
    }

    return result;
  }
}

module.exports = Guide;
