export * from './dependency';
export * from './compose';
export type { MixAttrs, StyleState } from './styles';

export type GUIOption<C> = {
  type: string;
  style: C;
};

export type Point = [number, number];
export type Vector2 = [number, number];
