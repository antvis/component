import { Group, Text as GText, type DisplayObjectConfig, type TextStyleProps } from '@antv/g';
import { deepAssign } from '../../util/deep-assign';
import { createOffscreenGroup } from '../../util/offscreen';
import { measureTextWidth } from '../../util/text';

/** for internal use */

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
            text: '',
            fontFamily: 'sans-serif',
            fontSize: 16,
            fontStyle: 'normal',
            fontVariant: 'normal',
            fontWeight: 'normal',
            textAlign: 'start',
            textBaseline: 'alphabetic',
            lineWidth: 1,
          },
        },
        options
      )
    );
  }

  // public get length() {
  //   return measureTextWidth(this);
  // }
}
