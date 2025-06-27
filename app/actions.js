"use server"

import { revalidatePath } from "next/cache"

// Simulated database for demo purposes
const patients = []
const healthRecords = []
const referrals = []
const visits = []

// Authentication functions
export async function sendOTP(email) {
  // In a real app, this would send an actual OTP via email
  console.log(`Sending OTP to ${email}`)
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true }
}

export async function verifyOTP(email, otp, region) {
  // In a real app, this would verify the OTP
  console.log(`Verifying OTP ${otp} for ${email} in ${region}`)
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, any OTP is valid
  if (otp.length < 4) {
    throw new Error("Invalid OTP")
  }

  return { success: true, user: { email, region, name: email.split("@")[0] } }
}

// Patient management functions
export async function registerPatient(patientData) {
  // Generate a unique ID
  const patientId = `ASHA-${Date.now().toString().slice(-5)}`

  const newPatient = {
    id: patientId,
    ...patientData,
    registrationDate: new Date().toISOString(),
  }

  // In a real app, this would save to a database
  patients.push(newPatient)

  // Revalidate the patients page
  revalidatePath("/patients")

  return { success: true, patient: newPatient }
}

export async function saveHealthData(patientId, healthData) {
  const record = {
    id: `HEALTH-${Date.now().toString().slice(-5)}`,
    patientId,
    ...healthData,
    recordDate: new Date().toISOString(),
  }

  // In a real app, this would save to a database
  healthRecords.push(record)

  // Revalidate the health tracking page
  revalidatePath("/health-tracking")

  return { success: true, record }
}

export async function saveDraftHealthData(patientId, healthData) {
  const record = {
    id: `DRAFT-${Date.now().toString().slice(-5)}`,
    patientId,
    ...healthData,
    isDraft: true,
    recordDate: new Date().toISOString(),
  }

  // In a real app, this would save to a database
  healthRecords.push(record)

  return { success: true, record }
}

export async function createReferral(patientId, hospitalId, reason) {
  const referral = {
    id: `REF-${Date.now().toString().slice(-5)}`,
    patientId,
    hospitalId,
    reason,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  // In a real app, this would save to a database
  referrals.push(referral)

  // Revalidate the referrals page
  revalidatePath("/referrals")

  return { success: true, referral }
}

export async function scheduleVisit(patientId, date, notes) {
  const visit = {
    id: `VISIT-${Date.now().toString().slice(-5)}`,
    patientId,
    scheduledDate: date,
    notes,
    status: "scheduled",
    createdAt: new Date().toISOString(),
  }

  // In a real app, this would save to a database
  visits.push(visit)

  // Revalidate the calendar page
  revalidatePath("/calendar")

  return { success: true, visit }
}

// Data retrieval functions
export async function getPatientData(patientId) {
  // In a real app, this would fetch from a database
  const patient = patients.find((p) => p.id === patientId)

  if (!patient) {
    return { success: false, error: "Patient not found" }
  }

  const records = healthRecords.filter((r) => r.patientId === patientId)
  const patientReferrals = referrals.filter((r) => r.patientId === patientId)
  const patientVisits = visits.filter((v) => v.patientId === patientId)

  return {
    success: true,
    data: {
      patient,
      healthRecords: records,
      referrals: patientReferrals,
      visits: patientVisits,
    },
  }
}

export async function generatePatientPDF(patientId) {
  // In a real app, this would generate a PDF
  console.log(`Generating PDF for patient ${patientId}`)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    success: true,
    pdfUrl: `/api/pdf/${patientId}`, // This would be a real URL in production
  }
}
