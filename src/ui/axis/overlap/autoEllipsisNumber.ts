import { Text } from '@antv/g';
import { maxBy, measureTextWidth } from '@antv/util';
import { getFont, toThousands, toKNotation, toScientificNotation } from '../../../util';

/**
 * @Aarebecca to write more test cases.
 * todo 需要考虑国际化问题，具体省略规则策略见：https://yuque.antfin.com/antv/cfksca/406601
 * 宽度为 width 时采取何种数字缩写缩略
 */
export function getNumberSimplifyStrategy(labels: Text[], width: number) {
  // 确定最长的数字使用的计数方法
  // 其余数字都采用该方法
  // @ts-ignore
  const ticks: any[] = labels.map((d, idx) => ({ text: d.style.text, value: Number(d.style.tip || d.style.text) }));
  const num = Number(maxBy(ticks, ({ text }) => text?.length || 0).value);
  const font = getFont(labels[0]);

  /**
   * 输入： 100000000， 宽度x
   * 1. 原始数值    100,000,000
   * 2. K表达      100,000K
   * 3. 科学计数    1e+8
   */
  let result = toThousands(num);
  if (measureTextWidth(result, font) <= width) {
    return (text: string, label: Text) => toThousands(Number(text));
  }
  result = toKNotation(num);
  if (measureTextWidth(result, font) <= width) {
    return (text: string, label: Text) => toKNotation(Number(text), 1);
  }
  // 如果都不行，只能用科学计数法了
  return (text: string, label: Text) => toScientificNotation(Number(text));
}
