/**
 * @fileOverview 计算path 使用的工具方法
 * @author dxq613@gmail.com
 */
const Util = require('../../util');

function getPointRadius(coord, point) {
  const center = coord.getCenter();
  const r = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
  return r;
}

function convertArr(arr, coord) {
  const len = arr.length;
  const tmp = [ arr[0] ];
  for (let i = 1; i < len; i = i + 2) {
    const point = coord.convertPoint({
      x: arr[i],
      y: arr[i + 1]
    });
    tmp.push(point.x, point.y);
  }
  return tmp;
}

function convertPolarPath(pre, cur, coord) {
  const transposed = coord.isTransposed;
  const startAngle = coord.startAngle;
  const endAngle = coord.endAngle;

  const prePoint = {
    x: pre[1],
    y: pre[2]
  };
  const curPoint = {
    x: cur[1],
    y: cur[2]
  };
  const rst = [];
  // innerRadius = innerRadius || 0;
  const xDim = transposed ? 'y' : 'x';
  const angleRange = Math.abs(curPoint[xDim] - prePoint[xDim]) * (endAngle - startAngle);
  const direction = curPoint[xDim] >= prePoint[xDim] ? 1 : 0; // 圆弧的方向
  const flag = angleRange > Math.PI ? 1 : 0; // 大弧还是小弧标志位
  const convertPoint = coord.convertPoint(curPoint);
  const r = getPointRadius(coord, convertPoint);
  if (r >= 0.5) { // 小于1像素的圆在图像上无法识别
    if (angleRange === Math.PI * 2) {
      const middlePoint = {
        x: (curPoint.x + prePoint.x) / 2,
        y: (curPoint.y + prePoint.y) / 2
      };
      const middleConvertPoint = coord.convertPoint(middlePoint);
      rst.push([ 'A', r, r, 0, flag, direction, middleConvertPoint.x, middleConvertPoint.y ]);
      rst.push([ 'A', r, r, 0, flag, direction, convertPoint.x, convertPoint.y ]);
    } else {
      rst.push([ 'A', r, r, 0, flag, direction, convertPoint.x, convertPoint.y ]);
    }
  }
  return rst;
}

// 当存在整体的圆时，去除圆前面和后面的线，防止出现直线穿过整个圆的情形
function filterFullCirleLine(path) {
  Util.each(path, function(subPath, index) {
    const cur = subPath;
    if (cur[0].toLowerCase() === 'a') {
      const pre = path[index - 1];
      const next = path[index + 1];
      if (next && next[0].toLowerCase() === 'a') {
        if (pre && pre[0].toLowerCase() === 'l') {
          pre[0] = 'M';
        }
      } else if (pre && pre[0].toLowerCase() === 'a') {
        if (next && next[0].toLowerCase() === 'l') {
          next[0] = 'M';
        }
      }
    }
  });
}

const PathUtil = {
  convertPolarPath(coord, path) {
    let tmp = [];
    let pre;
    let cur;
    let transposed;
    let equals;
    Util.each(path, function(subPath, index) {
      const action = subPath[0];

      switch (action.toLowerCase()) {
        case 'm':
        case 'c':
        case 'q':
          tmp.push(convertArr(subPath, coord));
          break;
        case 'l':
          pre = path[index - 1];
          cur = subPath;
          transposed = coord.isTransposed;
          // 是否半径相同，转换成圆弧
          equals = transposed ? pre[pre.length - 2] === cur[1] : pre[pre.length - 1] === cur[2];
          if (equals) {
            tmp = tmp.concat(convertPolarPath(pre, cur, coord));
          } else { // y 不相等，所以直接转换
            tmp.push(convertArr(subPath, coord));
          }
          break;
        case 'z':
        default:
          tmp.push(subPath);
          break;
      }
    });
    filterFullCirleLine(tmp); // 过滤多余的直线
    return tmp;
  }
};

module.exports = PathUtil;
