import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContactDetailsSectionProps {
  phone: string;
  email: string;
  address: string;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onAddressChange: (value: string) => void;
}

export default function ContactDetailsSection({
  phone,
  email,
  address,
  onPhoneChange,
  onEmailChange,
  onAddressChange,
}: ContactDetailsSectionProps) {
  return (
    <section className="grid gap-5 lg:grid-cols-2" aria-labelledby="contact-details-title">
      <div className="lg:col-span-2">
        <h2 id="contact-details-title" className="text-base font-semibold text-[#1F1F1F]">
          Əlaqə məlumatları
        </h2>
        <p className="mt-1 text-sm text-[#797979]">
          Bu məlumatlar saytın footer bölməsində göstəriləcək.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-phone">Telefon</Label>
        <Input
          id="contact-phone"
          type="tel"
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder="+994 12 310 14 00"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">E-poçt</Label>
        <Input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="info@example.az"
        />
      </div>
      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="contact-address">Ünvan</Label>
        <Textarea
          id="contact-address"
          className="min-h-28"
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
          placeholder="Ünvanı daxil edin"
        />
      </div>
    </section>
  );
}
