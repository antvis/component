const isTestEnv = () => typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
const canSetInterval = () => !isTestEnv() && !(globalThis as any)?.disableInterval;

export function interval(cb: Function, time?: number, runInTest?: boolean) {
  if (isTestEnv() && runInTest) cb();
  else if (canSetInterval()) setInterval(cb, time);
}

export function timeout(cb: Function, time?: number, runInTest?: boolean) {
  if (isTestEnv() && runInTest) cb();
  else if (canSetInterval()) setTimeout(cb, time);
}
