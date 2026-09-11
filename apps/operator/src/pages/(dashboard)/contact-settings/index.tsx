import { isAxiosError } from "axios";
import { LoaderCircle, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import {
  useAdminContactSettings,
  useUpdateAdminContactSettings,
} from "@/features/contact-settings/hooks";
import type { ContactSettings } from "@/features/contact-settings/types";
import ContactDetailsSection from "./contact-details-section";
import SocialLinksSection, { type SocialLinkRow } from "./social-links-section";

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function ContactSettingsForm({ settings }: { settings: ContactSettings }) {
  const updateSettings = useUpdateAdminContactSettings();
  const [phone, setPhone] = useState(settings.phone ?? "");
  const [email, setEmail] = useState(settings.email ?? "");
  const [address, setAddress] = useState(settings.address ?? "");
  const [socialLinks, setSocialLinks] = useState<SocialLinkRow[]>(() =>
    Object.entries(settings.social_links ?? {}).map(([platform, url], index) => ({
      id: index,
      platform,
      url,
    })),
  );

  function applySavedSettings(savedSettings: ContactSettings) {
    const savedLinks = Object.entries(savedSettings.social_links ?? {}).map(
      ([platform, url], index) => ({ id: index, platform, url }),
    );

    setPhone(savedSettings.phone ?? "");
    setEmail(savedSettings.email ?? "");
    setAddress(savedSettings.address ?? "");
    setSocialLinks(savedLinks);
  }

  async function addSocialLink(platform: string, url: string) {
    if (socialLinks.some((row) => row.platform === platform)) {
      toast.error("Bu sosial şəbəkə artıq əlavə edilib.");
      return false;
    }

    if (!isValidUrl(url)) {
      toast.error("Sosial şəbəkə keçidi http:// və ya https:// ilə başlamalıdır.");
      return false;
    }

    const social_links = Object.fromEntries([
      ...socialLinks.map((row) => [row.platform, row.url] as const),
      [platform, url] as const,
    ]);

    try {
      const response = await updateSettings.mutateAsync({
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        social_links,
      });
      applySavedSettings(response.data);
      toast.success(response.message || "Sosial şəbəkə əlavə edildi.");
      return true;
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Sosial şəbəkə əlavə edilərkən xəta baş verdi."),
      );
      return false;
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedLinks = socialLinks.map((row) => ({
      platform: row.platform.trim().toLowerCase(),
      url: row.url.trim(),
    }));
    const platforms = normalizedLinks.map((row) => row.platform);

    if (normalizedLinks.some((row) => !row.platform || !row.url)) {
      toast.error("Sosial şəbəkə adı və keçidi birlikdə doldurulmalıdır.");
      return;
    }

    if (new Set(platforms).size !== platforms.length) {
      toast.error("Eyni sosial şəbəkə yalnız bir dəfə əlavə edilə bilər.");
      return;
    }

    if (normalizedLinks.some((row) => !isValidUrl(row.url))) {
      toast.error("Sosial şəbəkə keçidləri http:// və ya https:// ilə başlamalıdır.");
      return;
    }

    const social_links = Object.fromEntries(
      normalizedLinks.map((row) => [row.platform, row.url]),
    );

    updateSettings.mutate(
      {
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        social_links,
      },
      {
        onSuccess: (response) => {
          applySavedSettings(response.data);
          toast.success(response.message || "Əlaqə məlumatları yeniləndi.");
        },
        onError: (error) =>
          toast.error(
            getErrorMessage(error, "Əlaqə məlumatları yenilənərkən xəta baş verdi."),
          ),
      },
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <ContactDetailsSection
        phone={phone}
        email={email}
        address={address}
        onPhoneChange={setPhone}
        onEmailChange={setEmail}
        onAddressChange={setAddress}
      />

      <SocialLinksSection
        rows={socialLinks}
        isSaving={updateSettings.isPending}
        onAdd={addSocialLink}
      />

      <div className="flex justify-end border-t border-[#DFDFDF] pt-6">
        <Button type="submit" className="gap-2" disabled={updateSettings.isPending}>
          {updateSettings.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Yadda saxla
        </Button>
      </div>
    </form>
  );
}

export default function ContactSettingsPage() {
  const settingsQuery = useAdminContactSettings();

  return (
    <div className="relative space-y-4">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">
        Əlaqə Ayarları
      </h1>

      <TableLayout className="space-y-6">
        <PageTitle
          title="Əlaqə məlumatları"
          text="Saytda görünən əlaqə məlumatlarını və sosial şəbəkələri idarə edin."
        />

        {settingsQuery.isLoading ? (
          <div className="flex justify-center py-20" aria-label="Əlaqə məlumatları yüklənir">
            <LoaderCircle className="size-10 animate-spin text-primary" />
          </div>
        ) : settingsQuery.isError || !settingsQuery.data?.data ? (
          <div className="rounded-lg bg-destructive/5 p-6 text-center text-sm text-destructive">
            Əlaqə məlumatları yüklənmədi.
          </div>
        ) : (
          <ContactSettingsForm settings={settingsQuery.data.data} />
        )}
      </TableLayout>
    </div>
  );
}
