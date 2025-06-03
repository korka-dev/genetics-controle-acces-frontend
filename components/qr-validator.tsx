"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"
import type { QRValidationResponse } from "@/lib/types"
import { CheckCircle, XCircle, Loader2, QrCode, User, Phone, Clock } from "lucide-react"

export default function QRValidator() {
  const [qrData, setQrData] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<QRValidationResponse | null>(null)
  const { toast } = useToast()

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!qrData.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer les données du QR code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await apiService.validateQRCode(qrData)
      if (response.success && response.data) {
        setValidationResult(response.data)
        toast({
          title: response.data.valid ? "QR Code valide" : "QR Code invalide",
          description: response.data.message,
          variant: response.data.valid ? "default" : "destructive",
        })
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Erreur lors de la validation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR")
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-md mx-auto">
      <Card className="w-full border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
            Valider un QR Code
          </CardTitle>
          <CardDescription className="text-orange-100 text-sm sm:text-base">
            Entrez les données du QR code pour vérifier sa validité
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleValidate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qrData" className="text-gray-700 font-medium text-sm sm:text-base">
                Données du QR Code
              </Label>
              <Input
                id="qrData"
                type="text"
                placeholder="Collez les données du QR code ici"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                className="border-orange-200 focus:border-orange-500 focus:ring-orange-500 h-10 sm:h-11 text-sm sm:text-base"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Validation en cours...</span>
                  <span className="sm:hidden">Validation...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Valider le QR Code</span>
                  <span className="sm:hidden">Valider</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {validationResult && (
        <Card className="w-full border-orange-200 shadow-lg">
          <CardHeader
            className={`rounded-t-lg p-4 sm:p-6 ${
              validationResult.valid
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-red-500 to-red-600"
            } text-white`}
          >
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              {validationResult.valid ? (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              Résultat de la validation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Badge variant={validationResult.valid ? "default" : "destructive"}>
                {validationResult.valid ? "Valide" : "Invalide"}
              </Badge>
              <span className="text-xs sm:text-sm text-gray-600 break-words">{validationResult.message}</span>
            </div>

            {validationResult.valid && validationResult.data && (
              <div className="space-y-3 pt-4 border-t border-orange-200">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm sm:text-base">Nom:</span>
                      <span className="ml-2 break-words text-sm sm:text-base">{validationResult.data.name}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm sm:text-base">Téléphone:</span>
                      <span className="ml-2 break-all text-sm sm:text-base">{validationResult.data.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm sm:text-base">Créé le:</span>
                      <span className="ml-2 break-words text-xs sm:text-sm">
                        {formatDate(validationResult.data.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm sm:text-base">Expire le:</span>
                      <span className="ml-2 break-words text-xs sm:text-sm">
                        {formatDate(validationResult.data.expires_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
