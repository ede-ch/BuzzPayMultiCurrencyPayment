import { Coins } from "lucide-react";
import { CURRENCY_TO_COUNTRY } from "@/lib/currencies";

/**
 * Renders a small flag for currencies with a known representative country
 * (via FlagCDN). Falls back to a generic coin icon for currencies that don't
 * map cleanly to a single country (e.g. XOF, XCD) instead of showing a
 * misleading flag.
 */
export default function CurrencyIcon({
  currencyCode,
  className = "w-5",
}: {
  currencyCode: string;
  className?: string;
}) {
  const countryCode = CURRENCY_TO_COUNTRY[currencyCode];

  if (!countryCode) {
    return (
      <Coins
        className={`shrink-0 text-muted-default ${className}`}
        strokeWidth={1.75}
      />
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
      alt={`${currencyCode} flag`}
      className={`rounded-[2px] object-cover shrink-0 ${className}`}
    />
  );
}
