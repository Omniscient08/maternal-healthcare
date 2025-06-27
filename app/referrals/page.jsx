"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapPin, ArrowLeft, Hospital, Ambulance, AlertTriangle, Clock, Phone, CheckCircle } from "lucide-react"
import { createReferral } from "@/app/actions"
import { toast } from "@/hooks/use-toast"
import dynamic from "next/dynamic";

const HospitalMap = dynamic(() => import("./hospital-map"), {
  ssr: false,
});


export default function Referrals() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [patient, setPatient] = useState(null)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [referralReason, setReferralReason] = useState("")
  const [referralStatus, setReferralStatus] = useState(null) // null, 'pending', 'accepted', 'dispatched'
  const [ambulanceETA, setAmbulanceETA] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      setUser(JSON.parse(userData))

      // Check if there's a patient in session storage (from health tracking)
      const referPatient = sessionStorage.getItem("referPatient")
      const referReason = sessionStorage.getItem("referReason")

      if (referPatient) {
        setPatient(JSON.parse(referPatient))

        if (referReason) {
          const reasonData = JSON.parse(referReason)
          let reasonText = `Risk Level: ${reasonData.riskLevel}\n`

          if (reasonData.symptoms.bleeding) reasonText += "- Bleeding\n"
          if (reasonData.symptoms.reducedMovement) reasonText += "- Reduced fetal movement\n"
          if (reasonData.symptoms.headache && reasonData.symptoms.dizziness) reasonText += "- Headache with dizziness\n"

          reasonText += `\nBlood Pressure: ${reasonData.bloodPressure.systolic}/${reasonData.bloodPressure.diastolic}\n`
          reasonText += `Blood Sugar: ${reasonData.bloodSugar} mg/dL`

          setReferralReason(reasonText)
        }

        // Clear session storage
        sessionStorage.removeItem("referPatient")
        sessionStorage.removeItem("referReason")
      }
    }
  }, [router])

  const handlePatientSelect = (value) => {
    // Simulate patient selection
    setPatient({
      id: value,
      name: value === "patient1" ? "Lakshmi Devi" : value === "patient2" ? "Priya Sharma" : "Meena Reddy",
      age: value === "patient1" ? 28 : value === "patient2" ? 24 : 32,
      status: "Pregnant - 28 weeks",
      riskLevel: value === "patient1" ? "high" : value === "patient2" ? "high" : "moderate",
      symptoms:
        value === "patient1"
          ? "High BP, Gestational Diabetes"
          : value === "patient2"
            ? "Severe Anemia, 32 weeks"
            : "Mild Preeclampsia Signs",
    })
  }

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital)
  }

  const handleReferralSubmit = async () => {
    if (!patient) {
      toast({
        title: "Error",
        description: "Please select a patient",
        variant: "destructive",
      })
      return
    }

    if (!selectedHospital) {
      toast({
        title: "Error",
        description: "Please select a hospital",
        variant: "destructive",
      })
      return
    }

    if (!referralReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for referral",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await createReferral(patient.id, selectedHospital.id, referralReason)

      if (result.success) {
        setReferralStatus("pending")
        toast({
          title: "Referral Created",
          description: "Hospital referral has been created successfully",
        })

        // Simulate hospital accepting referral after 2 seconds
        setTimeout(() => {
          setReferralStatus("accepted")
          toast({
            title: "Referral Accepted",
            description: `${selectedHospital.name} has accepted the referral`,
          })

          // Simulate ambulance dispatch after 3 more seconds
          setTimeout(() => {
            setReferralStatus("dispatched")
            setAmbulanceETA(Math.floor(Math.random() * 20) + 10) // Random ETA between 10-30 minutes
            toast({
              title: "Ambulance Dispatched",
              description: "An ambulance has been dispatched to the patient's location",
            })
          }, 3000)
        }, 2000)
      } else {
        toast({
          title: "Error",
          description: "Failed to create referral",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create referral",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold ml-4">Hospital Referrals</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Select Patient</CardTitle>
              <CardDescription>Choose a patient to refer to hospital</CardDescription>
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
                    className={`border rounded-lg p-4 mt-4 ${
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
                            : "Low Risk"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Age: {patient.age}</p>
                      <p>Status: {patient.status}</p>
                      <p>Symptoms: {patient.symptoms}</p>
                    </div>
                  </div>
                )}

                {patient && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="referralReason">Reason for Referral</Label>
                    <Textarea
                      id="referralReason"
                      placeholder="Describe the reason for hospital referral"
                      value={referralReason}
                      onChange={(e) => setReferralReason(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {patient && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Select Hospital</CardTitle>
                <CardDescription>Choose a nearby hospital for referral</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] mb-4 rounded-lg overflow-hidden border">
                  <HospitalMap onSelectHospital={handleHospitalSelect} />
                </div>

                {selectedHospital && (
                  <div className="border rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <Hospital className="mr-2 h-4 w-4 text-blue-500" />
                        {selectedHospital.name}
                      </h3>
                      <Badge variant="outline" className="text-blue-500 border-blue-500">
                        {selectedHospital.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Distance: {selectedHospital.distance} km</p>
                      <p>Address: {selectedHospital.address}</p>
                      <div className="flex items-center mt-1">
                        <Phone className="h-3 w-3 mr-1" />
                        <p>{selectedHospital.phone}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        onClick={handleReferralSubmit}
                        className="w-full bg-red-600 hover:bg-red-700"
                        disabled={referralStatus !== null || loading}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        {loading ? "Creating Referral..." : "Refer Patient to Hospital"}
                      </Button>
                    </div>
                  </div>
                )}

                {referralStatus && (
                  <div className="mt-4">
                    {referralStatus === "pending" && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <AlertTitle className="ml-2">Referral Pending</AlertTitle>
                        <AlertDescription>Waiting for hospital to accept the referral...</AlertDescription>
                      </Alert>
                    )}

                    {referralStatus === "accepted" && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle className="ml-2">Referral Accepted</AlertTitle>
                        <AlertDescription>
                          Hospital has accepted the referral. Preparing to dispatch ambulance...
                        </AlertDescription>
                      </Alert>
                    )}

                    {referralStatus === "dispatched" && (
                      <div className="space-y-4">
                        <Alert className="bg-green-50 border-green-200">
                          <Ambulance className="h-4 w-4 text-green-500" />
                          <AlertTitle className="ml-2">Ambulance Dispatched</AlertTitle>
                          <AlertDescription>Ambulance is on the way to patient's location.</AlertDescription>
                        </Alert>

                        <Card className="bg-blue-50 border-blue-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                              <Clock className="mr-2 h-5 w-5 text-blue-500" />
                              Ambulance ETA
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center">
                              <p className="text-3xl font-bold text-blue-600">{ambulanceETA} min</p>
                              <p className="text-sm text-blue-600">Estimated arrival time</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
