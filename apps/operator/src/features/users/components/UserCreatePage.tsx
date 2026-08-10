import { useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import type { Role } from "@/app/navigation";
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
import { useDepartments } from "@/features/applications/hooks";
import { useCreateUser } from "@/features/users/hooks";

type CreatableRole = Exclude<Role, "super_admin">;

const roles: Array<{ value: CreatableRole; label: string }> = [
  { value: "executor", label: "İcraçı" },
  { value: "department_head", label: "Şöbə müdiri" },
  { value: "deputy_minister", label: "Nazir müavini" },
];

export default function UserCreatePage() {
  const navigate = useNavigate();
  const departments = useDepartments();
  const create = useCreateUser();
  const [name, setName] = useState("");
  const [fin, setFin] = useState("");
  const [role, setRole] = useState<CreatableRole>("executor");
  const [departmentId, setDepartmentId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const requiresDepartment = role !== "deputy_minister";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || fin.length !== 7 || (requiresDepartment && !departmentId)) {
      toast.error("Məcburi sahələri düzgün doldurun");
      return;
    }

    create.mutate(
      {
        name: name.trim(),
        fin,
        role,
        ...(requiresDepartment ? { department_id: Number(departmentId) } : {}),
        is_active: isActive,
      },
      {
        onSuccess: () => {
          toast.success("İstifadəçi yaradıldı");
          navigate("/users");
        },
        onError: () => toast.error("İstifadəçi yaradılarkən xəta baş verdi"),
      },
    );
  };

  return (
    <main className="space-y-5 p-4">
      <Button variant="ghost" className="gap-2 text-primary" onClick={() => navigate(-1)}>
        <ArrowLeft className="size-5" />
        Geri
      </Button>
      <TableLayout className="max-w-2xl">
        <form onSubmit={submit} className="space-y-5">
          <h1 className="text-xl font-bold">Yeni işçi</h1>
          <div className="space-y-2">
            <Label htmlFor="new-user-name">Ad</Label>
            <Input id="new-user-name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-user-fin">FİN</Label>
            <Input id="new-user-fin" value={fin} maxLength={7} onChange={(event) => setFin(event.target.value.toUpperCase())} required />
          </div>
          <div className="space-y-2">
            <Label>Rol</Label>
            <Select value={role} onValueChange={(value) => setRole(value as CreatableRole)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {roles.map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {requiresDepartment ? (
            <div className="space-y-2">
              <Label>Şöbə</Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger><SelectValue placeholder="Şöbə seçin" /></SelectTrigger>
                <SelectContent>
                  {(departments.data?.data ?? []).map((department) => (
                    <SelectItem key={department.id} value={String(department.id)}>{department.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
            Aktiv
          </label>
          <div className="flex justify-end">
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
              Yadda saxla
            </Button>
          </div>
        </form>
      </TableLayout>
    </main>
  );
}
