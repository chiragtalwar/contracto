'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { Input } from "@/components/ui/input"
import { Send, Mic } from 'lucide-react'

export default function ChatbotPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I\'m your AI assistant. How can I help you with your contracts today?' }
  ])
  const [input, setInput] = useState('')

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }])
      // Here you would typically send the message to your AI backend
      // For this example, we'll just echo the message back
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bot', content: `You said: ${input}` }])
      }, 1000)
      setInput('')
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white relative overflow-hidden min-h-screen">
        <NavigationMenu isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 h-[600px] flex flex-col"
          >
            <h1 className="text-3xl font-bold mb-6">Chat with Contract Bot</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Ask any question about your contracts and get quick answers.</p>
            
            <div className="flex-grow overflow-y-auto mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-grow mr-2"
              />
              <Button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Send className="h-4 w-4" />
              </Button>
              <Button className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Pro Tip: Try asking "Which contract has the best payment terms?"</p>
          </div>
        </div>
      </div>
    </div>
  )
}

