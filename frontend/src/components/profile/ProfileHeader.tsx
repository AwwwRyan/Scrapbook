"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { movieApi } from "@/lib/api/movies"
import { User, Heart, Sparkles, Star, Film, Calendar, Pencil } from "lucide-react"
import { authApi } from "@/lib/api/auth"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface UserStats {
  total_movies_watched: number
  total_reviews: number
  average_rating: number
  watchlist_count: number
  watch_later_count: number
}

interface StatCardProps {
  title: string
  value: number | string
  suffix?: string
  icon: React.ReactNode
}

// Add user profile interface
interface UserProfile {
  id: number
  username: string
  name: string
  gender: string
  dob: string
  email: string
  avatar_url?: string
}

export default function ProfileHeader() {
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both stats and user profile in parallel
        const [statsData, profileData] = await Promise.all([movieApi.getUserStatistics(), authApi.getUserProfile()])

        setStats(statsData)
        setUserProfile(profileData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format date of birth
  const formatDOB = (dob: string) => {
    try {
      return format(new Date(dob), "MMMM d, yyyy")
    } catch {
      return "N/A"
    }
  }

  return (
    <Card className="p-8 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute -top-12 -right-12 text-pink-100 opacity-20 transform rotate-12">
        <Sparkles size={100} />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-pink-200 shadow-md">
              <AvatarImage
                src={userProfile?.avatar_url || "/default-avatar.png"}
                alt={userProfile?.name || "Profile"}
                onError={(e) => {
                  console.error("Avatar image failed to load:", {
                    originalSrc: e.currentTarget.src,
                    timestamp: new Date().toISOString(),
                  })
                  // Fallback to UI Avatars with proper error handling
                  const fallbackUrl = `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(userProfile?.name || "User")}`
                  if (e.currentTarget.src !== fallbackUrl) {
                    e.currentTarget.src = fallbackUrl
                  }
                }}
              />
              <AvatarFallback className="bg-gradient-to-br from-pink-300 to-purple-300">
                <User className="w-12 h-12 text-white" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md border border-pink-200">
              <Sparkles className="w-5 h-5 text-pink-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              {userProfile?.name || "Loading..."}
            </h1>
            <div className="space-y-1">
              <p className="text-purple-700 font-medium">@{userProfile?.username}</p>
              <p className="text-sm text-pink-600">{userProfile?.email}</p>
              <div className="flex gap-2 text-sm text-purple-600 items-center">
                <span>{userProfile?.gender}</span>
                <span className="text-pink-300">•</span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-pink-400" />
                  Born {userProfile?.dob ? formatDOB(userProfile.dob) : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.push("/profile/edit")}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-6 shadow-md transition-all duration-300"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <StatCard
            title="Movies Watched"
            value={stats.total_movies_watched}
            icon={<Film className="w-5 h-5 text-pink-500" />}
          />
          <StatCard
            title="Reviews Written"
            value={stats.total_reviews}
            icon={<Star className="w-5 h-5 text-pink-500 fill-pink-500" />}
          />
          <StatCard
            title="Average Rating"
            value={stats.average_rating.toFixed(1)}
            suffix="/5"
            icon={<Star className="w-5 h-5 text-pink-500 fill-pink-500" />}
          />
          <StatCard
            title="Watch Later"
            value={stats.watch_later_count}
            icon={<Heart className="w-5 h-5 text-pink-500" />}
          />
        </div>
      )}
    </Card>
  )
}

function StatCard({ title, value, suffix = "", icon }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-pink-50 p-4 rounded-xl text-center border border-pink-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-center mb-2">{icon}</div>
      <h3 className="text-purple-700 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1 text-pink-600">
        {value}
        {suffix}
      </p>
    </div>
  )
}