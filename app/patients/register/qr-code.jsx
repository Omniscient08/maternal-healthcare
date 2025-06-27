"use client"

import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { generatePatientPDF } from "@/app/actions"
import { toast } from "@/hooks/use-toast"

export default function QRCode({ patientData }) {
  const [loading, setLoading] = useState(false)

  const handleDownloadPDF = async () => {
    setLoading(true)
    try {
      const result = await generatePatientPDF(patientData.id)

      if (result.success) {
        toast({
          title: "PDF Generated",
          description: "Patient data PDF has been generated and is ready for download",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to generate PDF",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Prepare data for QR code
  const qrData = {
    id: patientData.id,
    name: patientData.name,
    phone: patientData.phone,
    village: patientData.village,
    status: patientData.pregnancyStatus,
    age: patientData.age,
    region: patientData.region || "unknown",
  }

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-sm text-center">
      <div className="flex justify-center">
        <QRCodeCanvas
          value={JSON.stringify(qrData)}
          size={200}
          bgColor="#ffffff"
          fgColor="#1a8754"
          level="H"
          includeMargin={true}
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full"
        onClick={handleDownloadPDF}
        disabled={loading}
      >
        <Download className="mr-2 h-4 w-4" />
        {loading ? "Generating PDF..." : "Download Patient Data"}
      </Button>
    </div>
  )
}
