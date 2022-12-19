import type { VerticalFactor, Direction } from '../types';

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

export function autoHideTickLine(labels: any[], tickLines: any[], autoHideTickLine?: boolean) {
  if (!autoHideTickLine) return;
  labels.forEach((label, idx) => {
    const tickLine = tickLines[idx];
    if (tickLine) tickLine.style.visibility = label.style.visibility;
  });
}

export function getFactor(...args: Direction[]): VerticalFactor {
  const fn = (str: typeof args[number]): VerticalFactor => (str === 'positive' ? -1 : 1);
  return args.reduce((acc, cur) => acc * fn(cur), 1) as unknown as VerticalFactor;
}
