const canSetInterval = process.env.NODE_ENV !== 'test' && !(globalThis as any).disableInterval;

export function interval(cb: Function, time?: number, runInTest?: boolean) {
  if (process.env.NODE_ENV === 'test' && runInTest) cb();
  else if (canSetInterval) setInterval(cb, time);
}

export function timeout(cb: Function, time?: number, runInTest?: boolean) {
  if (process.env.NODE_ENV === 'test' && runInTest) cb();
  else if (canSetInterval) setTimeout(cb, time);
}
