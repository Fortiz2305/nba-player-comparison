import * as React from "react"
import { cn } from "../../lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <div className={cn("h-full flex flex-col", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  title?: string
  children?: React.ReactNode
}

export function SidebarSection({
  className,
  title,
  children,
  ...props
}: SidebarSectionProps) {
  return (
    <div
      className={cn("px-3 py-2", className)}
      {...props}
    >
      {title && (
        <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          {title}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  icon?: React.ReactNode
  children?: React.ReactNode
  active?: boolean
}

export function SidebarItem({
  className,
  icon,
  children,
  active,
  ...props
}: SidebarItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {icon && <div className="w-4 h-4">{icon}</div>}
      <div>{children}</div>
    </div>
  )
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export function SidebarNav({
  className,
  children,
  ...props
}: SidebarNavProps) {
  return (
    <nav
      className={cn("grid gap-1 px-2 group py-2", className)}
      {...props}
    >
      {children}
    </nav>
  )
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export function SidebarFooter({
  className,
  children,
  ...props
}: SidebarFooterProps) {
  return (
    <div
      className={cn("mt-auto border-t px-3 py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}
