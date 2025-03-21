"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useTranslations } from "next-intl"

export function PlayerClustering() {
  const translations = useTranslations();
  const [season, setSeason] = useState("2024/25")
  const [numClusters, setNumClusters] = useState(4)

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">
            {translations('season.label')}
          </label>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger>
              <SelectValue placeholder={translations('season.select')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024/25">2024/25</SelectItem>
              <SelectItem value="2023/24">2023/24</SelectItem>
              <SelectItem value="2022/23">2022/23</SelectItem>
              <SelectItem value="2021/22">2021/22</SelectItem>
              <SelectItem value="2020/21">2020/21</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-2/3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">
            {translations('clustering.numClusters')}
          </label>
          <div className="flex items-center gap-4">
            <Slider
              value={[numClusters]}
              min={2}
              max={8}
              step={1}
              onValueChange={(value: number[]) => setNumClusters(value[0])}
              className="flex-1"
            />
            <span className="w-8 text-center font-medium">{numClusters}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[400px]">
            <CardHeader className="pb-2">
              <CardTitle>{translations('clustering.visualization')}</CardTitle>
              <CardDescription>{translations('clustering.visualizationDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[300px] w-full bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                <p className="text-slate-500">{translations('clustering.visualizationPlaceholder')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-[400px] overflow-auto">
            <CardHeader className="pb-2">
              <CardTitle>{translations('clustering.details')}</CardTitle>
              <CardDescription>{translations('clustering.detailsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg border border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <h3 className="font-medium">{translations('clustering.eliteScorers')}</h3>
                    <Badge variant="outline" className="ml-auto">
                      4 {translations('clustering.players')}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-gray-200 hover:border-blue-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <h3 className="font-medium">{translations('clustering.defensiveSpecialists')}</h3>
                    <Badge variant="outline" className="ml-auto">
                      3 {translations('clustering.players')}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-gray-200 hover:border-blue-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <h3 className="font-medium">{translations('clustering.allAroundPlayers')}</h3>
                    <Badge variant="outline" className="ml-auto">
                      3 {translations('clustering.players')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
