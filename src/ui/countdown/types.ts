import type { StatisticAttrs, StatisticOptions, ValueOption as Option } from '../statistic/types';

export interface ValueOption extends Option {
  /**
   * 格式化时间
   */
  format?: string;
  /**
   * 值 时间 是否动态时间 传入 value 为倒计时 不传入 为 当前时间
   */
  dynamicTime?: boolean;
}

export interface CountdownAttrs extends StatisticAttrs {
  value?: ValueOption;
}

export interface CountdownOptions extends StatisticOptions {
  attrs: CountdownAttrs;
}
