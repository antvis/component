export const CLASS_NAME = {
  CONTAINER: 'tooltip',
  TITLE: 'tooltip-title',
  LIST: 'tooltip-list',
  LIST_ITEM: 'tooltip-list-item',
  MARKER: 'tooltip-list-item-marker',
  NAME: 'tooltip-list-item-name',
  VALUE: 'tooltip-list-item-value',
  CROSSHAIR_X: 'tooltip-crosshair-x',
  CROSSHAIR_Y: 'tooltip-crosshair-y',
};

export const TOOLTIP_STYLE = {
  [`.${CLASS_NAME.CONTAINER}`]: {
    position: 'absolute',
    visibility: 'visible',
    // 'white-space': 'nowrap',
    'z-index': 8,
    transition:
      'visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1), ' +
      'left 0.4s cubic-bezier(0.23, 1, 0.32, 1), ' +
      'top 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
    'background-color': 'rgba(255, 255, 255, 0.9)',
    'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.2)',
    'border-radius': '2px',
    color: 'rgba(0, 0, 0, 0.65)',
    'font-size': '12px',
    // 'font-family': ,
    'line-height': '20px',
    padding: '10px 10px 10px 10px',
  },
  [`.${CLASS_NAME.TITLE}`]: {
    'margin-bottom': '4px',
  },
  [`.${CLASS_NAME.LIST}`]: {
    margin: '0px',
    'list-style-type': 'none',
    padding: '0px',
  },
  [`.${CLASS_NAME.LIST_ITEM}`]: {
    'list-style-type': 'none',
    'margin-bottom': '4px',
  },
  [`.${CLASS_NAME.MARKER}`]: {
    width: '8px',
    height: '8px',
    'border-radius': '50%',
    display: 'inline-block',
    'margin-right': '8px',
  },
  [`.${CLASS_NAME.NAME}`]: {
    color: 'rgba(0, 0, 0, 0.45)',
  },
  [`.${CLASS_NAME.VALUE}`]: {
    display: 'inline-block',
    float: 'right',
    'margin-left': '30px',
    color: 'rgba(0, 0, 0, 0.65)',
  },
  [`.${CLASS_NAME.CROSSHAIR_X}`]: {
    position: 'absolute',
    width: '1px',
    'background-color': 'rgba(0, 0, 0, 0.25)',
  },
  [`.${CLASS_NAME.CROSSHAIR_Y}`]: {
    position: 'absolute',
    height: '1px',
    'background-color': 'rgba(0, 0, 0, 0.25)',
  },
};
