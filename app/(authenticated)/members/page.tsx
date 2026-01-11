"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { DataTable } from "@/components/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useApp } from "@/components/providers"
import { t } from "@/lib/i18n"
import type { Member } from "@/lib/types"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MembersPage() {
  const { locale } = useApp()
  const members = useStore((state) => state.members)
  const bands = useStore((state) => state.bands)
  const addMember = useStore((state) => state.addMember)
  const updateMember = useStore((state) => state.updateMember)
  const deleteMember = useStore((state) => state.deleteMember)
  const isLoading = useStore((state) => state.isLoading)
  const error = useStore((state) => state.error)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    civilId: "",
    phoneNumber: "",
    bandIds: [] as string[],
  })

  const handleAdd = () => {
    setEditingMember(null)
    setFormData({ name: "", code: "", civilId: "", phoneNumber: "", bandIds: [] })
    setIsDialogOpen(true)
  }

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      code: member.code,
      civilId: member.civilId,
      phoneNumber: member.phoneNumber,
      bandIds: member.bandIds,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingMember) {
      updateMember(editingMember.id, formData)
    } else {
      addMember(formData)
    }
    setIsDialogOpen(false)
  }

  const toggleBand = (bandId: string) => {
    setFormData({
      ...formData,
      bandIds: formData.bandIds.includes(bandId)
        ? formData.bandIds.filter((id) => id !== bandId)
        : [...formData.bandIds, bandId],
    })
  }

  const columns = [
    { key: "code", label: t("memberCode", locale) },
    { key: "name", label: t("memberName", locale) },
    { key: "civilId", label: t("civilId", locale) },
    { key: "phoneNumber", label: t("phoneNumber", locale) },
    {
      key: "bandIds",
      label: t("assignedBands", locale),
      render: (member: Member) => {
        const memberBands = bands.filter((b) => member.bandIds.includes(b.id))
        return memberBands.length
      },
    },
  ]

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">{t("members", locale)}</h1>

      {isLoading && members.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          data={members}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={(member) => deleteMember(member.id)}
          searchKeys={["name", "code", "civilId", "phoneNumber"]}
          addLabel={t("addMember", locale)}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? t("editMember", locale) : t("addMember", locale)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t("memberCode", locale)}</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t("memberName", locale)}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="civilId">{t("civilId", locale)}</Label>
                <Input
                  id="civilId"
                  value={formData.civilId}
                  onChange={(e) => setFormData({ ...formData, civilId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t("phoneNumber", locale)}</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("selectBands", locale)}</Label>
              <div className="border border-border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                {bands.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noResults", locale)}</p>
                ) : (
                  bands.map((band) => (
                    <div key={band.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={band.id}
                        checked={formData.bandIds.includes(band.id)}
                        onCheckedChange={() => toggleBand(band.id)}
                      />
                      <label
                        htmlFor={band.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {band.name} ({band.code})
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("cancel", locale)}
            </Button>
            <Button onClick={handleSave} className="bg-[oklch(0.45_0.12_25)] hover:bg-[oklch(0.40_0.12_25)]">
              {t("save", locale)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
