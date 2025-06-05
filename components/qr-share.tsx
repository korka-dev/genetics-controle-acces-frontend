"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Share2, Copy, Mail, MessageSquare, Download, Check, Link } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface QRShareProps {
  qrCodeData: string
  formData: {
    name: string
    phone: string
    id: string
  }
}

export default function QRShare({ qrCodeData, formData }: QRShareProps) {
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const { toast } = useToast()

  // Générer l'URL de partage direct pour le QR code
  const generateQRDisplayUrl = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/qr/${formData.id}`
  }

  // Générer l'URL de validation (ancienne méthode)
  const generateValidationUrl = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/validate?qr=${encodeURIComponent(qrCodeData)}`
  }

  const handleCopyQRData = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeData)
      setCopied(true)
      toast({
        title: "Copié !",
        description: "Les données du QR code ont été copiées",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier les données",
        variant: "destructive",
      })
    }
  }

  const handleCopyQRLink = async () => {
    const url = generateQRDisplayUrl()
    try {
      await navigator.clipboard.writeText(url)
      setLinkCopied(true)
      toast({
        title: "Lien copié !",
        description: "Le lien d'accès a été copié",
      })
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      })
    }
  }

  const handleDownloadQR = () => {
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        const link = document.createElement("a")
        link.download = `qr-code-${formData.name.replace(/\s+/g, "-")}.png`
        link.href = canvas.toDataURL()
        link.click()

        toast({
          title: "Téléchargement réussi",
          description: "Le QR code a été téléchargé",
        })
      }

      img.crossOrigin = "anonymous"
      img.src = `data:image/png;base64,${qrCodeData}`
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le QR code",
        variant: "destructive",
      })
    }
  }

  const handleEmailShare = () => {
    const qrUrl = generateQRDisplayUrl()
    const subject = `Code d'accès résidentiel - ${formData.name}`
    const body = `Bonjour,

Voici votre code d'accès pour la résidence.

👤 Nom : ${formData.name}
📱 Téléphone : ${formData.phone}

🔗 Cliquez sur ce lien pour voir votre QR code d'accès :
${qrUrl}

Instructions :
• Cliquez sur le lien pour afficher votre QR code
• Présentez le QR code à l'entrée de la résidence
• Gardez ce lien accessible sur votre téléphone

Cordialement,
Genetic-Service`

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  const handleWhatsAppShare = () => {
    const qrUrl = generateQRDisplayUrl()
    const message = `🏠 *Code d'accès résidentiel*

👤 *Nom :* ${formData.name}
📱 *Téléphone :* ${formData.phone}

🔗 *Votre code d'accès :*
${qrUrl}

📋 *Instructions :*
• Cliquez sur le lien pour voir votre QR code
• Présentez le QR code à l'entrée
• Gardez ce lien sur votre téléphone

_Genetic-Service_`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleSMSShare = () => {
    const qrUrl = generateQRDisplayUrl()
    const message = `Code d'accès résidentiel pour ${formData.name}. Votre QR code : ${qrUrl} - Genetic-Service`
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`
    window.open(smsUrl)
  }

  const handleWebShare = async () => {
    const qrUrl = generateQRDisplayUrl()
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Code d'accès résidentiel - ${formData.name}`,
          text: `Voici votre code d'accès pour la résidence`,
          url: qrUrl,
        })
      } catch (error) {
        console.log("Partage annulé")
      }
    } else {
      toast({
        title: "Non supporté",
        description: "Le partage natif n'est pas supporté sur cet appareil",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Bouton principal de partage */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
            <Share2 className="h-4 w-4 mr-2" />
            Partager le Code d'Accès
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-orange-600" />
              Partager le Code d'Accès
            </DialogTitle>
            <DialogDescription>Envoyez le lien d'accès direct à votre invité</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Lien d'accès direct */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Link className="h-4 w-4 text-green-600" />
                Lien d'accès direct
              </Label>
              <div className="flex gap-2">
                <Input value={generateQRDisplayUrl()} readOnly className="text-xs" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleCopyQRLink}>
                        {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copier le lien d'accès</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-green-600">✓ L'invité verra directement son QR code en cliquant sur ce lien</p>
            </div>

            {/* Options de partage */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Partager via</Label>

              <div className="grid grid-cols-2 gap-2">
                {/* Partage natif (si supporté) */}
                {navigator.share && (
                  <Button variant="outline" size="sm" onClick={handleWebShare} className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Partager
                  </Button>
                )}

                {/* Email */}
                <Button variant="outline" size="sm" onClick={handleEmailShare} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>

                {/* WhatsApp */}
                <Button variant="outline" size="sm" onClick={handleWhatsAppShare} className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp
                </Button>

                {/* SMS */}
                <Button variant="outline" size="sm" onClick={handleSMSShare} className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS
                </Button>
              </div>
            </div>

            {/* Instructions simplifiées */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Instructions :</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Partagez ce lien avec votre invité</li>
                <li>• Il verra directement son QR code d'accès</li>
                <li>• Simple et rapide sur tous les appareils</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Actions rapides */}
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleCopyQRLink} className="flex-1">
                {linkCopied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copier le lien d'accès</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleDownloadQR} className="flex-1">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Télécharger QR</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleWhatsAppShare} className="flex-1">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Partager sur WhatsApp</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
