"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { movieApi } from "@/lib/api/movies"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Sparkles, Star, BarChart3, PieChartIcon, Clock, Film } from "lucide-react"

interface GenreAnalytics {
  distribution: Record<string, number>
  favorite_genres: Array<{
    genre: string
    movie_count: number
    average_rating: number
  }>
}

interface RatingAnalytics {
  distribution: Record<string, number>
  rating_trends: {
    last_30_days: number
  }
}

interface WatchHistory {
  timeline: Array<{
    date: string
    movies_watched: number
    movies: Array<{
      id: string
      title: string
      rating?: number
    }>
  }>
  summary: {
    daily_average: number
    total_watch_time: number
  }
}

// Custom colors for charts
const CHART_COLORS = [
  "#FF6B9D", // Pink
  "#9F7AEA", // Purple
  "#F687B3", // Light Pink
  "#B794F4", // Light Purple
  "#FEB2B2", // Salmon
  "#D6BCFA", // Lavender
  "#FBD38D", // Peach
  "#C4B5FD", // Periwinkle
  "#FCA5A5", // Coral
  "#E9D8FD", // Lilac
]

export default function AnalyticsSection() {
  const [genreData, setGenreData] = useState<GenreAnalytics | null>(null)
  const [ratingData, setRatingData] = useState<RatingAnalytics | null>(null)
  const [watchHistory, setWatchHistory] = useState<WatchHistory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [genres, ratings, history] = await Promise.all([
          movieApi.getGenreAnalytics(),
          movieApi.getRatingAnalytics(),
          movieApi.getWatchHistory(),
        ])

        setGenreData(genres)
        setRatingData(ratings)
        setWatchHistory(history)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const transformedGenreData = genreData
    ? Object.entries(genreData.distribution).map(([name, value]) => ({
        name,
        value,
      }))
    : []

  const transformedRatingData = ratingData
    ? Object.entries(ratingData.distribution).map(([name, value]) => ({
        name: name.replace("_stars", "★"),
        value,
      }))
    : []

  return (
    <div className="space-y-6">
              
      <Card className="p-6 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 flex items-center">
          <BarChart3 className="mr-2 text-pink-500" />
          Movie Analytics
        </h2>

        <Tabs defaultValue="genres">
          <TabsList className="flex w-full bg-pink-50 p-2 rounded-full border border-pink-200 mb-6 h-14">
            <TabsTrigger
              value="genres"
              className="flex-1 flex items-center justify-center h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-full transition-all duration-300"
            >
              <PieChartIcon className="w-4 h-5 mr-2" />
              Genres
            </TabsTrigger>
            <TabsTrigger
              value="ratings"
              className="flex-1 flex items-center justify-center h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-full transition-all duration-300"
            >
              <Star className="w-4 h-5 mr-2" />
              Ratings
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-1 flex items-center justify-center h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-full transition-all duration-300"
            >
              <Clock className="w-4 h-5 mr-2" />
              Watch History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="genres">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2 text-pink-500" />
                Genre Distribution
                <Sparkles className="w-4 h-4 ml-2 text-pink-500" />
              </h3>
              <div className="h-[400px] bg-white/70 rounded-xl p-4 border border-pink-100">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transformedGenreData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {transformedGenreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} movies`, "Count"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #F9A8D4",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-purple-600 text-center italic">
                Distribution of movies across different genres in your watchlist
              </p>
            </div>
          </TabsContent>

          <TabsContent value="ratings">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center text-purple-700 flex items-center justify-center">
                <Star className="w-4 h-4 mr-2 text-pink-500 fill-pink-500" />
                Rating Distribution
                <Star className="w-4 h-4 ml-2 text-pink-500 fill-pink-500" />
              </h3>
              <div className="h-[400px] bg-white/70 rounded-xl p-4 border border-pink-100 flex justify-center items-center">
                <ResponsiveContainer width="60%" height="100%">
                  <BarChart data={transformedRatingData}>
                    <XAxis
                      dataKey="name"
                      label={{
                        value: "Rating Stars",
                        position: "bottom",
                        offset: 0,
                        fill: "#9F7AEA",
                      }}
                    />
                    <YAxis
                      label={{
                        value: "Number of Movies",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#9F7AEA",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} movies`, "Count"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #F9A8D4",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                      }}
                    />
                    <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                      {transformedRatingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-purple-600 text-center italic">
                Distribution of your movie ratings from 1 to 5 stars
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center text-purple-700 flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2 text-pink-500" />
                Watch History Timeline
                <Clock className="w-4 h-4 ml-2 text-pink-500" />
              </h3>
              <div className="h-[400px] bg-white/70 rounded-xl p-4 border border-pink-100 flex justify-center items-center">
                <ResponsiveContainer width="60%" height="100%">
                  <BarChart data={watchHistory?.timeline || []}>
                    <XAxis
                      dataKey="date"
                      label={{
                        value: "Date",
                        position: "bottom",
                        offset: 0,
                        fill: "#9F7AEA",
                      }}
                    />
                    <YAxis
                      label={{
                        value: "Movies Watched",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#9F7AEA",
                      }}
                    />
                    <Tooltip
                      formatter={(value, name) => [`${value} movies`, "Movies Watched"]}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #F9A8D4",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                      }}
                    />
                    <Bar dataKey="movies_watched" radius={[8, 8, 0, 0]} name="Movies Watched">
                      {(watchHistory?.timeline || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-purple-600 text-center italic">Number of movies watched per day over time</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 flex items-center">
          <Sparkles className="mr-2 text-pink-500" />
          Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HighlightCard
            title="Most Watched Genre"
            value={genreData?.favorite_genres[0]?.genre}
            icon={<PieChartIcon className="w-5 h-5 text-pink-500" />}
          />
          <HighlightCard
            title="Movies This Month"
            value={
              watchHistory?.summary?.daily_average ? Math.round(watchHistory.summary.daily_average * 30) : undefined
            }
            icon={<Film className="w-5 h-5 text-pink-500" />}
          />
        </div>
      </Card>


    </div>
  )
}

interface HighlightCardProps {
  title: string
  value?: string | number
  suffix?: string
  icon: React.ReactNode
}

function HighlightCard({ title, value = "-", suffix = "", icon }: HighlightCardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-xl text-center border border-pink-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="text-purple-700 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2 text-pink-600">
        {value}
        {suffix}
      </p>
    </div>
  )
}

