"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FormCreator from "@/components/form-creator"
import FormsList from "@/components/forms-list"
import StatsDashboard from "@/components/stats-dashboard"
import QuickActions from "@/components/quick-actions"
import RecentActivity from "@/components/recent-activity"
import SearchAppointments from "@/components/search-appointments"
import CalendarView from "@/components/calendar-view"
import { QrCode, FileText, BarChart3, Menu, HomeIcon, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchOpen, setSearchOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const router = useRouter()

  const handleFormCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleRefreshData = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleCreateAppointment = () => {
    setActiveTab("create")
  }

  const handleOpenSearch = () => {
    setSearchOpen(true)
  }

  const handleOpenCalendar = () => {
    setCalendarOpen(true)
  }

  const handleLogin = () => {
    router.push("/connexion")
  }

  const handleSignup = () => {
    router.push("/register")
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
                className="w-32 h-auto mx-auto mb-4"
              />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                Contrôle d'Accès Résidentiel
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-yellow-500 font-bold mt-1">
                Genetic-Service
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white px-2 sm:px-4 max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10">
            Gérez l'accès à votre résidence avec des QR codes sécurisés pour vos invités
          </p>

          {/* Boutons d'authentification */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 px-4 sm:px-0">
            <Button
              onClick={handleLogin}
              variant="outline"
              className="w-full sm:w-auto border-2 border-yellow-300 text-yellow-500 hover:bg-yellow-50 hover:border-yellow-400 hover:scale-105 transition-all duration-300 h-12 sm:h-14 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg font-semibold min-w-[160px] sm:min-w-[180px] md:min-w-[200px] rounded-xl shadow-md hover:shadow-lg"
            >
              <LogIn className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 sm:mr-3" />
              Connexion
            </Button>
            <Button
              onClick={handleSignup}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white hover:scale-105 transition-all duration-300 h-12 sm:h-14 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl min-w-[160px] sm:min-w-[180px] md:min-w-[200px] rounded-xl"
            >
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 sm:mr-3" />
              Inscription
            </Button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard key={refreshTrigger} />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tabs - Masqué sur mobile */}
          <div className="hidden md:block">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-yellow-200 h-12 lg:h-14 shadow-sm">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-sm lg:text-base font-medium transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline">Tableau de Bord</span>
                <span className="lg:hidden">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-sm lg:text-base font-medium transition-all duration-200"
              >
                <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline">Nouvel Accès</span>
                <span className="lg:hidden">Créer</span>
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-sm lg:text-base font-medium transition-all duration-200"
              >
                <QrCode className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline">Gérer Accès</span>
                <span className="lg:hidden">Gérer</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tablet Tabs - Visible sur tablette uniquement */}
          <div className="hidden sm:block md:hidden">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-yellow-200 h-11 shadow-sm">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-sm font-medium transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-sm font-medium transition-all duration-200"
              >
                <FileText className="h-4 w-4" />
                <span>Créer</span>
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-sm font-medium transition-all duration-200"
              >
                <QrCode className="h-4 w-4" />
                <span>Gérer</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Mobile Navigation - Visible uniquement sur mobile */}
          <div className="sm:hidden mb-4">
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
              <SheetContent side="bottom" className="h-[350px] rounded-t-xl">
                <div className="grid grid-cols-1 gap-3 mt-6">
                  <TabsTrigger
                    value="dashboard"
                    className="flex items-center justify-center gap-3 p-4 rounded-lg border border-yellow-200 data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-base font-medium transition-all duration-200"
                  >
                    <BarChart3 className="h-6 w-6" />
                    Tableau de Bord
                  </TabsTrigger>
                  <TabsTrigger
                    value="create"
                    className="flex items-center justify-center gap-3 p-4 rounded-lg border border-yellow-200 data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-base font-medium transition-all duration-200"
                  >
                    <FileText className="h-6 w-6" />
                    Créer un accès
                  </TabsTrigger>
                  <TabsTrigger
                    value="manage"
                    className="flex items-center justify-center gap-3 p-4 rounded-lg border border-yellow-200 data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-base font-medium transition-all duration-200"
                  >
                    <QrCode className="h-6 w-6" />
                    Gérer les accès
                  </TabsTrigger>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <TabsContent value="dashboard" className="mt-3 sm:mt-4 md:mt-6">
            <div className="space-y-4 sm:space-y-6">
              <QuickActions
                onCreateAppointment={handleCreateAppointment}
                onRefreshData={handleRefreshData}
                onOpenSearch={handleOpenSearch}
                onOpenCalendar={handleOpenCalendar}
              />
              <RecentActivity key={refreshTrigger} />
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-3 sm:mt-4 md:mt-6">
            <div className="flex justify-center px-1 sm:px-2">
              <FormCreator onFormCreated={handleFormCreated} />
            </div>
          </TabsContent>

          <TabsContent value="manage" className="mt-3 sm:mt-4 md:mt-6">
            <FormsList refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Composants modaux */}
      <SearchAppointments isOpen={searchOpen} onClose={() => setSearchOpen(false)} onRefresh={handleRefreshData} />
      <CalendarView isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </div>
  )
}
