import type { FlexContainerConfig } from './types';
import type { LayoutExecuter } from '../types';
import { getItemsBBox } from '../utils';

export const flex: LayoutExecuter = function (container, items, config) {
  const { width, height } = container;
  const { containerConfig, itemsConfig } = config;
  const {
    flexDirection = 'row',
    flexWrap = 'nowrap',
    justifyContent = 'flex-start',
    alignContent = 'flex-start',
    alignItems = 'flex-start',
  } = containerConfig as FlexContainerConfig;

  const isHorizontalFlow = flexDirection === 'row'; // || flexDirection === 'row-reverse';
  const isLeftToRightFlow = flexDirection === 'row' || flexDirection === 'column';

  // implement default layout;
  // flex direction
  const direction = isHorizontalFlow ? (isLeftToRightFlow ? [1, 0] : [-1, 0]) : isLeftToRightFlow ? [0, 1] : [0, -1];

  let [offsetX, offsetY] = [0, 0];
  const itemsFromDirection = items.map((item) => {
    const { width, height } = item;
    const [x, y] = [offsetX, offsetY];
    [offsetX, offsetY] = [offsetX + width * direction[0], offsetY + height * direction[1]];
    return { x, y, width, height };
  });

  // flex wrap
  // todo

  // justify content
  // flex-start, flex-end, center
  const itemsForJustifyContentBBox = getItemsBBox(itemsFromDirection);
  const justifyContentOffset = {
    'flex-start': 0,
    'flex-end': isHorizontalFlow
      ? width - itemsForJustifyContentBBox.width
      : height - itemsForJustifyContentBBox.height,
    center: isHorizontalFlow
      ? (width - itemsForJustifyContentBBox.width) / 2
      : (height - itemsForJustifyContentBBox.height) / 2,
  };
  const itemsFromJustifyContent = itemsFromDirection.map((item) => {
    const { x, y } = item;
    return {
      ...item,
      x: isHorizontalFlow ? x + justifyContentOffset[justifyContent] : x,
      y: isHorizontalFlow ? y : y + justifyContentOffset[justifyContent],
    };
  });

  // align items
  // flex-start, flex-end, center
  const itemsForAlignItemsBBox = getItemsBBox(itemsFromJustifyContent);
  const alignItemsOffset = {
    'flex-start': 0,
    'flex-end': isHorizontalFlow ? height - itemsForAlignItemsBBox.height : width - itemsForAlignItemsBBox.width,
    center: isHorizontalFlow
      ? (height - itemsForAlignItemsBBox.height) / 2
      : (width - itemsForAlignItemsBBox.width) / 2,
  };
  const itemsFromAlignItems = itemsFromJustifyContent.map((item) => {
    const { x, y } = item;
    return {
      ...item,
      x: isHorizontalFlow ? x : x + alignItemsOffset[alignItems],
      y: isHorizontalFlow ? y + alignItemsOffset[alignItems] : y,
    };
  });

  return itemsFromAlignItems;
};
