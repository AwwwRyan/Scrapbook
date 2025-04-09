"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { authApi } from "@/lib/api/auth"
import { Heart, Sparkles } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { toast } from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { setToken, isAuthenticated } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleRedirect = async () => {
      if (isAuthenticated) {
        const redirectPath = sessionStorage.getItem('redirectAfterLogin')
        console.log('Attempting to redirect to:', redirectPath || '/')
        
        try {
          await router.push(redirectPath || '/')
          sessionStorage.removeItem('redirectAfterLogin')
        } catch (error) {
          console.error('Redirection failed:', error)
          // Fallback to window.location if router fails
          window.location.href = redirectPath || '/'
        }
      }
    }

    handleRedirect()
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await authApi.login(formData)
      
      if (response.access) {
        setToken(response.access)
        toast.success('Login successful')
        
        // Get the redirect path
        const redirectPath = sessionStorage.getItem('redirectAfterLogin')
        sessionStorage.removeItem('redirectAfterLogin')
        
        // Redirect to the stored path or default to profile
        router.push(redirectPath || '/')
      } else {
        throw new Error('No access token received')
      }
    } catch (err) {
      console.error('Login error:', err)
      toast.error('Invalid credentials')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  // If already authenticated, don't show login page
  if (isAuthenticated) {
    return <div>Redirecting...</div>
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

      <Card className="w-[400px] p-8 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Sparkles className="text-pink-500 mr-2" />
            <Heart className="text-pink-400" />
            <Sparkles className="text-pink-500 ml-2" />
          </div>
          <h1 className="text-2xl font-bold text-pink-600 tracking-wide">Welcome Back!</h1>
          <p className="text-purple-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-700 font-medium">
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
              <Label htmlFor="password" className="text-purple-700 font-medium">
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

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-pink-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-purple-500">New here?</span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/register")}
              className="w-full bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50 font-medium py-2 rounded-lg transition-all duration-300"
              variant="outline"
            >
              <Heart className="w-4 h-4 mr-2" />
              Register
            </Button>
          </div>
        </form>
      </Card>
    </div></>
  )
}

