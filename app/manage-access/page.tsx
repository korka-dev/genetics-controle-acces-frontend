"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FormsList from "@/components/forms-list";

export default function ManageAccess() {
  const [refreshTrigger] = useState(0);
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // Navigue vers la page précédente
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b233a]">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 max-w-7xl">
        {/* Bouton de retour pour la version mobile */}
        <div className="sm:hidden mb-4">
          <Button
            onClick={handleGoBack}
            variant="default"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>

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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Gérer les Accès</h1>
              <p className="text-sm sm:text-base text-yellow-500 font-semibold">
                Genetics-Services
              </p>
            </div>
          </div>
        </div>

        <FormsList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
