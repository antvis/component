export const PRIMILTIVE_ATTRIBUTES = [
  '$el',
  'cx',
  'cy',
  'd',
  'dx',
  'dy',
  'fill',
  'fillOpacity',
  'filter',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'height',
  'img',
  'increasedLineWidthForHitTesting',
  'innerHTML',
  'isBillboard',
  'billboardRotation',
  'isSizeAttenuation',
  'isClosed',
  'isOverflowing',
  'leading',
  'letterSpacing',
  'lineDash',
  'lineHeight',
  'lineWidth',
  'markerEnd',
  'markerEndOffset',
  'markerMid',
  'markerStart',
  'markerStartOffset',
  'maxLines',
  'metrics',
  'miterLimit',
  'offsetX',
  'offsetY',
  'opacity',
  'path',
  'points',
  'r',
  'radius',
  'rx',
  'ry',
  'shadowColor',
  'src',
  'stroke',
  'strokeOpacity',
  'text',
  'textAlign',
  'textBaseline',
  'textDecorationColor',
  'textDecorationLine',
  'textDecorationStyle',
  'textOverflow',
  'textPath',
  'textPathSide',
  'textPathStartOffset',
  'transform',
  'transformOrigin',
  'visibility',
  'width',
  'wordWrap',
  'wordWrapWidth',
  'x',
  'x1',
  'x2',
  'y',
  'y1',
  'y2',
  'z1',
  'z2',
  'zIndex',
];

export function isPrimitiveAttribute(key: string) {
  return PRIMILTIVE_ATTRIBUTES.includes(key);
}

export function getPrimitiveAttributes(attributes: Record<string, any>) {
  const object: typeof attributes = {};
  for (const key in attributes) {
    if (isPrimitiveAttribute(key)) object[key] = attributes[key];
  }
  return object;
}
