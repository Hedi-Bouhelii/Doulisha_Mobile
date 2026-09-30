/**
 * Hermes (React Native 0.86) has no Intl.PluralRules, which the ICU messages
 * need for every plural ("3 places left", Arabic dual and few/many forms).
 * Found on a Galaxy A07 in part 3a. Each polyfill installs itself only when
 * the engine lacks the feature; only the three interface languages are loaded.
 */
import '@formatjs/intl-getcanonicallocales/polyfill.js';
import '@formatjs/intl-locale/polyfill.js';
import '@formatjs/intl-pluralrules/polyfill.js';
import '@formatjs/intl-pluralrules/locale-data/ar.js';
import '@formatjs/intl-pluralrules/locale-data/fr.js';
import '@formatjs/intl-pluralrules/locale-data/en.js';
