import { useState, useCallback } from 'react'
import { ChatContainer } from '../components/chat/ChatContainer'
import type { Message } from '../types/chat'

const DEMO_RESPONSES = [
  "Bonjour ! Je suis **Decider**, votre assistant financier. Comment puis-je vous aider aujourd'hui ?",
  "C'est une excellente question. Laissez-moi analyser les données disponibles...",
  "Voici ce que je pense : les interfaces de chat modernes doivent être fluides, réactives et agréables à utiliser. Les animations subtiles ajoutent beaucoup à l'expérience.",
  "D'après mon analyse, le fonds Alpha Growth affiche un IRR de 18.5%, ce qui le place dans le premier quartile de sa catégorie.",
  "N'hésitez pas à explorer les différents onglets pour découvrir toutes les fonctionnalités de Decider !",
]

let messageIdCounter = 0

function createMessage(role: Message['role'], content: string, status: Message['status'] = 'complete'): Message {
  return {
    id: String(++messageIdCounter),
    role,
    content,
    timestamp: new Date(),
    status,
  }
}

export function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([
    createMessage('assistant', "Salut ! Je suis le chat de démo Decider. Envoyez-moi un message pour voir les animations en action."),
  ])
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = useCallback((content: string) => {
    setMessages((previous) => [...previous, createMessage('user', content)])
    setIsTyping(true)

    const delay = 800 + Math.random() * 1200
    setTimeout(() => {
      const response = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)]
      setMessages((previous) => [...previous, createMessage('assistant', response)])
      setIsTyping(false)
    }, delay)
  }, [])

  return (
    <div className="w-full max-w-2xl h-[700px] mx-auto">
      <ChatContainer
        messages={messages}
        isTyping={isTyping}
        onSend={handleSend}
      />
    </div>
  )
}
