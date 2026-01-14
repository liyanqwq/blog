import { ui } from "./ui";
import { SITE } from "@/config";
export const getTranslations = (locale: string = "zh-HK", key: string, args: Map<string, string> = new Map()): string => {
    const translations = ui[locale];
    const defaultTranslations = ui[SITE.lang];
    if (key in translations) {
        if (args.size > 0) {
            return translations[key].replace(/{(\w+)}/g, (match, p1: string) => args.get(p1) || match);
        }
        return translations[key] as string;
    } else if (key in defaultTranslations) {
        if (args.size > 0) {
            return defaultTranslations[key].replace(/{(\w+)}/g, (match, p1: string) => args.get(p1) || match);
        }
        return defaultTranslations[key] as string;
    } else {
        return key;
    }
}