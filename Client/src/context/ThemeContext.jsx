import { createContext, useCallback, useEffect, useState } from 'react'

export const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
})

// Pehli baar aane par hamesha dark. Light tabhi jab user ne khud chuna ho
const getInitialTheme = () => {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage allowed nahi hai */
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    const root = document.documentElement
    root.classList.add('theme-anim')
    window.setTimeout(() => root.classList.remove('theme-anim'), 450)
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}