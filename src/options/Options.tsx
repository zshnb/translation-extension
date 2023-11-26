import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import {Setting} from "../type/types";

const Options = () => {
  const [setting, setSetting] = useState<Setting>({
    mode: 'translation',
  });

  useEffect(() => {
    // 加载已保存的设置
    chrome.storage.local.get('setting', (result) => {
      if (result.setting) {
        setSetting(result.setting);
      }
    });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    chrome.storage.local.set({ setting }, () => {
      console.log('Settings saved.');
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSetting({ ...setting, [event.target.name]: event.target.value });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <p>模式：</p>
          <label>
            <input type="radio" name="mode" value="translation" onChange={handleChange} checked={setting.mode === 'translation'} /> 翻译模式
          </label>
          <label>
            <input type="radio" name="mode" value="dictionary" onChange={handleChange} checked={setting.mode === 'dictionary'} /> 词典模式
          </label>
        </div>

        <div>
          <p>Deepl API Key：</p>
          <input type="text" name="apiKey" onChange={handleChange} value={setting.apiKey} className="border border-gray-300 p-2 rounded" />
        </div>

        <div>
          <p>偏好领域：</p>
          <select name="preference" onChange={handleChange} value={setting.preference} className="border border-gray-300 p-2 rounded">
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
