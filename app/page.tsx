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
import { QrCode, FileText, BarChart3, Menu, HomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchOpen, setSearchOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 max-w-7xl">
        {/* Header - Optimisé pour tous les écrans */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 md:p-4 bg-orange-600 rounded-full">
              <HomeIcon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                Contrôle d'Accès Résidentiel
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-orange-600 font-bold mt-1">
                Genetic-Service
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 px-2 sm:px-4 max-w-4xl mx-auto">
            Gérez l'accès à votre résidence avec des QR codes sécurisés pour vos invités
          </p>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard key={refreshTrigger} />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tabs - Masqué sur mobile */}
          <div className="hidden md:block">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-orange-200 h-12 lg:h-14">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-sm lg:text-base font-medium"
              >
                <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline">Tableau de Bord</span>
                <span className="lg:hidden">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-sm lg:text-base font-medium"
              >
                <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline">Nouvel Accès</span>
                <span className="lg:hidden">Créer</span>
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-sm lg:text-base font-medium"
              >
                <QrCode className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline">Gérer Accès</span>
                <span className="lg:hidden">Gérer</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tablet Tabs - Visible sur tablette uniquement */}
          <div className="hidden sm:block md:hidden">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-orange-200 h-11">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-sm font-medium"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                <span>Créer</span>
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-sm font-medium"
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
                  className="w-full border-orange-200 text-orange-600 h-12 text-base font-medium"
                >
                  <Menu className="h-5 w-5 mr-2" />
                  Menu Navigation
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[350px] rounded-t-xl">
                <div className="grid grid-cols-1 gap-3 mt-6">
                  <TabsTrigger
                    value="dashboard"
                    className="flex items-center justify-center gap-3 p-4 rounded-lg border border-orange-200 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-base font-medium"
                  >
                    <BarChart3 className="h-6 w-6" />
                    Tableau de Bord
                  </TabsTrigger>
                  <TabsTrigger
                    value="create"
                    className="flex items-center justify-center gap-3 p-4 rounded-lg border border-orange-200 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-base font-medium"
                  >
                    <FileText className="h-6 w-6" />
                    Créer un accès
                  </TabsTrigger>
                  <TabsTrigger
                    value="manage"
                    className="flex items-center justify-center gap-3 p-4 rounded-lg border border-orange-200 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-base font-medium"
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
