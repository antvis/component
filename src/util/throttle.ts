/**
 * 节流修饰器
 * @param delay 节流时间
 */
export function throttle(delay: number = 0) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const func = descriptor.value;
    let timeout: number | null;
    if (typeof func === 'function') {
      // eslint-disable-next-line
      descriptor.value = function (...args: any[]) {
        if (timeout) return;
        const context = this;
        timeout = window.setTimeout(() => {
          func.apply(context, args);
          timeout = null;
        }, delay);
      };
    }
  };
}
