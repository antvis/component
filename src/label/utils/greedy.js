const SpiralFill = require('./spiral-fill');
const PositionFill = require('./position-fill');

const bitmap = [];

const LAYOUTS = {
  scatter: PositionFill,
  map: SpiralFill
};

class Greedy {
  hasGap(bbox) {
    let hasGap = true;
    const minY = Math.floor(bbox.minY);
    const maxY = Math.ceil(bbox.maxY) - 1;
    for (let i = Math.floor(bbox.minX); i < Math.ceil(bbox.maxX); i++) {
      if (!bitmap[i]) {
        bitmap[i] = [];
        continue;
      }
      if (i === 0 || i === Math.ceil(bbox.maxX)) {
        for (let j = minY; j <= maxY; j++) {
          if (bitmap[i][j]) {
            hasGap = false;
            break;
          }
        }
      } else {
        if (bitmap[i][minY] || bitmap[i][maxY]) {
          hasGap = false;
          break;
        }
      }
    }
    return hasGap;
  }
  fillGap(bbox) {
    for (let i = Math.floor(bbox.minX); i < Math.ceil(bbox.maxX); i++) {
      for (let j = Math.floor(bbox.minY); j < Math.ceil(bbox.maxY); j++) {
        bitmap[i][j] = true;
      }
    }
  }

  adjust(labels, shapes, type) {
    const self = this;
    let label;
    const toBeRemoved = [];
    const fill = LAYOUTS[type];
    if (!fill) {
      return;
    }
    for (let i = 0; i < labels.length; i++) {
      label = labels[i];
      if (!fill.call(self, label, shapes, i)) {
        toBeRemoved.push(label);
      }
    }
    for (let i = 0; i < toBeRemoved.length; i++) {
      toBeRemoved[i].remove();
    }
  }
}

module.exports = Greedy;
