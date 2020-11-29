import { IElement, IGroup } from '@antv/g-base';
import { AxisLabelAutoHideCfg } from '../../types';
import { getMaxLabelWidth } from '../../util/label';
import { getAngleByMatrix } from '../../util/matrix';
import { near } from '../../util/util';

// 文本是否旋转
function isRotate(label: IElement) {
  const matrix = label.attr('matrix');
  return matrix && matrix[0] !== 1; // 仅在这个场景下判定
}

function getRotateAngle(label: IElement) {
  const angle = isRotate(label) ? getAngleByMatrix(label.attr('matrix')) : 0;
  return angle % 360;
}

// autohide 不再考虑超出限制
// function isOutLimit(isVertical: boolean, label: IElement, limitLength: number) {
//   if (!limitLength) {
//     // 如果没限制 limitLength 则直接返回 false
//     return false;
//   }
//   const canvasBBox = label.getCanvasBBox();
//   let isOut = false;
//   if (isVertical) {
//     isOut = canvasBBox.width > limitLength;
//   } else {
//     isOut = canvasBBox.height > limitLength;
//   }
//   return isOut;
// }

// 是否重叠
function isOverlap(isVertical: boolean, first: IElement, second: IElement, minGap: number) {
  let overlap = false;
  const angle = getRotateAngle(first);
  const distance = isVertical
    ? Math.abs(second.attr('y') - first.attr('y'))
    : Math.abs(second.attr('x') - first.attr('x'));
  const prevBBox = (isVertical
  ? second.attr('y') > first.attr('y')
  : second.attr('x') > first.attr('x'))
    ? first.getBBox()
    : second.getBBox();

  if (isVertical) {
    const ratio = Math.abs(Math.cos(angle));
    if (near(ratio, 0, Math.PI / 180)) {
      overlap = prevBBox.width + minGap > distance;
    } else {
      overlap = prevBBox.height / ratio + minGap > distance;
    }
  } else {
    const ratio = Math.abs(Math.sin(angle));
    if (near(ratio, 0, Math.PI / 180)) {
      overlap = prevBBox.width + minGap > distance;
    } else {
      overlap = prevBBox.height / ratio + minGap > distance;
    }
  }

  return overlap;
}

// 保留第一个或者最后一个
function reserveOne(isVertical: boolean, labelsGroup: IGroup, reversed: boolean, autoHideCfg?: AxisLabelAutoHideCfg) {
  const minGap = autoHideCfg?.minGap || 0;
  const labels = labelsGroup
    .getChildren()
    .slice() // 复制数组
    .filter((item) => item.get('visible'));
  if (!labels.length) {
    return false;
  }
  let hasHide = false;
  if (reversed) {
    // 翻转
    labels.reverse();
  }
  const count = labels.length;
  const first = labels[0];
  let prev = first;
  for (let i = 1; i < count; i++) {
    const label = labels[i];
    const curBBox = label.getBBox();
    // 不再考虑超出限制，而仅仅根据是否重叠进行隐藏 isOutLimit(isVertical, label, limitLength) ||
    const isHide = isOverlap(isVertical, prev, label, minGap);
    if (isHide) {
      label.hide();
      hasHide = true;
    } else {
      prev = label;
    }
  }
  return hasHide;
}

// 均匀抽样隐藏标签，注意这里假设 label/tick 是均匀的
function parityHide(isVertical: boolean, labelsGroup: IGroup, autoHideCfg?: AxisLabelAutoHideCfg) {
  const minGap = autoHideCfg?.minGap || 0;
  const labels = labelsGroup.getChildren().slice(); // 复制数组
  if (labels.length < 2) {
    // 如果数量小于 2 则直接返回，等于 2 时可能也会重合
    return false;
  }
  let hasHide = false;
  const first = labels[0];
  const firstBBox = first.getBBox();
  const second = labels[1];
  const count = labels.length;
  const angle = getRotateAngle(first);
  const distance = isVertical
    ? Math.abs(second.attr('y') - first.attr('y'))
    : Math.abs(second.attr('x') - first.attr('x'));
  let interval = 0; // 不重叠的坐标文本间距个数
  if (isVertical) {
    // 垂直的坐标轴计算垂直方向的间距
    const ratio = Math.abs(Math.cos(angle));
    if (near(ratio, 0, Math.PI / 180)) {
      const maxWidth = getMaxLabelWidth(labels);
      interval = (maxWidth + minGap) / distance;
    } else {
      interval = (firstBBox.height / ratio + minGap) / distance;
    }
  } else {
    // 水平坐标轴
    const ratio = Math.abs(Math.sin(angle));
    if (near(ratio, 0, Math.PI / 180)) {
      const maxWidth = getMaxLabelWidth(labels);
      interval = (maxWidth + minGap) / distance;
    } else {
      interval = (firstBBox.height / ratio + minGap) / distance;
    }
  }
  // interval > 1 时需要对 label 进行隐藏
  if (interval > 1) {
    interval = Math.ceil(interval);
    for (let i = 0; i < count; i++) {
      if (i % interval !== 0) {
        // 仅保留被整除的 label
        labels[i].hide();
        hasHide = true;
      }
    }
  }
  return hasHide;
}

export function getDefault() {
  return equidistance;
}

/**
 * 保证首个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
export function reserveFirst(
  isVertical: boolean,
  labelsGroup: IGroup,
  limitLength?: number,
  autoHideCfg?: AxisLabelAutoHideCfg
): boolean {
  return reserveOne(isVertical, labelsGroup, false, autoHideCfg);
}

/**
 * 保证最后一个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
export function reserveLast(
  isVertical: boolean,
  labelsGroup: IGroup,
  limitLength?: number,
  autoHideCfg?: AxisLabelAutoHideCfg
): boolean {
  return reserveOne(isVertical, labelsGroup, true, autoHideCfg);
}

/**
 * 保证第一个最后一个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
export function reserveBoth(
  isVertical: boolean,
  labelsGroup: IGroup,
  limitLength?: number,
  autoHideCfg?: AxisLabelAutoHideCfg
): boolean {
  const minGap = autoHideCfg?.minGap || 0;
  const labels = labelsGroup.getChildren().slice(); // 复制数组
  if (labels.length <= 2) {
    // 如果数量小于或等于 2 则直接返回
    return false;
  }
  let hasHide = false;
  const count = labels.length;
  const first = labels[0];
  const last = labels[count - 1];
  let preLabel = first;
  // 按照先保存第一个的逻辑循环一遍，最后一个不参与循环
  for (let i = 1; i < count - 1; i++) {
    const label = labels[i];
    const curBBox = label.getBBox();
    // 废弃 isOutLimit(isVertical, label, limitLength) ||
    const isHide = isOverlap(isVertical, preLabel, label, minGap);
    if (isHide) {
      label.hide();
      hasHide = true;
    } else {
      preLabel = label;
    }
  }

  const overlap = isOverlap(isVertical, preLabel, last, minGap);
  if (overlap) {
    // 发生冲突，则隐藏前一个保留后一个
    preLabel.hide();
    hasHide = true;
  }
  return hasHide;
}

/**
 * 保证 label 均匀显示 和 不出现重叠，主要解决文本层叠的问题，对于 limitLength 不处理
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
export function equidistance(
  isVertical: boolean,
  labelsGroup: IGroup,
  limitLength?: number,
  autoHideCfg?: AxisLabelAutoHideCfg
): boolean {
  let hasHide = parityHide(isVertical, labelsGroup, autoHideCfg);

  // 处理  timeCat 类型的 tick，在均匀的基础上，再次检查出现重叠的进行隐藏
  if (reserveOne(isVertical, labelsGroup, false)) {
    hasHide = true;
  }

  return hasHide;
}

/**
 * 同 equidistance， 首先会保证 labels 均匀显示，然后会保留首尾
 * @param isVertical
 * @param labelsGroup
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
export function equidistanceWithReverseBoth(
  isVertical: boolean,
  labelsGroup: IGroup,
  limitLength?: number,
  autoHideCfg?: AxisLabelAutoHideCfg
): boolean {
  const labels = labelsGroup.getChildren().slice(); // 复制数组
  let hasHide = parityHide(isVertical, labelsGroup, autoHideCfg);

  if (labels.length > 2) {
    const first = labels[0];
    const last = labels[labels.length - 1];

    // 如果第一个被隐藏了
    if (!first.get('visible')) {
      first.show();
      if (reserveOne(isVertical, labelsGroup, false, autoHideCfg)) {
        hasHide = true;
      }
    }

    // 如果最后一个被隐藏了
    if (!last.get('visible')) {
      last.show();
      if (reserveOne(isVertical, labelsGroup, true, autoHideCfg)) {
        hasHide = true;
      }
    }
  }

  return hasHide;
}
