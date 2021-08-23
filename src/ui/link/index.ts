import type { Line, Polyline, BaseStyleProps, DisplayObjectConfig, Point } from '@antv/g';
import { Path } from '@antv/g';
import { Marker, MarkerCfg } from 'ui/marker';
import { GUI } from '../../core/gui';

type ArrowBody = Line | Path | Polyline;
export interface LinkStyleProps extends BaseStyleProps {
  sourceMarker?: MarkerCfg;
  targetMarker?: MarkerCfg;
  body: ArrowBody;
}

/**
 * support 3 types of arrow line:
 * 1. Line
 * 2. Polyline
 * 3. Path
 *
 * support 2 types of arrow head:
 * 1. default(Path)
 * 2. custom
 */
export class Link extends GUI<LinkStyleProps> {
  static tag = 'link';

  private body!: Line | Path | Polyline;

  private sourceMarker?: Marker;

  private targetMarker?: Marker;

  constructor(config: DisplayObjectConfig<LinkStyleProps>) {
    // to be fix later
    // @ts-ignore
    super({
      ...config,
    });
    this.init();
  }

  public init(): void {
    const { body, sourceMarker, targetMarker, ...rest } = this.attributes;

    if (!body) {
      throw new Error("Arrow's body is required");
    }

    // append arrow body
    this.body = body;
    this.appendChild(this.body!);

    if (sourceMarker) {
      this.appendMarker(sourceMarker, 'source');
    }

    if (targetMarker) {
      this.appendMarker(targetMarker, 'target');
    }
  }

  public update(cfg: Partial<LinkStyleProps>): void {
    throw new Error('Method not implemented.');
  }

  public clear(): void {
    throw new Error('Method not implemented.');
  }

  // attributeChangedCallback(name: string, value: any) {
  // if (name === 'opacity' || name === 'strokeOpacity' || name === 'stroke' || name === 'lineWidth') {
  //   this.applyArrowStyle({ [name]: value }, [this.body, this.startHead, this.endHead]);
  // } else if (name === 'startHead' || name === 'endHead') {
  //   const isStart = name === 'startHead';
  //   // delete existed arrow head first
  //   this.destroyArrowHead(isStart);
  //   if (value) {
  //     const { body, startHead, endHead, ...rest } = this.attributes;
  //     // append new arrow head
  //     this.appendArrowHead(this.getArrowHeadType(value), isStart);
  //     this.applyArrowStyle(rest, [isStart ? this.startHead : this.endHead]);
  //   }
  // } else if (name === 'body') {
  //   const { body, startHead, endHead, ...rest } = this.attributes;
  //   this.removeChild(this.body!, true);
  //   this.body = value;
  //   this.appendChild(this.body!);
  //   this.applyArrowStyle(rest, [this.body]);
  // }
  // }

  private appendMarker(style: MarkerCfg, type: 'source' | 'target') {
    const marker = new Marker({ style });

    // set position & rotation
    this.transformMarker(marker, type);

    // heads should display on top of body
    marker.setAttribute('zIndex', 1);

    this.appendChild(marker);
  }

  transformMarker(marker: Marker, type: 'source' | 'target') {}

  private getTangent(path: Path, isStart: boolean): [number, number][] {
    // @ts-ignore
    const { segments } = path.attributes;
    const { length } = segments;

    const result: [number, number][] = [];
    if (length > 1) {
      let startPoint = isStart ? segments[0].currentPoint : segments[length - 2].currentPoint;
      let endPoint = isStart ? segments[1].currentPoint : segments[length - 1].currentPoint;
      const tangent = isStart ? segments[1].startTangent : segments[length - 1].endTangent;
      let tmpPoint;

      if (!isStart) {
        tmpPoint = startPoint;
        startPoint = endPoint;
        endPoint = tmpPoint;
      }

      if (tangent) {
        result.push([startPoint[0] - tangent[0], startPoint[1] - tangent[1]]);
        result.push([startPoint[0], startPoint[1]]);
      } else {
        result.push([endPoint[0], endPoint[1]]);
        result.push([startPoint[0], startPoint[1]]);
      }
    }
    return result;
  }
}
