### Position

#### x

<description>**optional** _number_</description>

Tag 标签，在 canvas 画布中 x 方向的的相对位置, 默认为 0.

#### y

<description>**optional** _number_</description>

Tag 标签，在 canvas 画布中 y 方向的的相对位置, 默认为 0.

### Attributes

#### text

<description>**optional** _string_</description>

Tag 标签的文本内容.

#### marker

<description>**optional** _MarkerCfg_</description>

Tag 标签的图标类型，也可以自定义; 默认不显示. 详细可见：[Marker 组件](/en/docs/api/ui/marker)

```ts
type MarkerCfg = {
  /**
   * 标记的大小，默认为 16
   */
  size?: number;
  /**
   * 标记的类型，或者 path callback
   */
  symbol: string | FunctionalSymbol;
};
```

### Style

#### padding

<description>**optional** _number | number[]_</description>

Tag 标签的内边距.

#### radius

<description>**optional** _number_</description>

Tag 标签的圆角配置.

#### spacing

<description>**optional** _number_</description>

Tag 标签文本和 marker 的间距.

#### textStyle

<description>**optional** _object_</description>

Tag 标签的文本的样式配置.

```ts
type TextStyleCfg = {
  // 文本默认样式
  default?: TextStyleProps;
  // 文本激活样式
  active?: TextStyleProps;
};
```

**TextStyleProps** 配置详见：[G Text 文档](TODO)

#### backgroundStyle

<description>**optional** _object_</description>

Tag 标签的背景样式配置. 类型定义同 [textStyle](#textStyle)
