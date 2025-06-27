"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, ArrowLeft } from "lucide-react"
import { registerPatient } from "@/app/actions"
import { toast } from "@/hooks/use-toast"
import QRCode from "./qr-code"

export default function PatientRegistration() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    address: "",
    village: "",
    pregnancyStatus: "pregnant",
    lmpDate: "",
    childDob: "",
    medicalHistory: "",
  })

  const [step, setStep] = useState(1)
  const [showQR, setShowQR] = useState(false)
  const [patientId, setPatientId] = useState("")
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
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Add region information from logged in user
      const patientDataWithRegion = {
        ...formData,
        region: user?.region || "unknown",
      }

      const result = await registerPatient(patientDataWithRegion)

      if (result.success) {
        setPatientId(result.patient.id)
        setShowQR(true)
        toast({
          title: "Registration Successful",
          description: "Patient has been registered successfully",
        })
      } else {
        toast({
          title: "Registration Failed",
          description: "There was an error registering the patient",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering the patient",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
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
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <Link href="/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Register New Patient</h1>
        </div>

        {!showQR ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Patient Registration Form</CardTitle>
              <CardDescription>Enter the details of the pregnant woman or mother</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="village">Village/Area</Label>
                      <Select
                        name="village"
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, village: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select village" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rajupeta">Rajupeta</SelectItem>
                          <SelectItem value="gollavanitippa">Gollavanitippa</SelectItem>
                          <SelectItem value="venkatapuram">Venkatapuram</SelectItem>
                          <SelectItem value="chintalapalem">Chintalapalem</SelectItem>
                          <SelectItem value="kothakothuru">Kotha Kothuru</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <RadioGroup
                        defaultValue={formData.pregnancyStatus}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, pregnancyStatus: value }))}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pregnant" id="pregnant" />
                          <Label htmlFor="pregnant">Pregnant</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mother" id="mother" />
                          <Label htmlFor="mother">Mother with Infant</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.pregnancyStatus === "pregnant" ? (
                      <div className="space-y-2">
                        <Label>Last Menstrual Period (LMP) Date</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="date" name="lmpDate" onChange={handleChange} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Child's Date of Birth</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="date" name="childDob" onChange={handleChange} />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="medicalHistory">Medical History</Label>
                      <Textarea
                        id="medicalHistory"
                        name="medicalHistory"
                        placeholder="Any previous conditions, complications, or allergies"
                        value={formData.medicalHistory}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={handleBack}>
                        Back
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                        {loading ? "Registering..." : "Register Patient"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Registration Complete</CardTitle>
              <CardDescription>Patient has been registered successfully</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="mb-4">
                <QRCode patientData={{ ...formData, id: patientId }} />
              </div>
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">{formData.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {patientId}</p>
                <p className="text-sm text-muted-foreground">{formData.village}</p>
              </div>
              <p className="text-sm text-center mb-4">
                This QR code contains the patient's basic information. It can be scanned at hospitals for quick access
                to their records.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowQR(false)}>
                Edit Information
              </Button>
              <Link href="/dashboard">
                <Button className="bg-green-600 hover:bg-green-700">Go to Dashboard</Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}
