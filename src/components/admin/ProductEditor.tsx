"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { COLOR_TAGS, FLOWERS, OCCASIONS, RIBBONS, WRAPS, flowerInfo } from "@/lib/catalog";
import { groupStems, type CompositionLine } from "@/lib/composition";
import { useLocalize, useT } from "@/lib/hooks";
import type { Badge, ColorTag, FlowerKind, Product, Stem, WrapId } from "@/lib/types";
import { CloseIcon, MinusIcon, PlusIcon } from "../icons";
import { ProductArt } from "../ProductArt";
import { buttonGhost, buttonPrimary, chipClass, fieldClass } from "../ui";

type ProductEditorProps = {
  product: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
};

const expand = (lines: CompositionLine[]): Stem[] =>
  lines.flatMap((line) => Array.from({ length: line.count }, () => ({ kind: line.kind, color: line.color })));

const Label = ({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-sm text-mist">
    {children}
  </label>
);

export const ProductEditor = ({ product, onSave, onClose }: ProductEditorProps) => {
  const t = useT();
  const localize = useLocalize();
  const [draft, setDraft] = useState<Product>(product);
  const [lines, setLines] = useState<CompositionLine[]>(() => groupStems(product.composition));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = <K extends keyof Product>(key: K, value: Product[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const updateLine = (index: number, patch: Partial<CompositionLine>) =>
    setLines((current) =>
      current.map((line, lineIndex) => {
        if (lineIndex !== index) return line;
        const next = { ...line, ...patch };
        if (patch.kind) next.color = flowerInfo(patch.kind).colors[0]?.hex ?? line.color;
        return next;
      }),
    );

  const composition = expand(lines);
  const preview = { ...draft, composition };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave({ ...draft, composition, name: { uk: draft.name.uk.trim(), en: draft.name.en.trim() || draft.name.uk.trim() } });
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t.admin.edit}>
      <button type="button" aria-label={t.admin.cancel} className="absolute inset-0 bg-black/70" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="absolute inset-y-0 right-0 flex w-full max-w-5xl flex-col bg-ink shadow-[0_0_60px_rgba(0,0,0,0.5)]"
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-2xl">{draft.name.uk || t.admin.newProduct}</h2>
          <button type="button" onClick={onClose} aria-label={t.admin.cancel} className="grid h-10 w-10 place-items-center rounded-full hover:bg-plum">
            <CloseIcon />
          </button>
        </header>

        <div className="grid flex-1 gap-8 overflow-y-auto px-6 py-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name-uk">{t.admin.nameUk}</Label>
                <input id="name-uk" required className={fieldClass} value={draft.name.uk} onChange={(e) => set("name", { ...draft.name, uk: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="name-en">{t.admin.nameEn}</Label>
                <input id="name-en" className={fieldClass} value={draft.name.en} onChange={(e) => set("name", { ...draft.name, en: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="desc-uk">{t.admin.descriptionUk}</Label>
                <textarea
                  id="desc-uk"
                  rows={3}
                  className={`${fieldClass} h-auto resize-y py-3`}
                  value={draft.description.uk}
                  onChange={(e) => set("description", { ...draft.description, uk: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="desc-en">{t.admin.descriptionEn}</Label>
                <textarea
                  id="desc-en"
                  rows={3}
                  className={`${fieldClass} h-auto resize-y py-3`}
                  value={draft.description.en}
                  onChange={(e) => set("description", { ...draft.description, en: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">{t.admin.price}</Label>
                <input
                  id="price"
                  type="number"
                  min={0}
                  step={1}
                  required
                  className={`${fieldClass} tabular`}
                  value={draft.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="badge">{t.admin.badge}</Label>
                <select
                  id="badge"
                  className={fieldClass}
                  value={draft.badge ?? ""}
                  onChange={(e) => set("badge", (e.target.value || undefined) as Badge | undefined)}
                >
                  <option value="">{t.admin.noBadge}</option>
                  <option value="bestseller">{t.product.bestseller}</option>
                  <option value="new">{t.product.new}</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="image">{t.admin.image}</Label>
                <input
                  id="image"
                  type="url"
                  placeholder="https://"
                  className={fieldClass}
                  value={draft.image ?? ""}
                  onChange={(e) => set("image", e.target.value.trim() || undefined)}
                />
                <p className="mt-1.5 text-sm text-mist/80">{t.admin.imageHint}</p>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 accent-[var(--brand-accent)]"
                checked={draft.available}
                onChange={(e) => set("available", e.target.checked)}
              />
              {t.admin.available}
            </label>

            <section>
              <Label>{t.admin.composition}</Label>
              <ul className="space-y-2">
                {lines.map((line, index) => {
                  const info = flowerInfo(line.kind);
                  return (
                    <li key={index} className="flex flex-wrap items-center gap-2 rounded-2xl border border-line p-2">
                      <select
                        aria-label={t.catalog.flower}
                        className="h-10 flex-1 rounded-xl bg-plum px-3 text-sm"
                        value={line.kind}
                        onChange={(e) => updateLine(index, { kind: e.target.value as FlowerKind })}
                      >
                        {FLOWERS.map((flower) => (
                          <option key={flower.kind} value={flower.kind}>
                            {localize(flower.name)}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-1">
                        {info.colors.map((color) => (
                          <button
                            key={color.hex}
                            type="button"
                            aria-label={localize(color.name)}
                            aria-pressed={color.hex === line.color}
                            onClick={() => updateLine(index, { color: color.hex })}
                            className={`h-8 w-8 rounded-full ${color.hex === line.color ? "ring-2 ring-accent ring-offset-2 ring-offset-ink" : "ring-1 ring-line"}`}
                            style={{ background: color.hex }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={t.builder.decrease}
                          onClick={() => (line.count > 1 ? updateLine(index, { count: line.count - 1 }) : setLines((current) => current.filter((_, i) => i !== index)))}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-plum-raised"
                        >
                          <MinusIcon size={16} />
                        </button>
                        <span className="tabular w-6 text-center">{line.count}</span>
                        <button
                          type="button"
                          aria-label={t.builder.increase}
                          onClick={() => updateLine(index, { count: Math.min(25, line.count + 1) })}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-plum-raised"
                        >
                          <PlusIcon size={16} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                className={`${buttonGhost} mt-3 h-10 px-4 text-sm`}
                onClick={() => setLines((current) => [...current, { kind: "rose", color: FLOWERS[0]?.colors[0]?.hex ?? "#C8324B", count: 3 }])}
              >
                <PlusIcon size={16} /> {t.admin.addStem}
              </button>
            </section>

            <section>
              <Label>{t.admin.occasions}</Label>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((occasion) => {
                  const active = draft.occasions.includes(occasion.id);
                  return (
                    <button
                      key={occasion.id}
                      type="button"
                      aria-pressed={active}
                      className={chipClass(active)}
                      onClick={() =>
                        set("occasions", active ? draft.occasions.filter((id) => id !== occasion.id) : [...draft.occasions, occasion.id])
                      }
                    >
                      {localize(occasion.name)}
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="color">{t.admin.color}</Label>
                <select id="color" className={fieldClass} value={draft.color} onChange={(e) => set("color", e.target.value as ColorTag)}>
                  {COLOR_TAGS.map((color) => (
                    <option key={color.id} value={color.id}>
                      {localize(color.name)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="wrap">{t.admin.wrap}</Label>
                <select id="wrap" className={fieldClass} value={draft.wrap} onChange={(e) => set("wrap", e.target.value as WrapId)}>
                  {WRAPS.map((wrap) => (
                    <option key={wrap.id} value={wrap.id}>
                      {localize(wrap.name)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>{t.builder.ribbon}</Label>
                <div className="flex h-12 items-center gap-1.5">
                  {RIBBONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={color}
                      aria-pressed={color === draft.ribbon}
                      onClick={() => set("ribbon", color)}
                      className={`h-8 w-8 rounded-full ${color === draft.ribbon ? "ring-2 ring-accent ring-offset-2 ring-offset-ink" : "ring-1 ring-line"}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:sticky md:top-0 md:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-plum">
              <div className="absolute inset-x-[6%] bottom-0 top-[4%]">
                <ProductArt product={preview} title={draft.name.uk} />
              </div>
            </div>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button type="button" className={buttonGhost} onClick={onClose}>
            {t.admin.cancel}
          </button>
          <button type="submit" className={buttonPrimary} disabled={!draft.name.uk.trim() || composition.length === 0}>
            {t.admin.save}
          </button>
        </footer>
      </form>
    </div>
  );
};
