import { ExternalLink, LoaderCircle, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface SocialLinkRow {
  id: number;
  platform: string;
  url: string;
}

const platformOptions = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "İnstagram" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tiktok", label: "TikTok" },
  { value: "telegram", label: "Telegram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X (əvvəlki Twitter)" },
] as const;

function getPlatformLabel(platform: string) {
  return platformOptions.find((option) => option.value === platform)?.label ?? platform;
}

interface SocialLinksSectionProps {
  rows: SocialLinkRow[];
  isSaving: boolean;
  onAdd: (platform: string, url: string) => Promise<boolean>;
}

export default function SocialLinksSection({ rows, isSaving, onAdd }: SocialLinksSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const selectedPlatforms = new Set(rows.map((row) => row.platform));

  function changeDialogOpen(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setPlatform("");
      setUrl("");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!platform || !url.trim()) {
      toast.error("Platforma və keçid sahələrini doldurun.");
      return;
    }
    if (await onAdd(platform, url.trim())) changeDialogOpen(false);
  }

  return (
    <section className="space-y-4 border-t border-[#DFDFDF] pt-6" aria-labelledby="social-links-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="social-links-title" className="text-base font-semibold text-[#1F1F1F]">Sosial şəbəkələr</h2>
          <p className="mt-1 text-sm text-[#797979]">Saytda göstəriləcək sosial şəbəkə keçidlərini idarə edin.</p>
        </div>
        <Button type="button" variant="outline" className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" /> Yeni sosial şəbəkə əlavə et
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#DFDFDF] p-8 text-center text-sm text-[#797979]">
          Sosial şəbəkə əlavə edilməyib.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#DFDFDF]">
          <Table>
            <TableHeader><TableRow><TableHead>Platforma</TableHead><TableHead>Keçid</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-[#1F1F1F]">{getPlatformLabel(row.platform)}</TableCell>
                  <TableCell>
                    <a href={row.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-xl items-center gap-2 text-[#286AA6] hover:underline">
                      <span className="truncate">{row.url}</span><ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={changeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni sosial şəbəkə</DialogTitle>
            <DialogDescription>Platformanı seçin və profilin tam keçidini daxil edin.</DialogDescription>
          </DialogHeader>
          <form className="space-y-5" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="new-social-platform">Platforma</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="new-social-platform"><SelectValue placeholder="Platformanı seçin" /></SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} disabled={selectedPlatforms.has(option.value)}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-social-url">Keçid</Label>
              <Input id="new-social-url" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => changeDialogOpen(false)} disabled={isSaving}>Ləğv et</Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : null} Yadda saxla
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
