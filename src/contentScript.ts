import mountFloatingDiv from "./mountFloatingDiv";
import debounce from "debounce";

const handleSelectionChange = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && selection.toString().trim() !== '') {
    const selectedText = selection.toString().trim()
    const range = selection.getRangeAt(0).getBoundingClientRect();
    const marker = document.createElement('div');

    console.log(range)
    // 设置小方块的样式
    marker.style.position = 'absolute';
    marker.style.left = `${range.right}px`;
    marker.style.top = `${range.bottom}px`;
    marker.style.width = '20px';
    marker.style.height = '20px';
    const imageUrl = chrome.runtime.getURL('assets/logo.png');
    marker.style.backgroundImage = `url("${imageUrl}")`;
    marker.style.backgroundSize = 'cover'

    document.body.appendChild(marker);

    // 小方块的点击事件
    marker.addEventListener('click', () => {
      mountFloatingDiv(selectedText, {
        position: {
          left: range?.left || 0,
          bottom: range?.bottom || 0
        }
      });
      document.body.removeChild(marker)
    });
  }
}

document.addEventListener('selectionchange', debounce(handleSelectionChange, 300));

export {}