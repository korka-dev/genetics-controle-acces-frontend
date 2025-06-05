"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiService } from "@/lib/api";
import type { FormDataResponse } from "@/lib/types";
import { QrCode, User, Phone, Clock, Home, Download, Share2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QRDisplayPage() {
  const params = useParams();
  const formId = params.id as string;
  const [formData, setFormData] = useState<FormDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (formId) {
      fetchFormData();
    }
  }, [formId]);

  const fetchFormData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getForm(formId);
      if (response.success && response.data) {
        setFormData(response.data);
      } else {
        setError("Code d'accès introuvable ou expiré");
      }
    } catch (error) {
      setError("Erreur lors du chargement du code d'accès");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!formData?.qr_code_data) return;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const link = document.createElement("a");
        link.download = `acces-residence-${formData.name.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL();
        link.click();

        toast({
          title: "Téléchargement réussi",
          description: "Votre QR code d'accès a été téléchargé",
        });
      };

      img.crossOrigin = "anonymous";
      img.src = `data:image/png;base64,${formData.qr_code_data}`;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le QR code",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Code d'accès résidentiel - ${formData?.name}`,
          text: `Voici votre code d'accès pour la résidence`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Partage annulé");
      }
    } else {
      // Fallback: copier le lien
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Lien copié !",
          description: "Le lien a été copié dans le presse-papiers",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffInMinutes = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60));

    if (diffInMinutes <= 0) return "Expiré";
    if (diffInMinutes < 60) return `${diffInMinutes} min restantes`;

    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (hours < 24) {
      return minutes > 0 ? `${hours}h ${minutes}min restantes` : `${hours}h restantes`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    return remainingHours > 0 ? `${days}j ${remainingHours}h restantes` : `${days}j restantes`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b233a] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mb-4" />
            <p className="text-gray-200">Chargement de votre code d'accès...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b233a] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Code d'accès introuvable
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-gray-200 mb-4">{error}</p>
            <p className="text-sm text-gray-400">
              Vérifiez que le lien est correct ou contactez la personne qui vous a envoyé ce code.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const expired = isExpired(formData.expires_at);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b233a]">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-[#0b233a]">
              <img
                src="/welqo.jpeg"
                alt="Welqo Logo"
                className="w-24 h-auto"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Code d'Accès</h1>
              <p className="text-sm sm:text-base text-yellow-500 font-semibold">
                Genetics-Services
              </p>
            </div>
          </div>
        </div>

        <Card className="w-full border-yellow-200 shadow-lg bg-[#0b233a]">
          <CardHeader className={`rounded-t-lg p-4 sm:p-6 ${expired ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-green-600"} text-white`}>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              {expired ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
              {expired ? "Code d'accès expiré" : "Code d'accès valide"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-yellow-600" />
                Informations de l'invité
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-white">Nom:</span>
                  <span className="text-gray-300">{formData.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-yellow-600" />
                  <span className="font-medium text-sm text-white">Téléphone:</span>
                  <span className="text-gray-300">{formData.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <Badge variant={expired ? "destructive" : "default"} className="mb-2">
                  {expired ? "🔴 Expiré" : "🟢 Valide"}
                </Badge>
                <div className="text-sm text-gray-300">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Expire le : {formatDate(formData.expires_at)}</span>
                  </div>
                  <div className="font-medium text-yellow-600">{getTimeRemaining(formData.expires_at)}</div>
                </div>
              </div>
            </div>

            {formData.qr_code_data && (
              <div className="text-center">
                <h3 className="font-semibold text-white mb-4 flex items-center justify-center gap-2">
                  <QrCode className="h-5 w-5 text-yellow-600" />
                  Votre QR Code d'accès
                </h3>

                <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-yellow-200 shadow-inner">
                  <img
                    src={`data:image/png;base64,${formData.qr_code_data}`}
                    alt="QR Code d'accès résidentiel"
                    className="w-48 h-48 sm:w-64 sm:h-64"
                  />
                </div>

                {!expired && (
                  <div className="mt-4 p-3 bg-green-900 rounded-lg border border-green-700">
                    <p className="text-green-300 text-sm font-medium">
                      ✓ Présentez ce QR code à l'entrée de la résidence
                    </p>
                  </div>
                )}

                {expired && (
                  <div className="mt-4 p-3 bg-red-900 rounded-lg border border-red-700">
                    <p className="text-red-300 text-sm font-medium">
                      ✗ Ce code d'accès a expiré et ne peut plus être utilisé
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h4 className="font-medium text-blue-300 mb-2">Instructions d'utilisation :</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Présentez ce QR code au gardien ou au système d'accès</li>
                <li>• Gardez ce code accessible sur votre téléphone</li>
                <li>• Le code est personnel et ne doit pas être partagé</li>
                <li>• En cas de problème, contactez le résident qui vous a invité</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                className="flex-1 border-yellow-300 text-yellow-600 hover:bg-yellow-900"
                disabled={!formData.qr_code_data}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger le QR Code
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">Code d'accès généré par Genetic-Service</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
