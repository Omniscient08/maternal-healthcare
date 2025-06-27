"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, Calendar, Users, Activity, MapPin, LogOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalPatients: 0,
    highRisk: 0,
    pendingVisits: 0,
    completedVisits: 0,
  })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user")
        if (!userData) {
          router.push("/login")
          return
        }

        setUser(JSON.parse(userData))
      }
    }

    checkAuth()

    // Simulate data loading
    const timer = setTimeout(() => {
      setStats({
        totalPatients: 42,
        highRisk: 5,
        pendingVisits: 8,
        completedVisits: 34,
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

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

  const handleRegisterNewPatient = () => {
    router.push("/patients/register")
  }

  const handleReferNow = (patientName) => {
    toast({
      title: "Referral Initiated",
      description: `Starting referral process for ${patientName}`,
    })
    router.push("/referrals")
  }

  const handleScheduleVisit = (patientName) => {
    toast({
      title: "Visit Scheduling",
      description: `Scheduling a follow-up visit for ${patientName}`,
    })
    router.push("/calendar")
  }

  const handleViewFullCalendar = () => {
    router.push("/calendar")
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
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground font-bold">
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ASHA Worker Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleRegisterNewPatient}>
              <Users className="mr-2 h-4 w-4" />
              Register New Patient
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">+2 new this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Risk Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{loading ? "..." : stats.highRisk}</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{loading ? "..." : stats.pendingVisits}</div>
              <p className="text-xs text-muted-foreground">Due this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{loading ? "..." : stats.completedVisits}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="high-risk" className="mb-6">
          <TabsList>
            <TabsTrigger value="high-risk">High Risk</TabsTrigger>
            <TabsTrigger value="upcoming-visits">Upcoming Visits</TabsTrigger>
            <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="high-risk" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>High Risk Patients</CardTitle>
                <CardDescription>Patients requiring immediate attention based on AI risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">Lakshmi Devi</p>
                        <p className="text-sm text-muted-foreground">High BP, Gestational Diabetes</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">Critical</Badge>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleReferNow("Lakshmi Devi")}
                      >
                        Refer Now
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">Priya Sharma</p>
                        <p className="text-sm text-muted-foreground">Severe Anemia, 32 weeks</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">Critical</Badge>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleReferNow("Priya Sharma")}
                      >
                        Refer Now
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="h-8 w-8 text-amber-500" />
                      <div>
                        <p className="font-medium">Meena Reddy</p>
                        <p className="text-sm text-muted-foreground">Mild Preeclampsia Signs</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-amber-500 border-amber-500">
                        Moderate
                      </Badge>
                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700"
                        onClick={() => handleScheduleVisit("Meena Reddy")}
                      >
                        Schedule Visit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming-visits" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Visits</CardTitle>
                <CardDescription>Scheduled visits for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-medium">Anita Patel</p>
                        <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        Normal
                      </Badge>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => router.push("/patients")}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-medium">Sunita Kumari</p>
                        <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-amber-500 border-amber-500">
                        Moderate
                      </Badge>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => router.push("/patients")}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-medium">Geeta Singh</p>
                        <p className="text-sm text-muted-foreground">Day after tomorrow, 11:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        Normal
                      </Badge>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => router.push("/patients")}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recent-activity" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium">Completed visit for Radha Devi</p>
                      <p className="text-sm text-muted-foreground">Today, 9:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Activity className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">Updated health records for Kavita Rao</p>
                      <p className="text-sm text-muted-foreground">Yesterday, 4:15 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Users className="h-6 w-6 text-purple-500" />
                    <div>
                      <p className="font-medium">Registered new patient: Nirmala Joshi</p>
                      <p className="text-sm text-muted-foreground">Yesterday, 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Your visit completion rate and patient coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Visit Completion</p>
                    <p className="text-sm font-medium">85%</p>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Patient Coverage</p>
                    <p className="text-sm font-medium">92%</p>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Data Quality</p>
                    <p className="text-sm font-medium">78%</p>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your upcoming visits for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Sarita Verma</p>
                      <p className="text-xs text-muted-foreground">10:00 AM - 10:30 AM</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Upcoming</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Jyoti Mishra</p>
                      <p className="text-xs text-muted-foreground">11:30 AM - 12:00 PM</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Upcoming</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Anjali Gupta</p>
                      <p className="text-xs text-muted-foreground">2:00 PM - 2:30 PM</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Upcoming</Badge>
                </div>
                <Button variant="outline" className="w-full" onClick={handleViewFullCalendar}>
                  <Calendar className="mr-2 h-4 w-4" />
                  View Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
