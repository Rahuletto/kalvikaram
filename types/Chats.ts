export interface ChatMessage {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
}

export interface Thread {
    id: string
    title: string
    messages: ChatMessage[]
    timestamp: Date
}