const SQRT = Math.SQRT2;

function _adjust(shape, x, y) {
  const bbox = shape.getBBox();
  const cellSize = Math.min(bbox.width, bbox.height);
  const points = [[]];
  let index = 0;
  const path = shape.attr('path');
  path.forEach((segment, i) => {
    if (segment[0] === 'z' || segment[0] === 'Z' && i !== path.length - 1) {
      points.push([]);
      index += 1;
    }
    if (segment.length === 3) {
      points[index].push([ segment[1], segment[2] ]);
    }
  });
  let h = cellSize / 2;
  const cellQueue = [];
  if (cellSize === 0) {
    return { x, y };
  }
  for (let i = bbox.minX; i < bbox.maxX; i += cellSize) {
    for (let j = bbox.minY; j < bbox.maxY; j += cellSize) {
      cellQueue.push(getCell(i + h, j + h, h, points));
    }
  }
  let best = getCell(x, y, 0, points);
  const boxCell = getCell(bbox.minX + bbox.width / 2, bbox.minY + bbox.height / 2, 0, points);
  if (boxCell > best.d) {
    best = boxCell;
  }
  let cell;
  while (cellQueue.length) {
    cell = cellQueue.pop();

    if (cell.d > best.d) {
      best = cell;
    }
    if (cell.max - best.d <= 1) {
      continue;
    }

    h = cell.h / 2;
    cellQueue.push(getCell(cell.x - h, cell.y - h, h, points));
    cellQueue.push(getCell(cell.x + h, cell.y - h, h, points));
    cellQueue.push(getCell(cell.x - h, cell.y + h, h, points));
    cellQueue.push(getCell(cell.x + h, cell.y + h, h, points));
  }
  return { x: best.x, y: best.y };
}

function getCell(x, y, h, points) {
  const d = _calcDist(x, y, points);
  return {
    x,
    y,
    h,
    d,
    max: d + h * SQRT
  };
}

function _segmentDist(px, py, a, b) {
  let x = a[0],
    y = a[1],
    dx = b[0] - x,
    dy = b[1] - y,
    t;
  if (dx !== 0 || dy !== 0) {
    t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = b[0];
      y = b[1];

    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = px - x;
  dy = py - y;
  return dx * dx + dy * dy;
}

function _calcDist(x, y, points) {
  let inside = false;
  let minDist = Infinity;
  let polygon,
    a,
    b,
    length;
  for (let k = 0; k < points.length; k++) {
    polygon = points[k];
    length = polygon.length;
    for (let i = 0, j = length - 1; i < length; j = i++) {
      a = polygon[i];
      b = polygon[j];
      if ((a[1] > y !== b[1] > y) && (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) {
        inside = !inside;
      }
      minDist = Math.min(minDist, _segmentDist(x, y, a, b));
    }
  }

  return (inside ? 1 : -1) * Math.sqrt((minDist));
}

module.exports = function adjust(labels, shapes) {
  let label,
    shape,
    position;
  for (let i = 0; i < labels.length; i++) {
    label = labels[i];
    shape = shapes[i];
    position = _adjust(shape, label.attr('x'), label.attr('y'));
    label.attr(position);
  }
};

