/**
 * Усе, що треба змінити під нового клієнта, — тут.
 * Назва, контакти, кольори, ціни доставки і часові слоти.
 * Everything you change to rebrand the shop for a new client lives in this file.
 */
export const brand = {
  name: { uk: "Ноктюрн", en: "Nocturne" },
  tagline: {
    uk: "Нічна квіткова майстерня",
    en: "A night-time flower atelier",
  },
  city: { uk: "Житомир", en: "Zhytomyr" },
  address: { uk: "вул. Київська, 12", en: "12 Kyivska St." },
  phone: "+380 67 000 00 00",
  email: "hello@nocturne.flowers",
  instagram: "https://instagram.com/",
  telegram: "https://t.me/",
  workingHours: { uk: "Щодня 08:00–23:00", en: "Daily 08:00–23:00" },

  currency: "₴",
  deliveryFee: 150,
  freeDeliveryFrom: 2500,
  /** Скільки годин потрібно на збирання букета перед першим слотом */
  leadTimeHours: 2,
  deliverySlots: ["09:00–11:00", "11:00–13:00", "13:00–15:00", "15:00–17:00", "17:00–19:00", "19:00–21:00", "21:00–23:00"],

  /** Пароль до демо-адмінки. Для реального клієнта адмінку треба під'єднати до бекенду. */
  adminPin: "1234",

  colors: {
    ink: "#1A1220",
    plum: "#251A2B",
    plumRaised: "#33253B",
    line: "#45344E",
    moon: "#F1E8EC",
    mist: "#B4A3B6",
    accent: "#E9A9BE",
    accentInk: "#2A1220",
    sage: "#9DB08A",
  },
} as const;

export type Brand = typeof brand;
