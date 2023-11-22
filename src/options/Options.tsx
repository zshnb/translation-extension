import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import {Setting} from "../type/types";

const Options = () => {
  const [settings, setSettings] = useState<Setting>({
    mode: 'translation',
    api: 'deepl',
  });

  useEffect(() => {
    // 加载已保存的设置
    chrome.storage.local.get('settings', (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    chrome.storage.local.set({ settings }, () => {
      console.log('Settings saved.');
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({ ...settings, [event.target.name]: event.target.value });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <p>模式：</p>
          <label>
            <input type="radio" name="mode" value="translation" onChange={handleChange} checked={settings.mode === 'translation'} /> 翻译模式
          </label>
          <label>
            <input type="radio" name="mode" value="dictionary" onChange={handleChange} checked={settings.mode === 'dictionary'} /> 词典模式
          </label>
        </div>

        <div>
          <p>翻译接口：</p>
          <label>
            <input type="radio" name="api" value="deepl" onChange={handleChange} checked={settings.api === 'deepl'} /> DeepL
          </label>
          <label>
            <input type="radio" name="api" value="gpt" onChange={handleChange} checked={settings.api === 'gpt'} /> GPT
          </label>
        </div>

        <div>
          <p>API Key：</p>
          <input type="text" name="apiKey" onChange={handleChange} value={settings.apiKey} className="border border-gray-300 p-2 rounded" />
        </div>

        <div>
          <p>偏好领域：</p>
          <select name="preference" onChange={handleChange} value={settings.preference} className="border border-gray-300 p-2 rounded">
            <option value="general">通用</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit">
          保存
        </button>
      </form>
    </div>
  );
};

export default Options;
