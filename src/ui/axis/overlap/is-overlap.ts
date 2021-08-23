import type { DisplayObject } from '@antv/g';
import { Text } from '@antv/g';
import { getBoundsCenter } from '../utils';

const { abs, atan2, cos, PI, sin, sqrt } = Math;

type Vector = [number, number];
type Margin = [number, number, number, number];
type CollisionRectOptions = {
  // 中心
  center: [number, number];
  width: number;
  height: number;
  // 旋转的角度
  angle: number;
};

/**
 * 基于分离轴定律(SAT)进行碰撞检测
 * TODO 目前只能应用于中心旋转
 */
class CollisionRect {
  public axisX!: Vector;

  public axisY!: Vector;

  private halfWidth: number;

  private halfHeight: number;

  private centerPoint: [number, number];

  constructor(options: CollisionRectOptions) {
    const { center, height, width, angle } = options;
    this.centerPoint = center;
    this.halfHeight = height / 2;
    this.halfWidth = width / 2;
    this.setRotation(angle);
  }

  public getProjectionRadius(axis: Vector) {
    // 计算半径投影
    const projectionAxisX = this.dot(axis, this.axisX);
    const projectionAxisY = this.dot(axis, this.axisY);
    return this.halfWidth * projectionAxisX + this.halfHeight * projectionAxisY;
  }

  public dot(vectorA: Vector, vectorB: Vector) {
    // 向量点积
    return abs(vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1]);
  }

  public setRotation(angle: number) {
    // 计算两个检测轴的单位向量
    const deg = (angle / 180) * PI;
    this.axisX = [cos(deg), -sin(deg)];
    this.axisY = [sin(deg), cos(deg)];
    return this;
  }

  public isCollision(check: CollisionRect) {
    const centerDistanceVector = [
      this.centerPoint[0] - check.centerPoint[0],
      this.centerPoint[1] - check.centerPoint[1],
    ] as Vector;

    const axes = [
      // 两个矩形一共4条检测轴
      this.axisX,
      this.axisY,
      check.axisX,
      check.axisY,
    ];
    for (let i = 0, len = axes.length; i < len; i += 1) {
      if (
        this.getProjectionRadius(axes[i]) + check.getProjectionRadius(axes[i]) <=
        this.dot(centerDistanceVector, axes[i])
      ) {
        return false; // 任意一条轴没碰上，就是没碰撞
      }
    }

    return true;
  }

  public getBounds() {
    return {
      width: this.halfWidth * 2,
      height: this.halfHeight * 2,
      center: this.centerPoint,
    };
  }
}

/**
 * 获得图形在水平状态下的尺寸位置
 */
export function getHorizontalShape(shape: DisplayObject) {
  const currEulerAngles = shape.getEulerAngles();
  shape.setEulerAngles(0);
  const bound = shape.getBoundingClientRect();
  shape.setEulerAngles(currEulerAngles);
  return bound;
}

/**
 * 获得 DisplayObject 的碰撞 Text
 */
export function getCollisionText(shape: Text, [top, right, bottom, left]: Margin) {
  // TODO 目前需要确保文本的 textBaseline 为 middle
  const [x, y] = getBoundsCenter(shape);

  // 水平状态下文本的宽高
  const { width, height } = getHorizontalShape(shape);
  const [boxWidth, boxHeight] = [left + width + right, top + height + bottom];
  // 加上边距的包围盒中心
  const [boxX, boxY] = [x - width / 2 - left + boxWidth / 2, y - height / 2 - top + boxHeight / 2];
  const angle = shape.getEulerAngles();
  let [deltaX, deltaY] = [0, 0];
  const [diffX, diffY] = [boxX - x, boxY - y];
  if (angle === 0 || diffX === 0) {
    [deltaX, deltaY] = [diffX, diffY];
  } else {
    const alpha = atan2(diffY, diffX) + (angle / 180) * PI;
    // 文本中心到包围盒中心的距离
    const distance = sqrt(diffX ** 2 + diffY ** 2);
    // 计算包围盒绕 x，y 旋转后的中心位置
    // boxX - x = 0 时，会导致alpha为null
    [deltaX, deltaY] = [distance * cos(alpha), distance * sin(alpha)];
  }
  return new CollisionRect({
    angle,
    center: [x + deltaX, y + deltaY],
    width: boxWidth,
    height: boxHeight,
  });
}

/**
 * 判断两个 Text 是否重叠
 */
export function isTextOverlap(A: Text, B: Text, margin: Margin): boolean {
  const collisionA = getCollisionText(A, margin);
  const collisionB = getCollisionText(B, margin);
  return collisionA.isCollision(collisionB);
}

/**
 * 判断 labels 是否发生重叠
 */
export function isLabelsOverlap(labels: Text[], margin: Margin): boolean {
  for (let index = 1; index < labels.length; index += 1) {
    const prevLabel = labels[index - 1];
    const currLabel = labels[index];
    if (isTextOverlap(prevLabel, currLabel, margin)) {
      return true;
    }
  }
  return false;
}
