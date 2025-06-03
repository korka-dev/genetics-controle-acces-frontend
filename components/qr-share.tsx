"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Share2, Copy, Mail, MessageSquare, Download, QrCode, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QRShareProps {
  qrCodeData: string;
  formData: {
    name: string;
    phone: string;
    id: string;
  };
}

export default function QRShare({ qrCodeData, formData }: QRShareProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const { toast } = useToast();

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/validate?qr=${encodeURIComponent(qrCodeData)}`;
  };

  const handleCopyQRData = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeData);
      setCopied(true);
      toast({
        title: "Copié !",
        description: "Les données du QR code ont été copiées",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier les données",
        variant: "destructive",
      });
    }
  };

  const handleCopyShareUrl = async () => {
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Lien copié !",
        description: "Le lien de validation a été copié",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const link = document.createElement("a");
        link.download = `qr-code-${formData.name.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL();
        link.click();

        toast({
          title: "Téléchargement réussi",
          description: "Le QR code a été téléchargé",
        });
      };

      img.src = `data:image/png;base64,${qrCodeData}`;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le QR code",
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = () => {
    const subject = `QR Code de validation - Rendez-vous ${formData.name}`;
    const body = `Bonjour,

Voici le QR code de validation pour le rendez-vous de ${formData.name} (${formData.phone}).

Vous pouvez scanner ce QR code ou utiliser ce lien pour valider : ${generateShareUrl()}

Données du QR code : ${qrCodeData}

Cordialement,
Genetic-Service`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleWhatsAppShare = () => {
    const message = `🔍 *QR Code de validation - Rendez-vous*

👤 *Nom :* ${formData.name}
📱 *Téléphone :* ${formData.phone}

🔗 *Lien de validation :* ${generateShareUrl()}

📋 *Données QR :* ${qrCodeData}

_Genetic-Service_`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSMSShare = () => {
    const message = `QR Code de validation pour le rendez-vous de ${formData.name}. Lien: ${generateShareUrl()} - Genetic-Service`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code - Rendez-vous ${formData.name}`,
          text: `QR Code de validation pour le rendez-vous de ${formData.name}`,
          url: generateShareUrl(),
        });
      } catch (error) {
        console.log("Partage annulé");
      }
    } else {
      toast({
        title: "Non supporté",
        description: "Le partage natif n'est pas supporté sur cet appareil",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-yellow-300 text-yellow-600 hover:bg-yellow-50">
            <Share2 className="h-4 w-4 mr-2" />
            Partager le QR Code
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-yellow-600" />
              Partager le QR Code
            </DialogTitle>
            <DialogDescription>Partagez ce QR code avec la personne qui doit le scanner</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <img src={`data:image/png;base64,${qrCodeData}`} alt="QR Code" className="w-32 h-32" />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="text-sm">
                <span className="font-medium">Nom :</span> {formData.name}
              </div>
              <div className="text-sm">
                <span className="font-medium">Téléphone :</span> {formData.phone}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Lien de validation</Label>
              <div className="flex gap-2">
                <Input value={generateShareUrl()} readOnly className="text-xs" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleCopyShareUrl}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copier le lien</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Données du QR Code</Label>
              <div className="flex gap-2">
                <Input value={qrCodeData} readOnly className="text-xs font-mono" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleCopyQRData}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copier les données</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Options de partage</Label>

              <div className="grid grid-cols-2 gap-2">
                {navigator.share && (
                  <Button variant="outline" size="sm" onClick={handleWebShare} className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Partager
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={handleEmailShare} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>

                <Button variant="outline" size="sm" onClick={handleWhatsAppShare} className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp
                </Button>

                <Button variant="outline" size="sm" onClick={handleSMSShare} className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS
                </Button>

                <Button variant="outline" size="sm" onClick={handleDownloadQR} className="flex items-center gap-2 col-span-2">
                  <Download className="h-4 w-4" />
                  Télécharger le QR Code
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Instructions :</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Partagez le lien ou les données QR avec la personne</li>
                <li>• Elle peut scanner le QR code ou utiliser le lien</li>
                <li>• Le QR code sera validé automatiquement</li>
                <li>• Vérifiez la date d'expiration avant le partage</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleCopyQRData} className="flex-1">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copier les données QR</p>
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
  );
}
