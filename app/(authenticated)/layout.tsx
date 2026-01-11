import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
