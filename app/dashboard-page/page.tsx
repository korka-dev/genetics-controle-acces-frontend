"use client";

import React from 'react';
import QuickActions from "@/components/quick-actions";

export default function DashboardPage() {
  const handleCreateAppointment = () => {
    console.log("Créer un nouvel accès");
  };

  const handleRefreshData = () => {
    console.log("Actualiser les données");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b233a]">
      <div className="container mx-auto px-4 py-8">
        {/* Conteneur flexible pour le logo et le titre */}
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Tableau de Bord</h1>
              <p className="text-sm sm:text-base text-yellow-500 font-semibold">
                Genetics-Services
              </p>
            </div>
          </div>
        </div>

        <QuickActions
          onCreateAppointment={handleCreateAppointment}
          onRefreshData={handleRefreshData}
        />
      </div>
    </div>
  );
}

