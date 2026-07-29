import { useRef } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface A4PreviewField {
  label: string;
  value: string;
}

interface A4PreviewProps {
  date: string;
  srn: string;
  title: string;
  applicationTitle: string;
  fields: A4PreviewField[];
}

export default function A4Preview({
  date,
  srn,
  title,
  applicationTitle,
  fields,
}: A4PreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const win = window.open("", "_blank");
    if (!win) return;

    const styles = document.querySelectorAll("style, link[rel='stylesheet']");
    let styleHTML = "";
    styles.forEach((s) => (styleHTML += s.outerHTML));

    win.document.write(`
      <html>
        <head>${styleHTML}</head>
        <body>
          ${content.outerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  return (
    <div className="bg-white border border-[#DFDFDF] rounded-xl max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-10 pb-0">
        <div className="text-sm leading-5">
          <p className="text-[#797979] font-normal">{date}</p>
          <p className="text-[#286AA6] font-medium">{srn}</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-3 h-auto rounded-lg border-[#DFDFDF] text-[#286AA6] font-semibold text-base leading-6 shadow-none"
          onClick={handlePrint}
        >
          <Printer className="size-6" />
          Çap et
        </Button>
      </div>

      <div ref={printRef} className="flex flex-col items-center gap-5 p-10 pt-5">
        <div className="flex flex-col items-center gap-4 text-center max-w-[441px]">
          <p className="text-[#1F1F1F] font-semibold text-base leading-6">
            {title}
          </p>
          <p className="text-[#1F1F1F] font-bold text-2xl leading-8">
            {applicationTitle}
          </p>
        </div>

        <div className="w-full text-sm font-medium leading-5">
          {fields.map((field, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-[14px] border-b-[0.8px] border-[#DFDFDF]"
            >
              <span className="text-[#797979]">{field.label}</span>
              <span className="text-[#1F1F1F] text-right">{field.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
