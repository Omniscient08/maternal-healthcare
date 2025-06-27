"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  ArrowLeft,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Activity,
  Calendar,
  LogOut,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function PatientsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [patients, setPatients] = useState([])

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

    // Simulate loading patients data
    setLoading(true)
    setTimeout(() => {
      setPatients([
        {
          id: "ASHA-12345",
          name: "Lakshmi Devi",
          age: 28,
          village: "Rajupeta",
          status: "Pregnant - 28 weeks",
          riskLevel: "high",
          lastVisit: "15 days ago",
          nextVisit: "Tomorrow",
        },
        {
          id: "ASHA-23456",
          name: "Priya Sharma",
          age: 24,
          village: "Gollavanitippa",
          status: "Pregnant - 32 weeks",
          riskLevel: "high",
          lastVisit: "10 days ago",
          nextVisit: "In 3 days",
        },
        {
          id: "ASHA-34567",
          name: "Meena Reddy",
          age: 32,
          village: "Venkatapuram",
          status: "Pregnant - 20 weeks",
          riskLevel: "moderate",
          lastVisit: "7 days ago",
          nextVisit: "In 2 days",
        },
        {
          id: "ASHA-45678",
          name: "Anita Patel",
          age: 26,
          village: "Chintalapalem",
          status: "Pregnant - 16 weeks",
          riskLevel: "normal",
          lastVisit: "12 days ago",
          nextVisit: "Tomorrow",
        },
        {
          id: "ASHA-56789",
          name: "Sunita Kumari",
          age: 30,
          village: "Kotha Kothuru",
          status: "Mother - Child 2 months",
          riskLevel: "moderate",
          lastVisit: "5 days ago",
          nextVisit: "Tomorrow",
        },
        {
          id: "ASHA-67890",
          name: "Geeta Singh",
          age: 22,
          village: "Rajupeta",
          status: "Pregnant - 12 weeks",
          riskLevel: "normal",
          lastVisit: "14 days ago",
          nextVisit: "In 5 days",
        },
        {
          id: "ASHA-78901",
          name: "Radha Devi",
          age: 29,
          village: "Venkatapuram",
          status: "Mother - Child 4 months",
          riskLevel: "normal",
          lastVisit: "Today",
          nextVisit: "In 30 days",
        },
      ])
      setLoading(false)
    }, 1000)
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

  const handleViewPatient = (patientId) => {
    toast({
      title: "Patient Selected",
      description: `Viewing details for patient ${patientId}`,
    })
    // In a real app, this would navigate to a patient details page
    router.push(`/health-tracking?patient=${patientId}`)
  }

  const handleTrackHealth = (patientId) => {
    router.push(`/health-tracking?patient=${patientId}`)
  }

  const handleScheduleVisit = (patientId) => {
    router.push(`/calendar?patient=${patientId}`)
  }

  const handleViewRecommendations = (patientId) => {
    router.push(`/recommendations?patient=${patientId}`)
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.village.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              <Link href="/patients" className="transition-colors hover:text-foreground/80 text-foreground font-bold">
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
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold ml-4">Patient Management</h1>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleRegisterNewPatient}>
            <Plus className="mr-2 h-4 w-4" />
            Register New Patient
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Patient Directory</CardTitle>
            <CardDescription>View and manage all registered patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients by name, ID, or village..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <p>Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <p>No patients found matching your search.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Village</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Next Visit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.id}</TableCell>
                        <TableCell>{patient.village}</TableCell>
                        <TableCell>{patient.status}</TableCell>
                        <TableCell>
                          {patient.riskLevel === "high" ? (
                            <Badge variant="destructive" className="flex items-center w-fit">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              High Risk
                            </Badge>
                          ) : patient.riskLevel === "moderate" ? (
                            <Badge
                              variant="outline"
                              className="flex items-center w-fit text-amber-500 border-amber-500"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              Moderate
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="flex items-center w-fit text-green-500 border-green-500"
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Normal
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{patient.nextVisit}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewPatient(patient.id)}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleTrackHealth(patient.id)}
                            >
                              <Activity className="h-4 w-4" />
                              <span className="sr-only">Track Health</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleScheduleVisit(patient.id)}
                            >
                              <Calendar className="h-4 w-4" />
                              <span className="sr-only">Schedule Visit</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
