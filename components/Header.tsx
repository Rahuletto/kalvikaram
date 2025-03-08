'use client'
import React, { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from 'next-themes'

type Language = 'english' | 'tamil'

export default function Header() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<Language>('tamil')

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (value: Language) => {
    setLanguage(value)
    localStorage.setItem('language', value)
    window.dispatchEvent(new Event('languageChange'))
  }

  return (
    <header className='flex items-center justify-between px-8 py-2'>
      <div className='flex items-center gap-3'>
        {mounted && <div>
          {theme === "dark" && <img src='/icons/light.svg' alt='light' className='w-8 h-8' />}
          {theme === "light" && <img src='/icons/dark.svg' alt='dark' className='w-8 h-8' />}
        </div>}
        <h1 className='text-lg font-semibold'>{language === "english" ? "Kalvikaram" : "கல்விகரம்"}</h1>
      </div>
      <div className='flex items-center gap-4'>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
          className="h-9 rounded-full font-semibold appearance-none bg-black/5 dark:bg-white/5 px-5 py-1 text-sm shadow-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none"
        >
          <option value="english">English</option>
          <option value="tamil">தமிழ்</option>
          <option value="romanized">Tamil {"(romanized)"}</option>
        </select>
        <ThemeToggle />
      </div>
    </header>
  )
}
