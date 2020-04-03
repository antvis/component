export function simulateMouseEvent(dom, type, cfg) {
  const event = new MouseEvent(type, cfg);
  dom.dispatchEvent(event);
}

export function simulateTouchEvent(dom, type, cfg) {
  const touchObj = new Touch({
    identifier: Date.now(),
    target: dom,
    ...cfg,
  });
  const event = new TouchEvent(type, {
    touches: [touchObj],
  });
  dom.dispatchEvent(event);
}
