import { cookies } from "next/headers";
import { translations, extraTranslations, type Locale } from "./translations";

/** Returns the merged translation object for the current locale (server-side). */
export async function getT() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? "en") as Locale;
  const base = translations[locale] ?? translations["en"];
  const extra = extraTranslations[locale] ?? extraTranslations["en"];
  return { ...base, ...extra };
}
