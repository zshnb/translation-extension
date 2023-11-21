import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useTranslate from "./useTranslate";

const FloatingDiv: React.FC<{ text: string; onClose: () => void }> = ({ text, onClose }) => {
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
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
      <p>{loading ? '翻译中' : translation}</p>
    </div>
  );
};

const mountFloatingDiv = (text: string) => {
  const floatingDivContainer = document.createElement('div');
  document.body.appendChild(floatingDivContainer);

  ReactDOM.render(
    <FloatingDiv text={text} onClose={() => document.body.removeChild(floatingDivContainer)} />,
    floatingDivContainer
  );
};

export default mountFloatingDiv;
