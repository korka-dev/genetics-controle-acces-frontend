"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api"
import type { FormDataResponse } from "@/lib/types"
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from "lucide-react"

interface CalendarViewProps {
  isOpen: boolean
  onClose: () => void
}

export default function CalendarView({ isOpen, onClose }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<FormDataResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchAppointments()
    }
  }, [isOpen])

  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const response = await apiService.getAllForms()
      if (response.success && response.data) {
        setAppointments(response.data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des accès:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Générer les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    // Compléter avec les jours du mois suivant
    const remainingDays = 42 - days.length // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false })
    }

    return days
  }

  // Obtenir les accès pour une date donnée
  const getAccessForDate = (date: Date) => {
    const dateStr = date.toDateString()
    return appointments.filter((apt) => {
      const createdDate = new Date(apt.created_at)
      const expiryDate = new Date(apt.expires_at)

      // Accès créés ce jour ou qui expirent ce jour
      return createdDate.toDateString() === dateStr || expiryDate.toDateString() === dateStr
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="h-5 w-5" />
              Calendrier des accès résidentiels
            </CardTitle>
            <Button variant="ghost" className="text-white hover:bg-orange-700" onClick={onClose}>
              ✕ Fermer
            </Button>
          </div>
          <p className="text-orange-100 text-sm">Visualisez les accès programmés et leurs échéances</p>
        </CardHeader>

        <div className="p-4 bg-orange-50 border-b border-orange-200">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateMonth("prev")} className="border-orange-200">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" onClick={() => navigateMonth("next")} className="border-orange-200">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4 overflow-y-auto flex-1">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((day, index) => {
              const dayAccess = getAccessForDate(day.date)
              const activeAccess = dayAccess.filter((apt) => new Date(apt.expires_at) > new Date())
              const expiredAccess = dayAccess.filter((apt) => new Date(apt.expires_at) <= new Date())

              return (
                <div
                  key={index}
                  className={`
                    min-h-[100px] p-2 border border-gray-200 rounded-lg
                    ${day.isCurrentMonth ? "bg-white" : "bg-gray-50"}
                    ${isToday(day.date) ? "ring-2 ring-orange-500 bg-orange-50" : ""}
                    hover:bg-orange-50 transition-colors
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`
                      text-sm font-medium
                      ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                      ${isToday(day.date) ? "text-orange-600 font-bold" : ""}
                    `}
                    >
                      {day.date.getDate()}
                    </span>
                    {dayAccess.length > 0 && (
                      <div className="flex gap-1">
                        {activeAccess.length > 0 && (
                          <div
                            className="w-2 h-2 bg-green-500 rounded-full"
                            title={`${activeAccess.length} accès actifs`}
                          />
                        )}
                        {expiredAccess.length > 0 && (
                          <div
                            className="w-2 h-2 bg-red-500 rounded-full"
                            title={`${expiredAccess.length} accès expirés`}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Accès du jour */}
                  <div className="space-y-1">
                    {dayAccess.slice(0, 3).map((apt) => {
                      const isExpired = new Date(apt.expires_at) <= new Date()
                      const isCreatedToday = new Date(apt.created_at).toDateString() === day.date.toDateString()
                      const isExpiringToday = new Date(apt.expires_at).toDateString() === day.date.toDateString()

                      return (
                        <div
                          key={apt.id}
                          className={`
                            text-xs p-1 rounded border-l-2
                            ${isExpired ? "bg-red-50 border-red-400 text-red-700" : "bg-green-50 border-green-400 text-green-700"}
                          `}
                          title={`${apt.name} - ${apt.phone}`}
                        >
                          <div className="flex items-center gap-1">
                            {isCreatedToday && <User className="h-3 w-3" />}
                            {isExpiringToday && <Clock className="h-3 w-3" />}
                            <span className="truncate font-medium">{apt.name}</span>
                          </div>
                          <div className="text-xs opacity-75">
                            {isCreatedToday && "Nouvel accès"}
                            {isExpiringToday && "Expire aujourd'hui"}
                          </div>
                        </div>
                      )
                    })}
                    {dayAccess.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">+{dayAccess.length - 3} autres</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Légende */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Légende</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <span>Nouvel accès créé</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span>Accès expire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Accès actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Accès expirés</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
