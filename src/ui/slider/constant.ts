export const HANDLE_ICON_DEFAULT_CFG = {
  style: { fill: '#fff', stroke: '#bfbfbf', lineWidth: 1, size: 10, radius: 2, strokeOpacity: 1 },
};

export const HANDLE_LABEL_DEFAULT_CFG = {
  style: {
    fontSize: 12,
    fill: '#000',
    fillOpacity: 0.45,
    textAlign: 'center',
    textBaseline: 'middle',
  },
};

export const HANDLE_DEFAULT_CFG = {
  style: { orientation: 'horizontal', type: 'start' },
  showLabel: true,
} as const;
