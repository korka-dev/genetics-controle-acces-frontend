"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import type { FormDataResponse } from "@/lib/types";
import { Trash2, RefreshCw, QrCode, Clock, Phone, User, Loader2 } from "lucide-react";
import QRShare from "@/components/qr-share";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FormsListProps {
  refreshTrigger?: number;
}

export default function FormsList({ refreshTrigger }: FormsListProps) {
  const [forms, setForms] = useState<FormDataResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllForms();
      if (response.success && response.data) {
        const sortedForms = response.data.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setForms(sortedForms);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les rendez-vous",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [refreshTrigger]);

  const handleDelete = async (formId: string) => {
    setDeletingId(formId);
    try {
      const response = await apiService.deleteForm(formId);
      if (response.success) {
        setForms(forms.filter((form) => form.id !== formId));
        toast({
          title: "Succès",
          description: "Rendez-vous supprimé avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Erreur lors de la suppression",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleRenewQR = async (formId: string) => {
    setRenewingId(formId);
    try {
      const response = await apiService.renewQRCode(formId, 60);
      if (response.success && response.data) {
        setForms((prevForms) =>
          prevForms.map((form) =>
            form.id === formId
              ? { ...form, ...response.data! }
              : form
          )
        );
        toast({
          title: "Succès",
          description: "QR code renouvelé avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Erreur lors du renouvellement",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setRenewingId(null);
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <Card className="border-yellow-200 mx-2 sm:mx-0">
        <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8">
          <QrCode className="h-12 w-12 text-yellow-400 mb-4" />
          <p className="text-gray-500 text-center text-sm sm:text-base">
            Aucun rendez-vous créé pour le moment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 px-2 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-bold text-white">
        Rendez-vous créés ({forms.length})
      </h2>
      <div className="grid gap-3 sm:gap-4">
        {forms.map((form) => (
          <Card key={form.id} className="w-full border-yellow-200 shadow-lg bg-[#0b233a]">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-gray-900 text-base sm:text-lg">
                    <User className="h-4 w-4 text-yellow-600" />
                    <span className="break-words">{form.name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1 text-sm">
                    <Phone className="h-3 w-3 text-yellow-600" />
                    <span className="break-all">{form.phone}</span>
                  </CardDescription>
                </div>
                <Badge
                  variant={isExpired(form.expires_at) ? "destructive" : "default"}
                  className="self-start sm:self-center bg-yellow-500 hover:bg-yellow-500/80"
                >
                  {isExpired(form.expires_at) ? "Expiré" : "Actif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
                    <Clock className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                    <span className="break-words">Créé: {formatDate(form.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
                    <Clock className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                    <span className="break-words">Expire: {formatDate(form.expires_at)}</span>
                  </div>
                </div>

                {form.qr_code_data && (
                  <div className="flex justify-center p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <img
                      src={`data:image/png;base64,${form.qr_code_data}`}
                      alt="QR Code"
                      className="w-24 h-24 sm:w-32 sm:h-32"
                    />
                  </div>
                )}

                {form.qr_code_data && (
                  <QRShare
                    qrCodeData={form.qr_code_data}
                    formData={{
                      name: form.name,
                      phone: form.phone,
                      id: form.id,
                      user: form.user, // Passer les informations de l'utilisateur
                    }}
                  />
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRenewQR(form.id)}
                    disabled={renewingId === form.id}
                    className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    {renewingId === form.id ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    <span className="ml-1 sm:ml-2">Renouveler QR</span>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === form.id}
                        className="text-xs sm:text-sm h-8 sm:h-9"
                      >
                        {deletingId === form.id ? (
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                        <span className="ml-1 sm:ml-2">Supprimer</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="mx-4 sm:mx-0 max-w-md bg-[#0b233a] border-yellow-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base sm:text-lg text-white">
                          Confirmer la suppression
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm sm:text-base text-gray-200">
                          Êtes-vous sûr de vouloir supprimer le rendez-vous de {form.name} ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto bg-gray-500 hover:bg-gray-400 text-white">
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(form.id)}
                          className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
