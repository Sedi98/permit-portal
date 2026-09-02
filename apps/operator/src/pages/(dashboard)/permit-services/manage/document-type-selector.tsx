import { useCallback, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import {
  ArrowDown,
  ArrowUp,
  LoaderCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultipleSelector, {
  type Option,
} from "@/components/ui/multi-select";
import {
  useCreateDocumentType,
  useDocumentTypes,
} from "@/features/document-types/hooks";
import type { DocumentType } from "@/features/document-types/types";

const EMPTY_DOCUMENT_TYPES: DocumentType[] = [];

type DocumentTypeSelectorProps = {
  selectedIds: number[];
  initialDocumentTypes?: DocumentType[];
  onChange: (ids: number[]) => void;
  error?: string;
};

type DocumentTypeApiError = {
  message?: string;
  errors?: {
    name?: string | string[];
  };
};

function getCreateError(error: unknown) {
  const fallback = "Sənəd növü yaradılarkən xəta baş verdi.";
  if (!isAxiosError<DocumentTypeApiError>(error)) return fallback;

  const response = error.response?.data;
  const nameError = response?.errors?.name;
  if (Array.isArray(nameError)) return nameError[0] ?? fallback;
  return nameError ?? response?.message ?? fallback;
}

export default function DocumentTypeSelector({
  selectedIds,
  initialDocumentTypes = EMPTY_DOCUMENT_TYPES,
  onChange,
  error,
}: DocumentTypeSelectorProps) {
  const documentTypes = useDocumentTypes();
  const createDocumentType = useCreateDocumentType();
  const [newName, setNewName] = useState("");
  const fetchedItems = documentTypes.data?.data ?? EMPTY_DOCUMENT_TYPES;
  const items = useMemo(() => {
    const itemsById = new Map(
      initialDocumentTypes.map((item) => [item.id, item]),
    );
    for (const item of fetchedItems) itemsById.set(item.id, item);
    return [...itemsById.values()];
  }, [fetchedItems, initialDocumentTypes]);
  const itemsById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );
  const options = useMemo<Option[]>(
    () =>
      items.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      })),
    [items],
  );
  const selectedOptions = useMemo<Option[]>(
    () =>
      selectedIds.flatMap((id) => {
        const item = itemsById.get(id);
        return item ? [{ value: id.toString(), label: item.name }] : [];
      }),
    [itemsById, selectedIds],
  );
  const filterByName = useCallback(
    (value: string, search: string) => {
      const name = itemsById.get(Number(value))?.name ?? "";
      return name
        .toLocaleLowerCase("az")
        .includes(search.toLocaleLowerCase("az"))
        ? 1
        : 0;
    },
    [itemsById],
  );

  function handleSelectionChange(nextOptions: Option[]) {
    onChange(
      nextOptions
        .map((option) => Number(option.value))
        .filter(Number.isSafeInteger),
    );
  }

  function moveSelected(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= selectedIds.length) return;

    const nextIds = [...selectedIds];
    [nextIds[index], nextIds[targetIndex]] = [
      nextIds[targetIndex],
      nextIds[index],
    ];
    onChange(nextIds);
  }

  function addDocumentType() {
    const name = newName.trim();
    if (!name) return;

    const existing = items.find(
      (item) => item.name.toLocaleLowerCase("az") === name.toLocaleLowerCase("az"),
    );
    if (existing) {
      if (selectedIds.includes(existing.id)) {
        toast.info("Bu sənəd növü artıq seçilib.");
      } else {
        onChange([...selectedIds, existing.id]);
      }
      setNewName("");
      return;
    }

    createDocumentType.mutate(
      { name },
      {
        onSuccess: (response) => {
          if (!selectedIds.includes(response.data.id)) {
            onChange([...selectedIds, response.data.id]);
          }
          setNewName("");
          toast.success("Yeni sənəd növü yaradıldı.");
        },
        onError: (createError) => toast.error(getCreateError(createError)),
      },
    );
  }

  const disabled =
    documentTypes.isLoading ||
    documentTypes.isError ||
    createDocumentType.isPending;

  return (
    <div className="space-y-3">
      <Label htmlFor="permit-document-types">Tələb olunan sənəd növləri</Label>
      <MultipleSelector
        value={selectedOptions}
        options={options}
        onChange={handleSelectionChange}
        placeholder="Sənəd növlərini axtarın və seçin"
        emptyIndicator={
          <span className="text-sm text-muted-foreground">
            Uyğun sənəd növü tapılmadı.
          </span>
        }
        disabled={disabled}
        className="min-h-12 rounded-lg"
        commandProps={{ filter: filterByName }}
        inputProps={{
          id: "permit-document-types",
          "aria-invalid": !!error,
          "aria-describedby": error ? "permit-document-types-error" : undefined,
        }}
      />
      {documentTypes.isLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" />
          Sənəd növləri yüklənir...
        </p>
      ) : null}
      {documentTypes.isError ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-destructive">
          <span>Sənəd növləri yüklənmədi.</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void documentTypes.refetch()}
          >
            <RefreshCw className="size-4" />
            Yenidən yoxla
          </Button>
        </div>
      ) : null}
      {error ? (
        <p id="permit-document-types-error" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            addDocumentType();
          }}
          placeholder="Siyahıda yoxdursa, yeni sənəd adı yazın"
          disabled={disabled}
          aria-label="Yeni sənəd növünün adı"
        />
        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          disabled={disabled || !newName.trim()}
          onClick={addDocumentType}
        >
          {createDocumentType.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Yeni sənəd əlavə et
        </Button>
      </div>

      {selectedIds.length > 0 ? (
        <div className="space-y-2 rounded-lg border border-[#DFDFDF] p-3">
          <p className="text-sm font-medium text-[#1F1F1F]">
            Vətəndaşa göstərilmə sırası
          </p>
          <ol className="space-y-2">
            {selectedIds.map((id, index) => (
              <li
                key={id}
                className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2"
              >
                <span className="min-w-6 text-sm font-semibold text-primary">
                  {index + 1}.
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  {itemsById.get(id)?.name ?? `Sənəd #${id}`}
                </span>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  disabled={index === 0}
                  onClick={() => moveSelected(index, -1)}
                  aria-label={`${index + 1}-ci sənədi yuxarı daşı`}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  disabled={index === selectedIds.length - 1}
                  onClick={() => moveSelected(index, 1)}
                  aria-label={`${index + 1}-ci sənədi aşağı daşı`}
                >
                  <ArrowDown className="size-4" />
                </Button>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
