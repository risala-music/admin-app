"use client"

import type React from "react"

import { useState } from "react"
import { Search, Plus, Pencil, Trash2, X, FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useApp } from "./providers"
import { t } from "@/lib/i18n"

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
}

interface FilterType {
  id: string
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  dependsOn?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onAdd?: () => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  searchKeys: (keyof T)[]
  addLabel?: string
  filters?: FilterType[] // Added optional filters prop
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  searchKeys,
  addLabel,
  filters = [], // Default to empty array
}: DataTableProps<T>) {
  const { locale } = useApp()
  const [search, setSearch] = useState("")
  const [deleteItem, setDeleteItem] = useState<T | null>(null)

  const filteredData = data.filter((item) =>
    searchKeys.some((key) => String(item[key]).toLowerCase().includes(search.toLowerCase())),
  )

  const getActiveFilters = () => {
    return filters.filter((f) => f.value !== "all")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder", locale)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {filters.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 relative bg-transparent">
                  <FilterIcon className="h-4 w-4" />
                  {getActiveFilters().length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[oklch(0.45_0.12_25)] text-white text-xs flex items-center justify-center">
                      {getActiveFilters().length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{t("filters", locale)}</h4>
                    {getActiveFilters().length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => filters.forEach((f) => f.onChange("all"))}
                      >
                        {t("clearAllFilters", locale)}
                      </Button>
                    )}
                  </div>
                  {filters.map((filter) => {
                    const isDependent = filter.dependsOn
                    const dependsOnFilter = isDependent ? filters.find((f) => f.id === filter.dependsOn) : null
                    const isDisabled = isDependent && dependsOnFilter?.value === "all"

                    return (
                      <div key={filter.id} className="space-y-2">
                        <label className="text-sm font-medium">{filter.label}</label>
                        <Select value={filter.value} onValueChange={filter.onChange} disabled={isDisabled || false}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {filter.options.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="bg-[oklch(0.45_0.12_25)] hover:bg-[oklch(0.40_0.12_25)]">
            <Plus className="w-4 h-4 mr-2" />
            {addLabel}
          </Button>
        )}
      </div>

      {getActiveFilters().length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getActiveFilters().map((filter) => {
            const selectedOption = filter.options.find((opt) => opt.value === filter.value)
            return (
              <Badge key={filter.id} variant="secondary" className="gap-1">
                <span className="text-xs text-muted-foreground">{filter.label}:</span>
                <span>{selectedOption?.label}</span>
                <button onClick={() => filter.onChange("all")} className="ml-1 hover:bg-muted rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="w-24">{t("actions", locale)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                  {t("noResults", locale)}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(item) : String(item[column.key as keyof T])}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}

                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteItem(item)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete", locale)}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteConfirm", locale)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel", locale)}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteItem) {
                  onDelete?.(deleteItem)
                  setDeleteItem(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete", locale)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
