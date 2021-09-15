### Position

#### x

<description>**optional** _number_</description>

Text 文本，在 canvas 画布中 x 方向的的相对位置, 默认为 0.

#### y

<description>**optional** _number_</description>

Text 文本，在 canvas 画布中 y 方向的的相对位置, 默认为 0.

### Attributes

#### text

<description>**optional** _string_</description>

Text 文本的文本内容.

#### width

<description>**optional** _width_</description>

Text 文本的宽度，不指定时，文本宽度为渲染宽度。指定宽度后， 可设置文本超出后的处理方式。

#### height

<description>**optional** _height_</description>

Text 文本的高度，不指定时，文本高度为渲染高度。指定高度后， 可设置文本超出后的处理方式。

### lineHeight

<description>**optional** _lineHeight_</description>

Text 文本的行高，默认为字号大小.

#### fontColor

<description>**optional** _fontColor_</description>

Text 文本的字体颜色.

#### fontFamily

<description>**optional** _fontFamily_</description>

Text 文本的字体类型.

#### fontSize

<description>**optional** _fontSize_</description>

Text 文本的字体大小.

#### fontWeight

<description>**optional** _fontWeight_</description>

Text 文本的字体粗细.

#### fontVariant

<description>**optional** _fontVariant_</description>

Text 文本的字体变体.

#### letterSpacing

<description>**optional** _letterSpacing_</description>

Text 文本的字间距.

#### leading

<description>**optional** _leading_</description>

Text 文本的行间距.

#### textAlign

<description>**optional** _'start' | 'center' | 'end'_</description>

Text 文本在容器内的横向对齐位置，需指定宽度.

#### verticalAlign

<description>**optional** _'top' | 'middle' | 'bottom'_</description>

Text 文本在容器内的纵向对齐位置，需指定高度.

#### decoration

<description>**optional** _Object_</description>

Text 文本的修饰线条.

```ts
type DecorationCfg  {
  type?: 'none' | Array<DecorationLine | [DecorationLine, DecorationShape]>;
  // 线条默认颜色与文字颜色一致
  style?: ShapeAttrs;
}
```

#### overflow

<description>**optional** _'none' | 'clip' | 'ellipsis' | string_</description>

Text 文本超出后的处理方式.

- 'none' - 不处理
- 'clip' - 超出部分裁剪
- 'ellipsis' - 超出部分用省略号代替
- 'string' - 超出部分用指定字符串代替

#### transform

<description>**optional** _'none' | 'capitalize' | 'uppercase' | 'lowercase'_</description>

Text 文本的字符大小写转换.

#### backgroundStyle

<description>**optional** _object_</description>

Text 文本的背景样式配置.
