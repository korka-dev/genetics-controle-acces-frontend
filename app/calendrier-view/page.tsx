"use client";

import React from "react";
import CalendarView from "@/components/calendar-view";

export default function CalendarViewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b233a] to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <CalendarView />
      </div>
    </div>
  );
}
