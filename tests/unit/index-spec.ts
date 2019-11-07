import * as Component from '../../src/index';
import { Annotation, Legend } from '../../src/index';
const { Category, Continue } = Legend;
describe('test index', () => {
  it('test axis', () => {
    expect(Component.Axis).not.toBe(undefined);
    expect(Component.Axis.Line).not.toBe(undefined);
    expect(Component.Axis.Base).not.toBe(undefined);
    expect(Component.Axis.Circle).not.toBe(undefined);
  });
  it('test tooltip', () => {
    expect(Component.Tooltip).not.toBe(undefined);
    expect(Component.Tooltip.Html).not.toBe(undefined);
  });
  it('test Annotation', () => {
    expect(Annotation).not.toBe(undefined);
    expect(Annotation.Line).not.toBe(undefined);
    expect(Annotation.Image).not.toBe(undefined);
    expect(Annotation.Arc).not.toBe(undefined);
    expect(Annotation.Region).not.toBe(undefined);
  });

  it('test grid', () => {
    expect(Component.Grid).not.toBe(undefined);
    expect(Component.Grid.Line).not.toBe(undefined);
    expect(Component.Grid.Circle).not.toBe(undefined);
  });

  it('test legend', () => {
    expect(Legend).not.toBe(undefined);
    expect(Category).not.toBe(undefined);
    expect(Continue).not.toBe(undefined);
  });
});
