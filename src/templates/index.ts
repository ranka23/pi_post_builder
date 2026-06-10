import { TemplateConfig, Language, Style } from './types';
import { englishTemplates } from './english';
import { hindiTemplates } from './hindi';
import { vietnameseTemplates } from './vietnamese';
import { indonesianTemplates } from './indonesian';
import { spanishTemplates } from './spanish';

export type { TemplateConfig, Language, Style };

const allTemplates: Record<Language, Record<string, TemplateConfig[]>> = {
  english: englishTemplates,
  hindi: hindiTemplates,
  vietnamese: vietnameseTemplates,
  indonesian: indonesianTemplates,
  spanish: spanishTemplates,
};

export function generateTemplates(
  username: string,
  language: Language,
  style: Style
): TemplateConfig[] {
  const langTemplates = allTemplates[language]?.[style] || allTemplates.english.excited;
  return langTemplates.map((t) => ({
    ...t,
    body: t.body.replace(/\{\{USERNAME\}\}/g, username || 'YourUsername'),
  }));
}

export const languageLabels: Record<Language, string> = {
  english: '🇺🇸 English',
  hindi: '🇮🇳 हिन्दी',
  vietnamese: '🇻🇳 Tiếng Việt',
  indonesian: '🇮🇩 Bahasa Indonesia',
  spanish: '🇪🇸 Español',
};

export const styleLabels: Record<Style, { label: string; desc: string; icon: string }> = {
  excited: { label: 'Excited', desc: 'Emoji-packed, high-energy, attention-grabbing', icon: '🔥' },
  professional: { label: 'Professional', desc: 'Clean, credible, trust-building', icon: '💼' },
  short: { label: 'Short', desc: 'Quick copy-paste, perfect for comments', icon: '⚡' },
};

// Get template count per language
export function getTemplateCount(language: Language): number {
  const lang = allTemplates[language];
  if (!lang) return 0;
  return Object.values(lang).reduce((total, templates) => total + templates.length, 0);
}

// Get total template count
export function getTotalTemplateCount(): number {
  return Object.keys(allTemplates).reduce((total, lang) => {
    return total + getTemplateCount(lang as Language);
  }, 0);
}
