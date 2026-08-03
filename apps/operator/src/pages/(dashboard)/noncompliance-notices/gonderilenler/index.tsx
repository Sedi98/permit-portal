import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/Stepper";
import A4Preview from "@/components/A4Preview";
import TableLayout from "@/app/layouts/TableLayout";
import ApplicationExecutorsContainer from "@/components/ApplicationExecutorsContainer";
import AssignSection from "./sections/AssignSection";
import NoteTextarea from "@/components/NoteTextarea";
import RequiredDocumentsSection from "@/components/RequiredDocumentsSection";
import { useMe } from "@/features/auth/hooks";
import {
  useApplicationById,
  useExecutors,
  useAssignExecutor,
  useChangeStatus,
} from "@/features/applications/hooks";
import type { A4PreviewField } from "@/components/A4Preview";

export default function NoncomplianceNoticesGonderilenlerPage() {
  const { id } = useParams();
  const applicationId = id ? Number(id) : undefined;
  const { data: applicationDetail } = useApplicationById(applicationId);
  const { data: executorsData, isFetched: executorsFetched } = useExecutors();
  const me = useMe();
  const role = me.data?.data?.role;
  const canAssign = role === "super_admin" || role === "department_head";
  const isExecutor = role === "executor";
  const detail = applicationDetail?.data;
  const hasAssignedUser = !!detail?.assigned_user;

  const assignMutation = useAssignExecutor(applicationId!);
  const changeStatusMutation = useChangeStatus(applicationId!);

  console.log(detail);

  const navigate = useNavigate();
  const [selectedPeople, setSelectedPeople] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedExecutor, setSelectedExecutor] = useState("");
  const [note, setNote] = useState("");

  const peopleOptions =
    executorsData?.data?.map((exec) => ({
      value: String(exec.id),
      label: exec.name,
    })) ?? [];

  const isPhysical = detail?.applicant_type === "physical";

  const fields: A4PreviewField[] = isPhysical
    ? [
        {
          label: "Şəxsin soyadı, adı, ata adı",
          value:
            `${detail?.last_name ?? ""} ${detail?.first_name ?? ""} ${detail?.father_name ?? ""}`.trim(),
        },
        {
          label: "Şəxsiyyəti təsdiq edən sənədin növü",
          value: "Şəxsiyyət vəsiqəsi",
        },
        {
          label: "Ş/V sənədin seriyası və nömrəsi",
          value: detail?.id_series ?? "",
        },
        {
          label: "Şəxsin doğulduğu yer",
          value: "Azərbaycan Respublikası, Bakı şəhəri",
        },
        {
          label: "Şəxsin doğulduğu tarix",
          value: "17.08.1984",
        },
        { label: "Şəxsin vətəndaşlığı", value: "AZE" },
        {
          label: "Şəxsin yaşayış yeri",
          value: "Bakı şəhəri, Nəsimi rayonu, Füzuli küçəsi 14, mənzil 8",
        },
        { label: "Şəxsin cinsi", value: "Kişi" },
        {
          label: "Şəxsin fərdi identifikasiya nömrəsi",
          value: detail?.fin ?? "",
        },
        {
          label: "Şəxsiyyəti təsdiq edən sənədin verilmə tarixi",
          value: "23.10.2021",
        },
        {
          label: "Şəxsiyyəti təsdiq edən sənədin etibarlılıq müddəti",
          value: "23.10.2031",
        },
        {
          label: "Şəxsiyyəti təsdiq edən sənədi verən orqan",
          value: "Asan 3",
        },
      ]
    : [
        {
          label: "Fərdi sahibkarın adı",
          value:
            `${detail?.last_name ?? ""} ${detail?.first_name ?? ""} ${detail?.father_name ?? ""}`.trim(),
        },
        {
          label: "Fərdi sahibkarın qeydiyyat ünvanı",
          value: detail?.legal_address ?? "",
        },
        { label: "VÖEN", value: detail?.voen ?? "" },
        {
          label: "VÖEN-in verilmə tarixi",
          value: detail?.submitted_at
            ? format(new Date(detail.submitted_at), "dd.MM.yyyy")
            : "",
        },
        { label: "Vergi ödəyicisinin statusu", value: "Aktiv" },
      ];

  fields.push({
    label: "Əlaqə",
    value: detail?.phones?.map((p) => p.phone).join(", ") ?? "",
  });

  return (
    <main className=" space-y-5 md:space-y-10">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-4 py-3 h-auto rounded-lg text-[#286AA6] font-semibold text-base leading-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-6" />
            Geri
          </Button>
          <span className="text-[#1F1F1F] font-semibold text-base leading-6">
            Müraciətin detalları
          </span>
        </div>

        <Stepper
          steps={[
            { label: "Sahə seçimi" },
            { label: "Sənədlər" },
            { label: "İcraya vermə" },
            { label: "Yoxlama" },
            { label: "Ödəniş" },
            { label: "Müraciətin nəticəsi" },
          ]}
          activeStep={2}
        />
      </div>

      <A4Preview
        date={
          detail?.created_at
            ? format(new Date(detail.created_at), "dd.MM.yyyy")
            : ""
        }
        srn={detail?.application_no ?? ""}
        title={`${detail?.permit_service?.name ?? ""} üçün sərəncam verilməsi barədə`}
        applicationTitle="Ə R İ Z Ə"
        fields={fields}
      />

      <TableLayout>
        <ApplicationExecutorsContainer
          executors={[
            {
              name: detail?.assigned_user?.name ?? "",
              date: detail?.assigned_user?.name ? "05.05.2026" : '',
              assignment: detail?.assigned_user?.name ? "Sistem yönləndirmə" : '',
            },
            
          ]}
        />

        {!hasAssignedUser && canAssign && (
          executorsFetched ? (
            <AssignSection
              availablePeople={peopleOptions}
              selectedPeople={selectedPeople}
              onPeopleChange={setSelectedPeople}
              selectedExecutor={selectedExecutor}
              onExecutorChange={setSelectedExecutor}
            />
          ) : (
            <div className="flex items-center justify-center py-10">
              <div className="size-8 animate-spin rounded-full border-3 border-[#286aa6] border-t-transparent" />
            </div>
          )
        )}

        <NoteTextarea value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="flex justify-end">
          <Button
            className="h-12 mt-4 w-[160px]"
            variant={"default"}
            disabled={assignMutation.isPending || changeStatusMutation.isPending}
            onClick={() => {
              if (selectedExecutor && canAssign) {
                assignMutation.mutate(
                  { assigned_to: Number(selectedExecutor) },
                  { onSuccess: () => { toast.success("İcraçı təyin edildi"); navigate(-1); }, onError: () => { toast.error("İcraçı təyin edilərkən xəta baş verdi"); } },
                );
              } else if (isExecutor) {
                changeStatusMutation.mutate(
                  { status: "sent_for_approval" },
                  { onSuccess: () => { toast.success("Müraciət tamamlandı"); navigate(-1); }, onError: () => { toast.error("Status dəyişdirilərkən xəta baş verdi"); } },
                );
              }
            }}
          >
            Təsdiq et
          </Button>
        </div>
      </TableLayout>

      <TableLayout>
        <RequiredDocumentsSection
          subtitle={detail?.permit_service?.name ?? ""}
          applicationId={detail?.id}
          documents={detail?.files ?? []}
        />
      </TableLayout>
    </main>
  );
}
