"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Map, Users, Music, User } from "lucide-react"
import { useApp } from "@/components/providers"
import { t } from "@/lib/i18n"

export default function DashboardPage() {
  const { locale } = useApp()
  const commissions = useStore((state) => state.commissions)
  const districts = useStore((state) => state.districts)
  const groups = useStore((state) => state.groups)
  const bands = useStore((state) => state.bands)
//   const members = useStore((state) => state.members)

  const stats = [
    { label: t("commissions", locale), value: commissions.length, icon: Building2, color: "oklch(0.45_0.12_25)" },
    { label: t("districts", locale), value: districts.length, icon: Map, color: "oklch(0.55_0.10_35)" },
    { label: t("groups", locale), value: groups.length, icon: Users, color: "oklch(0.65_0.08_45)" },
    { label: t("bands", locale), value: bands.length, icon: Music, color: "oklch(0.50_0.11_30)" },
    // { label: t("members", locale), value: members.length, icon: User, color: "oklch(0.60_0.09_40)" },
  ]

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">{t("dashboard", locale)}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
