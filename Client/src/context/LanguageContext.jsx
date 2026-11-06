import { createContext, useCallback, useEffect, useState } from 'react'
import { translations } from '../i18n/translations'

export const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
})

// Pehli baar hamesha English. Hindi tabhi jab user ne khud chuni ho
const getInitialLang = () => {
  try {
    return localStorage.getItem('lang') === 'hi' ? 'hi' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* storage allowed nahi hai */
    }
  }, [lang])

  // t('nav.services')  ya  t('call.doneText', { name: 'Ravi', phone: '98765' })
  const t = useCallback(
    (key, vars) => {
      let text = translations[lang][key] ?? translations.en[key] ?? key
      if (vars) {
        Object.keys(vars).forEach((name) => {
          text = text.replaceAll(`{${name}}`, vars[name])
        })
      }
      return text
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}