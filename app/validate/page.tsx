"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api"
import type { QRValidationResponse } from "@/lib/types"
import { CheckCircle, XCircle, QrCode, User, Phone, Clock, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ValidatePage() {
  const searchParams = useSearchParams()
  const qrData = searchParams.get("qr")
  const [validationResult, setValidationResult] = useState<QRValidationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateQR = async () => {
      if (!qrData) {
        setIsLoading(false)
        return
      }

      try {
        const response = await apiService.validateQRCode(qrData)
        if (response.success && response.data) {
          setValidationResult(response.data)
        }
      } catch (error) {
        console.error("Erreur lors de la validation:", error)
      } finally {
        setIsLoading(false)
      }
    }

    validateQR()
  }, [qrData])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-600">Validation en cours...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!qrData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Erreur
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-4">Aucune donnée QR fournie pour la validation.</p>
            <Link href="/">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-orange-600 rounded-full">
              <QrCode className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Validation QR Code</h1>
              <p className="text-orange-600 font-bold">Genetic-Service</p>
            </div>
          </div>
        </div>

        {/* Résultat de validation */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md border-orange-200 shadow-lg">
            <CardHeader
              className={`rounded-t-lg ${
                validationResult?.valid
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              } text-white`}
            >
              <CardTitle className="flex items-center gap-2">
                {validationResult?.valid ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                Résultat de la validation
              </CardTitle>
              <CardDescription className="text-white/90">
                {validationResult?.valid ? "QR Code valide" : "QR Code invalide"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={validationResult?.valid ? "default" : "destructive"}>
                  {validationResult?.valid ? "✓ Valide" : "✗ Invalide"}
                </Badge>
                <span className="text-sm text-gray-600">{validationResult?.message}</span>
              </div>

              {validationResult?.valid && validationResult.data && (
                <div className="space-y-4 pt-4 border-t border-orange-200">
                  <h3 className="font-semibold text-gray-900">Informations du rendez-vous :</h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">Nom :</span>
                        <span className="ml-2 break-words">{validationResult.data.name}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">Téléphone :</span>
                        <span className="ml-2 break-all">{validationResult.data.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">Créé le :</span>
                        <span className="ml-2 text-sm">{formatDate(validationResult.data.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">Expire le :</span>
                        <span className="ml-2 text-sm">{formatDate(validationResult.data.expires_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-green-800 text-sm font-medium">✓ Ce QR code est valide et peut être utilisé.</p>
                  </div>
                </div>
              )}

              {!validationResult?.valid && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-red-800 text-sm font-medium">✗ Ce QR code n'est pas valide ou a expiré.</p>
                </div>
              )}

              <div className="pt-4">
                <Link href="/">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
