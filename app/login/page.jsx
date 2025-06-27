"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [region, setRegion] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState("")

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Generate a random 4-digit OTP
      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString()
      setGeneratedOtp(randomOtp)

      // In a real app, this would send an actual OTP via email
      // For demo purposes, we'll just display it on the screen
      setTimeout(() => {
        setOtpSent(true)
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your email",
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      })
      return
    }

    if (!region) {
      toast({
        title: "Error",
        description: "Please select your region",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // For demo purposes, we'll accept any OTP that matches the generated one
      // or the code "1234" as a fallback
      if (otp === generatedOtp || otp === "1234") {
        // Save user info to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "user",
            JSON.stringify({
              email,
              region,
              name: email.split("@")[0],
              isLoggedIn: true,
            }),
          )
        }

        toast({
          title: "Login Successful",
          description: "Welcome to Smart Maternal & Child Healthcare System",
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Error",
          description: "Invalid OTP. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-700">Smart Maternal & Child Healthcare</CardTitle>
          <CardDescription>Login to access the ASHA worker portal</CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleSendOTP}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="space-y-4">
                {generatedOtp && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      For demo purposes, your OTP is: <span className="font-bold">{generatedOtp}</span>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code (OTP)</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter the OTP sent to your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">A verification code has been sent to {email}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Select Region</Label>
                  <Select onValueChange={setRegion} required>
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hyderabad">Hyderabad Region</SelectItem>
                      <SelectItem value="warangal">Warangal Region</SelectItem>
                      <SelectItem value="karimnagar">Karimnagar Region</SelectItem>
                      <SelectItem value="nizamabad">Nizamabad Region</SelectItem>
                      <SelectItem value="khammam">Khammam Region</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? "Verifying..." : "Login"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setOtpSent(false)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="#" className="text-green-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
