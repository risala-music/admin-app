"use client";

import { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/components/providers";
import { t } from "@/lib/i18n";
import type { District } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DistrictsPage() {
  const { locale } = useApp();
  const districts = useStore((state) => state.districts);
  const commissions = useStore((state) => state.commissions);
  const addDistrict = useStore((state) => state.addDistrict);
  const updateDistrict = useStore((state) => state.updateDistrict);
  const deleteDistrict = useStore((state) => state.deleteDistrict);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    commissionName: "",
    commissionId: "",
  });
  const [filterCommissionId, setFilterCommissionId] = useState<string>("all");

  const filteredDistricts = useMemo(
    () =>
      filterCommissionId === "all"
        ? districts
        : districts.filter((d) => d.commissionId === filterCommissionId),
    [districts, filterCommissionId]
  );

  const handleAdd = () => {
    setEditingDistrict(null);
    setFormData({ name: "", code: "", commissionId: "", commissionName: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (district: District) => {
    setEditingDistrict(district);
    setFormData({
      name: district.name,
      code: district.code,
      commissionId: district.commissionId,
      commissionName: district.commissionName,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingDistrict) {
      updateDistrict(editingDistrict.id, formData);
    } else {
      addDistrict(formData);
    }
    setIsDialogOpen(false);
  };

  const columns = [
    { key: "id", label: t("districtID", locale) },
    { key: "name", label: t("districtName", locale) },
    {
      key: "commission",
      label: t("commissionName", locale),
      render: (district: District) => {
        const commission = commissions.find(
          (c) => c.id === district.commissionId
        );
        return commission?.name_ar || "-";
      },
    },
  ];

  const filters = [
    {
      id: "commission",
      label: t("filterByCommission", locale),
      value: filterCommissionId,
      options: [
        { value: "all", label: t("allCommissions", locale) },
        ...commissions.map((c) => ({ value: c.id, label: c.name_ar })),
      ],
      onChange: setFilterCommissionId,
    },
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
      <h1 className="text-3xl font-bold">{t("districts", locale)}</h1>

      {isLoading && districts.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          data={filteredDistricts}
          columns={columns}
          // onAdd={handleAdd}
          // onEdit={handleEdit}
          // onDelete={(district) => deleteDistrict(district.id)}
          searchKeys={["id", "name", "commissionName"]}
          // addLabel={t("addDistrict", locale)}
          filters={filters}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingDistrict
              ? t("editDistrict", locale)
              : t("addDistrict", locale)}
          </DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id">{t("districtID", locale)}</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t("districtName", locale)}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">
                {t("selectCommission", locale)}
              </Label>
              <Select
                value={formData.commissionName}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    commissionName: value,
                    commissionId:
                      commissions.find((c) => c.id === value)?.id || "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCommission", locale)} />
                </SelectTrigger>
                <SelectContent>
                  {commissions.map((commission) => (
                    <SelectItem key={commission.id} value={commission.id}>
                      {commission.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("cancel", locale)}
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[oklch(0.45_0.12_25)] hover:bg-[oklch(0.40_0.12_25)]"
            >
              {t("save", locale)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
