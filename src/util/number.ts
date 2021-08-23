/**
 * 保留x位小数
 */
export function toPrecision(num: number, precision: number) {
  const _ = 10 ** precision;
  // eslint-disable-next-line
  return ~~(num * _) / _;
}

/**
 * 千分位
 * 100000 -> 10,000
 */
export function toThousands(num: number) {
  return num.toLocaleString();
}

/**
 * 获得数字科学计数
 * 1000000 = 1e6
 */
export function toScientificNotation(num: number) {
  return num.toExponential();
}

/**
 * 用k的方式表达
 * 1234 -> 1K
 * 12345 -> 12K
 */
export function toKNotation(num: number, precision: number = 0) {
  if (Math.abs(num) < 1000) return String(num);
  return `${toPrecision(num / 1000, precision).toLocaleString()}K`;
}
