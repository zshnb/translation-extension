import mountFloatingDiv from "./mountFloatingDiv";
import debounce from "debounce";

const handleSelectionChange = (event: MouseEvent) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY + window.scrollY + 20;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && selection.toString().trim() !== '') {
    const selectedText = selection.toString().trim()
    const marker = document.createElement('div');

    // 设置小方块的样式
    marker.className = 'useful-translation-icon'
    marker.style.position = 'absolute';
    marker.style.left = `${mouseX}px`;
    marker.style.top = `${mouseY}px`;
    marker.style.width = '25px';
    marker.style.height = '25px';
    marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    const imageUrl = chrome.runtime.getURL('assets/logo.png');
    marker.style.backgroundImage = `url("${imageUrl}")`;
    marker.style.backgroundSize = 'cover'

    document.body.appendChild(marker);

    // 小方块的点击事件
    marker.addEventListener('click', () => {
      mountFloatingDiv(selectedText, {
        position: {
          left: mouseX,
          bottom: mouseY
        }
      });
      document.body.removeChild(marker)
    });
  }
}

document.addEventListener('mouseup', debounce(handleSelectionChange, 300));
document.addEventListener('click', function () {
  const markers = document.getElementsByClassName('useful-translation-icon')
  if (markers.length > 0) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].remove()
    }
  }
})

export {}