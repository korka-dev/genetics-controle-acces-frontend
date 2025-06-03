"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
}

const countries: Country[] = [
  { code: "SN", name: "Sénégal", flag: "🇸🇳", dialCode: "+221" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "MA", name: "Maroc", flag: "🇲🇦", dialCode: "+212" },
  { code: "DZ", name: "Algérie", flag: "🇩🇿", dialCode: "+213" },
  { code: "TN", name: "Tunisie", flag: "🇹🇳", dialCode: "+216" },
  { code: "ML", name: "Mali", flag: "🇲🇱", dialCode: "+223" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", dialCode: "+226" },
  { code: "NE", name: "Niger", flag: "🇳🇪", dialCode: "+227" },
  { code: "TD", name: "Tchad", flag: "🇹🇩", dialCode: "+235" },
  { code: "GM", name: "Gambie", flag: "🇬🇲", dialCode: "+220" },
  { code: "GN", name: "Guinée", flag: "🇬🇳", dialCode: "+224" },
  { code: "GW", name: "Guinée-Bissau", flag: "🇬🇼", dialCode: "+245" },
  { code: "CV", name: "Cap-Vert", flag: "🇨🇻", dialCode: "+238" },
  { code: "MR", name: "Mauritanie", flag: "🇲🇷", dialCode: "+222" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", dialCode: "+225" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", dialCode: "+233" },
  { code: "TG", name: "Togo", flag: "🇹🇬", dialCode: "+228" },
  { code: "BJ", name: "Bénin", flag: "🇧🇯", dialCode: "+229" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", dialCode: "+234" },
  { code: "CM", name: "Cameroun", flag: "🇨🇲", dialCode: "+237" },
  { code: "CF", name: "République Centrafricaine", flag: "🇨🇫", dialCode: "+236" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", dialCode: "+241" },
  { code: "GQ", name: "Guinée Équatoriale", flag: "🇬🇶", dialCode: "+240" },
  { code: "ST", name: "São Tomé-et-Príncipe", flag: "🇸🇹", dialCode: "+239" },
  { code: "CD", name: "République Démocratique du Congo", flag: "🇨🇩", dialCode: "+243" },
  { code: "CG", name: "République du Congo", flag: "🇨🇬", dialCode: "+242" },
  { code: "AO", name: "Angola", flag: "🇦🇴", dialCode: "+244" },
  { code: "US", name: "États-Unis", flag: "🇺🇸", dialCode: "+1" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧", dialCode: "+44" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪", dialCode: "+49" },
  { code: "IT", name: "Italie", flag: "🇮🇹", dialCode: "+39" },
  { code: "ES", name: "Espagne", flag: "🇪🇸", dialCode: "+34" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dialCode: "+351" },
  { code: "BE", name: "Belgique", flag: "🇧🇪", dialCode: "+32" },
  { code: "CH", name: "Suisse", flag: "🇨🇭", dialCode: "+41" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", dialCode: "+352" },
  { code: "NL", name: "Pays-Bas", flag: "🇳🇱", dialCode: "+31" },
  { code: "AT", name: "Autriche", flag: "🇦🇹", dialCode: "+43" },
  { code: "SE", name: "Suède", flag: "🇸🇪", dialCode: "+46" },
  { code: "NO", name: "Norvège", flag: "🇳🇴", dialCode: "+47" },
  { code: "DK", name: "Danemark", flag: "🇩🇰", dialCode: "+45" },
  { code: "FI", name: "Finlande", flag: "🇫🇮", dialCode: "+358" },
]

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  id?: string
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "Numéro de téléphone",
  className,
  required = false,
  id,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]) // Sénégal par défaut
  const [phoneNumber, setPhoneNumber] = useState("")

  // Extraire le numéro sans l'indicatif lors de l'initialisation
  const initializePhone = (fullNumber: string) => {
    if (!fullNumber) return

    const country = countries.find((c) => fullNumber.startsWith(c.dialCode))
    if (country) {
      setSelectedCountry(country)
      setPhoneNumber(fullNumber.substring(country.dialCode.length))
    } else {
      setPhoneNumber(fullNumber)
    }
  }

  // Initialiser si une valeur est fournie
  if (value && !phoneNumber && !value.startsWith(selectedCountry.dialCode)) {
    initializePhone(value)
  }

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode)
    if (country) {
      setSelectedCountry(country)
      const fullNumber = country.dialCode + phoneNumber
      onChange(fullNumber)
    }
  }

  const handlePhoneChange = (newPhoneNumber: string) => {
    // Supprimer tous les caractères non numériques
    const cleanNumber = newPhoneNumber.replace(/\D/g, "")
    setPhoneNumber(cleanNumber)
    const fullNumber = selectedCountry.dialCode + cleanNumber
    onChange(fullNumber)
  }

  const formatPhoneDisplay = (number: string) => {
    // Formater le numéro pour l'affichage (ajouter des espaces)
    if (selectedCountry.code === "SN" && number.length >= 2) {
      // Format sénégalais: XX XXX XX XX
      return number.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4")
    } else if (selectedCountry.code === "FR" && number.length >= 2) {
      // Format français: XX XX XX XX XX
      return number.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")
    }
    // Format par défaut avec espaces tous les 3 chiffres
    return number.replace(/(\d{3})(?=\d)/g, "$1 ")
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">
        Numéro de téléphone
      </Label>
      <div className="flex gap-1.5 sm:gap-2">
        {/* Sélecteur de pays - Responsive */}
        <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] border-orange-200 focus:border-orange-500 focus:ring-orange-500 h-9 sm:h-10 md:h-11">
            <SelectValue>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-base">{selectedCountry.flag}</span>
                <span className="text-xs sm:text-sm font-mono hidden sm:inline">{selectedCountry.dialCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[250px] sm:max-h-[300px]">
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2 sm:gap-3 w-full">
                  <span className="text-sm sm:text-base">{country.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-[150px]">
                      {country.name}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{country.dialCode}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Champ de saisie du numéro - Responsive */}
        <div className="flex-1 relative">
          <Input
            id={id}
            type="tel"
            placeholder={placeholder}
            value={formatPhoneDisplay(phoneNumber)}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={cn(
              "border-orange-200 focus:border-orange-500 focus:ring-orange-500 h-9 sm:h-10 md:h-11 text-sm sm:text-base",
              className,
            )}
            required={required}
          />
          {/* Affichage du numéro complet en petit - Masqué sur très petits écrans */}
          {phoneNumber && (
            <div className="absolute -bottom-4 sm:-bottom-5 left-0 text-xs text-gray-500 font-mono hidden sm:block">
              {selectedCountry.dialCode + phoneNumber}
            </div>
          )}
        </div>
      </div>

      {/* Aide contextuelle - Responsive */}
      <div className="text-xs text-gray-500 mt-1 sm:mt-2">
        {selectedCountry.code === "SN" && (
          <>
            <span className="hidden sm:inline">Format: 77 123 45 67</span>
            <span className="sm:hidden">Ex: 77 123 45 67</span>
          </>
        )}
        {selectedCountry.code === "FR" && (
          <>
            <span className="hidden sm:inline">Format: 06 12 34 56 78</span>
            <span className="sm:hidden">Ex: 06 12 34 56 78</span>
          </>
        )}
        {!["SN", "FR"].includes(selectedCountry.code) && (
          <>
            <span className="hidden sm:inline">Entrez votre numéro sans l'indicatif</span>
            <span className="sm:hidden">Sans indicatif</span>
          </>
        )}
      </div>
    </div>
  )
}
