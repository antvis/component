// @ts-nocheck
import {
  Group,
  Rect,
  DisplayObject,
  IDocument,
  BaseStyleProps as BP,
  Circle,
  Path,
  Text,
  Ellipse,
  Image,
  Line,
  Polygon,
  Polyline,
  HTML,
} from '@antv/g';

export type G2Element = DisplayObject & {
  __data__?: any;
};

/**
 * A simple implementation of d3-selection for @antv/g.
 * It has the core features of d3-selection and extended ability.
 * Every methods of selection returns new selection if elements
 * are mutated(e.g. append, remove), otherwise return the selection itself(e.g. attr, style).
 * @see https://github.com/d3/d3-selection
 * @see https://github.com/antvis/g
 * @todo Nested selections.
 * @todo More useful functor.
 */
export class Selection<T = any> {
  static registry: Record<string, new () => G2Element> = {
    g: Group,
    rect: Rect,
    circle: Circle,
    path: Path,
    text: Text,
    ellipse: Ellipse,
    image: Image,
    line: Line,
    polygon: Polygon,
    polyline: Polyline,
    html: HTML,
  };

  public __data__: T[];

  private __elements__: G2Element[];

  private __parent__: G2Element;

  private __enter__: Selection;

  private __exit__: Selection;

  private __update__: Selection;

  private __document__: IDocument;

  constructor(
    elements: G2Element[] = null,
    data: T[] = null,
    parent: G2Element = null,
    document: IDocument = null,
    selections: [Selection, Selection, Selection] = [null, null, null]
  ) {
    this.__elements__ = elements;
    this.__data__ = data;
    this.__parent__ = parent;
    this.__document__ = document;
    this.__enter__ = selections[0];
    this.__update__ = selections[1];
    this.__exit__ = selections[2];
  }

  selectAll(selector: string | G2Element[]): Selection<T> {
    const elements = typeof selector === 'string' ? this.__parent__.querySelectorAll<G2Element>(selector) : selector;
    return new Selection<T>(elements, null, this.__elements__[0], this.__document__);
  }

  /**
   * @todo Replace with querySelector which has bug now.
   */
  select(selector: string | G2Element): Selection<T> {
    const element =
      typeof selector === 'string' ? this.__parent__.querySelectorAll<G2Element>(selector)[0] || null : selector;
    return new Selection<T>([element], null, element, this.__document__);
  }

  append(node: string | ((data: T, i: number) => G2Element)): Selection<T> {
    const createElement = (type: string) => {
      if (this.__document__) {
        return this.__document__.createElement<G2Element, BP>(type, {});
      }
      const Ctor = Selection.registry[type];
      if (Ctor) return new Ctor();
      return new Error(`Unknown node type: ${type}`);
    };
    const callback = typeof node === 'function' ? node : () => createElement(node);

    const elements = [];
    if (this.__data__ !== null) {
      // For empty selection, append new element to parent.
      // Each element is bind with datum.
      for (let i = 0; i < this.__data__.length; i++) {
        const datum = this.__data__[i];
        const newElement = callback(datum, i);
        newElement.__data__ = datum;
        this.__parent__.appendChild(newElement);
        elements.push(newElement);
      }
      return new Selection(elements, null, this.__parent__, this.__document__);
    }
    // For non-empty selection, append new element to
    // selected element and return new selection.
    for (let i = 0; i < this.__elements__.length; i++) {
      const element = this.__elements__[i];
      const datum = element.__data__;
      const newElement = callback(datum, i);
      element.appendChild(newElement);
      elements.push(newElement);
    }
    return new Selection(elements, null, elements[0], this.__document__);
  }

  /**
   * Bind data to elements, and produce three selection:
   * Enter: Selection with empty elements and data to be bind to elements.
   * Update: Selection with elements to be updated.
   * Exit: Selection with elements to be removed.
   */
  data<T = any>(data: T[], id: (d: T, index: number) => any = (d) => d): Selection<T> {
    // An array of new data.
    const enter = [];

    // An array of elements to be updated.
    const update = [];

    // A Map from key to each element.
    const keyElement = new Map(this.__elements__.map((d, i) => [id(d.__data__, i), d]));

    // Diff data with selection(elements with data).
    for (let i = 0; i < data.length; i++) {
      const datum = data[i];
      const key = id(datum, i);
      if (keyElement.has(key)) {
        const element = keyElement.get(key);
        element.__data__ = datum;
        update.push(element);
        keyElement.delete(key);
      } else {
        enter.push(datum);
      }
    }

    // An array of elements to be removed.
    const exit = Array.from(keyElement.values());

    // Create new selection with enter, update and exit.
    const S: [Selection<T>, Selection<T>, Selection<T>] = [
      new Selection<T>([], enter, this.__parent__, this.__document__),
      new Selection<T>(update, null, this.__parent__, this.__document__),
      new Selection<T>(exit, null, this.__parent__, this.__document__),
    ];

    return new Selection<T>(this.__elements__, null, this.__parent__, this.__document__, S);
  }

  merge(other: Selection<T>): Selection<T> {
    const elements = [...this.__elements__, ...other.__elements__];
    return new Selection<T>(elements, null, this.__parent__, this.__document__);
  }

  /**
   * Apply callback for each selection(enter, update, exit)
   * and merge them into one selection.
   */
  join(
    enter: (selection: Selection<T>) => any = (d) => d,
    update: (selection: Selection<T>) => any = (d) => d,
    exit: (selection: Selection<T>) => any = (d) => d.remove()
  ): Selection<T> {
    const newEnter = enter(this.__enter__);
    const newUpdate = update(this.__update__);
    const newExit = exit(this.__exit__);
    return newUpdate.merge(newEnter).merge(newExit);
  }

  remove(): Selection<T> {
    const elements = [...this.__elements__];
    this.__elements__.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
        const index = elements.indexOf(element);
        elements.splice(index, 1);
        element.parentNode?.removeChild(element);
        element.remove();
      }
    });
    return new Selection<T>(elements, null, this.__parent__, this.__document__);
  }

  each(callback: (datum: T, index: number) => any): Selection<T> {
    for (let i = 0; i < this.__elements__.length; i++) {
      const element = this.__elements__[i];
      if (element) {
        const datum = element.__data__;
        callback.call(element, datum, i);
      }
    }
    return this;
  }

  attr(key: string, value: any): Selection<T> {
    const callback = typeof value !== 'function' ? () => value : value;
    this.each(function (d, i) {
      if (value !== undefined) this[key] = callback.call(this, d, i);
    });
    return this;
  }

  style(key: string, value: any): Selection<T> {
    const callback = typeof value !== 'function' ? () => value : value;
    this.each(function (d, i) {
      if (value !== undefined) this.style[key] = callback.call(this, d, i);
    });
    return this;
  }

  on(event: string, handler: any) {
    this.each(function () {
      this.addEventListener(event, handler);
    });
    return this;
  }

  call(callback: (selection: Selection<T>, ...args: any[]) => any, ...args: any[]): Selection<T> {
    callback.call(this.__parent__, this, ...args);
    return this;
  }

  node(): G2Element {
    return this.__elements__[0];
  }

  nodes(): G2Element[] {
    return this.__elements__;
  }
}

export function select<T = any>(node: Group) {
  return new Selection<T>([node], null, node, node.ownerDocument);
}

export function select2update(
  parent: DisplayObject,
  className: string,
  Ctor: new (...args: any[]) => DisplayObject,
  styles: any[]
) {
  return select(parent)
    .selectAll(`.${className}`)
    .data(styles || [], (d, idx) => d.id || idx)
    .join(
      (enter) => enter.append(({ id, ...style }) => new Ctor({ id, className, style })),
      (update) =>
        update.each(function (datum) {
          this.attr(datum);
        }),
      (exit) => exit.remove()
    )
    .nodes();
}

export function applyStyle(selection: Selection, style: Record<string, keyof any>) {
  if (!style) return;
  for (const [key, value] of Object.entries(style)) {
    selection.style(key, value);
  }
}

export function maybeAppend<T>(
  parent: Group,
  selector: string,
  node: string | ((data: T, i: number) => G2Element)
): Selection<T> {
  if (!parent.querySelector(selector)) {
    return select(parent).append(node);
  }
  return select(parent).select(selector);
}
