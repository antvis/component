import { IElement, IGroup } from '@antv/g-base';
import { each } from '@antv/util';
import fecha from 'fecha';
import { charAtLength, getLabelLength, strLen, testLabel, } from './util';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 31 * DAY;
const YEAR = 365 * DAY;

function dateTimeAbbrevaite(label, labels, index, timeDuration, limitLength) {
    const text = label.attr('text');
    const labelLength = label.getBBox().width;
    const codeLength = strLen(text);
    const reseveLength = Math.floor((limitLength / labelLength) * codeLength);
    let campareText;
    if (index === labels.length - 1) {
        campareText = labels[index - 1].attr('text');
    } else {
        campareText = labels[index + 1].attr('text');
    }
    const compare = new Date(campareText);
    const current = new Date(label.attr('text'));
    // time frequency
    const timeCycle = getDateTimeMode(current, compare);
    // 如果duration和frequency在同一区间
    if (timeDuration === timeCycle) {
        if (index !== 0 && index !== labels.length - 1) {
            const formatter = sameSectionFormatter(current,timeDuration,reseveLength);
            label.attr('text', fecha.format(current, formatter));
        }
        return;
    }
    if (index !== 0) {
        const previousText = labels[index - 1].attr('text')
        const previous = new Date(previousText);
        const isAbbreviate = needAbbrevaite(timeDuration, current, previous);
        if (isAbbreviate) {
          const formatter = getAbbrevaiteFormatter(timeDuration, timeCycle);
          label.attr('text', fecha.format(current, formatter));
        }
    }
}

// 工具方法
function getTimeDuration(labels) {
    const start = new Date(labels[0].attr('text'));
    const end = new Date(labels[labels.length - 1].attr('text'));
    return getDateTimeMode(start, end);
}

function getDateTimeMode(a, b) {
    let mode;
    const dist = Math.abs(a - b);
    const mapper = {
        minute: [MINUTE, HOUR],
        hour: [HOUR, DAY],
        day: [DAY, MONTH],
        month: [MONTH, YEAR],
        year: [YEAR, Infinity],
    };
    each(mapper, (range, key) => {
        if (dist >= range[0] && dist < range[1]) {
            mode = key;
        }
    });
    return mode;
}

function needAbbrevaite(mode, current, previous) {
    const currentStamp = getTime(current, mode);
    const previousStamp = getTime(previous, mode);
    if (currentStamp !== previousStamp) {
        return false;
    }
    return true;
}

function getTime(date: Date, mode: string) {
    if (mode === 'year') {
        return date.getFullYear();
    }
    if (mode === 'month') {
        return date.getMonth() + 1;
    }
    if (mode === 'day') {
        return date.getDay() + 1;
    }

    if (mode === 'hour') {
        return date.getHours() + 1;
    }

    if (mode === 'minute') {
        return date.getMinutes() + 1;
    }
}

function getAbbrevaiteFormatter(duration, cycle) {
    const times = ['year', 'month', 'day', 'hour', 'minute'];
    const formatters = ['YYYY', 'MM', 'DD', 'HH', 'MM'];
    const startIndex = times.indexOf(duration) + 1;
    const endIndex = times.indexOf(cycle);
    let formatter = '';
    for (let i = startIndex; i <= endIndex; i++) {
        formatter += formatters[i];
        if (i < endIndex) {
            formatter += '-';
        }
    }
    return formatter;
}

function sameSectionFormatter(time,mode,reseveLength) {
    const times = ['year', 'month', 'day', 'hour', 'minute'];
    const formatters = ['YYYY', 'MM', 'DD', 'HH', 'MM'];
    const index = times.indexOf(mode);
    const formatter = formatters[index];
    /*
    * 格式补完、逐级显示逻辑：
    * YYYY、MM、DD、HH、mm、ss 为时间格式字段，DD左边的字段为高位字段，右边的字段为低位字段。
    * 如果空间允许，DD及之前向高位补一位，HH及之后向低位补一位
    */
    if(index!==0 && index!==times.length){
        const extendIndex = index <= 2 ? index - 1 : index + 1;
        const extendFormatter = index <= 2 ? `${formatters[extendIndex]}-${formatter}` : `${formatter}-${formatters[extendIndex]}`;
        if(strLen(fecha.format(time,extendFormatter)) < reseveLength){
            return extendFormatter;
        }
    }
    return formatter; 
}

export function ellipsisTime(labelGroup: IGroup, limitLength: number): boolean {
    const children = labelGroup.getChildren();
    let needFormat = false;
    each(children, (label) => {
        const rst = testLabel(label, limitLength);
        needFormat = needFormat || rst;
    });
    if (needFormat) {
        const timeDuration = getTimeDuration(children);
        each(children, (label, index) => {
            dateTimeAbbrevaite(label, children, index, timeDuration, limitLength);
        });
        return true;
    }
    return false;
}