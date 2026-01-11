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
import type { Group } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GroupsPage() {
  const { locale } = useApp();
  const groups = useStore((state) => state.groups);
  const districts = useStore((state) => state.districts);
  const commissions = useStore((state) => state.commissions);
  const addGroup = useStore((state) => state.addGroup);
  const updateGroup = useStore((state) => state.updateGroup);
  const deleteGroup = useStore((state) => state.deleteGroup);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    town_name: "",
    districtId: "",
    districtName: "",
    commissionId: "",
    commissionName: "",
  });
  const [filterCommissionId, setFilterCommissionId] = useState<string>("all");
  const [filterDistrictId, setFilterDistrictId] = useState<string>("all");

  const availableDistricts = useMemo(() => {
    if (filterCommissionId === "all") return districts;
    return districts.filter((d) => d.commissionId === filterCommissionId);
  }, [districts, filterCommissionId]);

  const handleCommissionChange = (commissionId: string) => {
    setFilterCommissionId(commissionId);
    setFilterDistrictId("all");
  };

  const filteredGroups = useMemo(() => {
    let filtered = groups;

    if (filterCommissionId !== "all") {
      filtered = filtered.filter((g) => {
        const district = districts.find((d) => d.id === g.districtId);
        return district?.commissionId === filterCommissionId;
      });
    }

    if (filterDistrictId !== "all") {
      filtered = filtered.filter((g) => g.districtId === filterDistrictId);
    }

    return filtered;
  }, [groups, districts, filterCommissionId, filterDistrictId]);

  const handleAdd = () => {
    setEditingGroup(null);
    setFormData({
      id: "",
      name: "",
      code: "",
      town_name: "",
      districtId: "",
      districtName: "",
      commissionId: "",
      commissionName: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      id: group.id,
      name: group.name,
      code: group.code,
      town_name: group.town_name || "",
      districtId: group.districtId,
      districtName: group.districtName,
      commissionId: group.commissionId,
      commissionName: group.commissionName,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingGroup) {
      updateGroup(editingGroup.id, formData);
    } else {
      addGroup({
        ...formData,
        commissionId:
          commissions.find((c) => c.id === filterCommissionId)?.id || "",
        commissionName:
          commissions.find((c) => c.id === filterCommissionId)?.name_ar || "",
        districtName:
          districts.find((d) => d.id === formData.districtId)?.name || "",
      });
    }
    setIsDialogOpen(false);
  };

  const columns = [
    { key: "id", label: t("groupID", locale) },
    { key: "town_name", label: t("groupTownName", locale) },
    {
      key: "name",
      label: t("groupName", locale),
      render: (group: Group) => group.name || "-",
    },
    {
      key: "district",
      label: t("districtName", locale),
      render: (group: Group) => {
        const district = districts.find((d) => d.id === group.districtId);
        return district?.name || "-";
      },
    },
    {
      key: "commission",
      label: t("commissionName", locale),
      render: (group: Group) => {
        const commission = commissions.find((c) => c.id === group.commissionId);
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
      onChange: handleCommissionChange,
    },
    {
      id: "district",
      label: t("filterByDistrict", locale),
      value: filterDistrictId,
      options: [
        { value: "all", label: t("allDistricts", locale) },
        ...availableDistricts.map((d) => ({ value: d.id, label: d.name })),
      ],
      onChange: setFilterDistrictId,
      dependsOn: "commission",
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
      <h1 className="text-3xl font-bold">{t("groups", locale)}</h1>

      {isLoading && groups.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          data={filteredGroups}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={(group) => deleteGroup(group.id)}
          searchKeys={["name", "id", "town_name", "districtName", "commissionName"]}
          addLabel={t("addGroup", locale)}
          filters={filters}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? t("editGroup", locale) : t("addGroup", locale)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formData.id && (
              <div className="space-y-2">
                <Label htmlFor="code">{t("groupID", locale)}</Label>
                <Input
                  id="code"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  disabled={true}
                  readOnly={true}
                />
              </div>
            )}
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
              <Label htmlFor="name">{t("groupName", locale)}</Label>
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
                value={formData.commissionId}
                onValueChange={(value) =>
                  setFormData({ ...formData, commissionId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectDistrict", locale)} />
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
