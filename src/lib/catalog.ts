import type { ColorTag, FlowerKind, Localized, Occasion, SizeId, WrapId } from "./types";

type FlowerInfo = {
  kind: FlowerKind;
  name: Localized;
  pricePerStem: number;
  colors: { hex: string; name: Localized }[];
  /** Наповнювач: гілочки, що стоять позаду головних квітів */
  filler: boolean;
};

export const FLOWERS: FlowerInfo[] = [
  {
    kind: "rose",
    name: { uk: "Троянда", en: "Rose" },
    pricePerStem: 95,
    filler: false,
    colors: [
      { hex: "#C8324B", name: { uk: "Червона", en: "Red" } },
      { hex: "#EBA6B8", name: { uk: "Пудрова", en: "Blush" } },
      { hex: "#F3E6DA", name: { uk: "Кремова", en: "Cream" } },
      { hex: "#E6A15F", name: { uk: "Персикова", en: "Peach" } },
    ],
  },
  {
    kind: "peony",
    name: { uk: "Півонія", en: "Peony" },
    pricePerStem: 180,
    filler: false,
    colors: [
      { hex: "#EE9DB6", name: { uk: "Рожева", en: "Pink" } },
      { hex: "#F6E7EA", name: { uk: "Біла", en: "White" } },
      { hex: "#B93A63", name: { uk: "Малинова", en: "Raspberry" } },
    ],
  },
  {
    kind: "ranunculus",
    name: { uk: "Ранункулюс", en: "Ranunculus" },
    pricePerStem: 120,
    filler: false,
    colors: [
      { hex: "#F0A385", name: { uk: "Кораловий", en: "Coral" } },
      { hex: "#F5DDE3", name: { uk: "Ніжно-рожевий", en: "Pale pink" } },
      { hex: "#8E3B6E", name: { uk: "Сливовий", en: "Plum" } },
    ],
  },
  {
    kind: "tulip",
    name: { uk: "Тюльпан", en: "Tulip" },
    pricePerStem: 60,
    filler: false,
    colors: [
      { hex: "#D9415A", name: { uk: "Червоний", en: "Red" } },
      { hex: "#F4D35E", name: { uk: "Жовтий", en: "Yellow" } },
      { hex: "#9B6BC3", name: { uk: "Бузковий", en: "Lilac" } },
      { hex: "#F7EFE6", name: { uk: "Білий", en: "White" } },
    ],
  },
  {
    kind: "hydrangea",
    name: { uk: "Гортензія", en: "Hydrangea" },
    pricePerStem: 210,
    filler: false,
    colors: [
      { hex: "#9DB4E3", name: { uk: "Блакитна", en: "Blue" } },
      { hex: "#C9A6DD", name: { uk: "Лавандова", en: "Lavender" } },
      { hex: "#EEF0E6", name: { uk: "Біла", en: "White" } },
    ],
  },
  {
    kind: "daisy",
    name: { uk: "Ромашка", en: "Daisy" },
    pricePerStem: 40,
    filler: false,
    colors: [{ hex: "#FBF8F2", name: { uk: "Біла", en: "White" } }],
  },
  {
    kind: "eucalyptus",
    name: { uk: "Евкаліпт", en: "Eucalyptus" },
    pricePerStem: 55,
    filler: true,
    colors: [{ hex: "#8FA898", name: { uk: "Сріблястий", en: "Silver" } }],
  },
  {
    kind: "lavender",
    name: { uk: "Лаванда", en: "Lavender" },
    pricePerStem: 35,
    filler: true,
    colors: [{ hex: "#9C83C9", name: { uk: "Лавандова", en: "Lavender" } }],
  },
  {
    kind: "gypsophila",
    name: { uk: "Гіпсофіла", en: "Baby's breath" },
    pricePerStem: 45,
    filler: true,
    colors: [{ hex: "#F7F2F4", name: { uk: "Біла", en: "White" } }],
  },
];

export const flowerInfo = (kind: FlowerKind): FlowerInfo => {
  const info = FLOWERS.find((flower) => flower.kind === kind);
  if (!info) throw new Error(`Unknown flower kind: ${kind}`);
  return info;
};

export const WRAPS: { id: WrapId; name: Localized; price: number; back: string; front: string }[] = [
  { id: "kraft", name: { uk: "Крафт", en: "Kraft" }, price: 0, back: "#8A6A4F", front: "#B48C68" },
  { id: "night", name: { uk: "Нічний шовк", en: "Night silk" }, price: 120, back: "#2A1F31", front: "#3E2F48" },
  { id: "silk", name: { uk: "Перламутр", en: "Pearl" }, price: 150, back: "#C9BFC6", front: "#EDE5EA" },
  { id: "none", name: { uk: "Без пакування", en: "No wrap" }, price: 0, back: "transparent", front: "transparent" },
];

export const wrapInfo = (id: WrapId) => WRAPS.find((wrap) => wrap.id === id) ?? WRAPS[0];

export const RIBBONS = ["#E9A9BE", "#F1E8EC", "#9DB08A", "#C8324B", "#1A1220"];

export const OCCASIONS: { id: Occasion; name: Localized }[] = [
  { id: "birthday", name: { uk: "День народження", en: "Birthday" } },
  { id: "love", name: { uk: "Коханій людині", en: "For a loved one" } },
  { id: "mom", name: { uk: "Мамі", en: "For mom" } },
  { id: "thanks", name: { uk: "Подякувати", en: "Thank you" } },
  { id: "wedding", name: { uk: "Весілля", en: "Wedding" } },
  { id: "justBecause", name: { uk: "Просто так", en: "Just because" } },
];

export const COLOR_TAGS: { id: ColorTag; name: Localized; swatch: string }[] = [
  { id: "pink", name: { uk: "Рожеві", en: "Pink" }, swatch: "#EBA6B8" },
  { id: "white", name: { uk: "Білі", en: "White" }, swatch: "#F3ECE6" },
  { id: "red", name: { uk: "Червоні", en: "Red" }, swatch: "#C8324B" },
  { id: "purple", name: { uk: "Фіолетові", en: "Purple" }, swatch: "#9C83C9" },
  { id: "mixed", name: { uk: "Мікс", en: "Mixed" }, swatch: "conic-gradient(#EBA6B8, #F4D35E, #9DB4E3, #C8324B, #EBA6B8)" },
];

export const SIZES: { id: SizeId; multiplier: number; name: Localized }[] = [
  { id: "S", multiplier: 0.75, name: { uk: "Компактний", en: "Petite" } },
  { id: "M", multiplier: 1, name: { uk: "Класичний", en: "Classic" } },
  { id: "L", multiplier: 1.5, name: { uk: "Розкішний", en: "Grand" } },
];

export const sizePrice = (basePrice: number, size: SizeId) => {
  const multiplier = SIZES.find((option) => option.id === size)?.multiplier ?? 1;
  return Math.round((basePrice * multiplier) / 10) * 10;
};
