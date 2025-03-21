"use client"

import { useState } from "react"
import { UserSearch, Users, ChevronRight, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayerComparison } from "@/components/player-comparison"
import { PlayerClustering } from "@/components/player-clustering"

export function FeatureCards() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  if (selectedFeature === "comparison") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => setSelectedFeature(null)}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Features</span>
        </Button>

        <PlayerComparison />
      </div>
    )
  }

  if (selectedFeature === "clustering") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => setSelectedFeature(null)}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Features</span>
        </Button>

        <PlayerClustering />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <div
        className="cursor-pointer transition-transform hover:scale-[1.02]"
        onClick={() => setSelectedFeature("comparison")}
      >
        <Card className="border border-slate-200 dark:border-slate-800 overflow-hidden h-full">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 pb-2">
            <CardTitle className="flex items-center gap-2">
              <UserSearch className="h-5 w-5 text-blue-600" />
              <span className="text-xl">Player Comparison</span>
            </CardTitle>
            <CardDescription>Find the most similar players based on stats and playing style</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <svg width="280" height="160" viewBox="0 0 280 160" className="mx-auto">
                      <polygon points="140,30 220,70 190,140 90,140 60,70" fill="none" stroke="#ddd" strokeWidth="1" />
                      <polygon points="140,50 200,80 180,130 100,130 80,80" fill="none" stroke="#ddd" strokeWidth="1" />
                      <polygon
                        points="140,70 180,90 170,120 110,120 100,90"
                        fill="none"
                        stroke="#ddd"
                        strokeWidth="1"
                      />

                      <line x1="140" y1="30" x2="140" y2="140" stroke="#ddd" strokeWidth="1" strokeDasharray="4,4" />
                      <line x1="60" y1="70" x2="220" y2="70" stroke="#ddd" strokeWidth="1" strokeDasharray="4,4" />
                      <line x1="90" y1="140" x2="190" y2="30" stroke="#ddd" strokeWidth="1" strokeDasharray="4,4" />
                      <line x1="190" y1="140" x2="90" y2="30" stroke="#ddd" strokeWidth="1" strokeDasharray="4,4" />

                      <polygon
                        points="140,40 190,75 175,125 105,125 90,75"
                        fill="rgba(51, 102, 204, 0.3)"
                        stroke="#3366CC"
                        strokeWidth="2"
                      />

                      <polygon
                        points="140,50 200,80 165,120 115,120 80,80"
                        fill="rgba(255, 153, 51, 0.3)"
                        stroke="#FF9933"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Compare Player Profiles</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Analyze similarities between players across multiple statistical categories
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-white dark:bg-slate-900 p-4">
            <Button className="w-full">
              Compare Players
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div
        className="cursor-pointer transition-transform hover:scale-[1.02]"
        onClick={() => setSelectedFeature("clustering")}
      >
        <Card className="border border-slate-200 dark:border-slate-800 overflow-hidden h-full">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <span className="text-xl">Player Clusters</span>
              <Badge variant="outline" className="ml-2">
                New
              </Badge>
            </CardTitle>
            <CardDescription>Discover how players group together based on statistical similarity</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <svg width="280" height="160" viewBox="0 0 280 160" className="mx-auto">
                      <circle
                        cx="70"
                        cy="60"
                        r="40"
                        fill="rgba(51, 102, 204, 0.1)"
                        stroke="#3366CC"
                        strokeWidth="1.5"
                      />
                      <circle cx="60" cy="50" r="6" fill="#3366CC" />
                      <circle cx="80" cy="70" r="6" fill="#3366CC" />
                      <circle cx="65" cy="75" r="6" fill="#3366CC" />

                      <circle
                        cx="180"
                        cy="70"
                        r="50"
                        fill="rgba(255, 153, 51, 0.1)"
                        stroke="#FF9933"
                        strokeWidth="1.5"
                      />
                      <circle cx="160" cy="60" r="6" fill="#FF9933" />
                      <circle cx="190" cy="90" r="6" fill="#FF9933" />
                      <circle cx="210" cy="60" r="6" fill="#FF9933" />
                      <circle cx="170" cy="80" r="6" fill="#FF9933" />

                      <circle
                        cx="120"
                        cy="120"
                        r="30"
                        fill="rgba(51, 204, 153, 0.1)"
                        stroke="#33CC99"
                        strokeWidth="1.5"
                      />
                      <circle cx="110" cy="110" r="6" fill="#33CC99" />
                      <circle cx="130" cy="130" r="6" fill="#33CC99" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Explore Player Archetypes</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Visualize how players naturally group into distinct playing styles
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-white dark:bg-slate-900 p-4">
            <Button variant="outline" className="w-full">
              Explore Clusters
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
