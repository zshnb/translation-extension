import { useState } from 'react';

const useTranslate = () => {
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const apiOrigin = process.env.API_ORIGIN;

  const detectAndTranslate = async (text: string) => {
    setLoading(true);
    try {
      // 使用原文检测
      const detectionResponse = await fetch(`${apiOrigin}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'text': text.substring(0, 10),
          'sourceLang': null,
          'targetLang': 'EN-US' // 仅用于检测源语言
        })
      });

      const detectionData = await detectionResponse.json();
      const detectedSourceLang = detectionData.detectedSourceLang.toUpperCase()

      // 根据源语言确定目标语言
      const targetLang = detectedSourceLang === 'ZH' ? 'EN-US' : 'ZH';

      // 使用检测到的源语言进行完整翻译
      const translationResponse = await fetch(`${apiOrigin}/api/translate`, {
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
