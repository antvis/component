const GAP = 20;

const PositionMixin = {
  constraintPositionInBoundary(x, y, width, height, viewWidth, viewHeight) {
    if (x + width + GAP > viewWidth) {
      x -= width + GAP;
      x = x < 0 ? 0 : x;
    } else if (x + GAP < 0) {
      x = GAP;
    } else {
      x += GAP;
    }

    if (y + height + GAP > viewHeight) {
      y -= (height + GAP);
      y = y < 0 ? 0 : y;
    } else if (y + GAP < 0) {
      y = GAP;
    } else {
      y += GAP;
    }

    return [ x, y ];
  },

  constraintPositionInPlot(x, y, width, height, plotRange, onlyHorizontal) {
    if (x + width > plotRange.tr.x) {
      x -= (width + 2 * GAP);
    }

    if (x < plotRange.tl.x) {
      x = plotRange.tl.x;
    }

    if (!onlyHorizontal) {
      if (y + height > plotRange.bl.y) {
        y -= height + 2 * GAP;
      }

      if (y < plotRange.tl.y) {
        y = plotRange.tl.y;
      }
    }
    return [ x, y ];
  }

};
module.exports = PositionMixin;
