export const data = (len: number = 24, align: number = 0) =>
  new Array(len).fill(0).map((tick, idx, arr) => {
    const step = 1 / (arr.length - align);
    return { value: idx * step, label: `Text-${String(idx)}` };
  });

export const mockData = [
  '蚂蚁技术研究院',
  '智能资金',
  '蚂蚁消金',
  '合规线',
  '战略线',
  '商业智能线',
  'CFO线',
  'CTO线',
  '投资线',
  'GR线',
  '社会公益及绿色发展事业群',
  '阿里妈妈事业群',
  'CMO线',
  '大安全',
  '天猫事业线',
  '影业',
  'OceanBase',
  '投资基金线',
  '阿里体育',
  '智能科技事业群',
].map((d, idx, arr) => {
  const step = 1 / arr.length;
  return {
    value: step * idx,
    label: d,
    id: String(idx),
  };
});
