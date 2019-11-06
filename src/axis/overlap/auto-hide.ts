import { IElement, IGroup } from '@antv/g-base/lib/interfaces';
import { getMaxLabelWidth } from '../../util/label';

// 文本是否旋转
function isRotate(label: IElement) {
  const matrix = label.attr('matrix');
  return matrix && matrix[0] !== 1; // 仅在这个场景下判定
}

// 是否超出限制
function isOutLimit(isVertical: boolean, label: IElement, limitLength: number) {
  if (!limitLength) {
    // 如果没限制 limitLength 则直接返回 false
    return false;
  }
  const canvasBBox = label.getCanvasBBox();
  let isOut = false;
  if (isVertical) {
    isOut = canvasBBox.width > limitLength;
  } else {
    isOut = canvasBBox.height > limitLength;
  }
  return isOut;
}

// 是否重叠
function isOverlap(isVertical: boolean, rotated: boolean, preBox, curBox, reversed = false) {
  let overlap = false;
  if (isVertical) {
    // 垂直时检测边高
    overlap = Math.abs(preBox.y - curBox.y) < preBox.height;
  } else {
    // 水平时检测
    if (rotated) {
      // 如果旋转了，则检测两者 x 之间的间距是否小于前一个的高度
      const height = reversed ? curBox.height : preBox.height;
      overlap = Math.abs(preBox.x - curBox.x) < height;
    } else {
      // 检测两者是否 x 方向重合
      const width = reversed ? curBox.width : preBox.width;
      overlap = Math.abs(preBox.x - curBox.x) < width;
    }
  }
  return overlap;
}

// 保留第一个或者最后一个
function reserveOne(isVertical: boolean, labelsGroup: IGroup, limitLength: number, reversed: boolean) {
  const labels = labelsGroup.getChildren().slice(); // 复制数组
  if (!labels.length) {
    return;
  }
  if (reversed) {
    // 翻转
    labels.reverse();
  }
  const count = labels.length;
  const first = labels[0];
  const rotated = isRotate(first);
  let preBox = first.getBBox();
  for (let i = 1; i < count; i++) {
    const label = labels[i];
    const curBBox = label.getBBox();
    const isHide =
      isOutLimit(isVertical, label, limitLength) || isOverlap(isVertical, rotated, preBox, curBBox, reversed);
    if (isHide) {
      label.hide();
    } else {
      preBox = curBBox;
    }
  }
}

/**
 * 保证首个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number}  limitLength 长度限制
 */
export function reserveFirst(isVertical: boolean, labelsGroup: IGroup, limitLength: number) {
  reserveOne(isVertical, labelsGroup, limitLength, false);
}

/**
 * 保证最后一个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number}  limitLength 长度限制
 */
export function reserveLast(isVertical: boolean, labelsGroup: IGroup, limitLength: number) {
  reserveOne(isVertical, labelsGroup, limitLength, true);
}

/**
 * 保证第一个最后一个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number}  limitLength 长度限制
 */
export function reserveBoth(isVertical: boolean, labelsGroup: IGroup, limitLength: number) {
  const labels = labelsGroup.getChildren().slice(); // 复制数组
  if (labels.length <= 2) {
    // 如果数量小于或等于 2 则直接返回
    return;
  }
  const count = labels.length;
  const first = labels[0];
  const last = labels[count - 1];
  const rotated = isRotate(first);
  let preBox = first.getBBox();
  let preLabel = first;
  // 按照先保存第一个的逻辑循环一遍，最后一个不参与循环
  for (let i = 1; i < count - 1; i++) {
    const label = labels[i];
    const curBBox = label.getBBox();
    const isHide = isOutLimit(isVertical, label, limitLength) || isOverlap(isVertical, rotated, preBox, curBBox);
    if (isHide) {
      label.hide();
    } else {
      preBox = curBBox;
      preLabel = label;
    }
  }

  const lastBBox = last.getBBox();
  const overlap = isOverlap(isVertical, rotated, preBox, lastBBox); // 不检测超出 limit
  if (overlap) {
    // 发生冲突，则隐藏前一个保留后一个
    preLabel.hide();
  }
}

/**
 * 保证 label 均匀显示，主要解决文本层叠的问题，对于 limitLength 不处理
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number}  limitLength 长度限制
 */
export function equidistance(isVertical: boolean, labelsGroup: IGroup) {
  const labels = labelsGroup.getChildren().slice(); // 复制数组
  if (labels.length < 2) {
    // 如果数量小于 2 则直接返回，等于 2 时可能也会重合
    return;
  }
  const first = labels[0];
  const firstBBox = first.getBBox();
  const second = labels[1];
  const rotated = isRotate(first);
  const count = labels.length;
  let interval = 0; // 不重叠的坐标文本间距个数
  if (isVertical) {
    // 垂直的坐标轴计算垂直方向的间距
    const distance = Math.abs(second.attr('y') - first.attr('y'));
    interval = firstBBox.height / distance;
  } else {
    // 水平坐标轴
    if (rotated) {
      const distance = Math.abs(second.attr('x') - first.attr('x'));
      interval = firstBBox.width / distance;
    } else {
      const maxWidth = getMaxLabelWidth(labels);
      const distance = Math.abs(second.attr('x') - first.attr('x'));
      interval = maxWidth / distance;
    }
  }
  // interval > 1 时需要对 label 进行隐藏
  if (interval > 1) {
    interval = Math.ceil(interval);
    for (let i = 0; i < count; i++) {
      if (i % interval !== 0) {
        // 仅保留被整除的 label
        labels[i].hide();
      }
    }
  }
}
