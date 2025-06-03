"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/lib/api";
import type { FormDataResponse } from "@/lib/types";
import { Search, X, Calendar, Phone, User, Clock, Loader2, RefreshCw, Home, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import QRShare from "@/components/qr-share";

interface SearchAppointmentsProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function SearchAppointments({ isOpen, onClose, onRefresh }: SearchAppointmentsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<FormDataResponse[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<FormDataResponse[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchAppointments();
    }
  }, [isOpen]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllForms();
      if (response.success && response.data) {
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les accès",
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
    if (!appointments.length) return;

    let results = [...appointments];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (apt) =>
          apt.name.toLowerCase().includes(query) ||
          apt.phone.toLowerCase().includes(query) ||
          apt.id.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      const now = new Date();
      if (statusFilter === "active") {
        results = results.filter((apt) => new Date(apt.expires_at) > now);
      } else if (statusFilter === "expired") {
        results = results.filter((apt) => new Date(apt.expires_at) <= now);
      } else if (statusFilter === "today") {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        results = results.filter((apt) => {
          const expiryDate = new Date(apt.expires_at);
          return expiryDate >= today && expiryDate < tomorrow;
        });
      }
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);

      if (dateFilter === "today") {
        results = results.filter((apt) => {
          const createdDate = new Date(apt.created_at);
          return createdDate >= today && createdDate < tomorrow;
        });
      } else if (dateFilter === "week") {
        results = results.filter((apt) => {
          const createdDate = new Date(apt.created_at);
          return createdDate >= weekAgo;
        });
      } else if (dateFilter === "month") {
        results = results.filter((apt) => {
          const createdDate = new Date(apt.created_at);
          return createdDate >= monthAgo;
        });
      }
    }

    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredAppointments(results);
  }, [searchQuery, statusFilter, dateFilter, appointments]);

  const handleDelete = async (formId: string) => {
    setDeletingId(formId);
    try {
      const response = await apiService.deleteForm(formId);
      if (response.success) {
        setAppointments(appointments.filter((form) => form.id !== formId));
        toast({
          title: "Succès",
          description: "Accès supprimé avec succès",
        });
        onRefresh();
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
        setAppointments(appointments.map((form) => (form.id === formId ? response.data! : form)));
        toast({
          title: "Succès",
          description: "Code d'accès renouvelé avec succès",
        });
        onRefresh();
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

  const isActiveToday = (expiresAt: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expiryDate = new Date(expiresAt);
    return expiryDate >= today && expiryDate < tomorrow && expiryDate > now;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR");
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col mx-2 sm:mx-0">
        <CardHeader className="bg-gradient-to-r from-[#071f37] to-yellow-500 text-white p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Rechercher les accès résidentiels</span>
              <span className="sm:hidden">Recherche d'accès</span>
            </CardTitle>
            <Button
              variant="ghost"
              className="text-white hover:bg-yellow-700 h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
              onClick={onClose}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Fermer</span>
            </Button>
          </div>
          <p className="text-yellow-100 text-xs sm:text-sm hidden sm:block">
            Trouvez rapidement les codes d'accès de vos invités
          </p>
        </CardHeader>

        <div className="p-3 sm:p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="flex flex-col gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 border-yellow-200 focus:border-yellow-500 h-9 sm:h-10 text-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-7 sm:w-7 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 min-w-0">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-yellow-200 h-9 sm:h-10 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-600 flex-shrink-0" />
                      <SelectValue placeholder="Statut" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="active">🟢 Actifs</SelectItem>
                    <SelectItem value="today">📅 Aujourd'hui</SelectItem>
                    <SelectItem value="expired">🔴 Expirés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-0">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="border-yellow-200 h-9 sm:h-10 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-600 flex-shrink-0" />
                      <SelectValue placeholder="Date" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">7 jours</SelectItem>
                    <SelectItem value="month">30 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-yellow-200 h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
                onClick={resetFilters}
                title="Réinitialiser"
              >
                <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm hidden xs:flex">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{appointments.filter((apt) => !isExpired(apt.expires_at)).length} actifs</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{appointments.filter((apt) => isActiveToday(apt.expires_at)).length} aujourd'hui</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{appointments.filter((apt) => isExpired(apt.expires_at)).length} expirés</span>
            </div>
          </div>
        </div>

        <CardContent className="p-0 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-yellow-600" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
              <Home className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm sm:text-base">Aucun accès trouvé</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Modifiez vos critères de recherche</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 sm:p-4 hover:bg-yellow-50 transition-colors flex flex-col gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
                          <span className="truncate">{appointment.name}</span>
                          <span className="text-xs text-gray-500 font-normal hidden sm:inline">
                            #{appointment.id.slice(-6)}
                          </span>
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-600 flex-shrink-0" />
                          <span className="truncate">{appointment.phone}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        {isExpired(appointment.expires_at) ? (
                          <Badge variant="destructive" className="text-xs">
                            🔴 Expiré
                          </Badge>
                        ) : isActiveToday(appointment.expires_at) ? (
                          <Badge variant="default" className="text-xs bg-blue-600">
                            📅 Aujourd'hui
                          </Badge>
                        ) : (
                          <Badge variant="default" className="text-xs bg-green-600">
                            🟢 Actif
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">Créé: {formatDateShort(appointment.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">Expire: {formatDateShort(appointment.expires_at)}</span>
                      </div>
                    </div>

                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs hidden sm:block">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Home className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          Code d'accès résidentiel valide jusqu'au {formatDate(appointment.expires_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 justify-between items-center">
                    {appointment.qr_code_data && (
                      <div className="hidden sm:block flex-shrink-0">
                        <img
                          src={`data:image/png;base64,${appointment.qr_code_data}`}
                          alt="QR Code d'accès"
                          className="w-16 h-16 sm:w-20 sm:h-20 border border-gray-200 rounded"
                        />
                      </div>
                    )}
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      {appointment.qr_code_data && (
                        <QRShare
                          qrCodeData={appointment.qr_code_data}
                          formData={{
                            name: appointment.name,
                            phone: appointment.phone,
                            id: appointment.id,
                          }}
                        />
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRenewQR(appointment.id)}
                        disabled={renewingId === appointment.id}
                        className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 h-8 text-xs"
                      >
                        {renewingId === appointment.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                        <span className="ml-1 hidden sm:inline">Prolonger</span>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="h-8 text-xs">
                            {deletingId === appointment.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            <span className="ml-1 hidden sm:inline">Révoquer</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="mx-2 sm:mx-4 max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-sm sm:text-base">Révoquer l'accès</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm">
                              Êtes-vous sûr de vouloir révoquer l'accès de {appointment.name} ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto text-sm">Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(appointment.id)}
                              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm"
                            >
                              Révoquer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

