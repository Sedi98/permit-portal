import { Eye, Download } from "lucide-react";
import type { AppFile } from "@/features/applications/types";
import { useFileDownload } from "@/features/applications/hooks";

export type RequiredDocument = AppFile;

interface RequiredDocumentsSectionProps {
  title?: string;
  subtitle?: string;
  documents: RequiredDocument[];
  applicationId?: number;
}

export default function RequiredDocumentsSection({
  title = "Tələb olunan sənədlər",
  subtitle,
  documents,
  applicationId,
}: RequiredDocumentsSectionProps) {
  const downloadFile = useFileDownload();
  return (
    <div className="flex flex-col gap-3 ">
      <p className="text-[#1F1F1F] font-bold text-xl leading-7">{title}</p>
      {subtitle && (
        <p className="text-[#797979] text-base leading-6 font-normal">
          {subtitle}
        </p>
      )}
      <div className="flex flex-col w-full">
        {documents.map((doc, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-xl w-full ${
              i % 2 === 1 ? "bg-[#FEFEFE]" : ""
            }`}
          >
            <div className="flex-1 min-w-px">
              <div className="flex items-center gap-3">
                <div className="bg-[#EEF4FB] rounded-[10px] size-8 flex items-center justify-center">
                  <p className="text-[#286AA6] font-bold text-sm leading-5">
                    {i + 1}
                  </p>
                </div>
                <p className="text-[#1F1F1F] font-medium text-base leading-6 whitespace-nowrap">
                  {doc.document_type}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={async () => {
                  if (!applicationId) return;
                  const url = await downloadFile(applicationId, doc.id);
                  window.open(url, "_blank");
                }}
                className="bg-white border border-[#DFDFDF] rounded-lg size-10 flex items-center justify-center p-2 cursor-pointer"
              >
                <Eye className="size-6 text-primary" />
              </button>
              <button
                onClick={async () => {
                  if (!applicationId) return;
                  const url = await downloadFile(applicationId, doc.id);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = doc.original_name;
                  a.click();
                }}
                className="bg-white border border-[#DFDFDF] rounded-lg size-10 flex items-center justify-center p-2 cursor-pointer"
              >
                <Download className="size-6 text-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
