/** -- Closable path ------------------------------------------------------------------------------- */

/**
 * ○
 */
export function circle(x: number, y: number, r: number) {
  return [['M', x - r, y], ['A', r, r, 0, 1, 0, x + r, y], ['A', r, r, 0, 1, 0, x - r, y], ['Z']];
}

/**
 * Cname circle to point.
 */
export const point = circle;

/**
 * □
 */
export function square(x: number, y: number, r: number) {
  return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x + r, y + r], ['L', x - r, y + r], ['Z']];
}

/**
 * ◇
 */
export function diamond(x: number, y: number, r: number) {
  return [['M', x - r, y], ['L', x, y - r], ['L', x + r, y], ['L', x, y + r], ['Z']];
}

/**
 * △
 */
export function triangle(x: number, y: number, r: number) {
  const diffY = r * Math.sin((1 / 3) * Math.PI);
  return [['M', x - r, y + diffY], ['L', x, y - diffY], ['L', x + r, y + diffY], ['Z']];
}

/**
 * ▽
 */
export function triangleDown(x: number, y: number, r: number) {
  const diffY = r * Math.sin((1 / 3) * Math.PI);
  return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x, y + diffY], ['Z']];
}

/**
 * ⬡
 */
export function hexagon(x: number, y: number, r: number) {
  const diffX = (r / 2) * Math.sqrt(3);
  return [
    ['M', x, y - r],
    ['L', x + diffX, y - r / 2],
    ['L', x + diffX, y + r / 2],
    ['L', x, y + r],
    ['L', x - diffX, y + r / 2],
    ['L', x - diffX, y - r / 2],
    ['Z'],
  ];
}

/**
 * ▷◁
 */
export function bowtie(x: number, y: number, r: number) {
  const diffY = r - 1.5;
  return [['M', x - r, y - diffY], ['L', x + r, y + diffY], ['L', x + r, y - diffY], ['L', x - r, y + diffY], ['Z']];
}

/** -- 非闭合图形 ------------------------------------------------------------------------------- */

/**
 * |
 */
export function line(x: number, y: number, r: number) {
  return [
    ['M', x - r, y],
    ['L', x + r, y],
  ];
}

/**
 * ✕
 */
export function cross(x: number, y: number, r: number) {
  return [
    ['M', x - r, y - r],
    ['L', x + r, y + r],
    ['M', x + r, y - r],
    ['L', x - r, y + r],
  ];
}

/**
 * 工
 */
export function tick(x: number, y: number, r: number) {
  return [
    ['M', x - r / 2, y - r],
    ['L', x + r / 2, y - r],
    ['M', x, y - r],
    ['L', x, y + r],
    ['M', x - r / 2, y + r],
    ['L', x + r / 2, y + r],
  ];
}

/**
 * +
 */
export function plus(x: number, y: number, r: number) {
  return [
    ['M', x - r, y],
    ['L', x + r, y],
    ['M', x, y - r],
    ['L', x, y + r],
  ];
}

/**
 * -
 */
export function hyphen(x: number, y: number, r: number) {
  return [
    ['M', x - r, y],
    ['L', x + r, y],
  ];
}

/** -- 用于图例的 marker ------------------------------------------------------------------------------- */

/**
 * ---
 */
export function dot(x: number, y: number, r: number) {
  return [
    ['M', x - r, y],
    ['L', x + r, y],
  ];
}

export const dash = dot;

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
