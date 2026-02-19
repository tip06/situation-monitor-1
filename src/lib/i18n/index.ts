import { EN_MESSAGES, type MessageKey } from './messages/en';
import { PT_BR_MESSAGES } from './messages/pt-BR';
import type { Locale } from './types';

const MESSAGES = {
	en: EN_MESSAGES,
	'pt-BR': PT_BR_MESSAGES
} as const;

function interpolate(template: string, params?: Record<string, string | number>): string {
	if (!params) return template;
	return template.replace(/\{(\w+)\}/g, (_, token: string) => {
		const value = params[token];
		return value === undefined ? `{${token}}` : String(value);
	});
}

export function t(
	locale: Locale,
	key: MessageKey,
	params?: Record<string, string | number>
): string {
	const localized = MESSAGES[locale][key] || EN_MESSAGES[key];
	return interpolate(localized, params);
}

export type { MessageKey };
