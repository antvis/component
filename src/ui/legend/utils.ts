import type { PathCommand } from '@antv/g';
import { isUndefined } from '@antv/util';
import { Marker } from '../marker';
import { toPrecision } from '../../util';

/**
 * 梯形色板
 * @param width 完整的宽度
 * @param height 完整高度
 * @param x 起点x坐标
 * @param y 起点y坐标
 * @param start 梯形起点
 * @param end 梯形终点
 * @returns PathCommand[]
 */
export function createTrapezoidRailPath(
  width: number,
  height: number,
  x: number = 0,
  y: number = 0,
  start?: number,
  end?: number
) {
  const st = isUndefined(start) ? x : start;
  const ed = isUndefined(end) ? x + width : end;
  const slope = height / width;

  return [
    ['M', st, height],
    ['L', st, slope * (width - st - x)],
    ['L', ed, slope * (width - ed - x)],
    ['L', ed, height],
    ['Z'],
  ] as PathCommand[];
}

/**
 * 矩形色板
 * @param width 完整的宽度
 * @param height 完整高度
 * @param x 起点x坐标
 * @param y 起点y坐标
 * @param start 矩形起点
 * @param end 矩形终点
 * @returns PathCommand[]
 */
export function createRectRailPath(
  width: number,
  height: number,
  x: number = 0,
  y: number = 0,
  start?: number,
  end?: number
) {
  const st = isUndefined(start) ? x : start;
  const ed = isUndefined(end) ? x + width : end;

  return [['M', st, height], ['L', st, 0], ['L', ed, 0], ['L', ed, height], ['Z']] as PathCommand[];
}

/**
 * 根据值转换为其在rail上的偏移量
 * @param value 值
 * @param min 最小值
 * @param max 最大值
 * @param railLen rail长度
 * @param reverse 反向取值
 * @returns
 */
export function getValueOffset(
  value: number,
  min: number,
  max: number,
  railLen: number,
  reverse: boolean = false
): number {
  // 将value映射到 startRail, endRail
  if (reverse) return (value / railLen) * (max - min);
  return toPrecision(((value - min) / (max - min)) * railLen, 2);
}

/**
 * 将值转换至步长tick上
 */
export function getStepValueByValue(value: number, step: number, min: number) {
  const count = Math.round((value - min) / step);
  return min + count * step;
}

// 左箭头
export function leftArrow(x: number, y: number, r: number) {
  const diffY = r * Math.sin((1 / 3) * Math.PI);
  return [['M', x - r, y], ['L', x + r, y - diffY], ['L', x + r, y + diffY], ['Z']];
}

// 右箭头
export function rightArrow(x: number, y: number, r: number) {
  const diffY = r * Math.sin((1 / 3) * Math.PI);
  return [['M', x + r, y], ['L', x - r, y - diffY], ['L', x - r, y + diffY], ['Z']];
}

// 上三角
export function upArrow(x: number, y: number, r: number) {
  const diffY = r * Math.cos((1 / 3) * Math.PI);
  return [['M', x - r, y + diffY], ['L', x, y - diffY], ['L', x + r, y + diffY], ['Z']];
}

// 下三角
export function downArrow(x: number, y: number, r: number) {
  const diffY = r * Math.cos((1 / 3) * Math.PI);
  return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x, y + diffY], ['Z']];
}

export function hiddenHandle(x: number, y: number, r: number) {
  // 长宽比
  const ratio = 1.4;
  const diffY = ratio * r;
  return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x + r, y + diffY], ['L', x - r, y + diffY], ['Z']];
}

// 控制手柄
const HANDLE_HEIGHT_RATIO = 1.4;
const HANDLE_TRIANGLE_RATIO = 0.4;

// 纵向手柄
export function verticalHandle(x: number, y: number, r: number) {
  const width = r;
  const height = width * HANDLE_HEIGHT_RATIO;
  const halfWidth = width / 2;
  const oneSixthWidth = width / 6;
  const triangleX = x + height * HANDLE_TRIANGLE_RATIO;
  return [
    ['M', x, y],
    ['L', triangleX, y + halfWidth],
    ['L', x + height, y + halfWidth],
    ['L', x + height, y - halfWidth],
    ['L', triangleX, y - halfWidth],
    ['Z'],
    // 绘制两条横线
    ['M', triangleX, y + oneSixthWidth],
    ['L', x + height - 2, y + oneSixthWidth],
    ['M', triangleX, y - oneSixthWidth],
    ['L', x + height - 2, y - oneSixthWidth],
  ];
}

// 横向手柄
export function horizontalHandle(x: number, y: number, r: number) {
  const width = r;
  const height = width * HANDLE_HEIGHT_RATIO;
  const halfWidth = width / 2;
  const oneSixthWidth = width / 6;
  const triangleY = y + height * HANDLE_TRIANGLE_RATIO;
  return [
    ['M', x, y],
    ['L', x - halfWidth, triangleY],
    ['L', x - halfWidth, y + height],
    ['L', x + halfWidth, y + height],
    ['L', x + halfWidth, triangleY],
    ['Z'],
    // 绘制两条竖线
    ['M', x - oneSixthWidth, triangleY],
    ['L', x - oneSixthWidth, y + height - 2],
    ['M', x + oneSixthWidth, triangleY],
    ['L', x + oneSixthWidth, y + height - 2],
  ];
}

Marker.registerSymbol('leftArrow', leftArrow);
Marker.registerSymbol('rightArrow', rightArrow);
Marker.registerSymbol('upArrow', upArrow);
Marker.registerSymbol('downArrow', downArrow);
Marker.registerSymbol('hiddenHandle', hiddenHandle);
Marker.registerSymbol('verticalHandle', verticalHandle);
Marker.registerSymbol('horizontalHandle', horizontalHandle);
