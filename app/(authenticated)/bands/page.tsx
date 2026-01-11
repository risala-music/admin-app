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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/components/providers";
import { t } from "@/lib/i18n";
import type { Band } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BandsPage() {
  const { locale } = useApp();
  const bands = useStore((state) => state.bands);
  const groups = useStore((state) => state.groups);
  // const members = useStore((state) => state.members)
  const districts = useStore((state) => state.districts);
  const commissions = useStore((state) => state.commissions);
  const addBand = useStore((state) => state.addBand);
  const updateBand = useStore((state) => state.updateBand);
  const deleteBand = useStore((state) => state.deleteBand);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBand, setEditingBand] = useState<Band | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    town_name: "",
    code: "",
    groupId: "",
    groupName: "",
    districtId: "",
    districtName: "",
    commissionId: "",
    commissionName: "",
  });

  const handleAdd = () => {
    setEditingBand(null);
    setFormData({
      name: "",
      town_name: "",
      code: "",
      groupId: "",
      groupName: "",
      districtId: "",
      districtName: "",
      commissionId: "",
      commissionName: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (band: Band) => {
    setEditingBand(band);
    setFormData({
      name: band.name,
      town_name: band.town_name,
      code: band.code,
      groupId: band.groupId,
      groupName: band.groupName,
      districtId: band.districtId,
      districtName: band.districtName,
      commissionId: band.commissionId,
      commissionName: band.commissionName,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingBand) {
      updateBand(editingBand.id, formData);
    } else {
      addBand(formData);
    }
    setIsDialogOpen(false);
  };

  const columns = [
    { key: "code", label: t("bandCode", locale) },
    { key: "name", label: t("bandName", locale) },
    { key: "town_name", label: t("groupTownName", locale) },
    {
      key: "groupId",
      label: t("groupName", locale),
      render: (band: Band) => {
        const group = groups.find((g) => g.id === band.groupId);
        return group?.town_name || "-";
      },
    },
    {
      key: "districtId",
      label: t("districtName", locale),
      render: (band: Band) => {
        const district = districts.find((d) => d.id === band.districtId);
        return district?.name || "-";
      },
    },
    {
      key: "commissionId",
      label: t("commissionName", locale),
      render: (band: Band) => {
        const commission = commissions.find((c) => c.id === band.commissionId);
        return commission?.name_ar || "-";
      },
    },
    // {
    //   key: "members",
    //   label: t("bandMembers", locale),
    //   render: (band: Band) => {
    //     const bandMembers = members.filter((m) => m.bandIds.includes(band.id))
    //     return bandMembers.length
    //   },
    // },
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
      <h1 className="text-3xl font-bold">{t("bands", locale)}</h1>

      {isLoading && bands.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          data={bands}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={(band) => deleteBand(band.id)}
          searchKeys={["name", "code", "groupName", "districtName", "commissionName"]}
          addLabel={t("addBand", locale)}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBand ? t("editBand", locale) : t("addBand", locale)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formData.code && (
              <div className="space-y-2">
                <Label htmlFor="code">{t("bandCode", locale)}</Label>
                <Input
                  id="code"
                  value={formData.code}
                  // onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  disabled={true}
                  readOnly={true}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{t("bandName", locale)}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="town_name">{t("groupTownName", locale)}</Label>
              <Input
                id="town_name"
                value={formData.town_name}
                onChange={(e) =>
                  setFormData({ ...formData, town_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission">
                {t("selectCommission", locale)}
              </Label>
              <Select
                value={formData.commissionId}
                onValueChange={(value) =>
                  setFormData({ ...formData, commissionId: value })
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

          <div className="space-y-2">
            <Label htmlFor="district">{t("selectDistrict", locale)}</Label>
            <Select
              value={formData.districtId}
              onValueChange={(value) =>
                setFormData({ ...formData, districtId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectDistrict", locale)} />
              </SelectTrigger>
              <SelectContent>
                {districts
                  .filter((d) => d.commissionId === formData.commissionId)
                  .map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="group">{t("selectGroup", locale)}</Label>
            <Select
              value={formData.groupId}
              onValueChange={(value) =>
                setFormData({ ...formData, groupId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectGroup", locale)} />
              </SelectTrigger>
              <SelectContent>
                {groups
                  .filter((g) => g.districtId === formData.districtId)
                  .map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.town_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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
