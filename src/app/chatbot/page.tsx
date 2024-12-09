'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatService } from '@/lib/services/chatService'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { supabase } from '@/lib/supabase/client'

interface Contract {
  id: string
  original_name: string
}

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  // Fetch available contracts
  useEffect(() => {
    const fetchContracts = async () => {
      const { data } = await supabase
        .from('contracts')
        .select('id, original_name')
        .eq('status', 'processed')
      
      if (data) setContracts(data)
    }
    
    fetchContracts()
  }, [])

  // Add initial welcome message
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      content: "Hello! I'm your Contract Analysis Assistant. I can help you understand and compare your contracts. What would you like to know?",
      role: 'assistant',
      timestamp: new Date()
    }])
  }, [])

  const saveMessage = async (message: Message) => {
    try {
      await supabase.from('messages').insert([{
        content: message.content,
        role: message.role,
        timestamp: message.timestamp,
      }])
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    await saveMessage(userMessage) // Save user message
    setInput('')
    setLoading(true)

    try {
      const response = await ChatService.generateResponse(input, selectedContracts)
      
      const assistantMessage: Message = {
        id: `response-${Date.now()}`,
        content: response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      await saveMessage(assistantMessage) // Save assistant message
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        content: "I apologize, but I encountered an error. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <Card className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-slate-800 border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Contract Analyzer Pro</h2>
            <span className="text-sm text-slate-400">AI Assistant</span>
          </div>
          
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                {selectedContracts.length > 0
                  ? `${selectedContracts.length} contracts selected`
                  : "Select contracts..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search contracts..." />
                <CommandList>
                  <CommandEmpty className="py-6 text-center text-sm">
                    No contracts found.
                  </CommandEmpty>
                  <CommandGroup>
                    {contracts.map((contract) => (
                      <CommandItem
                        key={contract.id}
                        value={contract.original_name}
                        onSelect={() => {
                          setSelectedContracts(prev => 
                            prev.includes(contract.id)
                              ? prev.filter(id => id !== contract.id)
                              : [...prev, contract.id]
                          )
                        }}
                      >
                        <Check className={cn(
                          "mr-2 h-4 w-4",
                          selectedContracts.includes(contract.id) ? "opacity-100" : "opacity-0"
                        )} />
                        {contract.original_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {message.content}
                  <div className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your contracts..."
              className="bg-slate-700 border-slate-600 text-white"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Send
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

