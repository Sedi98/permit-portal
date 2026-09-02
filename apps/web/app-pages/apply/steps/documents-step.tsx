"use client";

import Image from "next/image";
import { useState } from "react";

import { DocumentUploadItem } from "@/components/document-upload-item";
import { Button } from "@/components/ui/button";
import type { DocumentType } from "@/features/permit-services/types";

export type SelectedApplicationDocument = {
  documentTypeId: number;
  documentTypeName: string;
  name: string;
  size: number;
};

const EMPTY_SELECTED_DOCUMENTS: SelectedApplicationDocument[] = [];

type DocumentsStepProps = {
  documentTypes: DocumentType[];
  initialDocuments?: SelectedApplicationDocument[];
  maxFileSizeMb?: number;
  onBack?: () => void;
  onNext?: (documents: SelectedApplicationDocument[]) => void;
  onUpload?: (documentTypeId: number, file: File) => void | Promise<void>;
};

type RequiredDocumentCardProps = {
  documentType: DocumentType;
  selectedDocument?: SelectedApplicationDocument;
  number: number;
  maxFileSizeMb: number;
  onUpload?: (file: File) => void | Promise<void>;
};

function RequiredDocumentCard({
  documentType,
  selectedDocument,
  number,
  maxFileSizeMb,
  onUpload,
}: RequiredDocumentCardProps) {
  return (
    <article className="flex w-full flex-col items-center gap-2 overflow-hidden rounded-2xl border border-[#dfdfdf] bg-white px-px pb-5">
      <header className="flex w-full items-center gap-3 px-5 pb-3 pt-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#eef4fb] px-3 py-1.5 text-sm font-bold leading-5 text-[#286aa6]">
          {number}
        </span>
        <h2 className="text-base font-semibold leading-6 text-[#1f1f1f]">
          {documentType.name}
        </h2>
      </header>
      <div className="flex w-full flex-col items-start px-5">
        <DocumentUploadItem
          id={`required-document-${documentType.id}`}
          initialStatus={selectedDocument ? "completed" : "idle"}
          initialFileName={selectedDocument?.name}
          initialFileSize={selectedDocument?.size}
          maxFileSizeMb={maxFileSizeMb}
          canRemove={false}
          onFileSelected={onUpload}
        />
      </div>
    </article>
  );
}

const OperationArrow = ({ direction }: { direction: "left" | "right" }) => (
  <Image
    src={`/icons/apply/documents/arrow-${direction}.svg`}
    alt=""
    width={24}
    height={24}
    aria-hidden="true"
  />
);

const DocumentsStep = ({
  documentTypes,
  initialDocuments = EMPTY_SELECTED_DOCUMENTS,
  maxFileSizeMb = 10,
  onBack,
  onNext,
  onUpload,
}: DocumentsStepProps) => {
  const [selectedByType, setSelectedByType] = useState<
    Record<number, SelectedApplicationDocument>
  >(() =>
    Object.fromEntries(
      initialDocuments.map((document) => [document.documentTypeId, document]),
    ),
  );

  const handleUpload = async (documentType: DocumentType, file: File) => {
    await onUpload?.(documentType.id, file);
    setSelectedByType((current) => ({
      ...current,
      [documentType.id]: {
        documentTypeId: documentType.id,
        documentTypeName: documentType.name,
        name: file.name,
        size: file.size,
      },
    }));
  };

  const selectedDocuments = documentTypes.flatMap((documentType) => {
    const selected = selectedByType[documentType.id];
    return selected ? [selected] : [];
  });
  const allDocumentsUploaded =
    documentTypes.length > 0 &&
    selectedDocuments.length === documentTypes.length;

  return (
    <section className="flex w-full max-w-[770px] flex-col gap-7 rounded-xl border border-[#dfdfdf] p-4 sm:p-8">
      <header className="flex w-full flex-col gap-1">
        <h1 className="text-xl font-bold leading-7 text-[#1f1f1f]">
          Sənədləri yükləyin
        </h1>
        <p className="text-sm font-normal leading-5 text-[#797979]">
          Tələb olunan sənədləri aşağıda müvafiq bölmələrə yükləyin
        </p>
      </header>

      <div className="flex w-full flex-col gap-5">
        {documentTypes.length > 0 ? (
          documentTypes.map((documentType, index) => (
            <RequiredDocumentCard
              key={documentType.id}
              documentType={documentType}
              selectedDocument={selectedByType[documentType.id]}
              number={index + 1}
              maxFileSizeMb={maxFileSizeMb}
              onUpload={(file) => handleUpload(documentType, file)}
            />
          ))
        ) : (
          <p className="rounded-xl bg-[#f9fafc] p-5 text-sm text-[#797979]">
            Bu icazə üçün tələb olunan sənədlər konfiqurasiya edilməyib.
          </p>
        )}
      </div>

      <footer className="flex w-full items-center justify-between border-t border-[#dfdfdf] pt-[21px]">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 w-[100px] gap-2 border-[#dfdfdf] bg-white px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
        >
          <OperationArrow direction="left" />
          Geri
        </Button>

        <span className="text-sm font-medium leading-5 text-[#797979]">4 / 6</span>

        <Button
          type="button"
          onClick={() => onNext?.(selectedDocuments)}
          disabled={!allDocumentsUploaded}
          className="h-12 w-[100px] gap-2 bg-[#286aa6] px-4 py-3 text-base font-semibold text-white hover:bg-[#286aa6]"
        >
          İrəli
          <OperationArrow direction="right" />
        </Button>
      </footer>
    </section>
  );
};

export default DocumentsStep;
