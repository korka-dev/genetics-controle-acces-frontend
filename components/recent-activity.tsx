"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/lib/api";
import type { FormDataResponse } from "@/lib/types";
import { Clock, User, Phone, QrCode, AlertTriangle } from "lucide-react";

export default function RecentActivity() {
  const [recentAppointments, setRecentAppointments] = useState<FormDataResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchRecentActivity = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllForms();
      if (response.success && response.data) {
        // Trier par date de création (plus récent en premier) et prendre les 5 derniers
        const sorted = response.data
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setRecentAppointments(sorted);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'activité récente:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;

    return date.toLocaleDateString("fr-FR");
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const isExpiringSoon = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffInHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffInHours > 0 && diffInHours <= 2; // Expire dans les 2 prochaines heures
  };

  const handleActivityClick = () => {
    router.push("/manage-access");
  };

  if (isLoading) {
    return (
      <Card className="border-yellow-200 shadow-lg w-full">
        <CardHeader style={{ backgroundColor: '#FFF5CC' }}>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Clock className="h-5 w-5 text-gray-900" />
            <span className="text-sm sm:text-base md:text-lg">Activité Récente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 shadow-lg w-full">
      <CardHeader style={{ backgroundColor: '#faba34' }}>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Clock className="h-5 w-5 text-gray-900" />
          <span className="text-sm sm:text-base md:text-lg">Activité Récente</span>
        </CardTitle>
        <CardDescription className="text-gray-700 text-xs sm:text-sm md:text-base">Les derniers rendez-vous créés</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {recentAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm sm:text-base">Aucune activité récente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                onClick={handleActivityClick}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-yellow-50 transition-colors cursor-pointer"
              >
                <div className="p-2 bg-yellow-100 rounded-full">
                  <User className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{appointment.name}</p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                        <Phone className="h-3 w-3" />
                        <span className="truncate">{appointment.phone}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{formatTimeAgo(appointment.created_at)}</p>
                    </div>
                    <div className="flex flex-col gap-1 mt-2 sm:mt-0">
                      {isExpired(appointment.expires_at) ? (
                        <Badge variant="destructive" className="text-xs sm:text-sm">
                          Expiré
                        </Badge>
                      ) : isExpiringSoon(appointment.expires_at) ? (
                        <Badge variant="outline" className="text-xs sm:text-sm border-yellow-300 text-yellow-700 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Expire bientôt</span>
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs sm:text-sm">
                          Actif
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
