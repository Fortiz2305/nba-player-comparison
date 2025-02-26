import React from 'react'
import { Sidebar } from './ui/sidebar'

interface PlayerComparisonLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export function PlayerComparisonLayout({
  sidebar,
  children,
}: PlayerComparisonLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] h-full gap-6">
      <aside className="hidden md:block border-r h-[calc(100vh-8rem)] sticky top-24 overflow-y-auto pb-12">
        <Sidebar className="p-4">
          <h3 className="text-lg font-semibold mb-4">Player Search</h3>
          {sidebar}
        </Sidebar>
      </aside>
      <main className="flex-1 overflow-hidden">
        <div className="md:hidden mb-6 p-4 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-4">Player Search</h3>
          {sidebar}
        </div>
        {children}
      </main>
    </div>
  )
}
