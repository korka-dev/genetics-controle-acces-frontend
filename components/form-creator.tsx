"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"
import type { FormDataCreate } from "@/lib/types"
import { Loader2, Plus } from "lucide-react"
import PhoneInput from "@/components/phone-input"

interface FormCreatorProps {
  onFormCreated?: () => void
}

export default function FormCreator({ onFormCreated }: FormCreatorProps) {
  const [formData, setFormData] = useState<FormDataCreate>({
    name: "",
    phone: "",
    duration_minutes: 60,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiService.createForm(formData)

      if (response.success) {
        toast({
          title: "Succès",
          description: "Accès créé avec succès !",
        })
        setFormData({ name: "", phone: "", duration_minutes: 60 })
        onFormCreated?.()
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Erreur lors de la création de l'accès",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-yellow-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#071f37] to-yellow-500 text-white rounded-t-lg p-3 sm:p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Créer un accès invité</span>
          <span className="sm:hidden">Nouvel accès</span>
        </CardTitle>
        <CardDescription className="text-yellow-100 text-xs sm:text-sm md:text-base">
          <span className="hidden sm:inline">Créez un nouveau code d'accès avec QR code</span>
          <span className="sm:hidden">Code d'accès avec QR</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">
              Nom de l'invité
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Entrez le nom de l'invité"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500 h-9 sm:h-10 md:h-11 text-sm sm:text-base"
              required
            />
          </div>

          {/* Composant PhoneInput responsive */}
          <PhoneInput
            id="phone"
            value={formData.phone}
            onChange={(phone) => setFormData({ ...formData, phone })}
            placeholder="Numéro de téléphone"
            required
          />

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">
              Durée de validité
            </Label>
            <Select
              value={formData.duration_minutes.toString()}
              onValueChange={(value) => setFormData({ ...formData, duration_minutes: Number.parseInt(value) })}
            >
              <SelectTrigger className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500 h-9 sm:h-10 md:h-11 text-sm sm:text-base">
                <SelectValue placeholder="Sélectionnez la durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
                <SelectItem value="120">2 heures</SelectItem>
                <SelectItem value="240">4 heures</SelectItem>
                <SelectItem value="480">8 heures</SelectItem>
                <SelectItem value="1440">24 heures</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium h-9 sm:h-10 md:h-11 text-sm sm:text-base mt-4 sm:mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                <span className="hidden sm:inline">Création en cours...</span>
                <span className="sm:hidden">Création...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Créer l'accès invité</span>
                <span className="sm:hidden">Créer</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
