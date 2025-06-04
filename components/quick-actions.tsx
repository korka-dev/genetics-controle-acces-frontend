"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, RefreshCw, Search, Home, Shield } from "lucide-react";

interface QuickActionsProps {
  onCreateAppointment: () => void;
  onRefreshData: () => void;
  onOpenSearch?: () => void;
  onOpenCalendar?: () => void;
}

export default function QuickActions({
  onCreateAppointment,
  onRefreshData,
  onOpenSearch,
  onOpenCalendar,
}: QuickActionsProps) {
  const handleViewCalendar = () => {
    if (onOpenCalendar) {
      onOpenCalendar();
    }
  };

  const handleSearchAppointments = () => {
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  const handleAnalytics = () => {
    console.log("Affichage des analytics de sécurité...");
  };

  const actions = [
    {
      title: "Nouvel Accès",
      description: "Créer un code d'accès pour un invité",
      icon: Plus,
      style: { backgroundColor: '#427bb3' },
      hoverStyle: { backgroundColor: '#1a3a5a' },
      onClick: onCreateAppointment,
    },
    {
      title: "Rechercher",
      description: "Rechercher un invité ou un accès",
      icon: Search,
      style: { backgroundColor: '#42adb3' },
      hoverStyle: { backgroundColor: '#1a3a5a' },
      onClick: handleSearchAppointments,
    },
    {
      title: "Calendrier",
      description: "Planning des accès résidentiels",
      icon: Calendar,
      style: { backgroundColor: '#42b37a' },
      hoverStyle: { backgroundColor: '#1a3a5a' },
      onClick: handleViewCalendar,
    },
    {
      title: "Sécurité",
      description: "Rapports et analytics de sécurité",
      icon: Shield,
      style: { backgroundColor: '#c49247' },
      hoverStyle: { backgroundColor: '#1a3a5a' },
      onClick: handleAnalytics,
    },
  ];

  return (
    <Card className="border-yellow-200 shadow-lg mb-4 sm:mb-6">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900 flex items-center gap-2">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              <span className="hidden sm:inline">Gestion des Accès Résidentiels</span>
              <span className="sm:hidden">Accès Résidentiels</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base mt-1">
              <span className="hidden md:inline">Contrôlez l'accès à votre résidence avec des QR codes sécurisés</span>
              <span className="md:hidden">QR codes sécurisés pour votre résidence</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshData}
              className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 h-8 sm:h-9 text-xs sm:text-sm"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Actualiser</span>
              <span className="sm:hidden">Actualiser</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              style={action.style}
              className={`text-white h-auto p-3 sm:p-4 md:p-5 flex flex-col items-center gap-1.5 sm:gap-2 hover:scale-105 transition-all duration-200 rounded-lg`}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = action.hoverStyle.backgroundColor;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = action.style.backgroundColor;
              }}
            >
              <action.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
              <div className="text-center">
                <div className="font-semibold text-xs sm:text-sm md:text-base leading-tight">
                  {action.title}
                </div>
                <div className="text-xs opacity-90 hidden md:block mt-1 leading-tight">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

