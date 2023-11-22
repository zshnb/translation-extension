export type Setting = {
  mode: 'translation' | 'dictionary',
  api: 'deepl' | 'gpt',
  apiKey?: string,
  preference?: string
}