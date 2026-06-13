// Mirrors config/currencies.php (ISO 4217 alphabetic currency codes accepted by the API)
export const ISO_4217_CURRENCIES = [
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
  "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
  "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY",
  "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP",
  "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD",
  "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS",
  "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR",
  "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD",
  "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU",
  "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK",
  "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG",
  "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK",
  "SGD", "SHP", "SLE", "SOS", "SRD", "SSP", "STN", "SYP", "SZL", "THB",
  "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX",
  "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XOF",
  "XPF", "YER", "ZAR", "ZMW", "ZWL",
] as const;

// Best-effort ISO 4217 currency -> representative ISO 3166-1 alpha-2 country
// code, used to look up a flag icon (e.g. via FlagCDN). Not every currency has
// a single "home" country (e.g. shared currencies like XOF/XCD), so those map
// to one representative member country — anything still unmapped falls back
// to a generic icon.
export const CURRENCY_TO_COUNTRY: Record<string, string> = {
  AED: "ae", AFN: "af", ALL: "al", AMD: "am", ANG: "cw", AOA: "ao",
  ARS: "ar", AUD: "au", AWG: "aw", AZN: "az", BAM: "ba", BBD: "bb",
  BDT: "bd", BGN: "bg", BHD: "bh", BIF: "bi", BMD: "bm", BND: "bn",
  BOB: "bo", BRL: "br", BSD: "bs", BTN: "bt", BWP: "bw", BYN: "by",
  BZD: "bz", CAD: "ca", CDF: "cd", CHF: "ch", CLP: "cl", CNY: "cn",
  COP: "co", CRC: "cr", CUP: "cu", CVE: "cv", CZK: "cz", DJF: "dj",
  DKK: "dk", DOP: "do", DZD: "dz", EGP: "eg", ERN: "er", ETB: "et",
  EUR: "eu", FJD: "fj", FKP: "fk", GBP: "gb", GEL: "ge", GHS: "gh",
  GIP: "gi", GMD: "gm", GNF: "gn", GTQ: "gt", GYD: "gy", HKD: "hk",
  HNL: "hn", HRK: "hr", HTG: "ht", HUF: "hu", IDR: "id", ILS: "il",
  INR: "in", IQD: "iq", IRR: "ir", ISK: "is", JMD: "jm", JOD: "jo",
  JPY: "jp", KES: "ke", KGS: "kg", KHR: "kh", KMF: "km", KPW: "kp",
  KRW: "kr", KWD: "kw", KYD: "ky", KZT: "kz", LAK: "la", LBP: "lb",
  LKR: "lk", LRD: "lr", LSL: "ls", LYD: "ly", MAD: "ma", MDL: "md",
  MGA: "mg", MKD: "mk", MMK: "mm", MNT: "mn", MOP: "mo", MRU: "mr",
  MUR: "mu", MVR: "mv", MWK: "mw", MXN: "mx", MYR: "my", MZN: "mz",
  NAD: "na", NGN: "ng", NIO: "ni", NOK: "no", NPR: "np", NZD: "nz",
  OMR: "om", PAB: "pa", PEN: "pe", PGK: "pg", PHP: "ph", PKR: "pk",
  PLN: "pl", PYG: "py", QAR: "qa", RON: "ro", RSD: "rs", RUB: "ru",
  RWF: "rw", SAR: "sa", SBD: "sb", SCR: "sc", SDG: "sd", SEK: "se",
  SGD: "sg", SHP: "sh", SLE: "sl", SOS: "so", SRD: "sr", SSP: "ss",
  STN: "st", SYP: "sy", SZL: "sz", THB: "th", TJS: "tj", TMT: "tm",
  TND: "tn", TOP: "to", TRY: "tr", TTD: "tt", TWD: "tw", TZS: "tz",
  UAH: "ua", UGX: "ug", USD: "us", UYU: "uy", UZS: "uz", VES: "ve",
  VND: "vn", VUV: "vu", WST: "ws", XAF: "cm", XCD: "ag", XOF: "sn",
  XPF: "pf", YER: "ye", ZAR: "za", ZMW: "zm", ZWL: "zw",
};

export function getCurrencySymbol(code: string): string {
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "symbol",
    }).formatToParts(0);
    const symbol = parts.find((part) => part.type === "currency")?.value;
    return symbol && symbol !== code ? symbol : "";
  } catch {
    return "";
  }
}
