
"use client";

import Image from "next/image";
import { useState } from "react";

import { DocumentUploadItem } from "@/components/document-upload-item";
import { Button } from "@/components/ui/button";

const requiredDocuments = [
  { id: "required-application", number: 1, title: "Müraciət ərizəsi", documentType: "application" },
  { id: "required-tax", number: 2, title: "VÖEN şəhadətnaməsi", documentType: "tax_certificate" },
  {
    id: "required-contract",
    number: 3,
    title: "İdxal/İxrac müqaviləsinin surəti",
    documentType: "contract",
  },
  { id: "required-specification", number: 4, title: "Texniki spesifikasiya", documentType: "specification" },
  {
    id: "required-finance",
    number: 5,
    title: "Maliyyə imkanlarının təsdiqi",
    documentType: "finance",
  },
] as const;

export type SelectedApplicationDocument = {
  documentType: string;
  name: string;
  size: number;
};

type DocumentsStepProps = {
  onBack?: () => void;
  onNext?: (documents: SelectedApplicationDocument[]) => void;
  onUpload?: (documentType: string, file: File) => void | Promise<void>;
};

function RequiredDocumentCard({
  id,
  number,
  title,
  documentType,
  onUpload,
}: (typeof requiredDocuments)[number] & {
  onUpload?: (documentType: string, file: File) => void | Promise<void>;
}) {

  return (
    <article className="flex w-full flex-col items-center gap-2 overflow-hidden rounded-2xl border border-[#dfdfdf] bg-white px-px pb-5">
      <header className="flex w-full items-center gap-3 px-5 pb-3 pt-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#eef4fb] px-3 py-1.5 text-sm font-bold leading-5 text-[#286aa6]">
          {number}
        </span>
        <h2 className="text-base font-semibold leading-6 text-[#1f1f1f]">{title}</h2>
      </header>
      <div className="flex w-full flex-col items-start px-5">
        <DocumentUploadItem
          id={id}
          onFileSelected={(file) => onUpload?.(documentType, file)}
          uploadIconSrc={
            number === 5
              ? "/icons/apply/documents/upload-finance.svg"
              : "/icons/apply/documents/upload.svg"
          }
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

const DocumentsStep = ({ onBack, onNext, onUpload }: DocumentsStepProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedApplicationDocument[]>([]);

  const handleUpload = async (documentType: string, file: File) => {
    setSelectedDocuments((current) => [
      ...current.filter((document) => document.documentType !== documentType),
      { documentType, name: file.name, size: file.size },
    ]);
    await onUpload?.(documentType, file);
  };

  const handleNext = () => {
    if (selectedDocuments.length > 0) {
      onNext?.(selectedDocuments);
    }
  };

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
        {requiredDocuments.map((document) => (
          <RequiredDocumentCard key={document.id} {...document} onUpload={handleUpload} />
        ))}

        <section className="flex w-full flex-col gap-3 border-t border-[#dfdfdf] p-5">
          <header className="flex w-full flex-col gap-1">
            <div className="flex w-full items-center gap-2">
              <Image
                src="/icons/apply/documents/folder-2-additional.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
              />
              <h2 className="flex-1 text-base font-semibold leading-6 text-[#1f1f1f]">
                Əlavə sənədlər
              </h2>
            </div>
            <p className="text-sm font-normal leading-5 text-[#797979]">
              Tərcümə edilmiş və ya əlavə sənədlər üçün (maksimum 3 fayl)
            </p>
          </header>

          <DocumentUploadItem
            id="additional-document-1"
            onFileSelected={(file) => void handleUpload("additional_1", file)}
            uploadIconSrc="/icons/apply/documents/upload-additional-exact.svg"
          />
          <DocumentUploadItem
            id="additional-document-2"
            onFileSelected={(file) => void handleUpload("additional_2", file)}
            uploadIconSrc="/icons/apply/documents/upload-additional-exact.svg"
            documentIconSrc="/icons/apply/documents/document-text-additional.svg"
            refreshIconSrc="/icons/apply/documents/refresh-2-additional.svg"
            trashIconSrc="/icons/apply/documents/trash-additional.svg"
          />
          <DocumentUploadItem
            id="additional-document-3"
            onFileSelected={(file) => void handleUpload("additional_3", file)}
            uploadIconSrc="/icons/apply/documents/upload-additional-exact.svg"
            documentIconSrc="/icons/apply/documents/document-text-additional.svg"
            refreshIconSrc="/icons/apply/documents/refresh-2-additional.svg"
            trashIconSrc="/icons/apply/documents/trash-additional.svg"
          />
        </section>
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
          onClick={handleNext}
          disabled={selectedDocuments.length === 0}
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
