import * as kiwi from 'kiwi.js';

function defined(v: number | null | undefined) {
  return v !== null && v !== undefined && !Number.isNaN(v);
}

export class Constraint {
  private solver = new kiwi.Solver();

  private variables: Map<string, kiwi.Variable> = new Map();

  private constraints: Map<string, kiwi.Constraint> = new Map();

  constructor(variables: Record<string, any> = {}) {
    Object.keys(variables).forEach((name) => {
      this.updateVariable(name, variables[name]);
    });
  }

  private updateVariable(name: string, value?: any): kiwi.Variable {
    let variable = this.variables.get(name);
    if (!variable) {
      variable = new kiwi.Variable(name);
      this.solver.addEditVariable(variable, kiwi.Strength.strong);
      this.variables.set(name, variable);
    }
    if (defined(value)) {
      this.solver.suggestValue(variable, value || 0);
    }
    return variable;
  }

  /**
   * The function accepts an arbitrary number of parameters,
   * each of which must be one of the following types:
   *  - number
   *  - string: name of Variable
   *  - Expression
   *  - 2-tuple of [number, string(name of Variable)|Expression]
   *
   * @example
   *   - addConstraint([ 'a' ], '=', 'b'); // means: a = b;
   *   - addConstraint([ 'a', -12], '=' 'b']); // means: a = b + 12;
   *   - addConstraint([ ['a', 'b', 12], '=', 'c']); // means: a + b + 12 = c;
   *   - addConstraint([ 'a' ], kiwi.Operator.Le, 12); // means: a < 12;
   */
  public addConstraint(
    params: Array<string | number | [number, string]>,
    operator: '=' | '<=' | '>=' = '=',
    rhs?: string | number | [number, string],
    strength?: number
  ) {
    const key = JSON.stringify({ ...params, operator, rhs, strength });
    const exprs = [];
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      if (typeof param === 'number') {
        exprs.push(param);
      } else if (typeof param === 'string') {
        let variable = this.variables.get(param);
        if (!variable) {
          variable = this.updateVariable(param);
        }
        exprs.push(variable);
      } else if (param instanceof Array) {
        if (param.length !== 2) {
          throw new Error('array must have length 2');
        }
        const d1: any = param[0];
        let d2: any = param[1];
        if (typeof d1 !== 'number') {
          throw new Error('array item 0 must be a number');
        }
        if (typeof d2 === 'string') {
          let variable = this.variables.get(d2);
          if (!variable) {
            variable = this.updateVariable(d2);
          }
          d2 = variable;
        }
        exprs.push([d1, d2]);
      }
    }

    let rhsExpression: any = 0;
    if (typeof rhs === 'string') {
      const variable = this.variables.get(rhs);
      if (variable) rhsExpression = variable;
    } else if (typeof rhs === 'number') {
      rhsExpression = rhs;
    } else if (rhs instanceof Array) {
      rhsExpression = new kiwi.Expression(this.variables.get(rhs[1])).multiply(rhs[0]);
    }
    const Operator = {
      '=': kiwi.Operator.Eq,
      '<=': kiwi.Operator.Le,
      '>=': kiwi.Operator.Ge,
    };
    const cn = new kiwi.Constraint(new kiwi.Expression(...exprs), Operator[operator], rhsExpression, strength);
    try {
      this.solver.addConstraint(cn);
      this.constraints.set(key, cn);
    } catch (e) {
      console.warn(e);
    }
  }

  public removeConstraint(
    params: Array<string | number | [number, string]>,
    operator: '=' | '<=' | '>=' = '=',
    rhs?: string | number | [number, string],
    strength?: number
  ) {
    const key = JSON.stringify({ ...params, operator, rhs, strength });
    const constraint = this.constraints.get(key);
    if (constraint) {
      this.solver.removeConstraint(constraint);
      this.constraints.delete(key);
    }
  }

  public collect(): any {
    this.solver.updateVariables();
    const values = Object.entries([...this.variables.values()]).reduce(
      (r, [, d]) => ((r[d.name()] = d.value() === -0 ? 0 : d.value()), r),
      {} as any
    );
    return values;
  }

  public get(name: string) {
    return this.collect()[name];
  }

  public set(name: string, value: any) {
    this.updateVariable(name, value);
  }

  /**
   * Remove all constraints and update variables.
   */
  public update(vars: any) {
    Array.from(this.constraints.values()).forEach((cn) => this.solver.removeConstraint(cn));
    Array.from(this.variables.values()).forEach((variable) => {
      if (this.solver.hasEditVariable(variable)) this.solver.removeEditVariable(variable);
    });
    const varsName = { ...Object.fromEntries(this.variables.entries()), ...vars };
    this.variables.clear();
    this.constraints.clear();
    Object.keys(varsName).forEach((name) => this.updateVariable(name, vars[name]));
  }
}
