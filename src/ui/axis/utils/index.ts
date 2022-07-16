import { pick, noop, isNil } from '@antv/util';
import { OverlapUtils, OverlapCallback } from '../overlap';
import { LinearAxisStyleProps, OverlapType } from '../types';

export * from './helper';

export function calcOptimizedTicks(ticks: any[], ticksThreshold?: number | false, appendTick?: boolean) {
  // Apply default id to ticks data.
  const T = Array.from(ticks || []).map((d, idx) => ({ id: `${idx}`, ...d }));
  const tickCount = T.length;
  let optimizedTicks = T;
  if (typeof ticksThreshold === 'number') {
    if (tickCount > ticksThreshold) {
      const page = Math.ceil(tickCount / ticksThreshold);
      // 保留最后一条
      optimizedTicks = T.filter((_, idx) => idx % page === 0 || idx === tickCount - 1);
    }
  }
  if (appendTick && optimizedTicks[optimizedTicks.length - 1].value !== 1) {
    optimizedTicks.push({ value: 1, id: 'append' });
  }
  return optimizedTicks;
}

// 是否可以执行某一 overlap
function canProcessOverlap(labelCfg: LinearAxisStyleProps['label'], type: OverlapType) {
  if (!labelCfg) return false;

  // 对 autoRotate，如果配置了旋转角度，直接进行固定角度旋转
  if (type === 'autoRotate') {
    return isNil(labelCfg.rotate);
  }

  // 默认所有 overlap 都可执行
  return true;
}

export function processOverlap(labelCfg: LinearAxisStyleProps['label'], axisPosition: string) {
  return (labels: any[]) => {
    if (!labelCfg) return;

    // Do labels layout.
    const { overlapOrder = [] } = labelCfg;
    let cfg = {
      labelType: labelCfg.type,
      ...pick(labelCfg, [
        'optionalAngles',
        'minLength',
        'maxLength',
        'ellipsisStep',
        'showFirst',
        'showLast',
        'margin',
      ]),
    };

    // const labels = this.labels;
    overlapOrder.forEach((type) => {
      const util = OverlapUtils.get(type);
      const overlapCfg = labelCfg[type];
      if (util && overlapCfg && canProcessOverlap(labelCfg, type)) {
        let overlapFunc: OverlapCallback = util.getDefault();
        if (typeof overlapCfg === 'function') {
          overlapFunc = overlapCfg;
        } else if (typeof overlapCfg === 'object') {
          overlapFunc = util[overlapCfg.type] || noop;
          cfg = { ...cfg, ...overlapCfg.cfg };
        } else if (typeof overlapCfg === 'string') {
          overlapFunc = util[overlapCfg] || noop;
        }
        overlapFunc(axisPosition, labels as any[], cfg);
      }
    });
  };
}

export function autoHideTickLine(labels: any[], tickLines: any[], autoHideTickLine?: boolean) {
  if (!autoHideTickLine) return;
  labels.forEach((label, idx) => {
    const tickLine = tickLines[idx];
    if (tickLine) tickLine.style.visibility = label.style.visibility;
  });
}
