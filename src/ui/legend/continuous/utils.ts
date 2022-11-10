function search(array: number[], value: number) {
  for (let i = 1; i < array.length; i += 1) {
    const st = array[i - 1];
    const end = array[i];
    if (value >= st && value <= end) {
      return [st, end];
    }
  }
  return [value, value];
}

export function getBlockColor(blocks: number, color: string[], orient: string) {
  const colors = Array.from(color);
  const count = blocks + 1;

  return new Array(count).fill(0).reduce((r, v, idx) => {
    const c = colors[idx % colors.length];
    return (r += ` ${idx / (count - 1)}:${c}${idx < count - 1 ? ` ${(idx + 1) / (count - 1)}:${c}` : ''}`);
  }, `l(${orient === 'horizontal' ? '0' : '270'})`);
}

export function getNextTickValue(ticks: number[], value: number) {
  const [v1, v2] = search(ticks, value);
  return { tick: value > (v1 + v2) / 2 ? v2 : v1, range: [v1, v2] };
}
