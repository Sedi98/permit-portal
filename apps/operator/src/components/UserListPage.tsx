import * as React from "react";
import { useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon } from "@/components/icons";
import { PaginationContainer } from "@/components/PaginationContainer";
import { useUsers } from "@/features/users/hooks";
import type { AdminUser } from "@/features/users/types";
import type { Role } from "@/app/navigation";

type UserRow = AdminUser;

const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super admin",
  executor: "İcraçı",
  department_head: "Şöbə müdiri",
  deputy_minister: "Nazir müavini",
};

function DetailButton({ userId }: { userId: number }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label="Ətraflı bax"
      onClick={() => navigate(`manage/${userId}`)}
      className="inline-flex size-12 items-center justify-center rounded-lg border border-[#dfdfdf] bg-white text-[#286aa6] transition-colors hover:bg-[#f7f9fc]"
    >
      <EyeIcon className="size-9" />
    </button>
  );
}

const columns: ColumnDef<UserRow>[] = [
  { header: "Ad", accessorKey: "name" },
  { header: "FİN", accessorKey: "fin" },
  {
    header: "Rol",
    accessorKey: "role",
    cell: ({ row }) => ROLE_LABELS[row.original.role],
  },
  { header: "Şöbə", accessorKey: "department_name" },
  { header: "Status", accessorKey: "is_active", cell: ({ row }) => row.original.is_active ? "Aktiv" : "Deaktiv" },
  {
    header: "Ətraflı",
    id: "details",
    cell: ({ row }) => <DetailButton userId={row.original.id} />,
  },
];

export default function UserListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState<Role | "all">("all");
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useUsers({
    search: search || undefined,
    role: role === "all" ? undefined : role,
    page,
    per_page: 20,
  });
  const response = data?.data;
  const items: UserRow[] = response?.data ?? [];

  return (
    <div className="relative space-y-4">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">İstifadəçilər</h1>
      <TableLayout className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageTitle title="İstifadəçilər siyahısı" text={`Cəmi ${response?.total ?? 0} istifadəçi tapıldı`} />
          <Button className="gap-2" onClick={() => navigate("/users/new")}>
            <Plus className="size-4" />
            Yeni işçi
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <SearchInput
            containerClassName="w-[400px]"
            placeholder="Axtar..."
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
          />
          <Select value={role} onValueChange={(value) => { setRole(value as Role | "all"); setPage(1); }}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Rol" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün rollar</SelectItem>
              <SelectItem value="executor">{ROLE_LABELS.executor}</SelectItem>
              <SelectItem value="department_head">
                {ROLE_LABELS.department_head}
              </SelectItem>
              <SelectItem value="deputy_minister">
                {ROLE_LABELS.deputy_minister}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-10 animate-spin rounded-full border-4 border-[#286aa6] border-t-transparent" />
          </div>
        ) : (
          <DataTable columns={columns} data={items} />
        )}
        <PaginationContainer
          currentPage={response?.current_page ?? page}
          totalPages={response?.last_page ?? 1}
          totalItems={response?.total ?? 0}
          itemsPerPage={response?.per_page ?? 20}
          onPageChange={setPage}
        />
      </TableLayout>
    </div>
  );
}
