import { Band as BandScale, Linear } from '@antv/scale';

export const getLinearData = (tickCount = 10) => {
  const scale = new Linear({ domain: [0, 400], range: [0, 1], tickCount });
  return scale.getTicks()!.map((d) => ({ value: scale.map(d as number), text: String(d) }));
};

export const getBandData = (count = 20) => {
  const domain = Array(Math.min(count, 26))
    .fill(null)
    .map((_, idx) => `City ${String.fromCharCode(idx + 65)}`);
  const scale = new BandScale({ domain, range: [0, 1] });
  const bandWidth = scale.getBandWidth();
  return scale.getDomain()!.map((d) => ({ value: scale.map(d as number) + bandWidth / 2, text: d }));
};

export const BAND_SCALE_DATA = (() => {
  const domain = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  const scale = new BandScale({ domain, range: [0, 1] });
  const bandWidth = scale.getBandWidth();
  return scale.getDomain()!.map((d) => ({ value: scale.map(d as number) + bandWidth / 2, text: d }));
})();

export const LINEAR_SCALE_DATA = getLinearData(20);

export const BAND_SCALE_DATA_8 = (() => {
  const domain = ['Glabron', 'Manchuria', 'Peatland', 'Svansota', 'Trebi', 'Velvet', 'No. 457', 'Wisconsin No. 38'];
  const scale = new BandScale({ domain, range: [0, 1] });
  const bandWidth = scale.getBandWidth();
  return scale.getDomain()!.map((d) => ({ value: scale.map(d as number) + bandWidth / 2, text: d }));
})();
