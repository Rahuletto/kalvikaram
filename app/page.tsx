'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import Link from "next/link"

export default function Home() {

  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-black transition-all duration-100">
      <header className='flex items-center justify-between px-8 py-2 z-10'>
        <div className='flex items-center gap-3'>
          {mounted && <div>
            {theme === "dark" && <img src='/icons/light.svg' alt='light' className='w-8 h-8' />}
            {theme === "light" && <img src='/icons/dark.svg' alt='dark' className='w-8 h-8' />}
          </div>}
          <h1 className='text-lg font-semibold'>Kalvikaram</h1>
        </div>
        <ThemeToggle />
      </header>
      <div className="max-w-[70vw] px-32 py-12 h-[calc(100vh-100px)] flex flex-col items-start justify-center gap-5">
        <h1 className="text-5xl font-semibold tamil leading-[1.25]">கல்வி, புரிந்த<br /><span className="text-primary-dark dark:text-primary tamil">மொழியில்</span> அனுபவிக்க.</h1>
        <p className="tamil text-lg font-medium opacity-80">தமிழ் மாணவர்களுக்கு ஏற்ற தொழில்நுட்பம் சார்ந்த கல்வி உதவியாளர்.
          பாடப்புத்தக உள்ளடக்கத்தை புரிந்துகொள்ள எளிய விளக்கங்கள், சுருக்கங்கள், மொழிபெயர்ப்புகள், எல்லாவற்றையும் <span className="sans text-primary-dark underline dark:text-primary font-semibold">Kalvikaram AI</span> வழங்குகிறது</p>
        <Link href='/chat' className="bg-primary-dark/20 mt-5 text-primary p-3 px-7 rounded-full font-semibold dark:bg-primary/20">
          Get Started
        </Link>
      </div>

      {
        mounted && theme === "dark" ? <img src='/hero-dark.svg' alt='hero' className='h-screen absolute right-0 object-cover' /> : mounted && <img src='/hero-light.svg' alt='hero' className='h-screen absolute right-0 object-cover' />
      }
    </main>
  );
}
