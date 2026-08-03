import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMe } from "@/features/auth/hooks";
import { useDepartments } from "@/features/applications/hooks";
import { useDeleteUser, useUpdateUser, useUserById } from "@/features/users/hooks";
import type { Role } from "@/app/navigation";

const roles: Array<{ value: Exclude<Role, "super_admin">; label: string }> = [
  { value: "executor", label: "İcraçı" },
  { value: "department_head", label: "Şöbə müdiri" },
  { value: "deputy_minister", label: "Nazir müavini" },
];

export default function UserManagePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = id ? Number(id) : undefined;
  const { data, isLoading } = useUserById(userId);
  const { data: departmentsData } = useDepartments();
  const { data: meData } = useMe();
  const update = useUpdateUser(userId ?? 0);
  const remove = useDeleteUser();
  const user = data?.data;
  const me = meData?.data;
  const [name, setName] = React.useState("");
  const [fin, setFin] = React.useState("");
  const [role, setRole] = React.useState<Exclude<Role, "super_admin">>("executor");
  const [departmentId, setDepartmentId] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    setName(user.name);
    setFin(user.fin);
    setRole(user.role === "super_admin" ? "executor" : user.role);
    setDepartmentId(user.department_id ? String(user.department_id) : "");
    setIsActive(user.is_active);
  }, [user]);

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="size-10 animate-spin rounded-full border-4 border-[#286aa6] border-t-transparent" /></div>;
  if (!user || !userId) return <div className="p-6 text-sm text-destructive">İstifadəçi tapılmadı.</div>;
  const isSelf = me?.id === user.id;
  const requiresDepartment = role !== "deputy_minister";

  const save = () => {
    if (!name.trim() || fin.length !== 7 || !role || (requiresDepartment && !departmentId)) return toast.error("Məcburi sahələri düzgün doldurun");
    update.mutate({ name, fin, role, ...(requiresDepartment ? { department_id: Number(departmentId) } : { department_id: null }), is_active: isSelf ? user.is_active : isActive }, { onSuccess: () => toast.success("İstifadəçi yeniləndi"), onError: () => toast.error("İstifadəçi yenilənərkən xəta baş verdi") });
  };

  const deactivate = () => {
    if (isSelf) return toast.error("Öz hesabınızı deaktiv edə bilməzsiniz");
    remove.mutate(user.id, { onSuccess: () => { toast.success("İstifadəçi deaktiv edildi"); navigate(-1); }, onError: () => toast.error("İstifadəçi deaktiv edilərkən xəta baş verdi") });
  };

  return <main className="space-y-5 p-4"><Button variant="ghost" className="gap-2 text-[#286AA6]" onClick={() => navigate(-1)}><ArrowLeft className="size-5" />Geri</Button><TableLayout className="max-w-2xl space-y-5"><h1 className="text-xl font-bold">İstifadəçini redaktə et</h1><div className="space-y-2"><Label htmlFor="user-name">Ad</Label><Input id="user-name" value={name} onChange={(event) => setName(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="user-fin">FİN</Label><Input id="user-fin" maxLength={7} value={fin} onChange={(event) => setFin(event.target.value)} /></div><div className="space-y-2"><Label>Rol</Label><Select value={role} onValueChange={(value) => setRole(value as Exclude<Role, "super_admin">)} disabled={isSelf}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{roles.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>{requiresDepartment && <div className="space-y-2"><Label>Şöbə</Label><Select value={departmentId} onValueChange={setDepartmentId}><SelectTrigger><SelectValue placeholder="Şöbə seçin" /></SelectTrigger><SelectContent>{(departmentsData?.data ?? []).map((department) => <SelectItem key={department.id} value={String(department.id)}>{department.name}</SelectItem>)}</SelectContent></Select></div>}<label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={isActive} disabled={isSelf} onChange={(event) => setIsActive(event.target.checked)} />Aktiv</label><div className="flex justify-between gap-3"><Button variant="outline" className="text-destructive" onClick={deactivate} disabled={remove.isPending || isSelf}>Deaktiv et</Button><Button onClick={save} disabled={update.isPending}>Yadda saxla</Button></div></TableLayout></main>;
}
