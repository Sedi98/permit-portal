import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { LinkPopover } from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

type TiptapNoteEditorProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export default function TiptapNoteEditor({
  id,
  label = "Qeyd",
  value = "",
  onChange,
  className,
  required,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}: TiptapNoteEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
      Underline,
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    editorProps: {
      attributes: {
        "aria-label": label,
        "aria-invalid": ariaInvalid ? "true" : "false",
        ...(id ? { id } : {}),
        ...(ariaDescribedby ? { "aria-describedby": ariaDescribedby } : {}),
        ...(required ? { "aria-required": "true" } : {}),
        class: "tiptap simple-editor",
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      onChange?.(updatedEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return;
    editor.commands.setContent(value);
  }, [editor, value]);

  return (
    <div className={`flex w-full flex-col gap-2 ${className ?? ""}`}>
      <label
        htmlFor={id}
        className="text-sm font-medium leading-5 text-[#797979]"
      >
        {label}
      </label>
      <div className="w-full">
        <Toolbar className="rounded-b-none rounded-t-lg! border">
          <ToolbarGroup>
            <UndoRedoButton
              editor={editor ?? undefined}
              action="undo"
              tooltip="Geri al"
              aria-label="Geri al"
            />
            <UndoRedoButton
              editor={editor ?? undefined}
              action="redo"
              tooltip="Təkrar et"
              aria-label="Təkrar et"
            />
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <HeadingDropdownMenu
              editor={editor ?? undefined}
              levels={[1, 2, 3, 4, 5, 6]}
              tooltip="Başlıq səviyyəsi"
              aria-label="Başlıq səviyyəsi"
            />
            <ListDropdownMenu
              editor={editor ?? undefined}
              types={["bulletList", "orderedList", "taskList"]}
              tooltip="Siyahı seçimləri"
              aria-label="Siyahı seçimləri"
            />
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <TextAlignButton
              editor={editor ?? undefined}
              align="left"
              tooltip="Sola düzləndir"
              aria-label="Sola düzləndir"
            />
            <TextAlignButton
              editor={editor ?? undefined}
              align="center"
              tooltip="Mərkəzə düzləndir"
              aria-label="Mərkəzə düzləndir"
            />
            <TextAlignButton
              editor={editor ?? undefined}
              align="right"
              tooltip="Sağa düzləndir"
              aria-label="Sağa düzləndir"
            />
            <TextAlignButton
              editor={editor ?? undefined}
              align="justify"
              tooltip="Eninə düzləndir"
              aria-label="Eninə düzləndir"
            />
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <MarkButton
              editor={editor ?? undefined}
              type="strike"
              tooltip="Üstündən xətt"
              aria-label="Üstündən xətt"
            />
            <MarkButton
              editor={editor ?? undefined}
              type="underline"
              tooltip="Altından xətt"
              aria-label="Altından xətt"
            />
            <LinkPopover
              editor={editor ?? undefined}
              tooltip="Keçid"
              aria-label="Keçid"
            />
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <MarkButton
              editor={editor ?? undefined}
              type="subscript"
              tooltip="Alt indeks"
              aria-label="Alt indeks"
            />
            <MarkButton
              editor={editor ?? undefined}
              type="superscript"
              tooltip="Üst indeks"
              aria-label="Üst indeks"
            />
          </ToolbarGroup>
        </Toolbar>
        <div className="min-h-[152px] rounded-b-lg border border-t-0 border-[#DFDFDF] bg-white px-3 py-3 text-sm">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
