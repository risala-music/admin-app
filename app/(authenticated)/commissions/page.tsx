"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { DataTable } from "@/components/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/components/providers";
import { t } from "@/lib/i18n";
import type { Commission } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CommissionsPage() {
  const { locale } = useApp();
  const commissions = useStore((state) => state.commissions);
  const addCommission = useStore((state) => state.addCommission);
  const updateCommission = useStore((state) => state.updateCommission);
  const deleteCommission = useStore((state) => state.deleteCommission);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState<Commission | null>(
    null
  );
  const [formData, setFormData] = useState({ name: "", code: "" });

  // const handleAdd = () => {
  //   setEditingCommission(null)
  //   setFormData({ name: "", code: "" })
  //   setIsDialogOpen(true)
  // }

  // const handleEdit = (commission: Commission) => {
  //   setEditingCommission(commission)
  //   setFormData({ name: commission.name, code: commission.code })
  //   setIsDialogOpen(true)
  // }

  // const handleSave = () => {
  //   if (editingCommission) {
  //     updateCommission(editingCommission.id, formData)
  //   } else {
  //     addCommission(formData)
  //   }
  //   setIsDialogOpen(false)
  // }

  const columns = [
    { key: "id", label: t("commissionID", locale) },
    { key: "name_ar", label: t("commissionName", locale) },
    // { key: "name_en", label: t("name_en", locale) }
  ];

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">{t("commissions", locale)}</h1>

      {isLoading && commissions.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          data={commissions}
          columns={columns}
          // onEdit={handleEdit}
          // onDelete={(commission) => deleteCommission(commission.id)}
          searchKeys={["id", "name_ar"]}
          // addLabel={t("addCommission", locale)}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCommission
                ? t("editCommission", locale)
                : t("addCommission", locale)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">{t("commissionID", locale)}</Label>
              <Input
                id="id"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t("commissionName", locale)}</Label>
              <Input
                id="name_en"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>
          {/* <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("cancel", locale)}
            </Button>
            <Button onClick={handleSave} className="bg-[oklch(0.45_0.12_25)] hover:bg-[oklch(0.40_0.12_25)]">
              {t("save", locale)}
            </Button>
          </div> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
