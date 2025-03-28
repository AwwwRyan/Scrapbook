"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/store/auth"
import { toast } from "react-hot-toast"
import type { User } from "@/types/user"
import { Heart, Sparkles, UserPlus, Calendar, Mail, UserIcon, Lock, Trash2, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditProfilePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [userData, setUserData] = useState<Partial<User>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated) {
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No auth token found, redirecting to login") // Debug log
        sessionStorage.setItem("redirectAfterLogin", "/profile/edit")
        router.push("/login")
        return
      }
    }

    // If authenticated, fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const data = await authApi.getUserProfile()
        console.log("Fetched user data:", data)
        setUserData(data)
      } catch (err) {
        console.error("Failed to load user data:", err)
        toast.error("Failed to load user data. Please try logging in again.")

        // Redirect only if there's no valid auth token
        const token = localStorage.getItem("token")
        if (!token) {
          sessionStorage.setItem("redirectAfterLogin", "/profile/edit")
          router.push("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authApi.updateProfile(userData)
      toast.success("Profile updated successfully")
      router.push("/")
    } catch (err) {
      toast.error("Failed to update profile")
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await authApi.deleteProfile()
        localStorage.removeItem("token")
        useAuthStore.getState().setToken(null)
        toast.success("Account deleted successfully")
        router.push("/login")
      } catch (err) {
        toast.error("Failed to delete account")
        console.error(err)
      }
    }
  }

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100">
        <div className="text-center p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-md border-2 border-pink-200">
          <div className="animate-spin text-pink-500 mb-4">
            <Sparkles size={40} />
          </div>
          <p className="text-purple-700 font-medium">Loading your profile...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 py-10">
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

      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-8 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <Sparkles className="text-pink-500 mr-2" />
              <Heart className="text-pink-400" />
              <Sparkles className="text-pink-500 ml-2" />
            </div>
            <h1 className="text-2xl font-bold text-pink-600 tracking-wide">Edit Your Profile</h1>
            <p className="text-purple-500 text-sm mt-1">Update your personal information</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-purple-700 font-medium flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-pink-400" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={userData.username || ""}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-700 font-medium flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-pink-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  value={userData.email || ""}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-700 font-medium flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-pink-400" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={userData.password || ""}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-700 font-medium flex items-center">
                  <UserPlus className="w-4 h-4 mr-2 text-pink-400" />
                  Name
                </Label>
                <Input
                  id="name"
                  value={userData.name || ""}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-purple-700 font-medium">
                  Gender
                </Label>
                <Select
                  value={userData.gender || ""}
                  onValueChange={(value) => setUserData({ ...userData, gender: value })}
                >
                  <SelectTrigger className="w-full border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-pink-200">
                    <SelectItem value="Male" className="text-purple-700 hover:bg-pink-50">
                      Male
                    </SelectItem>
                    <SelectItem value="Female" className="text-purple-700 hover:bg-pink-50">
                      Female
                    </SelectItem>
                    <SelectItem value="Other" className="text-purple-700 hover:bg-pink-50">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="text-purple-700 font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-pink-400" />
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={userData.dob || ""}
                  onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>

                <Button
                  type="button"
                  onClick={handleDelete}
                  variant="outline"
                  className="border-2 border-pink-300 bg-white text-pink-700 hover:bg-pink-50 hover:text-pink-800 font-medium py-2 rounded-lg transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4 mr-2 text-pink-700" />
                  Delete Account
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

