'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { BsSunFill } from 'react-icons/bs'
import { FaMoon } from 'react-icons/fa6'

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <button
            className='text-lg p-3 px-5 rounded-full text-color hover:dark:bg-white/5 transition-all duration-150 hover:bg-black/5'
            name="theme"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            {theme === 'light' ? <FaMoon /> : <BsSunFill />}
        </button>
    )
}