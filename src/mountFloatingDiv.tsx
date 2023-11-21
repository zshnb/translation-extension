import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import useTranslate from "./useTranslate";
import styled from "styled-components";

export type FloatingDivProps = {
  text: string
  onClose: () => void
  position: {
    left: number
    bottom: number
  }
}

const TranslationText = styled.p`
  margin: 0;
`

const TranslationTextWrap = styled.div<Pick<FloatingDivProps, 'position'>>`
  position: absolute;
  left: ${p => p.position.left}px;
  top: ${p => p.position.bottom}px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transform: translateX(-50%);
`
const FloatingDiv: React.FC<FloatingDivProps> = ({ text, onClose, position }) => {
  const { translate, translation, loading } = useTranslate(); // 使用hook

  useEffect(() => {
    // 模拟翻译过程
    translate(text)

    // 点击任意位置关闭浮窗
    const handleClickOutside = (event: MouseEvent) => {
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [text, onClose]);

  return (
    <TranslationTextWrap position={position}>
      <TranslationText>{loading ? '翻译中' : translation}</TranslationText>
    </TranslationTextWrap>
  );
};

const mountFloatingDiv = (text: string, position: Pick<FloatingDivProps, 'position'>) => {
  const floatingDivContainer = document.createElement('div');
  document.body.appendChild(floatingDivContainer);

  ReactDOM.render(
    <FloatingDiv text={text} onClose={() => {
      document.body.removeChild(floatingDivContainer)
    }} position={position.position}/>,
    floatingDivContainer
  );
};

export default mountFloatingDiv;
