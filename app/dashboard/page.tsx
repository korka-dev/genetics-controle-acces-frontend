"use client"

import { useState } from "react"
import StatsDashboard from "@/components/stats-dashboard"
import RecentActivity from "@/components/recent-activity"
import { QrCode, FileText, BarChart3, Menu, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const router = useRouter()

  const handleRefreshData = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleDashboardClick = () => {
    router.push("/dashboard-page")
  }

  const handleCreateClick = () => {
    router.push("/create")
  }

  const handleManageClick = () => {
    router.push("/manage")
  }

  const handleAccountClick = () => {
    router.push("/account")
  }

  const handleLogout = () => {
    router.push("/connexion")
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#071f37' }}>
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="text-center">
              <img
                src="/welqo.jpeg"
                alt="Welqo Logo"
                className="w-24 sm:w-32 h-auto mx-auto mb-4"
              />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                Contrôle d'Accès Résidentiel
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-yellow-500 font-bold mt-1">
                Genetics-Services
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white px-2 sm:px-4 max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10">
            Gérez l'accès à votre résidence avec des QR codes sécurisés pour vos invités
          </p>
        </div>

        {/* Navigation Bar */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          {/* Desktop Navigation - Masqué sur mobile */}
          <div className="hidden md:grid grid-cols-4 gap-2">
            <Button
              onClick={handleDashboardClick}
              className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-yellow-500 hover:text-white text-sm lg:text-base font-medium transition-all duration-200 border border-yellow-200 h-12 lg:h-14 shadow-sm rounded-lg"
            >
              <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="hidden lg:inline">Tableau de Bord</span>
              <span className="lg:hidden">Dashboard</span>
            </Button>
            <Button
              onClick={handleCreateClick}
              className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-yellow-500 hover:text-white text-sm lg:text-base font-medium transition-all duration-200 border border-yellow-200 h-12 lg:h-14 shadow-sm rounded-lg"
            >
              <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="hidden lg:inline">Nouvel Accès</span>
              <span className="lg:hidden">Créer</span>
            </Button>
            <Button
              onClick={handleManageClick}
              className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-yellow-500 hover:text-white text-sm lg:text-base font-medium transition-all duration-200 border border-yellow-200 h-12 lg:h-14 shadow-sm rounded-lg"
            >
              <QrCode className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="hidden lg:inline">Gérer Accès</span>
              <span className="lg:hidden">Gérer</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-yellow-500 hover:text-white text-sm lg:text-base font-medium transition-all duration-200 border border-yellow-200 h-12 lg:h-14 shadow-sm rounded-lg"
                >
                  <User className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="hidden lg:inline">Profil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={handleAccountClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Compte</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tablet Navigation - Visible sur tablette uniquement */}
          <div className="hidden sm:grid md:hidden grid-cols-4 gap-2">
            <Button
              onClick={handleDashboardClick}
              className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-yellow-500 hover:text-white text-sm font-medium transition-all duration-200 border border-yellow-200 h-11 shadow-sm rounded-lg"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            <Button
              onClick={handleCreateClick}
              className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-yellow-500 hover:text-white text-sm font-medium transition-all duration-200 border border-yellow-200 h-11 shadow-sm rounded-lg"
            >
              <FileText className="h-4 w-4" />
              <span>Créer</span>
            </Button>
            <Button
              onClick={handleManageClick}
              className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-yellow-500 hover:text-white text-sm font-medium transition-all duration-200 border border-yellow-200 h-11 shadow-sm rounded-lg"
            >
              <QrCode className="h-4 w-4" />
              <span>Gérer</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-yellow-500 hover:text-white text-sm font-medium transition-all duration-200 border border-yellow-200 h-11 shadow-sm rounded-lg"
                >
                  <User className="h-4 w-4" />
                  <span>Profil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={handleAccountClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Compte</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation - Visible uniquement sur mobile */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-yellow-200 text-yellow-500 h-12 text-base font-medium hover:bg-yellow-50 transition-all duration-200"
                >
                  <Menu className="h-5 w-5 mr-2" />
                  Menu Navigation
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[400px] rounded-t-xl">
                <SheetTitle className="sr-only">Menu de Navigation</SheetTitle>
                <div className="grid grid-cols-1 gap-3 mt-6">
                  <Button
                    onClick={handleDashboardClick}
                    className="flex items-center justify-start gap-3 p-4 rounded-lg border border-yellow-200 hover:bg-yellow-500 hover:text-white text-base font-medium transition-all duration-200 bg-white text-gray-800"
                  >
                    <BarChart3 className="h-6 w-6" />
                    Tableau de Bord
                  </Button>
                  <Button
                    onClick={handleCreateClick}
                    className="flex items-center justify-start gap-3 p-4 rounded-lg border border-yellow-200 hover:bg-yellow-500 hover:text-white text-base font-medium transition-all duration-200 bg-white text-gray-800"
                  >
                    <FileText className="h-6 w-6" />
                    Créer un accès
                  </Button>
                  <Button
                    onClick={handleManageClick}
                    className="flex items-center justify-start gap-3 p-4 rounded-lg border border-yellow-200 hover:bg-yellow-500 hover:text-white text-base font-medium transition-all duration-200 bg-white text-gray-800"
                  >
                    <QrCode className="h-6 w-6" />
                    Gérer les accès
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="flex items-center justify-start gap-3 p-4 rounded-lg border border-yellow-200 hover:bg-yellow-500 hover:text-white text-base font-medium transition-all duration-200 bg-white text-gray-800 w-full"
                      >
                        <User className="h-6 w-6" />
                        Profil
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 ml-4">
                      <DropdownMenuItem onClick={handleAccountClick}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Compte</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Déconnexion</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="w-full">
          <StatsDashboard key={refreshTrigger} />
        </div>

        {/* Recent Activity */}
        <div className="mt-6 sm:mt-8 md:mt-10 w-full">
          <RecentActivity key={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
