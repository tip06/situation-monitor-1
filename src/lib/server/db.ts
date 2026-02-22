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
	`);
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
