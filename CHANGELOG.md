#### 0.8.4 (2020-12-17)

#### New Features

- **sourceMap:** add src to files for sourceMap [#209](https://github.com/antvis/component/pull/209)

#### 0.8.3 (2020-11-30)

#### New Features

- **axis:** 轴标签 autoHide 支持配置最小间距 [#206](https://github.com/antvis/component/pull/206)

#### 0.8.2 (2020-11-16)

##### Bug Fixes

- **axis:** 坐标轴 title 重叠 [#1820](https://github.com/antvis/G2Plot/issues/1820)

#### 0.7.4 (2020-09-21)

##### Bug Fixes

- **axis:** 坐标轴 style 回调,如果用户没有填写全样式,使用传入的主题样式 ([#191](https://github.com/antvis/component/pull/191)) ([a5c854cd](https://github.com/antvis/component/commit/a5c854cd0c6e56b56e90bfeb96a95958e1ae12b3))

#### 0.7.3 (2020-09-02)

##### New Features

- **axis:** add label, grid, tickLine style callback typedefine ([#187](https://github.com/antvis/component/pull/187)) ([76a6d5dd](https://github.com/antvis/component/commit/76a6d5ddbf5b4499dee0564ad87cd95bdcd53fa9))

##### Bug Fixes

- **slider:** slider 更新的时候,组合的子组件不更新的问题 ([#189](https://github.com/antvis/component/pull/189)) ([fe6a2f6b](https://github.com/antvis/component/commit/fe6a2f6bfd44a4b2a5949d52408a7ea3505b309d))
- **trend:** 修复趋势图中,面积绘制不正确的问题 ([#186](https://github.com/antvis/component/pull/186)) ([79d37a0c](https://github.com/antvis/component/commit/79d37a0cb5b1df8e7bfa2a05e9ed905d8ea5b915))
- removeDom 节点不一定有 parentNode ([#183](https://github.com/antvis/component/pull/183)) ([c4b369e2](https://github.com/antvis/component/commit/c4b369e20b090c8e0f354ec6085a05370217d1d9))

#### 0.7.2 (2020-08-17)

##### New Features

- **legend:** 分类图例添加 itemMarginBottom 属性,用于调整图例项垂直方向的间距 ([d2a92529](https://github.com/antvis/component/commit/d2a92529d5cfc2a80172b91b6b7fc6fbd563b995))
- **axis:** 自动计算 textBaseline ([4401d921](https://github.com/antvis/component/commit/4401d9210004f2b400e0659aaacd05bd1474709e))

##### Bug Fixes

- offsetX 和 offsetY 不需要参与 layoutBBox 计算 ([df5700a6](https://github.com/antvis/component/commit/df5700a6a864de669da007a39e41adbe42c24aac))

#### 0.7.1 (2020-08-13)

##### New Features

- **version:** update to 0.7.0 ([#182](https://github.com/antvis/component/pull/182)) ([68bd998d](https://github.com/antvis/component/commit/68bd998dad06ef2915c6400d13b2e6e691a1bc5a))

##### Bug Fixes

- removeDom 节点不一定有 parentNode ([#183](https://github.com/antvis/component/pull/183)) ([c4b369e2](https://github.com/antvis/component/commit/c4b369e20b090c8e0f354ec6085a05370217d1d9))
