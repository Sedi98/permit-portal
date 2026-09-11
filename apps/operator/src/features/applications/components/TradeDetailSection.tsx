import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Eye, LoaderCircle, Pencil, RotateCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useApplicationPreview,
  useUpdateTradeDetail,
} from "@/features/applications/hooks";
import type {
  TradeDetail,
  UpdateTradeDetailPayload,
} from "@/features/applications/types";

const operationLabels = {
  export: "İxrac",
  import: "İdxal",
  re_export: "Təkrar ixrac",
  re_import: "Təkrar idxal",
  transit: "Tranzit",
} satisfies Record<TradeDetail["operation_type"], string>;

const editableFieldLabels = {
  goods_category: "Malların kateqoriyası",
  goods_name_volume: "Malın adı və həcmi",
  usage_info: "İstifadə barədə məlumat",
  remaining_info: "Qalıq barədə məlumat",
} satisfies Record<keyof UpdateTradeDetailPayload, string>;

type EditableField = keyof typeof editableFieldLabels;

function getVisibleFields(operationType: TradeDetail["operation_type"]) {
  const fields: EditableField[] = ["goods_category"];
  if (operationType === "import") fields.push("goods_name_volume");
  if (operationType === "re_import") {
    fields.push("usage_info", "remaining_info");
  }
  return fields;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<{ message?: string }>(error)) return fallback;
  return error.response?.data?.message ?? fallback;
}

interface TradeDetailSectionProps {
  applicationId: number;
  tradeDetail: TradeDetail;
  canEdit: boolean;
}

export default function TradeDetailSection({
  applicationId,
  tradeDetail,
  canEdit,
}: TradeDetailSectionProps) {
  const updateTradeDetail = useUpdateTradeDetail(applicationId);
  const loadPreview = useApplicationPreview();
  const visibleFields = getVisibleFields(tradeDetail.operation_type);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewRevision, setPreviewRevision] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [previewError, setPreviewError] = useState<string>();
  const [values, setValues] = useState<Record<EditableField, string>>(() => ({
    goods_category: tradeDetail.goods_category ?? "",
    goods_name_volume: tradeDetail.goods_name_volume ?? "",
    usage_info: tradeDetail.usage_info ?? "",
    remaining_info: tradeDetail.remaining_info ?? "",
  }));

  useEffect(() => {
    if (!isPreviewOpen) return;

    let disposed = false;
    let objectUrl: string | undefined;

    loadPreview(applicationId)
      .then((url) => {
        if (disposed) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setPreviewUrl(url);
      })
      .catch((error: unknown) => {
        if (!disposed) {
          setPreviewError(
            getErrorMessage(error, "Sənədin önizləməsi yüklənmədi."),
          );
        }
      });

    return () => {
      disposed = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [applicationId, isPreviewOpen, loadPreview, previewRevision]);

  const resetValues = () => {
    setValues({
      goods_category: tradeDetail.goods_category ?? "",
      goods_name_volume: tradeDetail.goods_name_volume ?? "",
      usage_info: tradeDetail.usage_info ?? "",
      remaining_info: tradeDetail.remaining_info ?? "",
    });
  };

  const handleSave = () => {
    const payload = Object.fromEntries(
      visibleFields
        .filter((field) => values[field] !== (tradeDetail[field] ?? ""))
        .map((field) => [field, values[field]]),
    ) as UpdateTradeDetailPayload;

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    updateTradeDetail.mutate(payload, {
      onSuccess: () => {
        toast.success("Əməliyyat detalları yeniləndi");
        setIsEditing(false);
        if (isPreviewOpen) {
          setPreviewUrl(undefined);
          setPreviewError(undefined);
          setPreviewRevision((current) => current + 1);
        }
      },
      onError: (error) => {
        toast.error(
          getErrorMessage(error, "Əməliyyat detalları yenilənərkən xəta baş verdi."),
        );
      },
    });
  };

  return (
    <section className="space-y-4" aria-labelledby="trade-detail-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="trade-detail-title" className="text-xl font-bold text-[#1F1F1F]">
          Əməliyyat detalları
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => {
              setPreviewUrl(undefined);
              setPreviewError(undefined);
              setIsPreviewOpen(true);
            }}
          >
            <Eye className="size-4" />
            Sənədi önizlə
          </Button>
          {canEdit && !isEditing ? (
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="size-4" />
              Redaktə et
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-[#DFDFDF] p-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-[#797979]">Əməliyyatın növü</p>
          <p className="mt-1 font-medium">
            {operationLabels[tradeDetail.operation_type]}
          </p>
        </div>
        {visibleFields.map((field) => (
          <div key={field}>
            <label className="text-sm text-[#797979]" htmlFor={`trade-${field}`}>
              {editableFieldLabels[field]}
            </label>
            {isEditing ? (
              <Textarea
                id={`trade-${field}`}
                className="mt-1 min-h-24"
                value={values[field]}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field]: event.target.value,
                  }))
                }
              />
            ) : (
              <p className="mt-1 whitespace-pre-wrap font-medium">
                {tradeDetail[field] || "—"}
              </p>
            )}
          </div>
        ))}
      </div>

      {isEditing ? (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={updateTradeDetail.isPending}
            onClick={() => {
              resetValues();
              setIsEditing(false);
            }}
          >
            Ləğv et
          </Button>
          <Button
            type="button"
            disabled={updateTradeDetail.isPending}
            onClick={handleSave}
          >
            {updateTradeDetail.isPending ? "Yadda saxlanılır..." : "Yadda saxla"}
          </Button>
        </div>
      ) : null}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="h-[90vh] max-w-[min(1100px,calc(100%-2rem))] grid-rows-[auto_1fr]">
          <DialogHeader>
            <DialogTitle>Sənədin önizləməsi</DialogTitle>
            <DialogDescription>
              Bu PDF QR-kodsuzdur və rəsmi sənəd hesab edilmir.
            </DialogDescription>
          </DialogHeader>
          {previewUrl ? (
            <iframe
              title="Sənədin önizləməsi"
              src={previewUrl}
              className="h-full min-h-0 w-full rounded-lg border"
            />
          ) : previewError ? (
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-destructive">{previewError}</p>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setPreviewUrl(undefined);
                  setPreviewError(undefined);
                  setPreviewRevision((current) => current + 1);
                }}
              >
                <RotateCw className="size-4" />
                Yenidən yoxla
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <LoaderCircle className="size-8 animate-spin text-[#286AA6]" />
              <span className="sr-only">Önizləmə yüklənir</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
