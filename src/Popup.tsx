import React, { useState } from 'react';
import styled from 'styled-components';
import 'tailwindcss/tailwind.css';
import useTranslate from "./useTranslate";

const Container = styled.div.attrs({
  className: 'flex flex-col items-center p-4 bg-gray-100 min-h-screen gap-y-4'
})``;

const StyledTitle = styled.p.attrs({
  className: 'text-xl font-bold text-gray-700'
})``;

const StyledTranslationResult = styled.div.attrs({
  className: 'border border-gray-300 p-2 w-full rounded-lg shadow-sm bg-white'
})`
  & {
    min-height: 5rem;
  }
`;

const StyledButton = styled.button.attrs({
  className: "bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition duration-300 text-sm w-2/4"
})`
  & {
    height: 2rem;
  }
`;

const StyledTextarea = styled.textarea.attrs({
  className: "border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300 text-sm w-full"
})``;


const Popup: React.FC = () => {
  const [text, setText] = useState('');
  const { translate, translation, loading } = useTranslate(); // 使用hook

  const handleTranslate = () => {
    // 调用translate函数进行翻译
    translate(text);
  };

  return (
    <Container>
      <div className="flex flex-row w-full">
        <StyledTitle className="flex-grow">快捷翻译</StyledTitle>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => chrome.runtime.openOptionsPage()}>
          设置
        </button>
      </div>
      <StyledTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="请在这输入待翻译文本" />
      <StyledButton
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? '翻译中...' : '翻译'}
      </StyledButton>
      <StyledTranslationResult>{translation}</StyledTranslationResult>
    </Container>
  );
};

export default Popup;
