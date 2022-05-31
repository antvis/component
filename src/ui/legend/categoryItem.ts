import { Text, CustomElement, DisplayObjectConfig, CustomEvent } from '@antv/g';
import { deepMix, get, omit, isNil } from '@antv/util';
import { applyStyle, getFont, maybeAppend, getEllipsisText, normalPadding, TEXT_INHERITABLE_PROPS } from '../../util';
import { Marker } from '../marker';
import { NAME_VALUE_RATIO } from './constant';
import { ItemMarkerCfg, ItemNameCfg, ItemValueCfg, MixShapeStyleProps, State } from './types';

export type CategoryItemStyleProps = {
  x?: number;
  y?: number;
  state?: State;
  id: string;
  backgroundStyle?: MixShapeStyleProps;
  padding?: number | number[];
  itemWidth?: number | null;
  itemHeight?: number | null;
  maxItemWidth?: number | null;
  itemMarker?: ItemMarkerCfg | null;
  itemName?: ItemNameCfg | null;
  itemValue?: ItemValueCfg | null;
};
type CategoryItemOptions = DisplayObjectConfig<CategoryItemStyleProps>;

const PREFIX = 'legend-item-';

function adjustText(nameShape?: Text | null, valueShape?: Text | null, maxWidth?: number) {
  if ((!nameShape && !valueShape) || typeof maxWidth !== 'number') return;

  if (Number(maxWidth) <= 0) {
    nameShape?.attr('text', '');
    valueShape?.attr('text', '');
    return;
  }

  if (!(nameShape && valueShape)) {
    const shape = (nameShape || valueShape)!;
    const w = shape.getLocalBounds().halfExtents[0] * 2;
    if (w > maxWidth) {
      shape.attr('text', getEllipsisText(shape.style.text, maxWidth, getFont(shape)));
    }
    return;
  }

  const nameBounds = nameShape.getLocalBounds();
  const valueBounds = valueShape.getLocalBounds();
  if (valueBounds.max[0] - nameBounds.min[0] > maxWidth) {
    const width1 = nameBounds.halfExtents[0] * 2;
    const width2 = valueBounds.halfExtents[0] * 2;
    const spacing = valueBounds.min[0] - nameBounds.max[0];
    // todo 后续开放占比配置。
    let [w1, w2] = [maxWidth * NAME_VALUE_RATIO, maxWidth * (1 - NAME_VALUE_RATIO)];
    let nameFlag = true;
    let valueFlag = true;
    if (w1 >= width1) {
      w2 = maxWidth - (width1 + spacing);
      nameFlag = false;
    } else if (w2 >= width2) {
      w1 = maxWidth - (width2 + spacing);
      valueFlag = false;
    }
    if (nameFlag) {
      nameShape.attr('text', getEllipsisText(nameShape.style.text, w1, getFont(nameShape)));
      valueShape.attr('x', Number(nameShape.style.x) + w1 + spacing);
    }
    if (valueFlag) {
      valueShape.attr('text', getEllipsisText(valueShape.style.text, w2, getFont(valueShape)));
    }
  }
}

export class CategoryItem extends CustomElement<CategoryItemStyleProps> {
  private active = false;

  private state: State = 'selected';

  public static defaultOptions: CategoryItemOptions = {
    style: {
      id: '',
      itemMarker: {
        size: 8,
        symbol: 'circle',
        style: {
          fill: '#d3d2d3',
          fillOpacity: 1,
          lineWidth: 0,
          active: {
            cursor: 'pointer',
          },
        },
      },
      itemName: {
        spacing: 4,
        style: {
          fontFamily: 'sans-serif',
          fill: '#646464',
          fontSize: 12,
          opacity: 1,
          active: {
            cursor: 'pointer',
          },
        },
      },
      itemValue: {
        spacing: 4,
        style: {
          fontFamily: 'sans-serif',
          fill: '#646464',
          opacity: 1,
          fontSize: 12,
          active: {
            cursor: 'pointer',
          },
        },
      },
    },
  };

  constructor(options: CategoryItemOptions) {
    super(deepMix({}, CategoryItem.defaultOptions, options));
    this.state = this.style.state || 'selected';
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  public setState(state: 'selected' | 'unselected' | 'disabled' = 'selected') {
    this.state = state;
    this.render();
  }

  public getState(): State {
    return this.state;
  }

  public update(cfg: Partial<CategoryItemStyleProps> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    if (cfg.state) {
      this.state = cfg.state;
    }

    this.render();
  }

  private get styles(): Required<Omit<CategoryItemStyleProps, 'state'>> {
    return deepMix({}, CategoryItem.defaultOptions.style, this.attributes);
  }

  private render() {
    const { backgroundStyle, itemMarker, padding, itemName, itemValue, maxItemWidth } = this.styles;
    let { itemHeight } = this.styles;
    const [pt, pr, pb, pl] = normalPadding(padding);
    const markerSize = Number(itemMarker?.size || 0);
    if (isNil(itemHeight)) {
      itemHeight =
        Math.max.call(
          null,
          markerSize,
          Number(itemName?.style?.fontSize || 0),
          Number(itemValue?.style?.fontSize || 0)
        ) +
        (pt + pb);
    }

    const container = maybeAppend(this, `.${PREFIX}container`, 'g')
      .attr('className', `${PREFIX}container`)
      .style('x', pl)
      .style('y', itemHeight / 2)
      .node();

    maybeAppend(container, `.${PREFIX}marker`, () => new Marker({}))
      .attr('className', `${PREFIX}marker`)
      .call((selection) => {
        if (!itemMarker) {
          selection.remove();
          return;
        }
        (selection.node() as Marker).update({
          x: markerSize / 2,
          y: 0,
          size: markerSize,
          symbol: itemMarker.symbol,
          ...omit(itemMarker.style || {}, ['active', 'selected', 'disabled', 'unselected']),
          ...get(itemMarker.style || {}, this.state),
          ...(this.active ? get(itemMarker.style || {}, 'active') : {}),
        });
      });

    const nameShapeX = markerSize ? markerSize + (itemName?.spacing || 0) : 0;
    const nameShape = maybeAppend(container, `.${PREFIX}name`, 'text')
      .attr('className', `${PREFIX}name`)
      .call((selection) => {
        if (!itemName) {
          selection.remove();
          return;
        }
        (selection.node() as Text).attr({
          x: nameShapeX,
          y: 0,
          tip: itemName?.content || '',
          text: itemName?.content || '',
          textBaseline: 'middle',
          textAlign: 'left',
          ...omit(itemName.style || {}, ['active', 'disabled', 'unselected']),
          ...get(itemName.style || {}, this.state),
          ...(this.active ? get(itemName.style || {}, 'active') : {}),
        });
      })
      .node() as Text;

    let nameShapeRight = nameShapeX;
    if (nameShape && !nameShape.destroyed) {
      nameShapeRight = nameShape.getLocalBounds().max[0];
    }

    const valueShape = maybeAppend(container, `.${PREFIX}value`, 'text')
      .attr('className', `${PREFIX}value`)
      .call((selection) => {
        if (!itemValue) {
          selection.remove();
          return;
        }
        (selection.node() as Text).attr({
          x: nameShapeRight + (itemValue.spacing || 0),
          y: 0,
          ...TEXT_INHERITABLE_PROPS,
          tip: itemValue?.content || '',
          text: itemValue?.content || '',
          textAlign: 'left',
          ...omit(itemValue.style || {}, ['active', 'disabled', 'unselected']),
          ...get(itemValue.style || {}, this.state),
          ...(this.active ? get(itemValue.style || {}, 'active') : {}),
          textBaseline: 'middle',
        });
      })
      .node() as Text;
    if (!isNil(maxItemWidth)) {
      adjustText(
        nameShape?.destroyed ? null : nameShape,
        valueShape?.destroyed ? null : valueShape,
        maxItemWidth - nameShapeX - (pl + pr)
      );
    }

    const bounds = container.getLocalBounds();
    let itemWidth = Math.max(bounds.halfExtents[0] * 2 + pr + pl, this.styles.itemWidth || 0);
    if (!isNil(maxItemWidth)) {
      itemWidth = Math.min(maxItemWidth, itemWidth);
    }

    // Update background.
    maybeAppend(this, `.${PREFIX}background`, 'rect')
      .attr('className', `${PREFIX}background`)
      .style('x', bounds.min[0] - pl)
      .style('y', 0)
      .style('width', itemWidth)
      .style('height', itemHeight)
      .style('zIndex', -1)
      .call(applyStyle, omit(backgroundStyle, ['unselected', 'active', 'disabled']))
      .call(applyStyle, get(backgroundStyle, this.state))
      .call(applyStyle, this.active ? get(backgroundStyle, 'active') : {});
  }

  public onClick() {
    if (this.state === 'disabled') return;
    this.state = this.state === 'unselected' ? 'selected' : 'unselected';
    const evt = new CustomEvent('stateChange', {
      detail: { value: { id: this.style.id, state: this.state } },
    });
    this.dispatchEvent(evt as any);
    this.render();
  }

  private bindEvents() {
    // Only for PC.
    this.addEventListener('mouseleave', this.offHover.bind(this));
    this.addEventListener('mousemove', this.onHover.bind(this));
    // For PC and mobile.
    this.addEventListener('pointerdown', this.onClick.bind(this));
  }

  public onHover() {
    this.active = true;
    this.render();
  }

  public offHover() {
    this.active = false;
    this.render();
  }
}
