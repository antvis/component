import { TextStyleProps, Group } from '@antv/g';
import { applyStyle, maybeAppend } from '../../util';
import { GUI } from '../../core/gui';
import { MarkerStyleProps, Marker } from '../marker';

type HandleStyleProps = MarkerStyleProps & {
  textStyle?: TextStyleProps;
};

export class Handle extends GUI<HandleStyleProps> {
  render(attribute: HandleStyleProps, container: Group) {
    const { textStyle, visibility, symbol, size, fill, stroke, lineWidth } = attribute;
    if (!symbol || visibility === 'hidden') {
      container.querySelector('.handle')?.remove();
      container.querySelector('.handle-text')?.remove();
      return;
    }

    maybeAppend(container, '.handle', () => new Marker({}))
      .attr('className', 'handle')
      .call((selection) => {
        (selection.node() as Marker).update({
          symbol,
          size,
          fill,
          stroke,
          lineWidth,
        });
      });
    maybeAppend(container, '.handle-text', 'text').attr('className', 'handle-text').call(applyStyle, textStyle);
  }
}
