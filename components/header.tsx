"use client"

import { Moon, Sun, Globe, LogOut, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useApp } from "./providers"
import { getSupabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function Header() {
  const { locale, setLocale, theme, setTheme, t } = useApp()
  const router = useRouter()
  const supabase = getSupabase()
  const [userEmail, setUserEmail] = useState<string>("")

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    fetchUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleChangePassword = () => {
    router.push("/change-password")
  }

  const avatarLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "U"

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLocale("en")}>English {locale === "en" && "✓"}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocale("ar")}>العربية {locale === "ar" && "✓"}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{avatarLetter}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{t("account")}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{userEmail || "user@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleChangePassword}>
              <KeyRound className="w-4 h-4 mr-2" />
              {t("changePassword")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
