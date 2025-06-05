"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, X, Bot } from "lucide-react"
import api from "@/lib/api"

interface Message {
  type: "user" | "bot"
  content: string
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content: "Hi! I'm your MileMaven assistant. Tell me about your trip and I'll suggest the perfect car for you!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { type: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await api.post("/ai/assistant", { message: input })
      const botMessage: Message = { type: "bot", content: response.data.response }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        type: "bot",
        content: "Sorry, I'm having trouble right now. Please try again later or contact our support team.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-6 z-50">
          <Card className="w-full max-w-md h-96 flex flex-col">
            <CardHeader className="bg-red-600 text-white rounded-t-lg flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>MileMaven Assistant</span>
              </CardTitle>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-red-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.type === "user" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your trip..."
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
