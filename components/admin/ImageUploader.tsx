"use client";

import Image from "next/image";
import { useState } from "react";
import { api } from "./ui";

/** Signed direct upload to Cloudinary. Value is a list of image URLs (first = main photo). */
export function ImageUploader({ value, onChange, max = 8 }: { value: string[]; onChange: (v: string[]) => void; max?: number }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const sig = await api<{ cloudName: string; apiKey: string; folder: string; timestamp: number; signature: string }>("/api/admin/upload", "POST");
      if (!sig.ok) throw new Error(sig.data.error ?? "Upload not available.");
      const urls: string[] = [];
      for (const file of Array.from(files).slice(0, max - value.length)) {
        if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) throw new Error("Images only, up to 8 MB each.");
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", sig.data.apiKey);
        fd.append("timestamp", String(sig.data.timestamp));
        fd.append("folder", sig.data.folder);
        fd.append("signature", sig.data.signature);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.data.cloudName}/image/upload`, { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message ?? "Upload failed.");
        // Deliver resized WebP/AVIF automatically.
        urls.push(String(json.secure_url).replace("/upload/", "/upload/f_auto,q_auto,c_limit,w_1600/"));
      }
      onChange([...value, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const move = (i: number, d: number) => {
    const next = [...value];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x);
    onChange(next);
  };

  return (
    <div>
      <ul className="flex flex-wrap gap-3">
        {value.map((src, i) => (
          <li key={src} className="w-28">
            <span className="relative block aspect-[4/5] bg-rose">
              <Image src={src} alt="" fill sizes="112px" className="object-cover" />
              {i === 0 && <span className="absolute top-1 left-1 bg-espresso px-1.5 text-[10px] text-cream">Main</span>}
            </span>
            <span className="mt-1 flex justify-between text-xs">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="disabled:opacity-30" aria-label="Move left">←</button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-danger underline">Remove</button>
              <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="disabled:opacity-30" aria-label="Move right">→</button>
            </span>
          </li>
        ))}
        {value.length < max && (
          <li>
            <label className={`grid aspect-[4/5] w-28 cursor-pointer place-items-center border border-dashed border-ink/40 text-center text-xs hover:border-ink ${busy ? "opacity-50" : ""}`}>
              {busy ? "Uploading…" : "+ Add photos"}
              <input type="file" accept="image/*" multiple className="sr-only" disabled={busy} onChange={(e) => upload(e.target.files)} />
            </label>
          </li>
        )}
      </ul>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {!value.length && <p className="mt-2 text-xs text-muted">No photos: the store shows the category photo.</p>}
    </div>
  );
}
