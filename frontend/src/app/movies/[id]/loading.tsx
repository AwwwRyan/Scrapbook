import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border-2 border-pink-200 shadow-md">
        <div className="animate-spin text-pink-500">
          <Sparkles size={40} />
        </div>
        <p className="mt-4 text-purple-700">Loading movie details...</p>
      </div>
    </div>
  )
} 