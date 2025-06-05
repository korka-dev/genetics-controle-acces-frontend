"use client";

import React from "react";
import FormCreator from "@/components/form-creator";

export default function CreateAccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b233a] to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FormCreator />
      </div>
    </div>
  );
}
