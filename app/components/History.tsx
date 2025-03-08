'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TbLayoutSidebarRight } from 'react-icons/tb'
import { FaHistory } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { Thread } from '../chat/[threadId]/page'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa6'

export default function History() {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const [threads, setThreads] = useState<Thread[]>([])
    const router = useRouter()

    const [language, setLanguage] = useState('tamil')

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language')
        if (savedLanguage) {
            setLanguage(savedLanguage)
        }

        const storedThreads = localStorage.getItem('chatThreads')
        if (storedThreads) {
            setThreads(JSON.parse(storedThreads))
        }

        const handleStorageChange = () => {
            const updatedThreads = localStorage.getItem('chatThreads')
            if (updatedThreads) {
                setThreads(JSON.parse(updatedThreads))
            }
        }

        window.addEventListener('threadSaved', handleStorageChange)

        return () => {
            window.removeEventListener('threadSaved', handleStorageChange)
        }
    }, [])

    const handleThreadClick = (thread: Thread) => {
        router.push(`/chat/${thread.id}`)
    }

    return (
        <AnimatePresence>
            {isOpen ? (
                <motion.div
                    key="sidebar"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{
                        duration: 0.15,
                        ease: "easeInOut"
                    }}
                    className='fixed inset-0 md:relative w-[90vw] max-md:right-[10vw] md:w-[20vw] h-[calc(100vh-80px)] overflow-auto bg-white/95 dark:bg-black/95 md:bg-black/5 md:dark:bg-white/5 backdrop-blur-sm md:rounded-2xl md:backdrop-blur-none z-50'
                >
                    <div className="h-full w-full md:rounded-xl p-4 md:p-3 md:px-5">
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium text-sm text-black/60 dark:text-white/60">
                                {
                                    language === "tamil" ? "உரையாடல்கள்" : "History"
                                }
                            </h2>
                            <div className='flex items-center gap-2'>
                                <Link href="/" className='flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150 text-left'>
                                    <FaPlus />
                                </Link>
                                <button onClick={() => setIsOpen(false)}>
                                    <TbLayoutSidebarRight className="transform rotate-180" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-col gap-2 overflow-auto max-h-[92vh] md:max-h-[86vh]">
                            {threads.length > 0 ? (
                                threads.map((thread) => (
                                    <button
                                        key={thread.id}
                                        onClick={() => handleThreadClick(thread)}
                                        className="w-full text-left p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150"
                                    >
                                        <p className="font-medium text-sm line-clamp-1">{thread.title}</p>
                                        <p className="text-xs text-black/60 dark:text-white/60">
                                            {new Date(thread.timestamp).toLocaleString()}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <p className="text-center text-black/60 dark:text-white/60 text-sm">
                                   {
                                    language === "tamil" ? "இதுவரை உரையாடல்கள் இல்லை." : "No chat history yet."
                                }
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.button
                    key="toggle"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{
                        duration: 0.15,
                        ease: "easeInOut"
                    }}
                    onClick={() => setIsOpen(true)}
                    className="fixed z-50 left-0 pl-4 md:pl-5 top-[74px] p-2 md:p-3 text-lg md:rounded-r-xl transition-all duration-100 rounded-r-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                >
                    <FaHistory />
                </motion.button>
            )}
        </AnimatePresence>
    )
}