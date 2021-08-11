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
  },
  middle: {
    textStyle: {
      fontSize: 12,
    },
    buttonStyle: {
      width: 60,
      height: 30,
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
  },
  dashed: {
    textStyle: {
      default: {},
      active: {},
    },
    buttonStyle: {
      default: { stroke: '#bbb', lineDash: [5, 5] },
      active: {},
    },
  },
  link: {
    textStyle: {
      default: { fill: '#1890ff' },
      active: {},
    },
    buttonStyle: {
      default: { lineWidth: 0 },
      active: {},
    },
  },
  text: {
    textStyle: {
      default: { fill: '#000' },
      active: {},
    },
    buttonStyle: {
      default: { lineWidth: 0 },
      active: {},
    },
  },
  default: {
    textStyle: {
      default: { fill: '#000' },
      active: { fill: '#1890ff' },
    },
    buttonStyle: {
      default: { stroke: '#bbb' },
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
  },
  textStyle: {},
  buttonStyle: {
    stroke: '#d9d9d9',
    fill: '#f5f5f5',
  },
};
