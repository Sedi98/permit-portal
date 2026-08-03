import * as React from "react";
import { useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { EyeIcon } from "@/components/icons";
import { PaginationContainer } from "@/components/PaginationContainer";
import { useUsers } from "@/features/users/hooks";
import type { AdminUser } from "@/features/users/types";

type UserRow = AdminUser;

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
  { header: "Rol", accessorKey: "role" },
  { header: "Şöbə", accessorKey: "department_name" },
  { header: "Status", accessorKey: "is_active", cell: ({ row }) => row.original.is_active ? "Aktiv" : "Deaktiv" },
  {
    header: "Ətraflı",
    id: "details",
    cell: ({ row }) => <DetailButton userId={row.original.id} />,
  },
];

export default function UserListPage() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useUsers({ search: search || undefined, page, per_page: 20 });
  const response = data?.data;
  const items: UserRow[] = response?.data ?? [];

  return (
    <div className="relative space-y-4">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">İstifadəçilər</h1>
      <TableLayout className="space-y-5">
        <PageTitle title="İstifadəçilər siyahısı" text={`Cəmi ${response?.total ?? 0} istifadəçi tapıldı`} />
        <div className="flex w-[400px] items-center gap-3 rounded-lg bg-[#f5f5f5] px-4 py-3">
          <Search className="size-5 shrink-0 text-[#797979]" />
          <Input
            placeholder="Axtar..."
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            className="h-auto rounded-none border-none bg-transparent px-0 py-0 text-base shadow-none placeholder:text-[#797979]"
          />
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
