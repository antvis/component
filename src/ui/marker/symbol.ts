/**
 * 圆形
 */
export function circle(x: number, y: number, r: number) {
  return [
    ['M', x - r, y],
    ['A', r, r, 0, 1, 0, x + r, y],
    ['A', r, r, 0, 1, 0, x - r, y],
  ];
}

/**
 * 正方形
 */
export function square(x: number, y: number, r: number) {
  return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x + r, y + r], ['L', x - r, y + r], ['Z']];
}

/**
 * 菱形
 */
export function diamond(x: number, y: number, r: number) {
  return [['M', x - r, y], ['L', x, y - r], ['L', x + r, y], ['L', x, y + r], ['Z']];
}

/**
 * 三角形
 */
export function triangle(x: number, y: number, r: number) {
  const diffY = r * Math.sin((1 / 3) * Math.PI);
  return [['M', x - r, y + diffY], ['L', x, y - diffY], ['L', x + r, y + diffY], ['Z']];
}

/**
 * 三角形
 */
export function triangleDown(x: number, y: number, r: number) {
  const diffY = r * Math.sin((1 / 3) * Math.PI);
  return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x, y + diffY], ['Z']];
}
