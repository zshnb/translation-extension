import React, { useState } from 'react';
import styled from 'styled-components';
import 'tailwindcss/tailwind.css';
import useTranslate from "./useTranslate";

const Container = styled.div`
  padding: 1rem;
`;

const TranslateButton = styled.button`
  @apply mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700;
`;

const TranslationResult = styled.div`
  @apply mt-4 p-4 bg-gray-100 rounded-lg;
`;

const Popup: React.FC = () => {
  const [text, setText] = useState('');
  const { translate, translation, loading } = useTranslate(); // 使用hook

  const handleTranslate = () => {
    // 调用translate函数进行翻译
    translate(text);
  };

  return (
    <Container>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <TranslateButton onClick={handleTranslate} disabled={loading}>
        {loading ? '翻译中...' : '翻译'}
      </TranslateButton>
      <TranslationResult>{translation}</TranslationResult>
    </Container>
  );
};

export default Popup;
