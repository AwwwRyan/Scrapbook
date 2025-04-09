"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { authApi } from "@/lib/api/auth"
import { Heart, Sparkles, UserPlus, Calendar, Mail, User, Lock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    gender: "Male", // Default value
    dob: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await authApi.register(formData)
      // The token is already saved in localStorage by the authApi.register function
      
      // Get the redirect path
      const redirectPath = sessionStorage.getItem('redirectAfterRegister')
      sessionStorage.removeItem('redirectAfterRegister')
      
      // Redirect to the stored path or default to profile
      router.push(redirectPath || '/')
    } catch (err) {
      console.error("Registration failed:", err)
      toast.error("Registration failed. Please try again.")
    }
  }

  return (<>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100" suppressHydrationWarning>
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

      <Card className="w-[450px] p-8 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm my-10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Sparkles className="text-pink-500 mr-2" />
            <Heart className="text-pink-400" />
            <Sparkles className="text-pink-500 ml-2" />
          </div>
          <h1 className="text-2xl font-bold text-pink-600 tracking-wide">Join Us!</h1>
          <p className="text-purple-500 text-sm mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-purple-700 font-medium flex items-center">
                <User className="w-4 h-4 mr-2 text-pink-400" />
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg"
                placeholder="Choose a username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-700 font-medium flex items-center">
                <Mail className="w-4 h-4 mr-2 text-pink-400" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg"
                placeholder="your@email.com"
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg"
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-purple-700 font-medium">
                Gender
              </Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
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
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg mt-4"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Register
            </Button>

            <div className="text-center mt-4">
              <Button
                onClick={() => router.push("/login")}
                variant="link"
                className="text-pink-600 hover:text-pink-700"
              >
                <Heart className="w-4 h-4 mr-1" />
                Already have an account? Login
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div></>
  )
}

