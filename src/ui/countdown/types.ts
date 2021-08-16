import type { DisplayObjectConfig } from '../../types';
import type { TagCfg } from '../tag/types';
import type { StatisticCfg } from '../statistic/types';

export type ValueCfg = TagCfg & {
  /** 数值文本内容 fixme 倒计时不需要输入 text */
  text?: string;
  /** 倒计时时间戳 */
  timestamp?: number;
  /** 格式化倒计时展示 */
  format?: string;
};

export interface CountdownCfg extends StatisticCfg {
  /** 倒计时数值内容的配置项 */
  value?: ValueCfg;
  /** 倒计时完成时触发 */
  onFinish?: () => void;
}

export type CountdownOptions = DisplayObjectConfig<CountdownCfg>;
