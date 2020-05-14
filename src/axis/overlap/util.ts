export function getLabelLength(isVertical: boolean, label) {
    const bbox = label.getCanvasBBox();
    return isVertical ? bbox.width : bbox.height;
}

export function strLen(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        len += charAtLength(str, i);
    }
    return len;
}

export function charAtLength(str, i) {
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
        return 1;
    } else {
        return 2;
    }
}