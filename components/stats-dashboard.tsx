"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { apiService } from "@/lib/api"
import type { FormDataResponse } from "@/lib/types"
import { Calendar, QrCode, TrendingUp, Clock, CheckCircle2, AlertCircle, CalendarDays } from "lucide-react"

interface StatsData {
  totalAppointments: number
  activeQRCodes: number
  todayAppointments: number
  successRate: number
  expiredToday: number
  upcomingExpiry: number
  uniquePersons: number
  thisWeekAppointments: number
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<StatsData>({
    totalAppointments: 0,
    activeQRCodes: 0,
    todayAppointments: 0,
    successRate: 0,
    expiredToday: 0,
    upcomingExpiry: 0,
    uniquePersons: 0,
    thisWeekAppointments: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const calculateStats = (appointments: FormDataResponse[]): StatsData => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    // Rendez-vous total
    const totalAppointments = appointments.length

    // QR codes actifs (non expirés)
    const activeQRCodes = appointments.filter((apt) => new Date(apt.expires_at) > now).length

    // Rendez-vous créés aujourd'hui
    const todayAppointments = appointments.filter((apt) => {
      const createdDate = new Date(apt.created_at)
      return createdDate >= today && createdDate < tomorrow
    }).length

    // Taux de succès (QR codes encore valides / total)
    const successRate = totalAppointments > 0 ? Math.round((activeQRCodes / totalAppointments) * 100) : 0

    // QR codes expirés aujourd'hui
    const expiredToday = appointments.filter((apt) => {
      const expiredDate = new Date(apt.expires_at)
      return expiredDate >= today && expiredDate < tomorrow && expiredDate <= now
    }).length

    // QR codes qui expirent dans les 24h
    const next24h = new Date(now)
    next24h.setHours(now.getHours() + 24)
    const upcomingExpiry = appointments.filter((apt) => {
      const expiredDate = new Date(apt.expires_at)
      return expiredDate > now && expiredDate <= next24h
    }).length

    // Nombre de personnes uniques (basé sur le téléphone)
    const uniquePhones = new Set(appointments.map((apt) => apt.phone))
    const uniquePersons = uniquePhones.size

    // Rendez-vous de cette semaine
    const thisWeekAppointments = appointments.filter((apt) => {
      const createdDate = new Date(apt.created_at)
      return createdDate >= weekStart && createdDate < weekEnd
    }).length

    return {
      totalAppointments,
      activeQRCodes,
      todayAppointments,
      successRate,
      expiredToday,
      upcomingExpiry,
      uniquePersons,
      thisWeekAppointments,
    }
  }

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const response = await apiService.getAllForms()
      if (response.success && response.data) {
        const calculatedStats = calculateStats(response.data)
        setStats(calculatedStats)
      }
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Actualiser les stats toutes les 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      title: "Accès Total",
      value: isLoading ? "..." : stats.totalAppointments.toString(),
      subtitle: `${stats.thisWeekAppointments} cette semaine`,
      icon: Calendar,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: stats.thisWeekAppointments > 0 ? "positive" : "neutral",
    },
    {
      title: "QR Actifs",
      value: isLoading ? "..." : stats.activeQRCodes.toString(),
      subtitle: `${stats.upcomingExpiry} expirent bientôt`,
      icon: QrCode,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: stats.upcomingExpiry > 0 ? "warning" : "positive",
    },
    {
      title: "Aujourd'hui",
      value: isLoading ? "..." : stats.todayAppointments.toString(),
      subtitle: `${stats.expiredToday} expirés`,
      icon: CalendarDays,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: stats.todayAppointments > stats.expiredToday ? "positive" : "neutral",
    },
    {
      title: "Taux Succès",
      value: isLoading ? "..." : `${stats.successRate}%`,
      subtitle: `${stats.uniquePersons} personnes`,
      icon: TrendingUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: stats.successRate >= 80 ? "positive" : stats.successRate >= 60 ? "warning" : "negative",
    },
  ]

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "positive":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "positive":
        return <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
      case "warning":
        return <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
      case "negative":
        return <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
      default:
        return <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
    }
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className="border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <CardContent className="p-2 sm:p-3 md:p-4 lg:p-6">
            <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
              {/* Icône */}
              <div className={`p-1.5 sm:p-2 md:p-3 ${stat.iconBg} rounded-full`}>
                <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 ${stat.iconColor}`} />
              </div>

              {/* Titre */}
              <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 leading-tight">{stat.title}</p>

              {/* Valeur principale */}
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-none">
                {stat.value}
              </p>

              {/* Sous-titre avec tendance */}
              <div className={`flex items-center justify-center gap-1 text-xs sm:text-sm ${getTrendColor(stat.trend)}`}>
                {getTrendIcon(stat.trend)}
                <span className="leading-tight text-center">{stat.subtitle}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
