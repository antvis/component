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
 * 下三角形
 */
export function triangleDown(x: number, y: number, r: number) {
  const diffY = r * Math.sin((1 / 3) * Math.PI);
  return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x, y + diffY], ['Z']];
}

/** -----------------------------LineSymbols-------------------------------------------- */

export function line(x: number, y: number, r: number) {
  return [
    ['M', x - r, y],
    ['L', x + r, y],
  ];
}

export function dot(x: number, y: number, r: number) {
  return [
    ['M', x - r, y],
    ['L', x + r, y],
  ];
}

export function dash(x: number, y: number, r: number) {
  return [
    ['M', x - r, y],
    ['L', x + r, y],
  ];
}

export function smooth(x: number, y: number, r: number) {
  return [
    ['M', x - r, y],
    ['A', r / 2, r / 2, 0, 1, 1, x, y],
    ['A', r / 2, r / 2, 0, 1, 0, x + r, y],
  ];
}

export function hv(x: number, y: number, r: number) {
  return [
    ['M', x - r - 1, y - 2.5],
    ['L', x, y - 2.5],
    ['L', x, y + 2.5],
    ['L', x + r + 1, y + 2.5],
  ];
}

export function vh(x: number, y: number, r: number) {
  return [
    ['M', x - r - 1, y + 2.5],
    ['L', x, y + 2.5],
    ['L', x, y - 2.5],
    ['L', x + r + 1, y - 2.5],
  ];
}

export function hvh(x: number, y: number, r: number) {
  return [
    ['M', x - (r + 1), y + 2.5],
    ['L', x - r / 2, y + 2.5],
    ['L', x - r / 2, y - 2.5],
    ['L', x + r / 2, y - 2.5],
    ['L', x + r / 2, y + 2.5],
    ['L', x + r + 1, y + 2.5],
  ];
}

export function vhv(x: number, y: number) {
  // 宽 13px，高 8px
  return [
    ['M', x - 5, y + 2.5],
    ['L', x - 5, y],
    ['L', x, y],
    ['L', x, y - 3],
    ['L', x, y + 3],
    ['L', x + 6.5, y + 3],
  ];
}

/** --------------------------------------------------------------------------------- */
