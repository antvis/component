import { Constraint } from '../../../src/layout/constraint';
import { Bounds } from '../../../src/layout/bounds';

describe('Constraint Layout', () => {
  const bounds = new Bounds({ left: 20, top: 20, right: 100, bottom: 220 });

  const vars = {
    ax: undefined,
    ay: undefined,
    aw: 20,
    ah: bounds!.height,
    bx: undefined,
    by: undefined,
    bw: undefined,
    bh: bounds!.height,
  };

  const limitSize = Number.MAX_VALUE;
  const gap = 12;

  const constraint = new Constraint(vars);

  it('Constraint.collect() to get variables', () => {
    expect(constraint.collect()).toEqual({
      ax: 0,
      ay: 0,
      aw: 20,
      ah: bounds!.height,
      bx: 0,
      by: 0,
      bw: 0,
      bh: bounds!.height,
    });
  });

  it('Constraint.get(name) and set(name, value)', () => {
    constraint.set('ax', 20);
    expect(constraint.get('ax')).toBe(20);
  });

  it('Constraint.addConstraint( bx >= ax + aw )', () => {
    constraint.addConstraint(['bx', 'aw'], '>=', 'ax');
    // 不等式，条件还不满足
    expect(constraint.get('bx')).not.toBe(40);
    constraint.addConstraint(['bx', 'aw'], '=', 'ax');
    expect(constraint.get('bx')).not.toBe(40);
  });

  it('Constraint.update(), clear all constraints and update variables', () => {
    constraint.update(vars);
    expect(constraint.collect()).toEqual({
      ax: 0,
      ay: 0,
      aw: 20,
      ah: bounds!.height,
      bx: 0,
      by: 0,
      bw: 0,
      bh: bounds!.height,
    });
  });

  it('Constraint.addConstraint()', () => {
    constraint.set('ax', 20);
    // Expression1: bx = ax
    constraint.addConstraint(['bx'], '=', 'ax');
    expect(constraint.get('bx')).toBe(20);
    // Update ax, bx is changed also.
    constraint.set('ax', 40);
    expect(constraint.get('bx')).toBe(40);

    // Expression2: bw - bx = ax + 100
    constraint.set('bw', 200);
    constraint.addConstraint([[-1, 'bx'], 'bw', [-1, 'ax']], '=', 100);
    // Because exist constraint ax === bx.
    expect(constraint.get('ax')).toBe(50);
    expect(constraint.get('bx')).toBe(50);
    // 移除约束
    constraint.removeConstraint([[-1, 'bx'], 'bw', [-1, 'ax']], '=', 100);
    expect(constraint.get('ax')).toBe(40);
    expect(constraint.get('bx')).toBe(40);
  });

  it('Constraint cases.', () => {
    constraint.update(vars);
    constraint.addConstraint(['bw', gap, 'aw'], '=', bounds.width);
    constraint.addConstraint(['aw'], '<=', limitSize);
    expect(constraint.get('aw')).toBe(20);
    expect(constraint.get('bw')).toBe(48);

    constraint.addConstraint(['aw'], '<=', 18);
    expect(constraint.get('aw')).toBe(18);
    expect(constraint.get('bw')).toBe(50);

    constraint.addConstraint(['bx', 'bw'], '=', bounds.right);
    constraint.addConstraint(['ax', 'aw', gap], '=', 'bx');
    constraint.addConstraint(['ay', 'ah'], '=', bounds.bottom);
    constraint.addConstraint(['by', 'bh', -bounds.bottom]);

    expect(constraint.get('ax')).toBe(20);
    expect(constraint.get('ay')).toBe(20);
    expect(constraint.get('aw')).toBe(18);
    expect(constraint.get('ah')).toBe(200);
    expect(constraint.get('bx')).toBe(50);
    expect(constraint.get('by')).toBe(20);
    expect(constraint.get('bw')).toBe(50);
    expect(constraint.get('bh')).toBe(200);
  });

  it('Constraint cases.', () => {
    const bounds = new Bounds({ left: 20 + 150, top: 20, right: 100 + 150, bottom: 220 });
    constraint.update({ ax: bounds.left, ay: bounds.top, bx: bounds.left, ah: 20, bw: bounds.width, aw: bounds.width });

    constraint.addConstraint(['bh', 'ah', gap], '=', bounds.height);
    constraint.addConstraint(['by', 'bh'], '=', bounds.bottom);
    constraint.addConstraint(['ay', 'ah', gap, 'bh'], '=', bounds.bottom);

    let bh;
    let ah;
    expect((bh = constraint.get('bh'))).toBe(bounds.height! - 20 - gap); // bh: 168
    expect(constraint.get('by')).toBe(bounds.bottom - bh);
    expect((ah = constraint.get('ay'))).toBe(bounds.bottom - ah - bh - gap);

    // Limit the maxHeight of bh.
    constraint.set('bounds.height', bounds.height!);
    constraint.addConstraint(['bh'], '<=', [0.8, 'bounds.height']);
    expect(constraint.get('bh')).toBe(bounds.height! * 0.8);
  });
});
