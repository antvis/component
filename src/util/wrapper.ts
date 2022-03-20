import { DisplayObject, DisplayObjectConfig } from '@antv/g';
import { get } from '@antv/util';

type CustomExtract<O, T, U> = O extends U ? T : never;
/** 获取函数参数类型 */
type GetArgumentsType<Type> = Type extends (...args: infer Arguments) => unknown ? Arguments : never;
/** 获取属性值为函数类型的相关属性 */
type GetFunctionTypeProperty<Object> = {
  [Property in keyof Object as CustomExtract<Object[Property], Property, Function>]: Property;
};
type CtorType<S, E> = {
  new (props: DisplayObjectConfig<S>): E;
};

export type WrapperNode<S, E extends DisplayObject = DisplayObject> = {
  style<K extends keyof S>(k: K, value: S[K]): WrapperNode<S, E>;
  call<K extends keyof GetFunctionTypeProperty<DisplayObject>>(
    property: K,
    ...args: GetArgumentsType<DisplayObject[K]>
  ): WrapperNode<S, E>;
  update<K extends keyof S>(k: K, value: S[K]): WrapperNode<S, E>;
  batchUpdate(styleProps: Partial<S>): WrapperNode<S, E>;
  node: () => E;
};

export function wrapper<S, E extends DisplayObject = DisplayObject>(
  Ctor: CtorType<S, E>,
  style: S,
  props: Omit<DisplayObjectConfig<S>, 'style'> = {}
): WrapperNode<S, E> {
  const shape = new Ctor({ ...props, style });

  return {
    style<K extends keyof S>(k: K, value: S[K]) {
      shape.style[k] = value;
      return this;
    },
    call<K extends keyof GetFunctionTypeProperty<DisplayObject>>(
      property: K,
      ...args: GetArgumentsType<DisplayObject[K]>
    ) {
      const callback = get(shape, property as string);
      if (typeof callback === 'function') {
        callback.apply(shape, args);
      }
      return this;
    },
    // 遵循 GUI 的 update
    update<K extends keyof S>(k: K, value: S[K]) {
      // @ts-ignore
      const updateFn = shape.update;
      if (typeof updateFn === 'function') {
        updateFn.call(shape, { [k]: value });
      }
      return this;
    },
    batchUpdate(styleProps: Partial<S>) {
      // @ts-ignore
      const updateFn = shape.update;
      if (typeof updateFn === 'function') {
        updateFn.call(shape, styleProps);
      }
      return this;
    },
    node: () => shape,
  };
}
