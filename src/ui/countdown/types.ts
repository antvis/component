import { DisplayObjectConfig } from '../../types';
import type { StatisticCfg, ValueOption as Option } from '../statistic/types';

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

export interface CountdownCfg extends StatisticCfg {
  value?: ValueOption;
}

export type CountdownOptions = DisplayObjectConfig<CountdownCfg>;
