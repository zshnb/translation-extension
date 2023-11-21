import { useState } from 'react';

const useTranslate = () => {
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const detectAndTranslate = async (text: string) => {
    setLoading(true);
    try {
      // 使用原文的第一个字符进行语言检测
      const detectionResponse = await fetch('https://api.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'DeepL-Auth-Key 52c1db36-46e2-eb9a-8410-d5522624907b:fx'
        },
        body: JSON.stringify({
          'text': text,
          'target_lang': 'EN' // 仅用于检测源语言
        })
      });

      const detectionData = await detectionResponse.json();
      const detectedSourceLang = detectionData.translations[0].detected_source_language;

      // 根据源语言确定目标语言
      const targetLang = detectedSourceLang === 'ZH' ? 'EN' : 'ZH';

      // 使用检测到的源语言进行完整翻译
      const translationResponse = await fetch('https://api.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'DeepL-Auth-Key 52c1db36-46e2-eb9a-8410-d5522624907b:fx'
        },
        body: JSON.stringify({
          'text': text,
          'source_lang': detectedSourceLang,
          'target_lang': targetLang,
        })
      });

      const translationData = await translationResponse.json();
      if (translationResponse.ok) {
        setTranslation(translationData.translations[0].text);
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
