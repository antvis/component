import { CustomElement, Group } from '@antv/g';
import type { GenericAnimation } from '../animation';
import { createOffscreenGroup, deepAssign } from '../util';
import { getPrimitiveAttributes } from './constant';
import type { ComponentOptions, PartialStyleProps, RequiredStyleProps } from './types';

export abstract class GUI<T extends Record<string, any>> extends CustomElement<T> {
  protected _defaultOptions: PartialStyleProps<T>;

  private _offscreen: Group;

  protected get offscreenGroup() {
    return this._offscreen;
  }

  public get defaultOptions() {
    return this._defaultOptions;
  }

  constructor(options: ComponentOptions<T>, defaultStyleProps: PartialStyleProps<T> = {}) {
    super(deepAssign({}, { style: defaultStyleProps }, options));
    this._defaultOptions = defaultStyleProps;
    this._offscreen = createOffscreenGroup(this);
    this.attr(getPrimitiveAttributes(this.attributes.style) as any);
  }

  connectedCallback() {
    this.render(this.attributes as Required<T>, this);
    this.bindEvents(this.attributes, this);
  }

  disconnectedCallback(): void {
    this._offscreen.destroy();
  }

  public update(attr: PartialStyleProps<T> = {}, animate?: GenericAnimation) {
    this.attr(deepAssign({}, this.attributes, attr));
    this.attr(getPrimitiveAttributes(this.attributes.style) as any);
    return this.render?.(this.attributes as Required<T>, this, animate);
  }

  public clear() {
    this.removeChildren();
  }

  attributeChangedCallback() {}

  public abstract render(attributes: RequiredStyleProps<T>, container: Group, animate?: GenericAnimation): any;

  public bindEvents(attributes: T, container: Group): void {}
}
