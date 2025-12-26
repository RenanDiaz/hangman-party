import { browser } from '$app/environment';
import { init, register, getLocaleFromNavigator, locale } from 'svelte-i18n';

const defaultLocale = 'es';

register('en', () => import('./en.json'));
register('es', () => import('./es.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? (localStorage.getItem('locale') || getLocaleFromNavigator()?.split('-')[0] || defaultLocale) : defaultLocale
});

// Subscribe to locale changes and save to localStorage
if (browser) {
	locale.subscribe((value) => {
		if (value) {
			localStorage.setItem('locale', value);
		}
	});
}

export { locale };
