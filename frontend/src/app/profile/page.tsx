"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileHeader from "@/components/profile/ProfileHeader"
import RecentReviews from "@/components/profile/RecentReviews"
import WatchlistSection from "@/components/profile/WatchlistSection"
import AnalyticsSection from "@/components/profile/AnalyticsSection"
import { authApi } from "@/lib/api/auth"
import axios from "axios"
import { Heart, Sparkles, Film, Star, BarChart3, CheckCircle, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApiError {
  response?: {
    status: number
    data: any
  }
  message: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        // Store the current path for redirect after login
        sessionStorage.setItem("redirectAfterLogin", "/profile")
        router.push("/login")
      } else {
        try {
          // You can add an API call here to check if the user has completed their profile
          const userProfile = await authApi.getUserProfile()
          setLoading(false)
        } catch (error: unknown) {
          console.error("Error fetching user profile:", error)

          // Type guard to check if error is AxiosError
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
              sessionStorage.setItem("redirectAfterRegister", "/profile")
              router.push("/register")
            }
          } else {
            // Handle other types of errors
            console.error("Unexpected error:", error)
          }
        }
      }
    }

    checkAuth()
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-center p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-md border-2 border-pink-200">
          <div className="animate-spin text-pink-500 mb-4">
            <Sparkles size={40} />
          </div>
          <p className="text-purple-700 font-medium">Loading your profile...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 py-8 px-4" suppressHydrationWarning>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-300 opacity-30">
          <Sparkles size={40} />
        </div>
        <div className="absolute bottom-20 right-10 text-purple-300 opacity-30">
          <Sparkles size={40} />
        </div>
        <div className="absolute top-1/4 right-1/4 text-pink-200 opacity-20">
          <Heart size={60} />
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-purple-200 opacity-20">
          <Heart size={60} />
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
        <div 
              onClick={() => router.push('/')}
              className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 flex items-center cursor-pointer hover:scale-105 transition-transform"
            >
              Scrapbook
              <Sparkles className="ml-2 text-pink-500" size={24} />
            </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-2 border-pink-200 hover:bg-pink-50 text-pink-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <ProfileHeader />

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="flex w-full bg-white/80 backdrop-blur-sm border-2 border-pink-200 p-2 rounded-full h-14">
            <TabsTrigger value="overview" className="flex-1 flex items-center justify-center h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-full transition-all duration-300">
              <Film className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 flex items-center justify-center h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-full transition-all duration-300">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="flex-1 flex items-center justify-center h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-full transition-all duration-300">
              <CheckCircle className="w-4 h-4 mr-2" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="watchlater" className="flex-1 flex items-center justify-center h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-full transition-all duration-300">
              <Heart className="w-4 h-4 mr-2" />
              Watch Later
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 flex items-center justify-center h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-full transition-all duration-300">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                <RecentReviews />
                <WatchlistSection showWatchedOnly={true} />
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-purple-700">Recent Reviews</h2>
                <Button
                  variant="outline"
                  onClick={() => router.push('/profile/reviews')}
                  className="border-2 border-pink-200 hover:bg-pink-50"
                >
                  Manage All Reviews
                </Button>
              </div>
              <RecentReviews fullView />
            </TabsContent>

            <TabsContent value="watchlist">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-purple-700">Watched Movies</h2>
                <Button
                  variant="outline"
                  onClick={() => router.push('/profile/watched')}
                  className="border-2 border-pink-200 hover:bg-pink-50"
                >
                  View All Watched Movies
                </Button>
              </div>
              <WatchlistSection showWatchedOnly={true} />
            </TabsContent>

            <TabsContent value="watchlater">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-purple-700">Watch Later</h2>
                <Button
                  variant="outline"
                  onClick={() => router.push('/profile/watchlist')}
                  className="border-2 border-pink-200 hover:bg-pink-50"
                >
                  Manage Watch Later
                </Button>
              </div>
              <WatchlistSection showWatchedOnly={false} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}