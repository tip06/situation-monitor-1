type TokenType = 'term' | 'and' | 'or' | 'not' | 'lparen' | 'rparen' | 'eof';

interface Token {
	type: TokenType;
	value: string;
}

type QueryNode =
	| { type: 'term'; value: string }
	| { type: 'and' | 'or'; left: QueryNode; right: QueryNode }
	| { type: 'not'; child: QueryNode };

export interface BooleanQueryResult {
	matches: boolean;
	matchedTerms: string[];
}

function tokenize(query: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;

	while (i < query.length) {
		const char = query[i];

		if (/\s/.test(char)) {
			i += 1;
			continue;
		}

		if (char === ',') {
			tokens.push({ type: 'or', value: ',' });
			i += 1;
			continue;
		}

		if (char === '(') {
			tokens.push({ type: 'lparen', value: char });
			i += 1;
			continue;
		}

		if (char === ')') {
			tokens.push({ type: 'rparen', value: char });
			i += 1;
			continue;
		}

		if (char === '"' || char === "'") {
			const quote = char;
			let value = '';
			i += 1;

			while (i < query.length && query[i] !== quote) {
				if (query[i] === '\\' && query[i + 1] === quote) {
					value += quote;
					i += 2;
					continue;
				}
				value += query[i];
				i += 1;
			}

			if (i >= query.length) {
				throw new Error('Unclosed quote in monitor query');
			}

			i += 1;
			if (value.trim()) {
				tokens.push({ type: 'term', value: value.trim() });
			}
			continue;
		}

		let value = '';
		while (i < query.length && !/[\s(),]/.test(query[i])) {
			value += query[i];
			i += 1;
		}

		const normalized = value.toLowerCase();
		if (normalized === 'and' || normalized === 'or' || normalized === 'not') {
			tokens.push({ type: normalized, value });
		} else if (value.trim()) {
			tokens.push({ type: 'term', value: value.trim() });
		}
	}

	tokens.push({ type: 'eof', value: '' });
	return tokens;
}

class Parser {
	private index = 0;

	constructor(private readonly tokens: Token[]) {}

	parse(): QueryNode {
		const node = this.parseOr();
		if (this.peek().type !== 'eof') {
			throw new Error('Unexpected token in monitor query');
		}
		return node;
	}

	private parseOr(): QueryNode {
		let node = this.parseAnd();

		while (this.match('or')) {
			node = { type: 'or', left: node, right: this.parseAnd() };
		}

		return node;
	}

	private parseAnd(): QueryNode {
		let node = this.parseNot();

		while (this.match('and') || this.startsPrimary()) {
			node = { type: 'and', left: node, right: this.parseNot() };
		}

		return node;
	}

	private parseNot(): QueryNode {
		if (this.match('not')) {
			return { type: 'not', child: this.parseNot() };
		}

		return this.parsePrimary();
	}

	private parsePrimary(): QueryNode {
		const token = this.peek();

		if (this.match('term')) {
			return { type: 'term', value: token.value };
		}

		if (this.match('lparen')) {
			const node = this.parseOr();
			if (!this.match('rparen')) {
				throw new Error('Missing closing parenthesis in monitor query');
			}
			return node;
		}

		throw new Error('Expected search term in monitor query');
	}

	private startsPrimary(): boolean {
		const type = this.peek().type;
		return type === 'term' || type === 'not' || type === 'lparen';
	}

	private match(type: TokenType): boolean {
		if (this.peek().type !== type) return false;
		this.index += 1;
		return true;
	}

	private peek(): Token {
		return this.tokens[this.index];
	}
}

function parse(query: string): QueryNode {
	const tokens = tokenize(query);
	if (tokens[0].type === 'eof') {
		throw new Error('Monitor query is empty');
	}
	return new Parser(tokens).parse();
}

function evaluateNode(node: QueryNode, normalizedText: string): BooleanQueryResult {
	if (node.type === 'term') {
		const matches = normalizedText.includes(node.value.toLowerCase());
		return { matches, matchedTerms: matches ? [node.value] : [] };
	}

	if (node.type === 'not') {
		return { matches: !evaluateNode(node.child, normalizedText).matches, matchedTerms: [] };
	}

	const left = evaluateNode(node.left, normalizedText);
	const right = evaluateNode(node.right, normalizedText);
	const matches =
		node.type === 'and' ? left.matches && right.matches : left.matches || right.matches;

	return {
		matches,
		matchedTerms: [...new Set([...left.matchedTerms, ...right.matchedTerms])]
	};
}

export function evaluateBooleanQuery(text: string, query: string): BooleanQueryResult {
	const ast = parse(query);
	return evaluateNode(ast, text.toLowerCase());
}

export function validateBooleanQuery(query: string): string | null {
	try {
		parse(query);
		return null;
	} catch (error) {
		return error instanceof Error ? error.message : 'Invalid monitor query';
	}
}

export function extractBooleanQueryTerms(query: string): string[] {
	const terms: string[] = [];

	function collect(node: QueryNode): void {
		if (node.type === 'term') {
			terms.push(node.value);
			return;
		}

		if (node.type === 'not') {
			collect(node.child);
			return;
		}

		collect(node.left);
		collect(node.right);
	}

	collect(parse(query));
	return [...new Set(terms.map((term) => term.trim().toLowerCase()).filter(Boolean))];
}

export function keywordsToBooleanQuery(keywords: string[]): string {
	return keywords
		.map((keyword) => keyword.trim())
		.filter(Boolean)
		.map((keyword) => (/\s/.test(keyword) ? `"${keyword.replaceAll('"', '\\"')}"` : keyword))
		.join(' OR ');
}
