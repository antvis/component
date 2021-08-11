---
title: BreadCrumb
order: 7
---

# Breadcrumb

> A breadcrumb displays the current location within a hierarchy. It allows going back to states higher up in the hierarchy.

## Usage

```ts
import { BreadCrumb } from '@antv/gui';
```

## Options

| **Property** | **Description**                   | **Type**                                        | **Default**    |
| ------------ | --------------------------------- | ----------------------------------------------- | -------------- |
| x            | Starting point x                  | <code>number</code>                             | `-`            |
| y            | Starting point y                  | <code>number</code>                             | `-`            |
| width        | Container width                   | <code>number<code>                              | `-`            |
| height       | Container height                  | <code>number<code>                              | `-`            |
| padding      | Container padding                 | <code>number \| number[]<code>                  | `[8, 8, 8, 8]` |
| items        | the items of breadcrumb           | <code>[BreadCrumnItems](#breadcrumnitems)<code> | `-`            |
| separator    | the separator of breadcrumb       | <code>[separator](#separator)<code>             | `-`            |
| textStyle    | custom text styles                | <code>StyleAttr<code>                           | `-`            |
| onClick      | The handler to handle click event | <code>(event) => void<code>                     | `-`            |

### BreadCrumnItems

| **Property** | **Description** | **Type**            | **Default** |
| ------------ | --------------- | ------------------- | ----------- |
| name         | label           | <code>string</code> | `-`         |
| id           | id              | <code>string</code> | `-`         |

### separator

| **Property** | **Description**                              | **Type**                     | **Default** |
| ------------ | -------------------------------------------- | ---------------------------- | ----------- |
| text         | Separator content                            | <code>string \| Group</code> | `/`         |
| style        | Separator style                              | <code>TextProps</code>       | `-`         |
| spacing      | Space between the two sides of the separator | <code>number</code>          | `-`         |
