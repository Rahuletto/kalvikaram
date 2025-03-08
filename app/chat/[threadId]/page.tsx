'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ChatMessage } from '@/types/Chats'
import Header from '@/components/Header'
import History from '@/components/History'
import ChatView from '@/components/ChatView'
import Resources from '@/components/Resources'

export type Thread = {
    id: string
    title: string
    messages: ChatMessage[]
    timestamp: string
}

export default function ThreadPage() {
    const { threadId } = useParams()
    const [thread, setThread] = useState<Thread | null>(null)

    useEffect(() => {
        const storedThreads = localStorage.getItem('chatThreads')
        if (storedThreads) {
            const threads = JSON.parse(storedThreads)
            const currentThread = threads.find((t: Thread) => t.id === threadId)
            if (currentThread) {
                setThread(currentThread)
            }
        }
    }, [threadId])

    if (!thread) return <div>Loading...</div>

    return (
        <main className="flex flex-col min-h-screen bg-background dark:bg-background-dark transition-all duration-100">
              <Header />
              <div className="flex p-2 justify-center h-full gap-4">
                <History />
                <ChatView initMessages={thread.messages} initThreadId={thread.id} />
                <Resources />
              </div>
            </main>
    )
}
