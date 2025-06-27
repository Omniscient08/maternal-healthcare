"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, ArrowLeft, Send, User, Bot, Video, Phone, LogOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      setUser(JSON.parse(userData))
    }

    // Initialize chat with a welcome message
    setChatHistory([
      {
        id: 1,
        sender: "bot",
        message: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ])
  }, [router])

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
      router.push("/login")
    }
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message to chat
    const userMessage = {
      id: chatHistory.length + 1,
      sender: "user",
      message: message,
      timestamp: new Date(),
    }
    setChatHistory([...chatHistory, userMessage])
    setMessage("")
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponses = {
        hello: "Hello! How can I assist you today?",
        hi: "Hi there! How can I help you?",
        "how are you": "I'm just a bot, but I'm functioning well! How can I assist you?",
        "what can you do":
          "I can answer questions about maternal and child healthcare, provide information about pregnancy, and help you with the ASHA worker system.",
        help: "I can help with information about pregnancy, child care, nutrition, and health monitoring. What specific information do you need?",
        symptoms:
          "Common pregnancy symptoms include nausea, fatigue, breast tenderness, and frequent urination. If you're experiencing severe symptoms, please consult a doctor.",
        diet: "A balanced pregnancy diet should include fruits, vegetables, whole grains, lean proteins, and dairy. Would you like specific dietary recommendations?",
        exercise:
          "Safe exercises during pregnancy include walking, swimming, and prenatal yoga. Always consult with a healthcare provider before starting any exercise routine.",
        "danger signs":
          "Danger signs during pregnancy include severe headache, vision changes, abdominal pain, vaginal bleeding, reduced fetal movement, and high fever. Seek immediate medical attention if you notice these.",
        anemia:
          "Anemia during pregnancy can be managed by increasing iron intake through diet (leafy greens, beans, meat) and taking prescribed supplements. Regular monitoring is important.",
        "blood pressure":
          "High blood pressure during pregnancy can lead to preeclampsia. It's important to monitor BP regularly and report any significant changes to a healthcare provider.",
        vaccination:
          "Vaccines recommended during pregnancy include Tdap and flu vaccines. They help protect both mother and baby. Consult your healthcare provider for personalized advice.",
        breastfeeding:
          "Breastfeeding provides optimal nutrition for babies and has health benefits for mothers too. It's recommended exclusively for the first 6 months of life.",
        "postpartum care":
          "Postpartum care includes rest, proper nutrition, emotional support, and regular check-ups. Watch for signs of postpartum depression and seek help if needed.",
        "newborn care":
          "Newborn care basics include feeding every 2-3 hours, changing diapers regularly, safe sleeping practices, umbilical cord care, and lots of skin-to-skin contact.",
      }

      // Check if the message contains any keywords
      const lowerMessage = message.toLowerCase()
      let botResponse =
        "I'm not sure how to respond to that. Could you please rephrase or ask something about maternal and child healthcare?"

      for (const [keyword, response] of Object.entries(botResponses)) {
        if (lowerMessage.includes(keyword)) {
          botResponse = response
          break
        }
      }

      // Add bot response to chat
      const aiMessage = {
        id: chatHistory.length + 2,
        sender: "bot",
        message: botResponse,
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, aiMessage])
      setLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleStartVideoCall = () => {
    toast({
      title: "Video Call",
      description: "Starting a video call with a healthcare provider...",
    })
    // In a real app, this would initiate a video call
  }

  const handleStartVoiceCall = () => {
    toast({
      title: "Voice Call",
      description: "Starting a voice call with a healthcare provider...",
    })
    // In a real app, this would initiate a voice call
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block text-green-600">Smart Maternal & Child Healthcare</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Dashboard
              </Link>
              <Link href="/patients" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Patients
              </Link>
              <Link href="/calendar" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Calendar
              </Link>
              <Link href="/chat" className="transition-colors hover:text-foreground/80 text-foreground font-bold">
                Support
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button variant="outline" className="ml-auto">
                <MapPin className="mr-2 h-4 w-4" />
                {user?.region === "hyderabad"
                  ? "Hyderabad Region"
                  : user?.region === "warangal"
                    ? "Warangal Region"
                    : user?.region === "karimnagar"
                      ? "Karimnagar Region"
                      : user?.region === "nizamabad"
                        ? "Nizamabad Region"
                        : user?.region === "khammam"
                          ? "Khammam Region"
                          : "Select Region"}
              </Button>
            </div>
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <span className="absolute right-0 top-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
              {user && (
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Support & Chat</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Contact Options</CardTitle>
              <CardDescription>Connect with healthcare providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleStartVideoCall}>
                <Video className="mr-2 h-4 w-4" />
                Start Video Call
              </Button>
              <Button className="w-full" variant="outline" onClick={handleStartVoiceCall}>
                <Phone className="mr-2 h-4 w-4" />
                Start Voice Call
              </Button>

              <div className="border rounded-lg p-4 mt-4">
                <h3 className="font-medium mb-2">Emergency Contacts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Emergency Helpline:</span>
                    <span className="font-medium">108</span>
                  </div>
                  <div className="flex justify-between">
                    <span>District Hospital:</span>
                    <span className="font-medium">040-12345678</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ambulance Service:</span>
                    <span className="font-medium">102</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supervisor:</span>
                    <span className="font-medium">040-87654321</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <Tabs defaultValue="chatbot">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
                  <TabsTrigger value="doctors">Healthcare Providers</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="chatbot" className="mt-0">
                  <div className="flex flex-col h-[500px]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatHistory.map((chat) => (
                        <div
                          key={chat.id}
                          className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex max-w-[80%] ${chat.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <Avatar className={`h-8 w-8 ${chat.sender === "user" ? "ml-2" : "mr-2"}`}>
                              <AvatarFallback className={chat.sender === "user" ? "bg-green-100" : "bg-blue-100"}>
                                {chat.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 ${
                                chat.sender === "user" ? "bg-green-100 text-green-900" : "bg-blue-100 text-blue-900"
                              }`}
                            >
                              <p className="text-sm">{chat.message}</p>
                              <p className="text-xs text-muted-foreground mt-1 text-right">
                                {formatTime(chat.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="flex max-w-[80%] flex-row">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback className="bg-blue-100">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg p-3 bg-blue-100 text-blue-900">
                              <p className="text-sm">Typing...</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="border-t p-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Type your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={handleSendMessage}
                          disabled={!message.trim() || loading}
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Ask about pregnancy, child care, nutrition, or health monitoring.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="doctors" className="mt-0">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarFallback className="bg-green-100">DR</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">Dr. Rajesh Kumar</h3>
                          <p className="text-sm text-muted-foreground">Gynecologist, District Hospital</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button className="flex-1" variant="outline" onClick={handleStartVoiceCall}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleStartVideoCall}>
                          <Video className="mr-2 h-4 w-4" />
                          Video
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarFallback className="bg-green-100">DS</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">Dr. Sunita Reddy</h3>
                          <p className="text-sm text-muted-foreground">Pediatrician, Primary Health Center</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button className="flex-1" variant="outline" onClick={handleStartVoiceCall}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleStartVideoCall}>
                          <Video className="mr-2 h-4 w-4" />
                          Video
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarFallback className="bg-green-100">AM</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">Dr. Anand Mehta</h3>
                          <p className="text-sm text-muted-foreground">General Physician, Rural Health Center</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button className="flex-1" variant="outline" onClick={handleStartVoiceCall}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleStartVideoCall}>
                          <Video className="mr-2 h-4 w-4" />
                          Video
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  )
}
