
const bitmap = [];

class Greedy {
  hasGap(bbox) {
    let area = 0;
    for (let i = Math.floor(bbox.minX); i < Math.ceil(bbox.maxX); i++) {
      if (!bitmap[i]) {
        bitmap[i] = [];
        continue;
      }
      for (let j = Math.floor(bbox.minY); j < Math.ceil(bbox.maxY); j++) {
        if (bitmap[i][j]) {
          area += 1;
          break;
        }
      }
    }

    if (area === 0) {
      return true;
    }
    return false;
  }
  fillGap(bbox) {
    for (let i = Math.floor(bbox.minX); i < Math.ceil(bbox.maxX); i++) {
      for (let j = Math.floor(bbox.minY); j < Math.ceil(bbox.maxY); j++) {
        bitmap[i][j] = true;
      }
    }
  }

  /*
   *  根据如下规则尝试放置label
   *                5
   *        ------------------
   *        |    1   |   0   |
   *    6   ——————————————————   4
   *        |    2   |   3   |
   *        ——————————————————
   *                 7
   */
  adjustLabelPosition(label, x, y, index) {
    const bbox = label.getBBox();
    const width = bbox.width;
    const height = bbox.height;
    const attrs = {
      x,
      y,
      textAlign: 'center'
    };
    switch (index) {
      case 0:
        attrs.y -= height / 2;
        attrs.textAlign = 'left';
        break;
      case 1:
        attrs.y -= height / 2;
        attrs.textAlign = 'right';
        break;
      case 2:
        attrs.y += height / 2;
        attrs.textAlign = 'right';
        break;
      case 3:
        attrs.y += height / 2;
        attrs.textAlign = 'left';
        break;
      case 4:
        attrs.x += width / 2;
        attrs.textAlign = 'left';
        break;
      case 5:
        attrs.y -= height / 2;
        break;
      case 6:
        attrs.x -= width / 2;
        attrs.textAlign = 'right';
        break;
      case 7:
        attrs.y += height / 2;
        break;
      default:break;
    }
    label.attr(attrs);
    return label.getBBox();
  }
  adjust(labels) {
    const self = this;
    let label,
      bbox,
      x,
      y;
    const toBeRemoved = [];
    let canFill;
    for (let i = 0; i < labels.length; i++) {
      label = labels[i];
      canFill = false;
      x = label.attr('x');
      y = label.attr('y');
      for (let j = 0; j < 8; j++) {
        bbox = self.adjustLabelPosition(label, x, y, j);
        if (self.hasGap(bbox)) {
          self.fillGap(bbox);
          canFill = true;
          break;
        }
      }
      if (!canFill) {
        toBeRemoved.push(label);
      }
    }
    for (let i = 0; i < toBeRemoved.length; i++) {
      toBeRemoved[i].remove();
    }
  }
}

module.exports = Greedy;
