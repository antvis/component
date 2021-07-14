/**
 * 保留x位小数
 */
export function toPrecision(num: number, precision: number) {
  const _ = 10 ** precision;
  return Number(Math.round(num * _).toFixed(0)) / _;
}
