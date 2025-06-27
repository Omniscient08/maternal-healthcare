"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft, Utensils, Activity, Calendar, Clock, CheckCircle, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function Recommendations() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [patient, setPatient] = useState(null)
  const [trimester, setTrimester] = useState("second")
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

  const handleDownloadMealPlan = () => {
    setLoading(true)

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download Started",
        description: "Your weekly meal plan is being downloaded",
      })
      setLoading(false)

      // In a real app, this would trigger a file download
    }, 1500)
  }

  // Diet recommendations based on trimester
  const dietRecommendations = {
    first: [
      {
        title: "Increase Folate Intake",
        description: "Consume foods rich in folate like leafy greens, citrus fruits, and beans.",
        examples: ["Spinach", "Orange juice", "Lentils", "Fortified cereals"],
      },
      {
        title: "Combat Morning Sickness",
        description: "Eat small, frequent meals and focus on bland, easy-to-digest foods.",
        examples: ["Crackers", "Plain rice", "Bananas", "Ginger tea"],
      },
      {
        title: "Hydration",
        description: "Drink plenty of water and fluids throughout the day.",
        examples: ["Water", "Coconut water", "Fresh fruit juices", "Milk"],
      },
    ],
    second: [
      {
        title: "Increase Calcium Intake",
        description: "Focus on calcium-rich foods for bone development.",
        examples: ["Milk", "Yogurt", "Cheese", "Fortified plant milks", "Tofu"],
      },
      {
        title: "Iron-Rich Foods",
        description: "Consume iron-rich foods to prevent anemia.",
        examples: ["Spinach", "Beans", "Lentils", "Lean meats", "Dried fruits"],
      },
      {
        title: "Healthy Fats",
        description: "Include sources of omega-3 fatty acids for brain development.",
        examples: ["Walnuts", "Flaxseeds", "Fish (if culturally acceptable)", "Avocados"],
      },
    ],
    third: [
      {
        title: "Protein-Rich Foods",
        description: "Increase protein intake for baby's growth in the final trimester.",
        examples: ["Lentils", "Beans", "Dairy", "Nuts and seeds", "Tofu"],
      },
      {
        title: "Fiber-Rich Foods",
        description: "Combat constipation with high-fiber foods.",
        examples: ["Whole grains", "Fruits with skin", "Vegetables", "Beans"],
      },
      {
        title: "Small, Frequent Meals",
        description: "Eat smaller meals to avoid heartburn and indigestion.",
        examples: ["5-6 small meals instead of 3 large ones"],
      },
    ],
  }

  // Exercise recommendations based on trimester
  const exerciseRecommendations = {
    first: [
      {
        title: "Gentle Walking",
        description: "Start with 15-20 minute walks on flat terrain.",
        frequency: "3-5 times per week",
      },
      {
        title: "Prenatal Yoga",
        description: "Focus on breathing and gentle stretching.",
        frequency: "2-3 times per week",
      },
      {
        title: "Pelvic Floor Exercises",
        description: "Begin Kegel exercises to strengthen pelvic floor muscles.",
        frequency: "Daily, 10-15 repetitions, 3 times a day",
      },
    ],
    second: [
      {
        title: "Moderate Walking",
        description: "Increase to 20-30 minute walks.",
        frequency: "4-5 times per week",
      },
      {
        title: "Swimming or Water Exercises",
        description: "If available, water exercises are excellent for pregnancy.",
        frequency: "2-3 times per week",
      },
      {
        title: "Prenatal Yoga",
        description: "Continue with poses appropriate for the second trimester.",
        frequency: "2-3 times per week",
      },
      {
        title: "Light Resistance Training",
        description: "Use body weight or very light weights for arm and leg exercises.",
        frequency: "2 times per week",
      },
    ],
    third: [
      {
        title: "Gentle Walking",
        description: "Continue with 15-20 minute walks at a comfortable pace.",
        frequency: "3-4 times per week",
      },
      {
        title: "Stretching Exercises",
        description: "Focus on gentle stretches to relieve discomfort.",
        frequency: "Daily, especially before bed",
      },
      {
        title: "Pelvic Tilts",
        description: "Help relieve back pain and prepare for delivery.",
        frequency: "Daily, 10-15 repetitions",
      },
      {
        title: "Deep Breathing",
        description: "Practice breathing techniques for labor preparation.",
        frequency: "Daily, 5-10 minutes",
      },
    ],
  }

  // Weekly meal plan based on trimester
  const weeklyMealPlans = {
    first: [
      {
        day: "Monday",
        breakfast: "Ragi porridge with milk and banana",
        lunch: "Rice, dal, spinach curry, and yogurt",
        dinner: "Chapati with mixed vegetable curry and buttermilk",
      },
      {
        day: "Tuesday",
        breakfast: "Idli with sambar and coconut chutney",
        lunch: "Rice, rajma curry, cucumber salad, and buttermilk",
        dinner: "Vegetable khichdi with yogurt",
      },
      {
        day: "Wednesday",
        breakfast: "Whole grain toast with peanut butter and banana",
        lunch: "Rice, fish curry (if culturally acceptable), beans poriyal",
        dinner: "Chapati with dal and bottle gourd curry",
      },
    ],
    second: [
      {
        day: "Monday",
        breakfast: "Oats porridge with milk, nuts, and fruits",
        lunch: "Rice, sambar, spinach curry, and yogurt",
        dinner: "Chapati with paneer bhurji and vegetable salad",
      },
      {
        day: "Tuesday",
        breakfast: "Vegetable upma with coconut chutney",
        lunch: "Rice, dal, bitter gourd curry, and buttermilk",
        dinner: "Multigrain roti with mixed vegetable curry",
      },
      {
        day: "Wednesday",
        breakfast: "Sprouts chaat with lemon and coriander",
        lunch: "Rice, egg curry, beans poriyal, and yogurt",
        dinner: "Chapati with dal and bottle gourd curry",
      },
    ],
    third: [
      {
        day: "Monday",
        breakfast: "Multigrain dosa with sambar and chutney",
        lunch: "Rice, dal, drumstick curry, and yogurt",
        dinner: "Chapati with mixed vegetable curry and milk",
      },
      {
        day: "Tuesday",
        breakfast: "Vegetable poha with peanuts and lemon",
        lunch: "Rice, rajma curry, cucumber salad, and buttermilk",
        dinner: "Chapati with paneer curry and vegetable salad",
      },
      {
        day: "Wednesday",
        breakfast: "Ragi dosa with peanut chutney",
        lunch: "Rice, sambar, spinach curry, and yogurt",
        dinner: "Khichdi with vegetables and yogurt",
      },
    ],
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
          <h1 className="text-2xl font-bold ml-4">Diet & Exercise Recommendations</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Select Patient</CardTitle>
              <CardDescription>Choose a patient to view personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient</label>
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

                {patient && (
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium">Trimester</label>
                    <Select defaultValue={trimester} onValueChange={setTrimester}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first">First Trimester</SelectItem>
                        <SelectItem value="second">Second Trimester</SelectItem>
                        <SelectItem value="third">Third Trimester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {patient && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>Based on patient's health status and trimester</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="diet">
                  <TabsList className="mb-4">
                    <TabsTrigger value="diet">
                      <Utensils className="mr-2 h-4 w-4" />
                      Diet
                    </TabsTrigger>
                    <TabsTrigger value="exercise">
                      <Activity className="mr-2 h-4 w-4" />
                      Exercise
                    </TabsTrigger>
                    <TabsTrigger value="mealplan">
                      <Calendar className="mr-2 h-4 w-4" />
                      Meal Plan
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="diet" className="space-y-4">
                    {dietRecommendations[trimester].map((rec, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {rec.examples.map((example, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="bg-green-100 text-green-800 hover:bg-green-100"
                              >
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Card className="bg-amber-50 border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-amber-500" />
                          Important Reminders
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">Take prenatal vitamins daily as prescribed</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">Avoid alcohol, tobacco, and excessive caffeine</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">Drink 8-10 glasses of water daily</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">Wash fruits and vegetables thoroughly before consumption</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="exercise" className="space-y-4">
                    {exerciseRecommendations[trimester].map((rec, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-1">{rec.description}</p>
                          <p className="text-sm font-medium">Frequency: {rec.frequency}</p>
                        </CardContent>
                      </Card>
                    ))}

                    <Card className="bg-amber-50 border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-amber-500" />
                          Exercise Precautions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">
                              Stop exercising if you feel dizzy, short of breath, or experience pain
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">
                              Avoid exercises that require lying flat on your back after the first trimester
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">Stay hydrated before, during, and after exercise</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">Wear comfortable, supportive clothing and footwear</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="mealplan" className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h3 className="font-medium text-green-800 mb-2">Sample 3-Day Meal Plan</h3>
                      <p className="text-sm text-green-700">
                        This meal plan is designed to provide essential nutrients needed during the {trimester}{" "}
                        trimester. Adjust portions based on hunger and activity level.
                      </p>
                    </div>

                    {weeklyMealPlans[trimester].map((day, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium">Breakfast</h4>
                              <p className="text-sm text-muted-foreground">{day.breakfast}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Lunch</h4>
                              <p className="text-sm text-muted-foreground">{day.lunch}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Dinner</h4>
                              <p className="text-sm text-muted-foreground">{day.dinner}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button className="w-full" onClick={handleDownloadMealPlan} disabled={loading}>
                      {loading ? (
                        "Generating PDF..."
                      ) : (
                        <>
                          Download Full Weekly Meal Plan
                          <Download className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
