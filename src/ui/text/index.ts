import { Text as GText, type TextStyleProps, type DisplayObjectConfig } from '@antv/g';
import { deepAssign } from '../../util/deep-assign';

/** for internal use */
export class Text extends GText {
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
}
