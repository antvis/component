const bitmap = [];

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
function getNextPosition(label, x, y, index) {
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

class Greedy {
  positionFill(label) {
    const self = this;
    let bbox,
      canFill = false;
    const x = label.attr('x');
    const y = label.attr('y');
    for (let j = 0; j < 8; j++) {
      bbox = getNextPosition(label, x, y, j);
      if (self.hasGap(bbox)) {
        self.fillGap(bbox);
        canFill = true;
        break;
      }
    }
    return canFill;
  }
  spiralFill(label) {
    const self = this;
    const dt = -1;
    const x = label.attr('x'),
      y = label.attr('y');
    const bbox = label.getBBox();
    const maxDelta = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height);
    let dxdy,
      t = -dt,
      dx = 0,
      dy = 0;
    const f = function(t) {
      return [ (t *= 0.1) * Math.cos(t) / 2, t * Math.sin(t) / 2 ];
    };

    if (self.hasGap(bbox)) {
      self.fillGap(bbox);
      return true;
    }
    let canFill = false;
    while (Math.min(Math.abs(dx), Math.abs(dy)) < maxDelta) {
      dxdy = f(t += dt);
      dx = ~~dxdy[0];
      dy = ~~dxdy[1];
      label.attr({ x: x + dx, y: y + dy });
      if (self.hasGap(label.getBBox())) {
        self.fillGap(bbox);
        canFill = true;
        break;
      }
    }
    return canFill;
  }
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
    let fill = self.positionFill;
    if (type === 'map') {
      fill = self.spiralFill;
    }

    for (let i = 0; i < labels.length; i++) {
      label = labels[i];
      if (!fill.call(self, label)) {
        toBeRemoved.push(label);
      }
    }
    for (let i = 0; i < toBeRemoved.length; i++) {
      toBeRemoved[i].remove();
    }
  }
}

module.exports = Greedy;
