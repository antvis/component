export const DEFAULT_BUTTON_STYLE = {
  text: '',
  type: 'primary',
  height: 20,
  width: 20,
  buttonStyle: {
    default: {
      lineWidth: 0,
      fill: '#fff',
    },
    active: {
      fill: '#fff',
    },
    disabled: {
      fill: '#fff',
    },
  },
  markerStyle: {
    default: {
      fill: 'black',
      size: 10,
    },
    disabled: {
      fill: '#8c8c8c',
    },
  },
} as const;
