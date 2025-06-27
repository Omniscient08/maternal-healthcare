"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, ArrowLeft, CalendarIcon, Clock, CheckCircle, AlertTriangle, LogOut } from "lucide-react"
import { scheduleVisit } from "@/app/actions"
import { toast } from "@/hooks/use-toast"

export default function CalendarPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientIdFromQuery = searchParams.get("patient")

  const [user, setUser] = useState(null)
  const [patient, setPatient] = useState(null)
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState("10:00")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [visits, setVisits] = useState([])
  const [selectedTab, setSelectedTab] = useState("upcoming")

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

    // If patient ID is provided in the URL, set the patient
    if (patientIdFromQuery) {
      // In a real app, this would fetch the patient data from the API
      // For demo purposes, we'll use mock data
      if (patientIdFromQuery === "patient1" || patientIdFromQuery === "ASHA-12345") {
        setPatient({
          id: "ASHA-12345",
          name: "Lakshmi Devi",
          age: 28,
          status: "Pregnant - 28 weeks",
          village: "Rajupeta",
          riskLevel: "high",
        })
      } else if (patientIdFromQuery === "patient2" || patientIdFromQuery === "ASHA-23456") {
        setPatient({
          id: "ASHA-23456",
          name: "Priya Sharma",
          age: 24,
          status: "Pregnant - 32 weeks",
          village: "Gollavanitippa",
          riskLevel: "high",
        })
      } else if (patientIdFromQuery === "patient3" || patientIdFromQuery === "ASHA-34567") {
        setPatient({
          id: "ASHA-34567",
          name: "Meena Reddy",
          age: 32,
          status: "Pregnant - 20 weeks",
          village: "Venkatapuram",
          riskLevel: "moderate",
        })
      }
    }

    // Simulate loading visits data
    setTimeout(() => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const dayAfterTomorrow = new Date(today)
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      setVisits([
        {
          id: "VISIT-12345",
          patientId: "ASHA-12345",
          patientName: "Lakshmi Devi",
          village: "Rajupeta",
          date: tomorrow,
          time: "10:00",
          status: "scheduled",
          riskLevel: "high",
        },
        {
          id: "VISIT-23456",
          patientId: "ASHA-23456",
          patientName: "Priya Sharma",
          village: "Gollavanitippa",
          date: tomorrow,
          time: "14:00",
          status: "scheduled",
          riskLevel: "high",
        },
        {
          id: "VISIT-34567",
          patientId: "ASHA-34567",
          patientName: "Meena Reddy",
          village: "Venkatapuram",
          date: dayAfterTomorrow,
          time: "11:00",
          status: "scheduled",
          riskLevel: "moderate",
        },
        {
          id: "VISIT-45678",
          patientId: "ASHA-45678",
          patientName: "Anita Patel",
          village: "Chintalapalem",
          date: today,
          time: "09:30",
          status: "completed",
          riskLevel: "normal",
        },
        {
          id: "VISIT-56789",
          patientId: "ASHA-56789",
          patientName: "Sunita Kumari",
          village: "Kotha Kothuru",
          date: nextWeek,
          time: "15:30",
          status: "scheduled",
          riskLevel: "moderate",
        },
      ])
    }, 1000)
  }, [router, patientIdFromQuery])

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

  const handlePatientSelect = (value) => {
    // Simulate patient selection
    if (value === "patient1") {
      setPatient({
        id: "ASHA-12345",
        name: "Lakshmi Devi",
        age: 28,
        status: "Pregnant - 28 weeks",
        village: "Rajupeta",
        riskLevel: "high",
      })
    } else if (value === "patient2") {
      setPatient({
        id: "ASHA-23456",
        name: "Priya Sharma",
        age: 24,
        status: "Pregnant - 32 weeks",
        village: "Gollavanitippa",
        riskLevel: "high",
      })
    } else if (value === "patient3") {
      setPatient({
        id: "ASHA-34567",
        name: "Meena Reddy",
        age: 32,
        status: "Pregnant - 20 weeks",
        village: "Venkatapuram",
        riskLevel: "moderate",
      })
    }
  }

  const handleScheduleVisit = async () => {
    if (!patient) {
      toast({
        title: "Error",
        description: "Please select a patient",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const visitData = {
        patientId: patient.id,
        date: date.toISOString(),
        time,
        notes,
      }

      const result = await scheduleVisit(patient.id, date.toISOString(), notes)

      if (result.success) {
        toast({
          title: "Visit Scheduled",
          description: `Visit for ${patient.name} has been scheduled successfully`,
        })

        // Add the new visit to the list
        const newVisit = {
          id: result.visit.id,
          patientId: patient.id,
          patientName: patient.name,
          village: patient.village,
          date: date,
          time: time,
          status: "scheduled",
          riskLevel: patient.riskLevel,
        }

        setVisits([...visits, newVisit])

        // Reset form
        setNotes("")
        setSelectedTab("upcoming")
      } else {
        toast({
          title: "Error",
          description: "Failed to schedule visit",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule visit",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteVisit = (visitId) => {
    // Update the visit status to completed
    const updatedVisits = visits.map((visit) => {
      if (visit.id === visitId) {
        return { ...visit, status: "completed" }
      }
      return visit
    })

    setVisits(updatedVisits)

    toast({
      title: "Visit Completed",
      description: "Visit has been marked as completed",
    })
  }

  const handleRescheduleVisit = (visitId) => {
    // In a real app, this would open a modal to reschedule the visit
    toast({
      title: "Reschedule Visit",
      description: "This would open a modal to reschedule the visit",
    })
  }

  // Filter visits based on the selected tab
  const filteredVisits = visits.filter((visit) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedTab === "upcoming") {
      return visit.status === "scheduled" && new Date(visit.date) >= today
    } else if (selectedTab === "completed") {
      return visit.status === "completed"
    } else if (selectedTab === "today") {
      const visitDate = new Date(visit.date)
      visitDate.setHours(0, 0, 0, 0)
      return visitDate.getTime() === today.getTime()
    }
    return true
  })

  // Sort visits by date
  filteredVisits.sort((a, b) => new Date(a.date) - new Date(b.date))

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
              <Link href="/calendar" className="transition-colors hover:text-foreground/80 text-foreground font-bold">
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
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Visit Schedule</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Schedule New Visit</CardTitle>
              <CardDescription>Plan your next patient visit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!patient && (
                  <div className="space-y-2">
                    <Label>Patient</Label>
                    <Select onValueChange={handlePatientSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient1">Lakshmi Devi</SelectItem>
                        <SelectItem value="patient2">Priya Sharma</SelectItem>
                        <SelectItem value="patient3">Meena Reddy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {patient && (
                  <div
                    className={`border rounded-lg p-4 ${
                      patient.riskLevel === "high"
                        ? "bg-red-50 border-red-200"
                        : patient.riskLevel === "moderate"
                          ? "bg-amber-50 border-amber-200"
                          : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{patient.name}</h3>
                      <Badge
                        variant={
                          patient.riskLevel === "high"
                            ? "destructive"
                            : patient.riskLevel === "moderate"
                              ? "outline"
                              : "outline"
                        }
                        className={
                          patient.riskLevel === "moderate"
                            ? "text-amber-500 border-amber-500"
                            : patient.riskLevel === "low"
                              ? "text-green-500 border-green-500"
                              : ""
                        }
                      >
                        {patient.riskLevel === "high"
                          ? "High Risk"
                          : patient.riskLevel === "moderate"
                            ? "Moderate Risk"
                            : "Normal"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Age: {patient.age}</p>
                      <p>Status: {patient.status}</p>
                      <p>Village: {patient.village}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Visit Date</Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="mx-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Visit Time</Label>
                  <Select defaultValue={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Enter any notes for this visit"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleScheduleVisit}
                disabled={!patient || !date || loading}
              >
                {loading ? "Scheduling..." : "Schedule Visit"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Visit Calendar</CardTitle>
              <CardDescription>Manage your scheduled visits</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" onValueChange={setSelectedTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <div className="space-y-4">
                  {filteredVisits.length === 0 ? (
                    <div className="flex justify-center items-center py-8">
                      <p>No visits found.</p>
                    </div>
                  ) : (
                    filteredVisits.map((visit) => (
                      <div
                        key={visit.id}
                        className={`border rounded-lg p-4 ${
                          visit.riskLevel === "high"
                            ? "bg-red-50 border-red-200"
                            : visit.riskLevel === "moderate"
                              ? "bg-amber-50 border-amber-200"
                              : "bg-green-50 border-green-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                            <h3 className="font-medium">{visit.patientName}</h3>
                          </div>
                          <Badge
                            variant={
                              visit.status === "completed"
                                ? "outline"
                                : visit.riskLevel === "high"
                                  ? "destructive"
                                  : "outline"
                            }
                            className={
                              visit.status === "completed"
                                ? "text-green-500 border-green-500"
                                : visit.riskLevel === "moderate"
                                  ? "text-amber-500 border-amber-500"
                                  : visit.riskLevel === "normal"
                                    ? "text-green-500 border-green-500"
                                    : ""
                            }
                          >
                            {visit.status === "completed" ? (
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </div>
                            ) : visit.riskLevel === "high" ? (
                              <div className="flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                High Risk
                              </div>
                            ) : visit.riskLevel === "moderate" ? (
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Moderate
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Normal
                              </div>
                            )}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          <p>
                            {visit.date.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            , {visit.time}
                          </p>
                          <p>Village: {visit.village}</p>
                        </div>
                        {visit.status !== "completed" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleRescheduleVisit(visit.id)}
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleCompleteVisit(visit.id)}
                            >
                              Mark as Completed
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
