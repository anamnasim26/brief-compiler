"use client";

import { useRef, useState } from "react";
import Button from "@atlaskit/button/default/button";
import IconButton from "@atlaskit/button/icon/button";
import TextArea from "@atlaskit/textarea";
import Lozenge from "@atlaskit/lozenge";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import { mockVisionDescriber } from "@/lib/providers/vision-describer";
import { newReferenceId, type Reference } from "@/lib/schema/recipe";
import { ImagePlus, X } from "lucide-react";

const ImagePlusIcon = toAtlaskitIcon(ImagePlus);
const XIcon = toAtlaskitIcon(X);

const MAX_REFERENCES = 5;
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ReferenceUploader({
  references,
  onAdd,
  onEditDescription,
  onRemove,
}: {
  references: Reference[];
  onAdd: (reference: Reference) => void;
  onEditDescription: (id: string, description: string) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [describing, setDescribing] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const room = MAX_REFERENCES - references.length;
    if (room <= 0) {
      setError(`Up to ${MAX_REFERENCES} references. Remove one to add another.`);
      return;
    }
    const toAdd = Array.from(files).slice(0, room);
    setDescribing(true);
    for (const file of toAdd) {
      if (!/^image\/(png|jpeg)$/.test(file.type)) {
        setError("Only PNG or JPG references are supported.");
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError("References must be 10 MB or smaller.");
        continue;
      }
      const dataUrl = await readFileAsDataUrl(file);
      const autoDescription = await mockVisionDescriber.describe({ fileName: file.name, sizeBytes: file.size });
      onAdd({
        id: newReferenceId(),
        fileName: file.name,
        dataUrl,
        description: autoDescription,
        autoDescription,
        edited: false,
      });
    }
    setDescribing(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          spacing="compact"
          iconBefore={ImagePlusIcon}
          onClick={() => inputRef.current?.click()}
          isDisabled={references.length >= MAX_REFERENCES}
        >
          Add reference image
        </Button>
        <span className="text-xs text-muted-foreground">
          {references.length}/{MAX_REFERENCES} · PNG or JPG, up to 10MB
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          multiple
          className="hidden"
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {describing ? <p className="text-xs text-muted-foreground">Describing reference…</p> : null}

      {references.length === 0 ? (
        <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
          Drop in 1-5 references — a moodboard, a past asset, anything that shows what you mean.
        </p>
      ) : (
        <div className="space-y-3">
          {references.map((ref) => (
            <div key={ref.id} className="flex gap-3 rounded-xl border p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ref.dataUrl} alt={ref.fileName} className="size-16 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-muted-foreground">{ref.fileName}</span>
                  <div className="flex items-center gap-1.5">
                    {ref.edited ? <Lozenge appearance="new">edited</Lozenge> : null}
                    <IconButton
                      icon={XIcon}
                      onClick={() => onRemove(ref.id)}
                      label={`Remove ${ref.fileName}`}
                      spacing="compact"
                      appearance="subtle"
                    />
                  </div>
                </div>
                <TextArea
                  value={ref.description}
                  onChange={(e) => onEditDescription(ref.id, e.target.value)}
                  minimumRows={2}
                  aria-label={`Description for ${ref.fileName}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
