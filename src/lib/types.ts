export type Locale = "uk" | "en";
export type Localized = Record<Locale, string>;

export type FlowerKind =
  | "rose"
  | "peony"
  | "ranunculus"
  | "tulip"
  | "daisy"
  | "hydrangea"
  | "lavender"
  | "eucalyptus"
  | "gypsophila";

export type Stem = { kind: FlowerKind; color: string };

export type Occasion = "birthday" | "love" | "thanks" | "justBecause" | "wedding" | "mom";
export type ColorTag = "pink" | "white" | "red" | "purple" | "mixed";
export type WrapId = "kraft" | "night" | "silk" | "none";
export type SizeId = "S" | "M" | "L";
export type Badge = "new" | "bestseller";

export type Product = {
  id: string;
  name: Localized;
  description: Localized;
  /** Ціна розміру M */
  price: number;
  occasions: Occasion[];
  color: ColorTag;
  composition: Stem[];
  wrap: WrapId;
  ribbon: string;
  image?: string;
  badge?: Badge;
  available: boolean;
};

export type CartItem = {
  key: string;
  productId?: string;
  name: Localized;
  unitPrice: number;
  qty: number;
  size?: SizeId;
  composition: Stem[];
  wrap: WrapId;
  ribbon: string;
  image?: string;
  custom: boolean;
};

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  delivery: {
    date: string;
    slot: string;
    address: string;
    recipientName: string;
    recipientPhone: string;
  };
  customer: { name: string; phone: string };
  cardText: string;
  anonymous: boolean;
  pickup: boolean;
};
