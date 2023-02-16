/* global KeyframeAnimationOptions */
import type { DisplayObjectConfig } from '@antv/g';
import type { GenericAnimation, StandardAnimationOption } from '../animation';
import type { CallbackableObject, PrefixObject } from '../types';

export interface ComponentStyleProps<T extends Record<string, any>> {
  layout?: T extends { layout: infer L } ? L : Record<string, any>;
  events?: T extends { events: infer E } ? E : Record<string, any>;
  style?: T extends { style: infer S } ? S : Record<string, any>;
  animation?: GenericAnimation | StandardAnimationOption;
  interactions?: T extends { interation: infer I } ? I : Record<string, any>;
  [key: string]: any;
}

export interface ComponentOptions<T extends Record<string, any>> extends DisplayObjectConfig<Record<string, any>> {
  style?: ComponentStyleProps<T>;
  attrs?: ComponentStyleProps<T>;
}

type ReserveProperty = 'layout' | 'events' | 'style' | 'animate' | 'interactions';

/** add prefix for object property key  */
export type PrefixStyleProps<T extends Record<string, any>, P extends string> = {
  [K in keyof T as K extends `show${string}` | ReserveProperty
    ? K
    : K extends string
    ? `${P}${Capitalize<K>}`
    : never]: K extends ReserveProperty ? PrefixObject<T[K], P> : T[K];
};

export type PartialStyleProps<T> = {
  [K in keyof T]?: T[K] | Partial<T[K]>;
};

type NonObject = string | number | boolean | Array<any> | Function | Symbol | null | undefined;

export type RequiredStyleProps<T> = {
  [K in keyof T]-?: T[K] extends NonObject ? T[K] : Required<T[K]>;
};

export type CallbackableStyleProps<T extends Record<string, any>, P extends any[]> = {
  [K in keyof T]: K extends 'style' ? CallbackableObject<T[K], P> : T[K];
};
