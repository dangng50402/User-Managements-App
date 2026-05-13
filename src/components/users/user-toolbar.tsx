// UserToolbar.tsx
"use client";

import { memo } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { useAuthStore, selectIsAuthenticated } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterStatus, SortField, SortOrder } from "@/types/user";

interface UserToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filter: FilterStatus;
  onFilterChange: (v: FilterStatus) => void;
  sortField: SortField;
  onSortFieldChange: (v: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (v: SortOrder) => void;
  onCreateClick: () => void;
  totalCount: number;
  filteredCount: number;
}

export const UserToolbar = memo(function UserToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  onCreateClick,
  totalCount,
  filteredCount,
}: UserToolbarProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Tìm kiếm theo tên, email, công ty..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filter}
          onValueChange={(v) => onFilterChange(v as FilterStatus)}
        >
          <SelectTrigger className="w-44">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="has-website">Có website</SelectItem>
            <SelectItem value="no-website">Không có website</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortField}
          onValueChange={(v) => onSortFieldChange(v as SortField)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Tên</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="company">Công ty</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(v) => onSortOrderChange(v as SortOrder)}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A → Z</SelectItem>
            <SelectItem value="desc">Z → A</SelectItem>
          </SelectContent>
        </Select>

        {isAuthenticated && (
          <Button
            onClick={onCreateClick}
            className="border border-border shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm user
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Hiển thị{" "}
        <span className="font-medium text-foreground">{filteredCount}</span> /{" "}
        {totalCount} users
      </p>
    </div>
  );
});