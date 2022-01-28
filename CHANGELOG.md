#### 0.8.25 (2022-01-28)

##### Bug Fixes

- **annotation:** 修复 html 组件 html 参数为 数字、空字符串 以及 特殊字符时出现的报错问题 ([#265](https://github.com/antvis/component/pull/265)) ([34db4609](https://github.com/antvis/component/commit/34db46094c1b3211e6e27e9600cf416acf734444))
- **trend:** trend height 过大 ([#266](https://github.com/antvis/component/pull/266)) ([9a60c279](https://github.com/antvis/component/commit/9a60c279c5d8cb61ef1f230121003de598e38011))

#### 0.8.24 (2022-01-18)

##### New Features

- legend radio 支持 tip 配置 & tooltip 支持 dom id 配置 ([0f46d32d](https://github.com/antvis/component/commit/0f46d32dc7f6264bdf0266f7e6ab4141a99c5bdf))

#### 0.8.23 (2022-01-18)

##### Bug Fixes

- **legend:** 修复 legend radio 设置错误 ([#262](https://github.com/antvis/component/pull/262)) ([971a8bec](https://github.com/antvis/component/commit/971a8becbc699a33472725508b74abb2324b4874))

#### 0.8.22 (2022-01-14)

##### Chores

- update g-base version ([#258](https://github.com/antvis/component/pull/258)) ([7d27acfe](https://github.com/antvis/component/commit/7d27acfe0e3a0d4fd0b19f9b018fd86c600bc6d2))

##### Bug Fixes

- **component:** set default value for defaultCfg ([#253](https://github.com/antvis/component/pull/253)) ([5372709d](https://github.com/antvis/component/commit/5372709daf740b17d711654a027e5d0dceeaf1c0))
- **legend:** 修复图例分页数量超过 100 后文字被遮挡 ([#254](https://github.com/antvis/component/pull/254)) ([bbaae5c0](https://github.com/antvis/component/commit/bbaae5c0f050171ceab358025da3453a546de93e))

#### 0.8.21 (2021-12-29)

##### New Features

- **legend:** 添加正反选按钮 ([#259](https://github.com/antvis/component/pull/259)) ([2e8c7563](https://github.com/antvis/component/commit/2e8c7563b5b3e7360613d15c064a0387a23f6ccf))

#### 0.8.20 (2021-11-03)

##### Bug Fixes

- 修复依赖 ([d2970f99](https://github.com/antvis/component/commit/d2970f991f18bca0db6ae7dd54903fd87e2b2809))
- unreachable code after return statement ([#244](https://github.com/antvis/component/pull/244)) ([b6f7bfef](https://github.com/antvis/component/commit/b6f7bfef3ffeb02dfd93f4926307bd0474ea738f))

#### 0.8.19 (2021-10-08)

##### Bug Fixes

- **axis:** 修复 circle axis 处理 vertical limit 不当 ([#250](https://github.com/antvis/component/pull/250)) ([dd5ecb81](https://github.com/antvis/component/commit/dd5ecb815cef72010b2cba2da6bab2ab58ed1bc8))

#### 0.8.18 (2021-10-07)

##### New Features

- **axis:** 坐标轴支持额外绝对偏移量 ([#246](https://github.com/antvis/component/pull/246)) ([df888f58](https://github.com/antvis/component/commit/df888f58e144da765f67121b565953c89ad0502b))

##### Bug Fixes

- **#2487:** 圆型坐标轴支持文本缩略 ([#245](https://github.com/antvis/component/pull/245)) ([22a01f3c](https://github.com/antvis/component/commit/22a01f3c67fe51dd457b033ff243f0ab9db13aa6))
- 【legend】 期望分页场景下的多行和不分页的多行，展示一致 ([#242](https://github.com/antvis/component/pull/242)) ([030c7bad](https://github.com/antvis/component/commit/030c7bade1998dab5495701d4465f79ea981836a))

#### 0.8.17 (2021-07-28)

##### New Features

- **legend:**
  - 图例支持多行分页 ([#239](https://github.com/antvis/component/pull/239)) ([1bbb0533](https://github.com/antvis/component/commit/1bbb0533dcd8a7ac3741320d33c6f3e3f1296002))

#### 0.8.15 (2021-07-20)

##### New Features

- **legend:** 修改连续图例 中的 values 配置 ([#236](https://github.com/antvis/component/pull/236)) ([d113b801](https://github.com/antvis/component/commit/d113b8019ad5ef02d366be58bf80fde0971de795))
- **legend:** 图例 itemName.style 以及 itemValue.style 支持回调方法 ([#227](https://github.com/antvis/component/pull/227))" ([#231](https://github.com/antvis/component/pull/231)) ([6bb88825](https://github.com/antvis/component/commit/6bb88825c5415933ce0901012f817163fb2b771b))

##### Bug Fixes

- **types:** axis title 增加 position 的类型定义 ([#235](https://github.com/antvis/component/pull/235)) ([f097180d](https://github.com/antvis/component/commit/f097180d0d856202d845f0e18c88f5f95fc47bb4))

#### 0.8.14 (2021-07-06)

##### Bug Fixes

- **legend:** 修复 legend 组件无法通过回调设置 spacing 参数

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
