import { flex } from './flex';
import { grid } from './grid';
import type { LayoutConfig, LayoutContainer, LayoutItem } from './types';

export default (container: LayoutContainer, config: LayoutConfig) => {
  const { children } = container;
  const { type } = config;
  const caller = type === 'flex' ? flex : grid;
  return caller.call(null, container, children, config);
};
