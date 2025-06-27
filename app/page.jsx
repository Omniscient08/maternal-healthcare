"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Activity, Users, FileText, MessageCircle, Hospital, LogOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        setLoading(true)
        const userData = localStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        }
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      setUser(null)
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
    }
  }

  const handleCardClick = (path) => {
    if (user) {
      router.push(path)
    } else {
      router.push("/login")
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
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
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground">
                Dashboard
              </Link>
              <Link href="/patients" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Patients
              </Link>
              <Link href="/calendar" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Calendar
              </Link>
              <Link href="/chat" className="transition-colors hover:text-foreground/80 text-foreground/60">
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
            <nav className="flex items-center">
              {user ? (
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Smart Maternal & Child Healthcare
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Empowering ASHA workers with AI-enabled tools for better maternal and child healthcare in rural India.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleGetStarted}>
                  {user ? "Go to Dashboard" : "Get Started"}
                </Button>
                {!user && (
                  <Link href="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-green-600" />
                    Patient Registration
                  </CardTitle>
                  <CardDescription>Register and manage pregnant women and mothers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Easily register new patients, generate QR codes, and maintain comprehensive profiles with health
                    records.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleCardClick("/patients/register")}
                  >
                    Register New Patient
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-green-600" />
                    Health Monitoring
                  </CardTitle>
                  <CardDescription>Track vital signs and symptoms</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Log monthly visits, record vital signs, and get AI-powered risk assessments and recommendations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleCardClick("/health-tracking")}
                  >
                    Track Health Data
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-green-600" />
                    Visit Schedule
                  </CardTitle>
                  <CardDescription>Manage your monthly visit calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View your automated visit schedule, get reminders, and track your performance.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleCardClick("/calendar")}
                  >
                    View Calendar
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-green-600" />
                    Diet & Exercise
                  </CardTitle>
                  <CardDescription>Personalized health recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Access personalized diet plans, exercise routines, and health tips based on patient condition.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleCardClick("/recommendations")}
                  >
                    View Recommendations
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5 text-green-600" />
                    Chat Support
                  </CardTitle>
                  <CardDescription>Real-time communication</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect with doctors via video calls and use the AI chatbot for quick answers to common questions.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleCardClick("/chat")}>
                    Start Chat
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hospital className="mr-2 h-5 w-5 text-green-600" />
                    Hospital Referrals
                  </CardTitle>
                  <CardDescription>Emergency referral system</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Quickly refer patients to nearby hospitals and track ambulance status in real-time.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleCardClick("/referrals")}
                  >
                    Make Referral
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-green-50">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 Smart Maternal & Child Healthcare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
