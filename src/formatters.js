/* @flow */

function pad(num: number, size: number = 2): string {
  const s = num.toString();
  const shortage = Math.max(size - s.length, 0);
  const prefix = '0'.repeat(shortage);
  return `${prefix}${s}`;
}

export function formatDate(date: ?Date): string {
  if (!date) {
    return '';
  }
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

export function formatFullDate(date: ?Date): string {
  if (!(date instanceof Date)) {
    return '';
  }
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}`;
}

export function formatNumber(num: number): string {
  if (typeof num !== 'number') {
    return num;
  }
  const isMinus = num < 0;
  const str = (isMinus ? -num : num).toString();
  const len = str.length;
  const parts = [];
  let span = len % 3;
  if (span === 0) {
    span = 3;
  }
  let pos = 0;
  while (pos < len) {
    parts.push(str.slice(pos, pos + span));
    pos += span;
    span = 3;
  }
  return (isMinus ? '-' : '') + parts.join(',');
}
