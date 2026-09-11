/**
 * UI string dictionary. German is the shipping locale; English keys are stubbed
 * so a second locale can be switched on later without hunting for hard-coded
 * strings across components. Story bodies live in MDX, not here.
 */
export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

type Dict = Record<string, string>;

const de: Dict = {
  'nav.stories': 'Geschichten',
  'nav.index': 'Index',
  'nav.about': 'Über',
  'nav.menu': 'Menü',
  'nav.close': 'Schliessen',
  'skip.content': 'Zum Inhalt springen',
  'home.tagline': 'Geschichten für den genaueren Blick.',
  'home.featured': 'Im Fokus',
  'home.selected': 'Ausgewählte Geschichten',
  'home.topics': 'Themen',
  'home.manifest': 'Manifest',
  'story.readingTime': 'Lesezeit',
  'story.published': 'Veröffentlicht',
  'story.updated': 'Aktualisiert',
  'story.scroll': 'Weiterscrollen',
  'story.sources': 'Quellen',
  'story.chapter': 'Kapitel',
  'story.continue': 'Nächstes Kapitel',
  'newsletter.title': 'Aperçu-Post',
  'newsletter.blurb':
    'Neue Recherchen, unregelmässig. Keine Werbung, kein Weiterverkauf deiner Adresse.',
  'newsletter.placeholder': 'deine@e-mail.ch',
  'newsletter.submit': 'Abonnieren',
  'form.sending': 'Wird gesendet …',
  'form.name': 'Name',
  'form.email': 'E-Mail',
  'form.message': 'Nachricht',
  'form.send': 'Senden',
  'error.generic': 'Etwas ist schiefgelaufen. Bitte später erneut versuchen.',
  '404.title': 'Seite nicht gefunden',
  '404.body': 'Diese Adresse führt ins Leere. Vielleicht hilft der Weg zurück.',
  '404.home': 'Zur Startseite',
};

// English stubs fall back to German until the locale is populated.
const en: Dict = {
  'nav.stories': 'Stories',
  'nav.index': 'Index',
  'nav.about': 'About',
  'skip.content': 'Skip to content',
  'home.tagline': 'Stories for looking closer.',
};

const dictionaries: Record<Locale, Dict> = { de, en };

export function t(key: string, locale: Locale = defaultLocale): string {
  return dictionaries[locale][key] ?? dictionaries.de[key] ?? key;
}
