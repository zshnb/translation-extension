import { useState } from 'react';
import {Setting} from "./type/types";

type TranslationResult = {
  text: string
}

type DictionaryResult = {
  allMeanings: Meaning[]
}

type Meaning = {
  type: string
  text: string[]
}

type TranslateRequest = {
  text: string
  onSuccess: (result: TranslationResult | DictionaryResult) => void
}

const useTranslate = () => {
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const getMode = async (text: string) => {
    const isWord = !text.includes(' ')
    if (!isWord) {
      return 'translation'
    }
    const setting = await getSetting()
    return setting.mode
  }

  const detectAndTranslate = async (text: string) => {
    setLoading(true);
    try {
      const mode = await getMode(text)
      if (mode === 'translation') {
        await translationMode({
          text,
          onSuccess: (result) => {
            setTranslation((result as TranslationResult).text)
          }
        })
      } else {
        await dictionaryMode({
          text,
          onSuccess: (result) => {
            const dictionaryResult = result as DictionaryResult
            const text = dictionaryResult.allMeanings.map(it => {
              return `${it.type}: ${it.text.join(', ')}`
            }).join('\n')
            setTranslation(text)
          }
        })
      }
    } catch (error) {
      setTranslation((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { translate: detectAndTranslate, translation, loading };
};

const getSetting: () => Promise<Setting> = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('setting', (result) => {
      if (result.setting) {
        resolve(result.setting)
      } else {
        resolve({
          mode: 'translation',
        })
      }
    });
  })
}

const translationMode = async (request: TranslateRequest) => {
  const apiOrigin = process.env.API_ORIGIN;
  // 使用原文检测
  const detectionResponse = await fetch(`${apiOrigin}/api/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: request.text.substring(0, 10),
      sourceLang: null,
      targetLang: 'EN-US', // 仅用于检测源语言
      api: 'deepl'
    })
  });

  if (!detectionResponse.ok) {
    throw new Error('翻译失败，请稍后重试')
  }

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
      text: request.text,
      sourceLang: detectedSourceLang,
      targetLang: targetLang,
      api: 'deepl'
    })
  });

  if (translationResponse.ok) {
    const translationData = await translationResponse.json();
    request.onSuccess(translationData)
  } else {
    throw new Error('翻译失败');
  }
}

const dictionaryMode = async (request: TranslateRequest) => {
  const apiOrigin = process.env.API_ORIGIN;
  const translationResponse = await fetch(`${apiOrigin}/api/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: request.text,
      api: 'gpt'
    })
  });

  if (translationResponse.ok) {
    const translationData = await translationResponse.json();
    request.onSuccess(translationData)
  } else {
    throw new Error('翻译失败，请稍后重试');
  }
}

export default useTranslate;
