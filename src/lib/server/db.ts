/**
 * SQLite database layer for server-side caching
 */

import Database from 'better-sqlite3';
import { mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

const DB_PATH = process.env.DB_PATH || 'data/situation-monitor.db';

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
	if (_db) return _db;

	const dir = dirname(DB_PATH);
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}

	_db = new Database(DB_PATH);
	_db.pragma('journal_mode = WAL');
	_db.pragma('synchronous = NORMAL');

	initSchema(_db);
	return _db;
}

function initSchema(db: Database.Database): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS news (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			link TEXT NOT NULL,
			pub_date TEXT,
			timestamp INTEGER NOT NULL,
			description TEXT,
			source TEXT NOT NULL,
			category TEXT NOT NULL,
			is_alert INTEGER DEFAULT 0,
			alert_keyword TEXT,
			region TEXT,
			topics TEXT,
			created_at INTEGER DEFAULT (unixepoch() * 1000)
		);
		CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
		CREATE INDEX IF NOT EXISTS idx_news_timestamp ON news(timestamp);
		CREATE INDEX IF NOT EXISTS idx_news_category_timestamp ON news(category, timestamp DESC);

		CREATE TABLE IF NOT EXISTS markets (
			key TEXT PRIMARY KEY,
			data TEXT NOT NULL,
			updated_at INTEGER NOT NULL
		);

		CREATE TABLE IF NOT EXISTS meta (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL,
			updated_at INTEGER NOT NULL
		);

		CREATE TABLE IF NOT EXISTS news_custom_sources (
			id TEXT PRIMARY KEY,
			category TEXT NOT NULL,
			name TEXT NOT NULL,
			url TEXT NOT NULL,
			enabled INTEGER NOT NULL DEFAULT 1,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL
		);
		CREATE UNIQUE INDEX IF NOT EXISTS idx_news_custom_sources_category_url
			ON news_custom_sources(category, lower(url));

		CREATE TABLE IF NOT EXISTS news_source_overrides (
			id TEXT PRIMARY KEY,
			enabled INTEGER NOT NULL,
			updated_at INTEGER NOT NULL
		);

		CREATE TABLE IF NOT EXISTS analysis_manual_insights (
			id TEXT PRIMARY KEY,
			locale TEXT NOT NULL,
			signal_id TEXT NOT NULL,
			category TEXT NOT NULL,
			text TEXT NOT NULL,
			created_at INTEGER NOT NULL
		);
		CREATE INDEX IF NOT EXISTS idx_analysis_manual_insights_signal_locale
			ON analysis_manual_insights(signal_id, locale);

		CREATE TABLE IF NOT EXISTS analysis_correlation_history (
			hour_bucket INTEGER NOT NULL,
			topic_id TEXT NOT NULL,
			count INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			PRIMARY KEY (hour_bucket, topic_id)
		);
		CREATE INDEX IF NOT EXISTS idx_analysis_correlation_history_topic_hour
			ON analysis_correlation_history(topic_id, hour_bucket DESC);
	`);

	// Migration: add source_type and selectors columns to news_custom_sources
	runMigrations(db);
}

function runMigrations(db: Database.Database): void {
	const hasColumn = (table: string, column: string): boolean => {
		const cols = db.pragma(`table_info(${table})`) as Array<{ name: string }>;
		return cols.some((c) => c.name === column);
	};

	if (!hasColumn('news_custom_sources', 'source_type')) {
		db.exec(`ALTER TABLE news_custom_sources ADD COLUMN source_type TEXT DEFAULT 'rss'`);
	}
	if (!hasColumn('news_custom_sources', 'selectors')) {
		db.exec(`ALTER TABLE news_custom_sources ADD COLUMN selectors TEXT`);
	}
}

// --- News operations ---

import type { NewsItem, NewsCategory } from '$lib/types';

const INSERT_NEWS = `
	INSERT OR REPLACE INTO news (id, title, link, pub_date, timestamp, description, source, category, is_alert, alert_keyword, region, topics, created_at)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export function upsertNewsItems(items: NewsItem[]): void {
	const db = getDb();
	const stmt = db.prepare(INSERT_NEWS);
	const insertMany = db.transaction((rows: NewsItem[]) => {
		for (const item of rows) {
			stmt.run(
				item.id,
				item.title,
				item.link,
				item.pubDate ?? null,
				item.timestamp,
				item.description ?? null,
				item.source,
				item.category,
				item.isAlert ? 1 : 0,
				item.alertKeyword ?? null,
				item.region ?? null,
				item.topics ? JSON.stringify(item.topics) : null,
				Date.now()
			);
		}
	});
	insertMany(items);
}

function rowToNewsItem(row: Record<string, unknown>): NewsItem {
	return {
		id: row.id as string,
		title: row.title as string,
		link: row.link as string,
		pubDate: (row.pub_date as string) ?? undefined,
		timestamp: row.timestamp as number,
		description: (row.description as string) ?? undefined,
		source: row.source as string,
		category: row.category as NewsCategory,
		isAlert: row.is_alert === 1,
		alertKeyword: (row.alert_keyword as string) ?? undefined,
		region: (row.region as string) ?? undefined,
		topics: row.topics ? JSON.parse(row.topics as string) : undefined
	};
}

export function getNewsByCategory(category: NewsCategory, since?: number): NewsItem[] {
	const db = getDb();
	if (since) {
		const rows = db
			.prepare('SELECT * FROM news WHERE category = ? AND timestamp > ? ORDER BY timestamp DESC')
			.all(category, since) as Record<string, unknown>[];
		return rows.map(rowToNewsItem);
	}
	const rows = db
		.prepare('SELECT * FROM news WHERE category = ? ORDER BY timestamp DESC LIMIT 200')
		.all(category) as Record<string, unknown>[];
	return rows.map(rowToNewsItem);
}

export function getNewsByCategoryBatch(
	categories: NewsCategory[],
	sinceByCategory?: Partial<Record<NewsCategory, number>>
): Record<string, NewsItem[]> {
	const result: Record<string, NewsItem[]> = {};
	for (const category of categories) {
		const since = sinceByCategory?.[category];
		result[category] = getNewsByCategory(category, since);
	}
	return result;
}

export function getNewsCount(): number {
	const db = getDb();
	const row = db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number };
	return row.count;
}

export function deleteOldNews(maxAgeDays: number): number {
	const db = getDb();
	const cutoff = Date.now() - maxAgeDays * 86400000;
	const result = db.prepare('DELETE FROM news WHERE timestamp < ?').run(cutoff);
	return result.changes;
}

// --- Markets operations ---

export function setMarketData(key: string, data: unknown): void {
	const db = getDb();
	db.prepare('INSERT OR REPLACE INTO markets (key, data, updated_at) VALUES (?, ?, ?)').run(
		key,
		JSON.stringify(data),
		Date.now()
	);
}

export function getMarketData<T>(key: string): { data: T; updatedAt: number } | null {
	const db = getDb();
	const row = db.prepare('SELECT data, updated_at FROM markets WHERE key = ?').get(key) as
		| { data: string; updated_at: number }
		| undefined;
	if (!row) return null;
	return { data: JSON.parse(row.data) as T, updatedAt: row.updated_at };
}

// --- Sources operations ---

export interface CustomSourceRow {
	id: string;
	category: string;
	name: string;
	url: string;
	enabled: boolean;
	sourceType: 'rss' | 'html';
	selectors?: string; // JSON string of HtmlSelectors
	createdAt: number;
	updatedAt: number;
}

export interface SourceOverrideRow {
	id: string;
	enabled: boolean;
	updatedAt: number;
}

export function getCustomSources(): CustomSourceRow[] {
	const db = getDb();
	const rows = db
		.prepare(
			'SELECT id, category, name, url, enabled, source_type, selectors, created_at, updated_at FROM news_custom_sources ORDER BY name COLLATE NOCASE ASC'
		)
		.all() as Array<{
		id: string;
		category: string;
		name: string;
		url: string;
		enabled: number;
		source_type: string | null;
		selectors: string | null;
		created_at: number;
		updated_at: number;
	}>;

	return rows.map((row) => ({
		id: row.id,
		category: row.category,
		name: row.name,
		url: row.url,
		enabled: row.enabled === 1,
		sourceType: (row.source_type as 'rss' | 'html') || 'rss',
		selectors: row.selectors || undefined,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	}));
}

export function insertCustomSource(row: {
	id: string;
	category: string;
	name: string;
	url: string;
	enabled?: boolean;
	sourceType?: 'rss' | 'html';
	selectors?: string;
}): void {
	const db = getDb();
	const now = Date.now();
	db.prepare(
		'INSERT INTO news_custom_sources (id, category, name, url, enabled, source_type, selectors, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
	).run(row.id, row.category, row.name, row.url, row.enabled === false ? 0 : 1, row.sourceType || 'rss', row.selectors || null, now, now);
}

export function updateCustomSource(
	id: string,
	updates: Partial<Pick<CustomSourceRow, 'category' | 'name' | 'url' | 'enabled' | 'sourceType' | 'selectors'>>
): boolean {
	const db = getDb();
	const current = db
		.prepare('SELECT id, category, name, url, enabled, source_type, selectors FROM news_custom_sources WHERE id = ?')
		.get(id) as
		| { id: string; category: string; name: string; url: string; enabled: number; source_type: string | null; selectors: string | null }
		| undefined;
	if (!current) return false;

	const next = {
		category: updates.category ?? current.category,
		name: updates.name ?? current.name,
		url: updates.url ?? current.url,
		enabled: updates.enabled === undefined ? current.enabled === 1 : updates.enabled,
		sourceType: updates.sourceType ?? current.source_type ?? 'rss',
		selectors: updates.selectors !== undefined ? updates.selectors : current.selectors
	};

	const result = db
		.prepare(
			'UPDATE news_custom_sources SET category = ?, name = ?, url = ?, enabled = ?, source_type = ?, selectors = ?, updated_at = ? WHERE id = ?'
		)
		.run(next.category, next.name, next.url, next.enabled ? 1 : 0, next.sourceType, next.selectors || null, Date.now(), id);
	return result.changes > 0;
}

export function deleteCustomSource(id: string): boolean {
	const db = getDb();
	const result = db.prepare('DELETE FROM news_custom_sources WHERE id = ?').run(id);
	return result.changes > 0;
}

export function getSourceOverrides(): SourceOverrideRow[] {
	const db = getDb();
	const rows = db
		.prepare('SELECT id, enabled, updated_at FROM news_source_overrides')
		.all() as Array<{ id: string; enabled: number; updated_at: number }>;
	return rows.map((row) => ({
		id: row.id,
		enabled: row.enabled === 1,
		updatedAt: row.updated_at
	}));
}

export function setSourceOverride(id: string, enabled: boolean): void {
	const db = getDb();
	db.prepare(
		'INSERT OR REPLACE INTO news_source_overrides (id, enabled, updated_at) VALUES (?, ?, ?)'
	).run(id, enabled ? 1 : 0, Date.now());
}

export function deleteSourceOverride(id: string): void {
	const db = getDb();
	db.prepare('DELETE FROM news_source_overrides WHERE id = ?').run(id);
}

// --- Analysis persistence operations ---

export interface ManualInsightRow {
	id: string;
	locale: string;
	signalId: string;
	category: string;
	text: string;
	createdAt: number;
}

export interface CorrelationHistoryRow {
	hourBucket: number;
	topicId: string;
	count: number;
	updatedAt: number;
}

export function insertManualInsight(row: {
	id: string;
	locale: string;
	signalId: string;
	category: string;
	text: string;
}): void {
	const db = getDb();
	db.prepare(
		'INSERT INTO analysis_manual_insights (id, locale, signal_id, category, text, created_at) VALUES (?, ?, ?, ?, ?, ?)'
	).run(row.id, row.locale, row.signalId, row.category, row.text, Date.now());
}

export function getManualInsights(locale: string): ManualInsightRow[] {
	const db = getDb();
	const rows = db
		.prepare(
			'SELECT id, locale, signal_id, category, text, created_at FROM analysis_manual_insights WHERE locale = ? ORDER BY created_at ASC'
		)
		.all(locale) as Array<{
		id: string;
		locale: string;
		signal_id: string;
		category: string;
		text: string;
		created_at: number;
	}>;
	return rows.map((row) => ({
		id: row.id,
		locale: row.locale,
		signalId: row.signal_id,
		category: row.category,
		text: row.text,
		createdAt: row.created_at
	}));
}

export function upsertCorrelationHistoryPoint(
	hourBucket: number,
	topicId: string,
	count: number
): void {
	const db = getDb();
	db.prepare(
		'INSERT OR REPLACE INTO analysis_correlation_history (hour_bucket, topic_id, count, updated_at) VALUES (?, ?, ?, ?)'
	).run(hourBucket, topicId, count, Date.now());
}

export function getCorrelationHistorySince(minHourBucket: number): CorrelationHistoryRow[] {
	const db = getDb();
	const rows = db
		.prepare(
			'SELECT hour_bucket, topic_id, count, updated_at FROM analysis_correlation_history WHERE hour_bucket >= ? ORDER BY hour_bucket ASC'
		)
		.all(minHourBucket) as Array<{
		hour_bucket: number;
		topic_id: string;
		count: number;
		updated_at: number;
	}>;
	return rows.map((row) => ({
		hourBucket: row.hour_bucket,
		topicId: row.topic_id,
		count: row.count,
		updatedAt: row.updated_at
	}));
}

export function pruneCorrelationHistory(olderThanHourBucket: number): number {
	const db = getDb();
	const result = db
		.prepare('DELETE FROM analysis_correlation_history WHERE hour_bucket < ?')
		.run(olderThanHourBucket);
	return result.changes;
}

// --- Meta operations ---

export function setMeta(key: string, value: unknown): void {
	const db = getDb();
	db.prepare('INSERT OR REPLACE INTO meta (key, value, updated_at) VALUES (?, ?, ?)').run(
		key,
		JSON.stringify(value),
		Date.now()
	);
}

export function getMeta<T>(key: string): { value: T; updatedAt: number } | null {
	const db = getDb();
	const row = db.prepare('SELECT value, updated_at FROM meta WHERE key = ?').get(key) as
		| { value: string; updated_at: number }
		| undefined;
	if (!row) return null;
	return { value: JSON.parse(row.value) as T, updatedAt: row.updated_at };
}

export function closeDb(): void {
	if (_db) {
		_db.close();
		_db = null;
	}
}
