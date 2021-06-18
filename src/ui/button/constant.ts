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
      fill: '#fff',
    },
    buttonStyle: {
      fill: '#1890ff',
      lineWidth: 0,
    },
    hoverStyle: {
      textStyle: {},
      buttonStyle: {
        fill: '#40a9ff',
      },
    },
  },
  dashed: {
    textStyle: {},
    buttonStyle: {
      stroke: '#bbb',
      lineDash: [5, 5],
    },
    hoverStyle: {
      textStyle: {},
      buttonStyle: {},
    },
  },
  link: {
    textStyle: {
      fill: '#1890ff',
    },
    buttonStyle: {
      lineWidth: 0,
    },
    hoverStyle: { textStyle: {}, buttonStyle: {} },
  },
  text: {
    textStyle: {
      fill: '#000',
    },
    buttonStyle: {
      lineWidth: 0,
    },
    hoverStyle: { textStyle: {}, buttonStyle: {} },
  },
  default: {
    textStyle: {
      fill: '#000',
    },
    buttonStyle: { stroke: '#bbb' },
    hoverStyle: {
      textStyle: {
        fill: '#1890ff',
      },
      buttonStyle: {
        stroke: '#1890ff',
      },
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
