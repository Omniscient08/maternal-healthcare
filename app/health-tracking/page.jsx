"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapPin, ArrowLeft, AlertTriangle, CheckCircle, Heart, Droplets, Weight, Thermometer } from "lucide-react"
import { saveHealthData, saveDraftHealthData } from "@/app/actions"
import { toast } from "@/hooks/use-toast"

export default function HealthTracking() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [patient, setPatient] = useState(null)
  const [formData, setFormData] = useState({
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
    },
    weight: 55,
    bloodSugar: 95,
    temperature: 98.6,
    symptoms: {
      vomiting: false,
      bleeding: false,
      swelling: false,
      headache: false,
      dizziness: false,
      abdominalPain: false,
      reducedMovement: false,
    },
    notes: "",
  })

  const [riskLevel, setRiskLevel] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
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

  const handlePatientSelect = (value) => {
    // Simulate patient selection
    setPatient({
      id: value,
      name: value === "patient1" ? "Lakshmi Devi" : value === "patient2" ? "Priya Sharma" : "Meena Reddy",
      age: value === "patient1" ? 28 : value === "patient2" ? 24 : 32,
      status: "Pregnant - 28 weeks",
      lastVisit: "15 days ago",
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBPChange = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      bloodPressure: {
        ...prev.bloodPressure,
        [type]: value,
      },
    }))
  }

  const handleSymptomChange = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [symptom]: !prev.symptoms[symptom],
      },
    }))
  }

  const analyzeRisk = () => {
    // Simple risk analysis logic
    const { bloodPressure, symptoms, bloodSugar } = formData
    const systolic = bloodPressure.systolic
    const diastolic = bloodPressure.diastolic

    let risk = "normal"
    let riskRecommendations = []

    // Check blood pressure
    if (systolic >= 140 || diastolic >= 90) {
      risk = "severe"
      riskRecommendations.push("High blood pressure detected. Immediate medical attention required.")
    } else if (systolic >= 130 || diastolic >= 85) {
      risk = "moderate"
      riskRecommendations.push("Slightly elevated blood pressure. Monitor closely and reduce salt intake.")
    }

    // Check blood sugar
    if (bloodSugar > 140) {
      risk = "severe"
      riskRecommendations.push("High blood sugar levels. Possible gestational diabetes. Refer to doctor.")
    } else if (bloodSugar > 120) {
      risk = risk === "severe" ? "severe" : "moderate"
      riskRecommendations.push("Elevated blood sugar. Monitor diet and increase physical activity.")
    }

    // Check symptoms
    if (symptoms.bleeding) {
      risk = "severe"
      riskRecommendations.push("Bleeding is a serious symptom during pregnancy. Immediate medical attention required.")
    }

    if (symptoms.reducedMovement) {
      risk = "severe"
      riskRecommendations.push("Reduced fetal movement requires immediate medical evaluation.")
    }

    if (symptoms.headache && symptoms.dizziness) {
      risk = risk === "normal" ? "moderate" : risk
      riskRecommendations.push("Headache with dizziness could indicate blood pressure issues. Monitor closely.")
    }

    // Add general recommendations based on risk level
    if (risk === "normal") {
      riskRecommendations = [
        "Continue regular prenatal care",
        "Maintain a balanced diet rich in fruits, vegetables, and proteins",
        "Stay hydrated with 8-10 glasses of water daily",
        "Engage in light exercise like walking for 20-30 minutes daily",
        "Take prescribed prenatal vitamins regularly",
      ]
    } else if (risk === "moderate" && riskRecommendations.length < 3) {
      riskRecommendations.push(
        "Schedule a follow-up visit within 3-5 days",
        "Reduce physical exertion and get adequate rest",
        "Monitor symptoms daily and report any changes",
      )
    }

    setRiskLevel(risk)
    setRecommendations(riskRecommendations)
  }

  const handleSaveDraft = async () => {
    if (!patient) {
      toast({
        title: "Error",
        description: "Please select a patient first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await saveDraftHealthData(patient.id, formData)

      if (result.success) {
        toast({
          title: "Draft Saved",
          description: "Health data has been saved as a draft",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save draft",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAssessment = async () => {
    if (!patient) {
      toast({
        title: "Error",
        description: "Please select a patient first",
        variant: "destructive",
      })
      return
    }

    if (!riskLevel) {
      toast({
        title: "Error",
        description: "Please analyze risk first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const healthDataWithAssessment = {
        ...formData,
        riskLevel,
        recommendations,
      }

      const result = await saveHealthData(patient.id, healthDataWithAssessment)

      if (result.success) {
        toast({
          title: "Assessment Saved",
          description: "Health assessment has been saved successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save assessment",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReferToHospital = () => {
    if (!patient) {
      toast({
        title: "Error",
        description: "Please select a patient first",
        variant: "destructive",
      })
      return
    }

    // Store patient data in session storage for referral page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("referPatient", JSON.stringify(patient))
      sessionStorage.setItem(
        "referReason",
        JSON.stringify({
          riskLevel,
          symptoms: formData.symptoms,
          bloodPressure: formData.bloodPressure,
          bloodSugar: formData.bloodSugar,
        }),
      )
    }

    router.push("/referrals")
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
          <h1 className="text-2xl font-bold ml-4">Health Tracking</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Select Patient</CardTitle>
              <CardDescription>Choose a patient to record health data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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

                {patient && (
                  <div className="border rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{patient.name}</h3>
                      <Badge variant="outline">{patient.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Age: {patient.age}</p>
                      <p>Last Visit: {patient.lastVisit}</p>
                      <p>ID: {patient.id}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {patient && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Health Data</CardTitle>
                <CardDescription>Record vital signs and symptoms</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="vitals">
                  <TabsList className="mb-4">
                    <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                    <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="vitals" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center">
                          <Heart className="mr-2 h-4 w-4 text-red-500" />
                          Blood Pressure (mmHg)
                        </Label>
                        <span className="text-sm font-medium">
                          {formData.bloodPressure.systolic}/{formData.bloodPressure.diastolic}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Systolic</Label>
                          <Input
                            type="number"
                            value={formData.bloodPressure.systolic}
                            onChange={(e) => handleBPChange("systolic", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Diastolic</Label>
                          <Input
                            type="number"
                            value={formData.bloodPressure.diastolic}
                            onChange={(e) => handleBPChange("diastolic", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center">
                          <Weight className="mr-2 h-4 w-4 text-blue-500" />
                          Weight (kg)
                        </Label>
                        <span className="text-sm font-medium">{formData.weight} kg</span>
                      </div>
                      <Slider
                        defaultValue={[formData.weight]}
                        min={30}
                        max={120}
                        step={0.5}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, weight: value[0] }))}
                      />
                      <Input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center">
                          <Droplets className="mr-2 h-4 w-4 text-purple-500" />
                          Blood Sugar (mg/dL)
                        </Label>
                        <span className="text-sm font-medium">{formData.bloodSugar} mg/dL</span>
                      </div>
                      <Input
                        type="number"
                        value={formData.bloodSugar}
                        onChange={(e) => setFormData((prev) => ({ ...prev, bloodSugar: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center">
                          <Thermometer className="mr-2 h-4 w-4 text-orange-500" />
                          Temperature (°F)
                        </Label>
                        <span className="text-sm font-medium">{formData.temperature} °F</span>
                      </div>
                      <Input
                        type="number"
                        value={formData.temperature}
                        onChange={(e) => setFormData((prev) => ({ ...prev, temperature: e.target.value }))}
                        step={0.1}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="symptoms" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                        <Label htmlFor="vomiting" className="flex-1">
                          Vomiting
                        </Label>
                        <Switch
                          id="vomiting"
                          checked={formData.symptoms.vomiting}
                          onCheckedChange={() => handleSymptomChange("vomiting")}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                        <Label htmlFor="bleeding" className="flex-1">
                          Bleeding
                        </Label>
                        <Switch
                          id="bleeding"
                          checked={formData.symptoms.bleeding}
                          onCheckedChange={() => handleSymptomChange("bleeding")}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                        <Label htmlFor="swelling" className="flex-1">
                          Swelling
                        </Label>
                        <Switch
                          id="swelling"
                          checked={formData.symptoms.swelling}
                          onCheckedChange={() => handleSymptomChange("swelling")}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                        <Label htmlFor="headache" className="flex-1">
                          Headache
                        </Label>
                        <Switch
                          id="headache"
                          checked={formData.symptoms.headache}
                          onCheckedChange={() => handleSymptomChange("headache")}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                        <Label htmlFor="dizziness" className="flex-1">
                          Dizziness
                        </Label>
                        <Switch
                          id="dizziness"
                          checked={formData.symptoms.dizziness}
                          onCheckedChange={() => handleSymptomChange("dizziness")}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                        <Label htmlFor="abdominalPain" className="flex-1">
                          Abdominal Pain
                        </Label>
                        <Switch
                          id="abdominalPain"
                          checked={formData.symptoms.abdominalPain}
                          onCheckedChange={() => handleSymptomChange("abdominalPain")}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg sm:col-span-2">
                        <Label htmlFor="reducedMovement" className="flex-1">
                          Reduced Fetal Movement
                        </Label>
                        <Switch
                          id="reducedMovement"
                          checked={formData.symptoms.reducedMovement}
                          onCheckedChange={() => handleSymptomChange("reducedMovement")}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Enter any additional observations or notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={5}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                  {loading ? "Saving..." : "Save Draft"}
                </Button>
                <Button onClick={analyzeRisk} className="bg-green-600 hover:bg-green-700" disabled={loading}>
                  Analyze Risk
                </Button>
              </CardFooter>
            </Card>
          )}

          {riskLevel && (
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {riskLevel === "severe" && <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />}
                  {riskLevel === "moderate" && <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />}
                  {riskLevel === "normal" && <CheckCircle className="mr-2 h-5 w-5 text-green-500" />}
                  Risk Assessment
                </CardTitle>
                <CardDescription>AI-powered analysis of the patient's health data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert
                  className={
                    riskLevel === "severe"
                      ? "bg-red-50 border-red-200"
                      : riskLevel === "moderate"
                        ? "bg-amber-50 border-amber-200"
                        : "bg-green-50 border-green-200"
                  }
                >
                  <div className="flex items-center">
                    {riskLevel === "severe" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    {riskLevel === "moderate" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                    {riskLevel === "normal" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    <AlertTitle className="ml-2 font-bold">
                      {riskLevel === "severe"
                        ? "High Risk - Immediate Action Required"
                        : riskLevel === "moderate"
                          ? "Moderate Risk - Close Monitoring Needed"
                          : "Normal - Continue Regular Care"}
                    </AlertTitle>
                  </div>
                  <AlertDescription className="mt-2">
                    <div className="space-y-2">
                      {recommendations.map((rec, index) => (
                        <p key={index} className="text-sm">
                          {rec}
                        </p>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Recommended Diet</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Increase protein intake with lentils, beans, and dairy</li>
                        <li>Consume iron-rich foods like spinach and other leafy greens</li>
                        <li>Include calcium sources such as milk, yogurt, and cheese</li>
                        <li>Stay hydrated with 8-10 glasses of water daily</li>
                        <li>Limit processed foods and excess sugar</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Recommended Exercise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Gentle walking for 20-30 minutes daily</li>
                        <li>Prenatal yoga for flexibility and relaxation</li>
                        <li>Light stretching exercises in the morning</li>
                        <li>Pelvic floor exercises (Kegels) 3 times daily</li>
                        <li>Swimming or water aerobics if available</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between">
                  {riskLevel === "severe" && (
                    <Button className="bg-red-600 hover:bg-red-700" onClick={handleReferToHospital} disabled={loading}>
                      Refer to Hospital
                    </Button>
                  )}
                  {riskLevel === "moderate" && (
                    <Button
                      className="bg-amber-600 hover:bg-amber-700"
                      onClick={() => router.push("/calendar")}
                      disabled={loading}
                    >
                      Schedule Follow-up
                    </Button>
                  )}
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveAssessment} disabled={loading}>
                    {loading ? "Saving..." : "Save Assessment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
