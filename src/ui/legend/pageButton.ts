import { Button, ButtonStyleProps } from '../timeline/button';

export { Button as PageButton, ButtonStyleProps };

Button.registerSymbol('left', (x: number, y: number, r: number) => {
  const diff = r * Math.sin(Math.PI / 3);
  return [['M', x - diff, y], ['L', x + r, y - r], ['L', x + r, y + r], ['Z']];
});
Button.registerSymbol('right', (x: number, y: number, r: number) => {
  const diff = r * Math.sin(Math.PI / 3);
  return [['M', x - r, y - r], ['L', x + diff, y], ['L', x - r, y + r], ['Z']];
});
Button.registerSymbol('up', (x: number, y: number, r: number) => {
  const diff = r * Math.sin(Math.PI / 3);
  return [['M', x - r, y + r], ['L', x, y - diff], ['L', x + r, y + r], ['Z']];
});
Button.registerSymbol('down', (x: number, y: number, r: number) => {
  const diff = r * Math.sin(Math.PI / 3);
  return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x, y + diff], ['Z']];
});
