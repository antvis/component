export type Merge<T, P> = {
  [key in keyof T | keyof P]?: key extends keyof T & keyof P
    ? T[key] & P[key]
    : key extends keyof T
    ? T[key]
    : key extends keyof P
    ? P[key]
    : never;
};

export type MergeMultiple<T> = T extends [infer A, infer B, ...infer C]
  ? Merge<Merge<A, B>, MergeMultiple<C>>
  : T extends [infer A, infer B]
  ? Merge<A, B>
  : T extends [infer A]
  ? A
  : T;
