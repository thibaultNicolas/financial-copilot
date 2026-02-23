"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "fr" : "en";
    // Replace current locale in path
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 hover:border-gray-300 transition-all text-gray-600 hover:text-gray-900"
    >
      <span style={{ opacity: locale === "en" ? 1 : 0.4 }}>EN</span>
      <span className="text-gray-300">|</span>
      <span style={{ opacity: locale === "fr" ? 1 : 0.4 }}>FR</span>
    </button>
  );
}
