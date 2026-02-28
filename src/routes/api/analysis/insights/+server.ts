import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Locale } from '$lib/i18n/types';
import type { CompoundPatternAdditionCategory } from '$lib/config/analysis';
import {
	addManualInsight,
	buildManualAdditions,
	isValidLocale
} from '$lib/server/analysis-persistence';

export const GET: RequestHandler = async ({ url }) => {
	const localeParam = url.searchParams.get('locale') ?? 'en';
	const locale = isValidLocale(localeParam) ? localeParam : 'en';
	return json({ additions: buildManualAdditions(locale) });
};

export const POST: RequestHandler = async ({ request }) => {
	let payload: {
		locale?: string;
		signalId?: string;
		category?: string;
		text?: string;
	};

	try {
		payload = await request.json();
	} catch {
		return json({ error: 'required' }, { status: 400 });
	}

	if (!payload.locale || !isValidLocale(payload.locale)) {
		return json({ error: 'required' }, { status: 400 });
	}

	const result = addManualInsight({
		locale: payload.locale as Locale,
		signalId: payload.signalId ?? '',
		category: (payload.category ?? '') as CompoundPatternAdditionCategory,
		text: payload.text ?? ''
	});

	if (!result.ok) {
		return json({ error: result.error }, { status: 400 });
	}

	return json({ additions: buildManualAdditions(payload.locale as Locale) }, { status: 201 });
};
