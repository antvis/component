/**
 * 尺寸配置
 */
export const SIZE_STYLE = {
  small: {
    textStyle: {
      fontSize: 10,
    },
    buttonStyle: {
      width: 40,
      height: 20,
    },
    markerStyle: {
      size: 8,
    },
  },
  middle: {
    textStyle: {
      fontSize: 12,
    },
    buttonStyle: {
      width: 60,
      height: 30,
    },
    markerStyle: {
      size: 12,
    },
  },
  large: {
    textStyle: {
      fontSize: 16,
    },
    buttonStyle: {
      width: 80,
      height: 40,
    },
    markerStyle: {
      size: 16,
    },
  },
};

/**
 * 类型配置
 */
export const TYPE_STYLE = {
  primary: {
    textStyle: {
      default: { fill: '#fff' },
      active: {},
    },
    buttonStyle: {
      default: { fill: '#1890ff', lineWidth: 0 },
      active: { fill: '#40a9ff' },
    },
    markerStyle: {
      default: { fill: '#1890ff' },
      active: { fill: '#40a9ff' },
    },
  },
  dashed: {
    textStyle: {
      default: {},
      active: {},
    },
    buttonStyle: {
      default: { fill: 'transparent', stroke: '#bbb', lineDash: [5, 5] },
      active: {},
    },
    markerStyle: {},
  },
  link: {
    textStyle: {
      default: { fill: '#1890ff' },
      active: {},
    },
    buttonStyle: {
      default: { fill: 'transparent', lineWidth: 0 },
      active: {},
    },
    markerStyle: {
      default: { fill: '#1890ff' },
    },
  },
  text: {
    textStyle: {
      default: { fill: '#000' },
      active: {},
    },
    buttonStyle: {
      default: { fill: 'transparent', lineWidth: 0 },
      active: {},
    },
    markerStyle: {
      default: { stroke: '#000' },
    },
  },
  default: {
    textStyle: {
      default: { fill: '#000' },
      active: { fill: '#1890ff' },
    },
    buttonStyle: {
      default: { fill: 'transparent', stroke: '#bbb' },
      active: { stroke: '#1890ff' },
    },
    markerStyle: {
      default: { stroke: '#bbb', lineWidth: 1 },
      active: { stroke: '#1890ff' },
    },
  },
};

/**
 * disabled style
 */
export const DISABLED_STYLE = {
  // 严格需要替换的样式
  strict: {
    textStyle: {
      fill: '#b8b8b8',
    },
    buttonStyle: {},
    markerStyle: {},
  },
  textStyle: {},
  buttonStyle: {
    stroke: '#d9d9d9',
    fill: '#f5f5f5',
  },
  markerStyle: {
    stroke: '#d9d9d9',
  },
};
