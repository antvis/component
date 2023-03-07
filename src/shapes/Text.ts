import { Group, Text as GText, type DisplayObjectConfig, type TextStyleProps as GTextStyleProps } from '@antv/g';
import { deepAssign } from '../util/deep-assign';
import { createOffscreenGroup } from '../util/offscreen';
import { OmitConflictStyleProps } from './types';

export type TextStyleProps = OmitConflictStyleProps<GTextStyleProps>;

export class Text extends GText {
  private _offscreen!: Group;

  protected get offscreenGroup() {
    if (!this._offscreen) this._offscreen = createOffscreenGroup(this);
    return this._offscreen;
  }

  disconnectedCallback(): void {
    this._offscreen?.destroy();
  }

  constructor(options: DisplayObjectConfig<TextStyleProps> = {}) {
    super(
      deepAssign(
        {
          style: {
            fill: 'black',
            fontFamily: 'sans-serif',
            fontSize: 16,
            fontStyle: 'normal',
            fontVariant: 'normal',
            fontWeight: 'normal',
            lineWidth: 1,
            textAlign: 'start',
            textBaseline: 'alphabetic',
          },
        },
        options
      )
    );
  }
}
