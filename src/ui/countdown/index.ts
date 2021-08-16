import { deepMix, isNil } from '@antv/util';
import { Statistic } from '../statistic';
import { formatTimeStr } from './utils';
import type { GUIOption } from '../../types';
import type { CountdownCfg, CountdownOptions } from './types';

export type { CountdownCfg, CountdownOptions };

const REFRESH_INTERVAL = 1000 / 30;

export class Countdown extends Statistic<CountdownCfg> {
  /**
   * 标签类型
   */
  public static tag = 'countdown';

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<CountdownCfg> = deepMix({}, Statistic.defaultOptions, {
    style: {
      value: {
        // 默认 30s
        timestamp: Date.now() + 1000 * 30,
      },
    },
  });

  /**
   * 记录初始化时间戳 倒计时用
   */
  public countdownId: number | undefined;

  /**
   * 记录初始化value
   */
  public timestamp!: number;

  /**
   * @override
   */
  public init(): void {
    super.init();
    this.timestamp = this.attributes.value.timestamp!;
    this.startTimer();
  }

  /**
   * @override 倒计时组件, 时间文本（value.text）复写更新
   */
  public update(cfg: Partial<CountdownCfg>) {
    super.update(cfg);
  }

  /**
   * 更新 倒计时数值
   */
  private formatCountdown(cfg?: Partial<CountdownCfg>): string {
    let format = this.attributes.value?.format;
    if (cfg?.value?.format) {
      format = cfg.value.format;
    }

    const target = new Date(this.timestamp).getTime();
    const current = Date.now();
    const diff = Math.max(target - current, 0);
    let text = !isNil(diff) ? `${diff}` : '';
    if (format) {
      text = formatTimeStr(diff, format);
    }
    return text;
  }

  private startTimer() {
    if (this.countdownId) return;

    this.countdownId = window.setInterval(() => {
      const text = this.formatCountdown();
      this.valueShape.update({ text });

      if (this.timestamp <= Date.now()) {
        this.stopTimer();
      }
    }, REFRESH_INTERVAL);
  }

  private stopTimer() {
    if (this.countdownId) {
      clearInterval(this.countdownId);
      this.countdownId = undefined;

      const { onFinish } = this.attributes;
      if (onFinish) {
        onFinish();
      }
    }
  }
}
