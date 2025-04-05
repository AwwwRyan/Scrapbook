"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AnalyticsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4 text-pink-600 hover:text-pink-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            Analytics
          </h1>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-pink-200 shadow-md">
          {/* Analytics content will go here */}
          <p className="text-gray-500 text-center">Analytics dashboard coming soon...</p>
        </div>
      </div>
    </div>
  )
} 