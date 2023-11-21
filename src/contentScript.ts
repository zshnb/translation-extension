import mountFloatingDiv from "./mountFloatingDiv";

document.addEventListener('dblclick', () => {
  console.log('clicked')
  const selectedText = window.getSelection()?.toString().trim();
  if (selectedText) {
    // 这里调用React组件来显示悬浮框
    mountFloatingDiv(selectedText);
  }
});

export {}