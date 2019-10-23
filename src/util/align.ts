// 检测各边是否超出
export function getOutSides(x, y, width, height, limitBox) {
  const hits = {
    left: x < limitBox.x,
    right: x + width > limitBox.x + limitBox.width,
    top: y < limitBox.y,
    bottom: y + height > limitBox.y + limitBox.height,
  };
  return hits;
}

export function getPointByPosition(x, y, offset, width, height, position) {
  let px = x;
  let py = y;
  switch (position) {
    case 'left': // left center
      px = x - width - offset;
      py = y - height / 2;
      break;
    case 'right':
      px = x + offset;
      py = y - height / 2;
      break;
    case 'top':
      px = x - width / 2;
      py = y - height - offset;
      break;
    default:
      // bottom
      px = x - width / 2;
      py = y + offset;
      break;
  }

  return {
    x: px,
    y: py,
  };
}

export function getAlignPoint(x, y, offset, width, height, position, limitBox?) {
  const point = getPointByPosition(x, y, offset, width, height, position);
  if (limitBox) {
    const outSides = getOutSides(point.x, point.y, width, height, limitBox);
    if (position === 'top' || position === 'bottom') {
      if (outSides.left) {
        // 左侧躲避
        point.x = limitBox.x;
      }
      if (outSides.right) {
        // 右侧躲避
        point.x = limitBox.x + limitBox.width - width;
      }
      if (position === 'top' && outSides.top) {
        // 如果上面对齐检测上面，不检测下面
        point.y = y + offset;
      }
      if (position === 'bottom' && outSides.bottom) {
        point.y = y - height - offset;
      }
    } else {
      // 检测左右位置
      if (outSides.top) {
        point.y = limitBox.y;
      }
      if (outSides.bottom) {
        point.y = limitBox.y + limitBox.height - height;
      }
      if (position === 'left' && outSides.left) {
        point.x = x + offset;
      }
      if (position === 'right' && outSides.right) {
        point.x = x - width - offset;
      }
    }
  }
  return point;
}
