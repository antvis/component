import { DisplayObject } from '@antv/g';

export type { MixAttrs, StyleState } from './styles';

export type Point = [number, number];

export type Vector2 = [number, number];

export type ExtendDisplayObject = string | number | DisplayObject | (() => DisplayObject);

export type Callbackable<T, P extends any[]> = T | ((...args: P) => T);

export type CallbackParameter<T = any, E extends any[] = []> = [datum: T, index: number, data: T[], ...args: E];

export type CallbackableObject<T extends { [keys: string]: any }, P extends any[]> = {
  [K in keyof T]: Callbackable<T[K], P>;
};

export * from './dependency';
export * from './merge';
export * from './prefix';
