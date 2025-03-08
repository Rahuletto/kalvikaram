import { ChatMessage, Thread } from "@/types/Chats"

export const saveThread = (messages: ChatMessage[], threadId: string) => {

    const storedThreads = localStorage.getItem('chatThreads')
    const threads = storedThreads ? JSON.parse(storedThreads) : []

    const existingThreadIndex = threads.findIndex((t: Thread) => t.id === threadId)

    if (existingThreadIndex !== -1) {
        // Update existing thread
        threads[existingThreadIndex].messages = messages
        threads[existingThreadIndex].timestamp = new Date().toISOString()
        // Update title only if it's the first message
        if (messages.length === 1) {
            threads[existingThreadIndex].title = messages[0].content.slice(0, 50)
        }
    } else {
        // Create new thread
        const thread = {
            id: threadId,
            title: messages[0]?.content.slice(0, 50) || 'New Chat',
            messages,
            timestamp: new Date().toISOString()
        }
        threads.unshift(thread)
    }

    localStorage.setItem('chatThreads', JSON.stringify(threads))
    const event = new CustomEvent('threadSaved', { detail: { threadId, messages } });
    window.dispatchEvent(event);
    return threadId
}

export const getThread = (threadId: string) => {
    const storedThreads = localStorage.getItem('chatThreads')
    if (!storedThreads) return null
    const threads = JSON.parse(storedThreads)
    return threads.find((t: Thread) => t.id === threadId) || null
}
