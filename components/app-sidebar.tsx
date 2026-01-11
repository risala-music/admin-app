"use client"

import { LayoutDashboard, Building2, Map, Users, Music, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useApp } from "./providers"
import { t } from "@/lib/i18n"

export function AppSidebar() {
  const pathname = usePathname()
  const { locale } = useApp()

  const navigation = [
    { name: t("dashboard", locale), href: "/", icon: LayoutDashboard },
    { name: t("commissions", locale), href: "/commissions", icon: Building2 },
    { name: t("districts", locale), href: "/districts", icon: Map },
    { name: t("groups", locale), href: "/groups", icon: Users },
    { name: t("bands", locale), href: "/bands", icon: Music },
    // { name: t("members", locale), href: "/members", icon: User },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-[oklch(0.45_0.12_25)]">Risala Music</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "bg-[oklch(0.45_0.12_25)] text-white"
                  : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
