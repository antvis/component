import { Group, GroupStyleProps } from '@antv/g';

type GroupTest = (group: Group) => void;
type GroupTestReturn = { (): Group; [keys: string]: any };

export function it(test: GroupTest): GroupTestReturn;
export function it(options: GroupStyleProps, test: GroupTest): GroupTestReturn;
export function it(argv1: GroupTest | GroupStyleProps, argv2?: GroupTest): GroupTestReturn {
  return () => {
    const group = new Group();

    if (typeof argv1 === 'object') {
      group.attr(argv1);
      argv2?.(group);
    } else argv1(group);

    return group;
  };
}
