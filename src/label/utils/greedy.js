
class Greedy {
  constructor() {
    this.bitmap = [];
  }
  hasGap(bbox) {
    let hasGap = true;
    const bitmap = this.bitmap;
    const minY = Math.floor(bbox.minY);
    const maxY = Math.ceil(bbox.maxY) - 1;
    for (let i = Math.floor(bbox.minX); i < Math.ceil(bbox.maxX); i++) {
      if (!bitmap[i]) {
        bitmap[i] = [];
        continue;
      }
      if (i === 0 || i === Math.ceil(bbox.maxX)) {
        for (let j = minY; j <= maxY; j++) {
          if (bitmap[i][j]) {
            hasGap = false;
            break;
          }
        }
      } else {
        if (bitmap[i][minY] || bitmap[i][maxY]) {
          hasGap = false;
          break;
        }
      }
    }
    return hasGap;
  }
  fillGap(bbox) {
    const bitmap = this.bitmap;
    for (let i = Math.floor(bbox.minX); i < Math.ceil(bbox.maxX); i++) {
      for (let j = Math.floor(bbox.minY); j < Math.ceil(bbox.maxY); j++) {
        if (!bitmap[i]) {
          bitmap[i] = [];
        }
        bitmap[i][j] = true;
      }
    }
  }
}

module.exports = Greedy;
