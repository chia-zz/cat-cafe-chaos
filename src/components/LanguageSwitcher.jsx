import { LANGUAGES, useI18n } from '../i18n/index.js';

/** 語言切換：分段按鈕，任何時候切換都會立即生效並記住選擇 */
export default function LanguageSwitcher({ className = '' }) {
  const { lang, t, setLanguage } = useI18n();
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t('lang.label')}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.dict.meta.htmlLang}
          className={l.code === lang ? 'is-active' : ''}
          aria-pressed={l.code === lang}
          onClick={() => setLanguage(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
