export const data = (len: number = 24, align: number = 0) =>
  new Array(len).fill(0).map((tick, idx, arr) => {
    const step = 1 / (arr.length - align);
    return { value: idx * step, label: `Text-${String(idx)}` };
  });
