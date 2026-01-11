"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Locale } from "@/lib/i18n"
import { translations } from "@/lib/i18n"
import { useStore } from "@/lib/store"

interface AppContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
  t: (key: string) => string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)
  const fetchAll = useStore((state) => state.fetchAll)

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[locale]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  useEffect(() => {
    setMounted(true)
    const savedLocale = localStorage.getItem("locale") as Locale
    const savedTheme = localStorage.getItem("theme") as "light" | "dark"
    if (savedLocale) setLocale(savedLocale)
    if (savedTheme) setTheme(savedTheme)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("locale", locale)
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = locale
    }
  }, [locale, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme)
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }, [theme, mounted])

  useEffect(() => {
    if (mounted) {
      fetchAll()
    }
  }, [mounted, fetchAll])

  if (!mounted) return null

  return <AppContext.Provider value={{ locale, setLocale, theme, setTheme, t }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
