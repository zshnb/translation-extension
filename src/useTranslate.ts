import { useState } from 'react';

const useTranslate = () => {
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const detectAndTranslate = async (text: string) => {
    setLoading(true);
    try {
      // 使用原文的第一个字符进行语言检测
      const detectionResponse = await fetch('http://localhost:3000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'text': text,
          'sourceLang': null,
          'targetLang': 'EN-US' // 仅用于检测源语言
        })
      });

      const detectionData = await detectionResponse.json();
      console.log(detectionData)
      const detectedSourceLang = detectionData.detectedSourceLang.toUpperCase()

      // 根据源语言确定目标语言
      const targetLang = detectedSourceLang === 'ZH' ? 'EN-US' : 'ZH';
      console.log(targetLang)

      // 使用检测到的源语言进行完整翻译
      const translationResponse = await fetch('http://localhost:3000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'text': text,
          'sourceLang': detectedSourceLang,
          'targetLang': targetLang,
        })
      });

      const translationData = await translationResponse.json();
      if (translationResponse.ok) {
        setTranslation(translationData.text);
      } else {
        throw new Error(translationData.message || '翻译失败');
      }
    } catch (error) {
      console.error('翻译错误:', error);
      setTranslation('');
    } finally {
      setLoading(false);
    }
  };

  return { translate: detectAndTranslate, translation, loading };
};

export default useTranslate;
