import { GUI } from '../core/gui';
import type { AxisOptions } from './types';

export type { AxisOptions };

export class Axis extends GUI<AxisOptions> {
  attributeChangedCallback(name: string, value: any) {
    throw new Error('Method not implemented.');
  }

  public init() {
    throw new Error('Method not implemented.');
  }

  public update() {
    throw new Error('Method not implemented.');
  }

  public clear() {
    throw new Error('Method not implemented.');
  }
}
