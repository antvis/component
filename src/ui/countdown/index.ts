import fecha from 'fecha';
import { deepMix, isNil } from '@antv/util';
import { Statistic } from '../statistic';
import type { TitleOption, ValueOption } from '../statistic/types';
import type { CountdownCfg, CountdownOptions } from './types';

export type { CountdownCfg, CountdownOptions };

const timeFormatList = {
  D: 1000 * 60 * 60 * 24,
  H: 1000 * 60 * 60,
  m: 1000 * 60,
  s: 1000,
  S: 1,
};

export class Countdown extends Statistic {
  /**
   * 标签类型
   */
  public static tag = 'countdown';

  /**
   * 记录初始化时间戳 倒计时用
   */
  public initTime!: number;

  /**
   * 记录初始化value
   */
  public initValue!: string | number;

  constructor(options: CountdownOptions) {
    super(deepMix({}, options));
  }

  public init(): void {
    const { x, y, value } = this.attributes;
    this.initValue = value.text!;
    this.createText();
    this.timeDynamicTime();
    // 设置位置
    this.translate(x, y);
  }

  // 过滤用
  public getNewText(key: 'title' | 'value') {
    // to be fix later
    // @ts-ignore
    const { text, formatter, format } = this.attributes[key] as Required<TitleOption> | Required<ValueOption>;
    const { initValue } = this;
    if (isNil(text) && !format) {
      return '';
    }
    if (key === 'value' && format && (Number(initValue) || isNil(initValue))) {
      return formatter ? formatter(this.timeAdapter()) : this.timeAdapter();
    }
    return formatter ? formatter(text) : text;
  }

  /**
   * 当前时间用 moment 格式化就好
   * 差值计时器 自定标准 没有大小的限制 最大值由上层决定
   * 天 D 1 DD 01 | 小时 H 1 HH 01 | 分钟 m 1 mm 01 | 秒 s 1 ss 01 | 毫秒 S 1 SS 11 SSS 111 |
   * @returns
   */
  public timeAdapter() {
    const {
      // to be fix later
      // @ts-ignore
      value: { format: formatAttr },
    } = this.attributes;

    if (isNil(this.initValue)) {
      // 初始化，没有 value 就代表 当前值 返货 moment 自定义格式就好
      return fecha.format(new Date(), formatAttr);
    }

    let timeStamp = Number(this.initValue); // 时间戳获取

    if (!this.initTime) {
      this.initTime = Date.now();
    }
    // 动态定时 value值 - ( 当前时间戳 - 初始化时间戳 )
    timeStamp -= Date.now() - this.initTime;
    if (timeStamp <= 0) {
      // 为0 时 返回 0 并且 关闭定时器
      timeStamp = 0;
      // to be fix later
      // @ts-ignore
      this.attributes.value.dynamicTime = false;
    }

    let format = formatAttr;

    // 解析 format 正常格式为 D . H  顺序无所谓  value 为 时间戳差值
    Object.keys(timeFormatList).forEach((key) => {
      const regExp = new RegExp(`${key}{1,${key === 'S' ? 3 : 2}}`, 'g');
      if (regExp.test(format)) {
        // to be fix later
        // @ts-ignore
        const time = Math.floor(timeStamp / timeFormatList[key]);
        // to be fix later
        // @ts-ignore
        timeStamp -= time * timeFormatList[key];
        // to be fix later
        // @ts-ignore
        format = format.replace(regExp, (v) => {
          if (!v) return '';
          if (key === 'S') {
            const ms = (time / 1000).toFixed(v.length);
            return ms.replace(/.\./, '');
          }

          if (v?.length === 1 || time?.toString()?.length !== 1) {
            // 如果是一个 就直接返回
            return `${time}`;
          }

          return `0${time}`;
        });
      }
    });

    return format;
  }

  // 动态时间（计时器 | 当前时间）
  public timeDynamicTime() {
    // to be fix later
    // @ts-ignore
    if (this.getAttribute('value')?.dynamicTime) {
      requestAnimationFrame(() => this.timeDynamicTime());
      const text = this.getNewText('value');
      if (this.attributes?.value?.text === text) return;
      this.updateText({
        value: {
          text,
        },
      });
    }
  }

  public update(cfg: Partial<CountdownCfg>) {
    if (cfg?.value?.text) {
      this.initValue = cfg?.value?.text;
    }
    this.updateText(cfg);
  }

  public updateText(cfg: Partial<CountdownCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.titleShape.attr(this.getTitleShapeShapeCfg());
    this.valueShape.attr(this.getValueShapeShapeCfg());
  }

  public clear() {
    this.removeAttribute('value');
    this.valueShape.destroy();
    this.titleShape.destroy();
  }
}
