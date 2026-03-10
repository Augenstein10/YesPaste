import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import i18n from './i18n'
import './index.css'
import App from './App.tsx'

const savedLang = (() => {
  try {
    const raw = localStorage.getItem('yespaste_settings')
    if (!raw) return undefined
    const s = JSON.parse(raw)
    return s.language
  } catch {
    return undefined
  }
})()

if (savedLang === 'zh' || savedLang === 'en') {
  i18n.changeLanguage(savedLang)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
