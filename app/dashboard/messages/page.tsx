"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Plus, X } from "lucide-react"

interface Message {
  id: string
  from: string
  to: string
  text: string
  time: string
}

interface Conversation {
  id: string
  name: string
  email: string
  lastMessage: string
  time: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [selectedChat, setSelectedChat] = useState<string>("")
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<any[]>([])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
    setCurrentUser(user)

    const savedConversations = JSON.parse(localStorage.getItem(`conversations_${user.email}`) || "[]")
    setConversations(savedConversations)

    const savedMessages = JSON.parse(localStorage.getItem(`messages_${user.email}`) || "{}")
    setMessages(savedMessages)

    if (savedConversations.length > 0) {
      setSelectedChat(savedConversations[0].id)
    }

    // Load all users for adding to conversations
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const otherUsers = allUsers.filter((u: any) => u.email !== user.email)
    setAvailableUsers(otherUsers)
  }, [])

  const handleAddUser = (user: any) => {
    const conversationId = user.email

    // Check if already in conversations
    if (conversations.find((c) => c.id === conversationId)) {
      setSelectedChat(conversationId)
      setShowAddUser(false)
      return
    }

    const newConversation: Conversation = {
      id: conversationId,
      name: user.name,
      email: user.email,
      lastMessage: "Start a conversation",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    const updatedConversations = [...conversations, newConversation]
    setConversations(updatedConversations)
    localStorage.setItem(`conversations_${currentUser.email}`, JSON.stringify(updatedConversations))

    setSelectedChat(conversationId)
    setShowAddUser(false)
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat && currentUser) {
      const message: Message = {
        id: Date.now().toString(),
        from: currentUser.name,
        to: conversations.find((c) => c.id === selectedChat)?.name || "",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      const updatedMessages = {
        ...messages,
        [selectedChat]: [...(messages[selectedChat] || []), message],
      }
      setMessages(updatedMessages)
      localStorage.setItem(`messages_${currentUser.email}`, JSON.stringify(updatedMessages))

      // Update conversation last message
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedChat ? { ...conv, lastMessage: newMessage, time: message.time } : conv,
      )
      setConversations(updatedConversations)
      localStorage.setItem(`conversations_${currentUser.email}`, JSON.stringify(updatedConversations))

      setNewMessage("")
    }
  }

  const handleRemoveConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter((c) => c.id !== conversationId)
    setConversations(updatedConversations)
    localStorage.setItem(`conversations_${currentUser.email}`, JSON.stringify(updatedConversations))
    if (selectedChat === conversationId) {
      setSelectedChat(updatedConversations.length > 0 ? updatedConversations[0].id : "")
    }
  }

  const currentConversation = conversations.find((c) => c.id === selectedChat)
  const currentMessages = messages[selectedChat] || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">Connect with farmers and vendors</p>
        </div>
        <Button onClick={() => setShowAddUser(!showAddUser)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      {showAddUser && (
        <Card className="p-4 border-primary/20 bg-primary/5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Select a user to message</h3>
            <button onClick={() => setShowAddUser(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableUsers.length > 0 ? (
              availableUsers.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleAddUser(user)}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </button>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No other users available</p>
            )}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="col-span-1 overflow-hidden flex flex-col border-border/50">
          <div className="p-4 border-b border-border">
            <Input placeholder="Search conversations..." className="h-9" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 p-2">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedChat === conv.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                  }`}
                >
                  <button onClick={() => setSelectedChat(conv.id)} className="flex-1 text-left">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-foreground text-sm">{conv.name}</span>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-xs truncate text-muted-foreground">{conv.lastMessage}</p>
                  </button>
                  <button
                    onClick={() => handleRemoveConversation(conv.id)}
                    className="ml-2 p-1 hover:bg-destructive/10 rounded"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No conversations yet. Click "Add Contact" to start messaging.
              </div>
            )}
          </div>
        </Card>

        {/* Chat Window */}
        <Card className="col-span-1 lg:col-span-2 overflow-hidden flex flex-col border-border/50">
          {selectedChat && currentConversation ? (
            <>
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-bold text-foreground">{currentConversation.name}</h3>
                <p className="text-xs text-muted-foreground">{currentConversation.email}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.from === currentUser?.name ? "justify-end" : ""}`}>
                    {msg.from !== currentUser?.name && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold">{msg.from[0]}</span>
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg max-w-xs ${
                        msg.from === currentUser?.name
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span
                        className={`text-xs ${
                          msg.from === currentUser?.name ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
