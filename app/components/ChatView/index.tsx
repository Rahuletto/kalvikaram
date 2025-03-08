'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa6'
import { RiLoader2Fill } from 'react-icons/ri'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { saveThread } from '@/utils/threadManager'
import { ChatMessage } from '@/types/Chats'

export default function ChatView({ initMessages, initThreadId }: {
  initMessages?: ChatMessage[]
  initThreadId?: string
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initMessages ?? [])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [threadId] = useState<string>(initThreadId ?? Date.now().toString())
  const [language, setLanguage] = useState('tamil')

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('language') || 'english')
    }
    window.addEventListener('languageChange', handleLanguageChange)
    return () => window.removeEventListener('languageChange', handleLanguageChange)
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      saveThread(messages, threadId)
    }
  }, [messages, threadId])

  useEffect(() => {
    const handleLoadThread = (e: CustomEvent) => {
      setMessages(e.detail)
    }
    window.addEventListener("loadThread", handleLoadThread as EventListener)
    return () => window.removeEventListener("loadThread", handleLoadThread as EventListener)
  }, [])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }
    setMessages(prevMessages => [...prevMessages, newMessage])
    sendMessage(input)
    setInput('')

    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.style.height = '2.5rem'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const sendMessage = async (input: string) => {
    setLoading(true)
    try {
      const resp = await fetch('http://localhost:8000/api/py/ask', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input,
          language: language.replace("romanized", "tamil but romanized"),
          threadId: threadId
        })
      })

      if (!resp.ok) {
        throw new Error(`Server error: ${resp.statusText}`)
      }

      const response = await resp.json()
      const respText = response.answer

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        content: respText,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prevMessages => [...prevMessages, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "There was an error processing your request.",
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prevMessages => [...prevMessages, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-[70vw] mx-auto rounded-xl p-3 px-5 relative flex flex-col max-h-[calc(100vh-120px)]'>
      <h2 className='font-medium text-sm text-black/60 absolute top-2 left-4 dark:text-white/60'>Chat</h2>

      <div className='max-w-3xl mx-auto w-full h-[calc(100vh-70px)] flex flex-col justify-between '>
        {messages.length > 0 ? (
          <div className='flex flex-col w-full max-w-3xl pb-4 h-[calc(100vh-200px)] overflow-auto'>
            <div className='flex-1 overflow-y-auto p-4 space-y-6'>
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      x: message.role === 'user' ? 20 : -20
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: 0
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <motion.pre
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.5 }
                      }}
                      style={{ whiteSpace: "pre-wrap" }}
                      className={`max-w-[77%] py-3 px-6 font-sans font-medium ${message.role === 'user'
                        ? 'dark:bg-primary/10 font-medium bg-primary/50 text-black dark:text-primary break-words rounded-l-3xl rounded-t-3xl rounded-br-md ml-4'
                        : 'prose dark:prose-invert prose-sm max-w-none typewriter-effect'
                        }`}
                    >
                      {message.role === 'assistant' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => <span className="font-bold text-2xl">{children}</span>,
                            h2: ({ children }) => <span className="font-semibold text-xl">{children}</span>,
                            h3: ({ children }) => <span className="font-medium text-lg">{children}</span>,
                            table: ({ children }) => (
                              <div className="overflow-x-auto">
                                <table className="min-w-full rounded-lg divide-y dark:divide-foreground-dark/40 divide-foreground/40">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-primary-dark/10 min-w-full dark:bg-primary/10 !text-primary font-semibold">
                                {children}
                              </thead>
                            ),
                            tbody: ({ children }) => (
                              <tbody className="bg-foreground/5 min-w-full dark:bg-foreground-dark/5 divide-y dark:divide-foreground-dark/40 divide-foreground/40">
                                {children}
                              </tbody>
                            ),
                            tr: ({ children }) => (
                              <tr className="hover:bg-foreground/5 dark:hover:bg-foreground-dark/5">
                                {children}
                              </tr>
                            ),
                            th: ({ children }) => (
                              <th className="px-6 py-3 text-left text-sm font-medium !text-primary uppercase tracking-wider">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-6 py-4 whitespace-nowrap text-lg capitalize text-gray-900 dark:text-gray-100">
                                {children}
                              </td>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </motion.pre>
                  </motion.div>
                ))}
                <div className='flex items-start justify-start w-full'>
                  {loading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <RiLoader2Fill className='text-2xl text-foreground dark:text-foreground-dark' />
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className='overflow-y-auto p-4 h-[calc(100vh-200px)] flex items-center justify-center'>
            <p className='text-center text-gray-500'>No messages yet. Start the conversation!</p>
          </div>
        )}

        <div className='p-4 mb-2'>
          <motion.div
            initial={false}
            animate={{ height: "auto" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className='flex gap-4 dark:bg-white/5 bg-black/5 rounded-3xl p-3'
          >
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                const textarea = e.target
                textarea.style.height = 'auto'
                textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`
              }}
              onKeyDown={handleKeyDown}
              placeholder='Ask me questions'
              className='flex-1 focus:ring-transparent bg-transparent p-2 outline-none font-medium resize-none min-h-[2.5rem] overflow-y-auto transition-[height] duration-200 ease-in-out'
              rows={1}
            />
            <motion.div className='flex justify-end items-end gap-2'>
              <motion.button
                onClick={handleSend}
                disabled={!input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='p-2 px-3 w-fit h-fit dark:text-background-dark text-background bg-primary-dark dark:bg-primary rounded-full aspect-square disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <FaArrowUp />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}