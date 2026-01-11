"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useApp } from "@/components/providers"

export default function ChangePasswordPage() {
  const { t } = useApp()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = getSupabase()

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setLoading(false)
      return
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("Not authenticated")
      setLoading(false)
      return
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })

    if (signInError) {
      setError("Current password is incorrect")
      setLoading(false)
      return
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setLoading(false)

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t("changePassword")}</h1>
          <p className="text-muted-foreground mt-2">{t("changePasswordDescription")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("changePassword")}</CardTitle>
            <CardDescription>Enter your current and new password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>Password changed successfully! Redirecting...</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={loading || success}
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading || success}
                  autoComplete="new-password"
                  minLength={6}
                />
                <p className="text-sm text-muted-foreground">Must be at least 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || success}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading || success}>
                  {loading ? "Changing..." : success ? "Changed!" : "Change Password"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
