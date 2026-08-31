import DraftsPage from "@/app-pages/drafts";
import { getDraftApplications } from "@/features/applications/api";
import type { CitizenDraftListItem } from "@/features/applications/types";
import { getServerAuthToken } from "@/features/auth/server";

export default async function Drafts() {
  let drafts: CitizenDraftListItem[] = [];
  let errorMessage: string | undefined;
  const token = await getServerAuthToken();

  try {
    const response = await getDraftApplications(token);
    drafts = response.data;
  } catch (error) {
    console.error("Drafts load error:", error);
    errorMessage = "Qaralamalar yüklənərkən xəta baş verdi.";
  }

  return <DraftsPage drafts={drafts} errorMessage={errorMessage} />;
}
