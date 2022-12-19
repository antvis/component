/**
 * @description
 * convert parameter seem like {prefixFilter: val1, prefixFiltrate: val2}
 * to {prefixFilter: val2, prefixFiltrate: val1}
 */
export function filterTransform<T extends { [key: string]: any }>(parameter: T) {
  const finalParameter: Partial<T> = { ...parameter };
  const reg = new RegExp(/^(f|[\S]+F)(ilter|iltrate)$/);
  const keys: { [key: string]: any } = {};
  const mapper = { iltrate: 'ilter', ilter: 'iltrate' };
  Object.entries(parameter).forEach(([k, v]) => {
    if (reg.test(k)) keys[k] = v;
  });
  Object.keys(keys).forEach((k) => {
    delete finalParameter[k];
  });
  Object.keys(keys).forEach((k) => {
    if (
      (k.endsWith('iltrate') && typeof keys[k] !== 'function') ||
      (k.endsWith('ilter') && typeof keys[k] === 'function')
    ) {
      const key = k.replace(reg, (match, p1, p2) => `${p1}${mapper[p2 as 'iltrate' | 'ilter']}`);
      Object.assign(finalParameter, { [key]: keys[k] });
    }
  });
  return finalParameter;
}
