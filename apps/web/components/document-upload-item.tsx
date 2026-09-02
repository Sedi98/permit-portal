"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";

type DocumentUploadStatus = "idle" | "uploading" | "completed";

type DocumentUploadItemProps = {
  id: string;
  initialStatus?: DocumentUploadStatus;
  initialFileName?: string;
  initialFileSize?: number;
  initialProgress?: number;
  uploadIconSrc?: string;
  documentIconSrc?: string;
  refreshIconSrc?: string;
  trashIconSrc?: string;
  maxFileSizeMb?: number;
  canRemove?: boolean;
  onFileSelected?: (file: File) => void | Promise<void>;
  onRemove?: () => void;
};

type SelectedFile = {
  name: string;
  size: number;
};

const DEFAULT_UPLOAD_ICON = "/icons/apply/documents/upload.svg";
const DEFAULT_DOCUMENT_ICON = "/icons/apply/documents/document-text.svg";
const DEFAULT_REFRESH_ICON = "/icons/apply/documents/refresh-2.svg";
const DEFAULT_TRASH_ICON = "/icons/apply/documents/trash.svg";

export function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function DocumentUploadItem({
  id,
  initialStatus = "idle",
  initialFileName,
  initialFileSize = 628 * 1024,
  initialProgress = 25,
  uploadIconSrc = DEFAULT_UPLOAD_ICON,
  documentIconSrc = DEFAULT_DOCUMENT_ICON,
  refreshIconSrc = DEFAULT_REFRESH_ICON,
  trashIconSrc = DEFAULT_TRASH_ICON,
  maxFileSizeMb = 10,
  canRemove = true,
  onFileSelected,
  onRemove,
}: DocumentUploadItemProps) {
  const [status, setStatus] = useState<DocumentUploadStatus>(initialStatus);
  const [progress, setProgress] = useState(initialProgress);
  const [file, setFile] = useState<SelectedFile | null>(
    initialFileName ? { name: initialFileName, size: initialFileSize } : null,
  );
  const [error, setError] = useState<string | null>(null);
  const progressRef = useRef(initialProgress);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status !== "uploading") {
      return;
    }

    const interval = window.setInterval(() => {
      const nextProgress = Math.min(progressRef.current + 5, 90);
      progressRef.current = nextProgress;
      setProgress(nextProgress);

      if (nextProgress === 90) {
        window.clearInterval(interval);
      }
    }, 120);

    return () => window.clearInterval(interval);
  }, [status]);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;
    if (!isPdf(selectedFile)) {
      setError("Yalnız PDF formatında fayl yükləmək olar.");
      event.target.value = "";
      return;
    }
    if (selectedFile.size > maxFileSizeMb * 1024 * 1024) {
      setError(`Faylın ölçüsü maksimum ${maxFileSizeMb} MB ola bilər.`);
      event.target.value = "";
      return;
    }

    const previousFile = file;
    const previousStatus = status;
    setError(null);
    setFile({ name: selectedFile.name, size: selectedFile.size });
    progressRef.current = 0;
    setProgress(0);
    setStatus("uploading");

    try {
      await onFileSelected?.(selectedFile);
      progressRef.current = 100;
      setProgress(100);
      setStatus("completed");
    } catch {
      setFile(previousFile);
      progressRef.current = 0;
      setProgress(0);
      setStatus(previousStatus === "completed" ? "completed" : "idle");
      setError("Fayl yüklənmədi. Yenidən cəhd edin.");
      event.target.value = "";
    }
  };

  const handleRemove = () => {
    setFile(null);
    progressRef.current = 0;
    setProgress(0);
    setStatus("idle");
    setError(null);
    onRemove?.();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (status === "uploading") {
    return (
      <div className="flex min-h-[71px] w-full items-center justify-between rounded-xl border-[1.5px] border-dashed border-[#dfdfdf] bg-white p-[13.5px]">
        <div className="flex w-full flex-col justify-center gap-3">
          <div className="flex w-full items-center justify-between text-base font-medium leading-6 text-[#286aa6]">
            <span>Yüklənir...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-[99px] bg-[#dfdfdf]">
            <div
              className="h-2 rounded-[999px] bg-[#286aa6] motion-safe:transition-[width] motion-safe:duration-150 motion-safe:ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (status === "completed" && file) {
    return (
      <div className="flex min-h-[71px] w-full flex-col items-start justify-between gap-3 rounded-xl border-[1.5px] border-dashed border-[#dfdfdf] bg-white p-[13.5px] sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg p-3">
            <Image
              src={documentIconSrc}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-medium leading-6 text-[#1f1f1f]">
              {file.name}
            </p>
            <p className="text-sm font-normal leading-5 text-[#797979]">
              {formatFileSize(file.size)} · PDF
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            aria-label={`${file.name} faylını dəyişdir`}
            onClick={openFilePicker}
            className="size-10 rounded-lg border-[#dfdfdf] bg-white p-2 text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
          >
            <Image
              src={refreshIconSrc}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </Button>
          {canRemove ? (
            <Button
              type="button"
              variant="ghost"
              aria-label={`${file.name} faylını sil`}
              onClick={handleRemove}
              className="size-10 rounded-lg bg-[#fef1f1] p-2 text-[#f32020] hover:bg-[#fef1f1] hover:text-[#f32020]"
            >
              <Image
                src={trashIconSrc}
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
            </Button>
          ) : null}
        </div>

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept=".pdf,application/pdf"
          className="sr-only"
          onChange={handleFileSelected}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex min-h-[71px] w-full flex-col items-start justify-between gap-3 rounded-xl border-[1.5px] border-dashed border-[#dfdfdf] bg-[#f5f5f5] p-[13.5px] sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg p-3">
            <Image
              src={uploadIconSrc}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <p className="text-base font-medium leading-6 text-[#1f1f1f]">
              Sürükləyin və ya seçin
            </p>
            <p className="text-sm font-normal leading-5 text-[#797979]">
              .pdf · maks. {maxFileSizeMb}MB
            </p>
          </div>
        </div>

        <div className="shrink-0 self-end sm:self-auto">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={handleFileSelected}
          />
          <Button
            type="button"
            onClick={openFilePicker}
            className="h-10 w-[120px] rounded-lg bg-[#286aa6] px-3 py-2 text-base font-semibold leading-6 text-white hover:bg-[#286aa6]"
          >
            Faylı seçin
          </Button>
        </div>
      </div>
      {error ? (
        <p className="text-sm text-[#d90b0b]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { DocumentUploadItem };
export type { DocumentUploadItemProps, DocumentUploadStatus };
