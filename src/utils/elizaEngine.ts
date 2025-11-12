import { CACM_1966_01_DOCTOR_SCRIPT } from './elizaScript';

const SPECIAL_RULE_NONE = 'zNONE';
const NOMATCH_MESSAGES = ['PLEASE CONTINUE', 'HMMM', 'GO ON , PLEASE', 'I SEE'];
const WORD_DELIMITERS = new Set<string>([',', '.', 'BUT']);

interface Token {
  type: 'open' | 'close' | 'symbol' | 'number' | 'eof';
  value: string;
}

interface PatternReassembly {
  kind: 'pattern';
  parts: string[];
}

interface ReferenceReassembly {
  kind: 'reference';
  keyword: string;
}

interface NewKeyReassembly {
  kind: 'newkey';
}

interface PreReassembly {
  kind: 'pre';
  parts: string[];
  reference: string;
}

type ReassemblyRule = PatternReassembly | ReferenceReassembly | NewKeyReassembly | PreReassembly;

interface Transform {
  decomposition: string[];
  reassemblies: ReassemblyRule[];
  nextIndex: number;
}

interface KeywordRule {
  keyword: string;
  rawKeyword: string;
  substitute?: string;
  precedence: number;
  tags: string[];
  linkKeyword?: string;
  transformations: Transform[];
}

interface MemoryTransformation {
  decomposition: string[];
  reassemblies: ReassemblyRule[];
}

interface MemoryRuleDefinition {
  keyword: string;
  transformations: MemoryTransformation[];
}

interface ScriptData {
  hello: string[];
  rules: KeywordRule[];
  memoryRule: MemoryRuleDefinition;
}

class Tokenizer {
  private index = 0;
  private cached: Token | null = null;

  constructor(private readonly text: string) {}

  next(): Token {
    if (this.cached) {
      const token = this.cached;
      this.cached = null;
      return token;
    }
    return this.read();
  }

  peek(): Token {
    if (!this.cached) {
      this.cached = this.read();
    }
    return this.cached;
  }

  private read(): Token {
    const length = this.text.length;
    while (this.index < length) {
      const ch = this.text[this.index++];
      if (ch === '\r') continue;
      if (ch === '\n') continue;
      if (/\s/.test(ch)) continue;
      if (ch === ';') {
        while (this.index < length && this.text[this.index] !== '\n') {
          this.index++;
        }
        continue;
      }
      if (ch === '(') return { type: 'open', value: ch };
      if (ch === ')') return { type: 'close', value: ch };
      if (ch === '=') return { type: 'symbol', value: ch };
      if (ch === ',' || ch === '.') return { type: 'symbol', value: ch };
      if (/\d/.test(ch)) {
        let value = ch;
        while (this.index < length && /\d/.test(this.text[this.index])) {
          value += this.text[this.index++];
        }
        return { type: 'number', value };
      }
      let value = ch;
      while (this.index < length) {
        const peek = this.text[this.index];
        if (/\s/.test(peek) || peek === '(' || peek === ')' || peek === '=' || peek === ',' || peek === '.') {
          break;
        }
        value += peek;
        this.index++;
      }
      return { type: 'symbol', value };
    }
    return { type: 'eof', value: '' };
  }
}

class ScriptParser {
  private references: string[] = [];

  constructor(private readonly tokenizer: Tokenizer) {}

  parse(): ScriptData {
    const hello = this.readList();
    const maybeStart = this.tokenizer.peek();
    if (maybeStart.type === 'symbol' && maybeStart.value === 'START') {
      this.tokenizer.next();
    }

    const rules: KeywordRule[] = [];
    let memoryRule: MemoryRuleDefinition | null = null;

    while (this.readRule(rules, (value) => {
      memoryRule = value;
    })) {
      /* keep parsing */
    }

    if (!memoryRule) {
      throw new Error('Script missing MEMORY rule');
    }

    const hasNone = rules.some((rule) => rule.keyword === SPECIAL_RULE_NONE);
    if (!hasNone) {
      throw new Error('Script missing NONE rule');
    }

    this.references.forEach((keyword) => {
      const target = rules.find((rule) => rule.keyword === keyword || rule.rawKeyword === keyword);
      if (!target || (target.transformations.length === 0 && !target.linkKeyword)) {
        throw new Error(`Referenced keyword ${keyword} is not defined`);
      }
    });

    return { hello, rules, memoryRule };
  }

  private readRule(rules: KeywordRule[], setMemory: (rule: MemoryRuleDefinition) => void): boolean {
    const open = this.tokenizer.next();
    if (open.type === 'eof') {
      return false;
    }
    if (open.type !== 'open') {
      throw new Error('Expected (');
    }
    const peek = this.tokenizer.peek();
    if (peek.type === 'close') {
      this.tokenizer.next();
      return true;
    }
    const keywordToken = this.tokenizer.next();
    if (keywordToken.type !== 'symbol') {
      throw new Error('Expected keyword');
    }
    if (keywordToken.value === 'MEMORY') {
      const memory = this.readMemoryRule();
      setMemory(memory);
      return true;
    }
    const rule = this.readKeywordRule(keywordToken.value);
    rules.push(rule);
    return true;
  }

  private readMemoryRule(): MemoryRuleDefinition {
    const keywordToken = this.tokenizer.next();
    if (keywordToken.type !== 'symbol') {
      throw new Error('Expected keyword after MEMORY');
    }
    const transformations: MemoryTransformation[] = [];
    for (let i = 0; i < 4; i += 1) {
      const open = this.tokenizer.next();
      if (open.type !== 'open') {
        throw new Error('Expected ( in MEMORY rule');
      }
      const decomposition: string[] = [];
      let token = this.tokenizer.next();
      while (!(token.type === 'symbol' && token.value === '=')) {
        if (token.type !== 'symbol' && token.type !== 'number') {
          throw new Error('Invalid MEMORY decomposition');
        }
        decomposition.push(token.value);
        token = this.tokenizer.next();
      }
      const reassemblyParts: string[] = [];
      token = this.tokenizer.next();
      while (token.type !== 'close') {
        if (token.type !== 'symbol' && token.type !== 'number') {
          throw new Error('Invalid MEMORY reassembly');
        }
        reassemblyParts.push(token.value);
        token = this.tokenizer.next();
      }
      transformations.push({
        decomposition,
        reassemblies: [{ kind: 'pattern', parts: reassemblyParts }],
      });
    }
    const closing = this.tokenizer.next();
    if (closing.type !== 'close') {
      throw new Error('Expected ) after MEMORY rule');
    }
    return { keyword: keywordToken.value, transformations };
  }

  private readKeywordRule(rawKeyword: string): KeywordRule {
    const keyword = rawKeyword === 'NONE' ? SPECIAL_RULE_NONE : rawKeyword;
    const rule: KeywordRule = {
      keyword,
      rawKeyword,
      precedence: 0,
      tags: [],
      transformations: [],
    };

    let token = this.tokenizer.next();
    while (token.type !== 'close') {
      if (token.type === 'symbol' && token.value === '=') {
        const substitute = this.tokenizer.next();
        if (substitute.type !== 'symbol') {
          throw new Error('Expected keyword after =');
        }
        rule.substitute = substitute.value;
      } else if (token.type === 'number') {
        rule.precedence = parseInt(token.value, 10);
      } else if (token.type === 'symbol' && token.value === 'DLIST') {
        rule.tags = this.readTags();
      } else if (token.type === 'open') {
        const peek = this.tokenizer.peek();
        if (peek.type === 'symbol' && peek.value === '=') {
          this.tokenizer.next();
          const target = this.tokenizer.next();
          if (target.type !== 'symbol') {
            throw new Error('Expected equivalence keyword');
          }
          rule.linkKeyword = target.value;
          this.references.push(target.value === 'NONE' ? SPECIAL_RULE_NONE : target.value);
          const closeRef = this.tokenizer.next();
          if (closeRef.type !== 'close') {
            throw new Error('Expected ) after reference');
          }
        } else {
          const decomposition = this.readList();
          const reassemblies: ReassemblyRule[] = [];
          while (this.tokenizer.peek().type === 'open') {
            reassemblies.push(this.readReassembly());
          }
          const closeTransform = this.tokenizer.next();
          if (closeTransform.type !== 'close') {
            throw new Error(`Expected ) after transformation, got ${closeTransform.type} ${closeTransform.value}`);
          }
          rule.transformations.push({
            decomposition,
            reassemblies,
            nextIndex: 0,
          });
        }
      } else {
        throw new Error(`Malformed rule near token ${token.value}`);
      }
      token = this.tokenizer.next();
    }

    return rule;
  }

  private readReassembly(): ReassemblyRule {
    const open = this.tokenizer.next();
    if (open.type !== 'open') {
      throw new Error('Expected ( in reassembly');
    }
    const peek = this.tokenizer.peek();
    if (peek.type === 'symbol' && peek.value === 'PRE') {
      this.tokenizer.next();
      const parts = this.readList();
      const referenceParts = this.readList();
      if (referenceParts.length !== 2 || referenceParts[0] !== '=') {
        throw new Error('Invalid PRE reference');
      }
      const closing = this.tokenizer.next();
      if (closing.type !== 'close') {
        throw new Error('Expected ) after PRE rule');
      }
      const target = referenceParts[1];
      this.references.push(target === 'NONE' ? SPECIAL_RULE_NONE : target);
      return { kind: 'pre', parts, reference: target };
    }
    const parts = this.readListContents();
    if (parts.length === 1 && parts[0] === 'NEWKEY') {
      return { kind: 'newkey' };
    }
    if (parts.length === 2 && parts[0] === '=') {
      const target = parts[1];
      this.references.push(target === 'NONE' ? SPECIAL_RULE_NONE : target);
      return { kind: 'reference', keyword: target };
    }
    return { kind: 'pattern', parts };
  }

  private readTags(): string[] {
    const raw = this.readList();
    const tags: string[] = [];
    raw.forEach((entry) => {
      const trimmed = entry.replace(/[()]/g, ' ').trim();
      trimmed.split(/\s+/).forEach((token) => {
        if (!token) return;
        const name = token.replace(/^\//, '').trim();
        if (name) {
          tags.push(name);
        }
      });
    });
    return tags;
  }

  private readList(prior = true): string[] {
    if (prior) {
      const open = this.tokenizer.next();
      if (open.type !== 'open') {
        throw new Error('Expected (');
      }
    }
    return this.readListContents();
  }

  private readListContents(): string[] {
    const items: string[] = [];
    let token = this.tokenizer.next();
    while (token.type !== 'close') {
      if (token.type === 'symbol' || token.type === 'number') {
        items.push(token.value);
      } else if (token.type === 'open') {
        const nested = this.readListContents();
        items.push(`(${nested.join(' ')})`);
      } else {
        throw new Error('Unexpected token in list');
      }
      token = this.tokenizer.next();
    }
    return items;
  }
}

function parseScript(): ScriptData {
  const parser = new ScriptParser(new Tokenizer(CACM_1966_01_DOCTOR_SCRIPT));
  return parser.parse();
}

const parsedScript = parseScript();

function cloneReassembly(reassembly: ReassemblyRule): ReassemblyRule {
  switch (reassembly.kind) {
    case 'pattern':
      return { kind: 'pattern', parts: [...reassembly.parts] };
    case 'reference':
      return { kind: 'reference', keyword: reassembly.keyword };
    case 'newkey':
      return { kind: 'newkey' };
    case 'pre':
      return { kind: 'pre', parts: [...reassembly.parts], reference: reassembly.reference };
    default:
      return reassembly;
  }
}

function cloneRule(rule: KeywordRule): KeywordRule {
  return {
    keyword: rule.keyword,
    rawKeyword: rule.rawKeyword,
    substitute: rule.substitute,
    precedence: rule.precedence,
    tags: [...rule.tags],
    linkKeyword: rule.linkKeyword,
    transformations: rule.transformations.map((transform) => ({
      decomposition: [...transform.decomposition],
      reassemblies: transform.reassemblies.map((reassembly) => cloneReassembly(reassembly)),
      nextIndex: 0,
    })),
  };
}

function cloneMemoryRule(memoryRule: MemoryRuleDefinition): MemoryRuleDefinition {
  return {
    keyword: memoryRule.keyword,
    transformations: memoryRule.transformations.map((transformation) => ({
      decomposition: [...transformation.decomposition],
      reassemblies: transformation.reassemblies.map((reassembly) => cloneReassembly(reassembly)),
    })),
  };
}

const hollerithEncoding: number[] = (() => {
  const table = new Array<number>(256).fill(-1);
  const bcd = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '\0', '=', '\'', '\0', '\0', '\0',
    '+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', '\0', '.', ')', '\0', '\0', '\0',
    '-', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', '\0', '$', '*', '\0', '\0', '\0',
    ' ', '/', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '\0', ',', '(', '\0', '\0', '\0',
  ];
  bcd.forEach((char, index) => {
    if (char !== '\0') {
      table[char.charCodeAt(0)] = index;
    }
  });
  return table;
})();

function hollerithDefined(char: string): boolean {
  const code = char.charCodeAt(0);
  return hollerithEncoding[code] !== undefined && hollerithEncoding[code] !== -1;
}

function lastChunkAsBcd(word: string): bigint {
  if (!word) {
    return 0n;
  }
  const length = word.length;
  const start = Math.floor((Math.max(length, 1) - 1) / 6) * 6;
  let chunk = word.slice(start, start + 6);
  while (chunk.length < 6) {
    chunk += ' ';
  }
  let result = 0n;
  for (let i = 0; i < chunk.length; i += 1) {
    const char = chunk[i];
    result <<= 6n;
    if (hollerithDefined(char)) {
      result |= BigInt(hollerithEncoding[char.charCodeAt(0)]);
    } else {
      result |= BigInt(char.charCodeAt(0) & 0x3f);
    }
  }
  return result;
}

function hash(value: bigint, bits: number): number {
  const mask35 = (1n << 35n) - 1n;
  let datum = value & mask35;
  datum *= datum;
  const shift = BigInt(35 - Math.floor(bits / 2));
  datum >>= shift;
  const mask = (1n << BigInt(bits)) - 1n;
  return Number(datum & mask);
}

function toInt(value: string): number {
  return /^\d+$/.test(value) ? parseInt(value, 10) : -1;
}

function splitUserInput(text: string): string[] {
  const result: string[] = [];
  let current = '';
  const pushCurrent = () => {
    if (current) {
      result.push(current);
      current = '';
    }
  };
  for (const ch of text) {
    if (ch === ' ') {
      pushCurrent();
      continue;
    }
    if (ch === ',' || ch === '.') {
      pushCurrent();
      result.push(ch);
      continue;
    }
    current += ch;
  }
  pushCurrent();
  return result;
}

function joinWords(words: string[]): string {
  const joined = words.filter(Boolean).join(' ');
  return joined.replace(/\s+([.,])/g, '$1').trim();
}

function formatElizaText(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();
  let result = '';
  let capitalizeNext = true;

  for (const char of lower) {
    let nextChar = char;
    if (/[a-z]/.test(nextChar)) {
      if (capitalizeNext) {
        nextChar = nextChar.toUpperCase();
      }
      capitalizeNext = false;
    } else if (/[.!?]/.test(nextChar)) {
      capitalizeNext = true;
    } else if (!/\s/.test(nextChar)) {
      capitalizeNext = false;
    }
    result += nextChar;
  }

  const replacements = [
    { regex: /\bi'm\b/g, value: "I'm" },
    { regex: /\bi'd\b/g, value: "I'd" },
    { regex: /\bi've\b/g, value: "I've" },
    { regex: /\bi'll\b/g, value: "I'll" },
  ];

  replacements.forEach(({ regex, value }) => {
    result = result.replace(regex, value);
  });

  result = result.replace(/\bi\b/g, 'I');
  return result.replace(/\s+/g, ' ').trim();
}

function splitForReassembly(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

function inList(word: string, spec: string, tags: Map<string, string[]>): boolean {
  const inner = spec.slice(1, -1).trim();
  if (!inner) return false;
  const indicator = inner[0];
  const body = inner.slice(1).trim();
  if (indicator === '*') {
    return body.split(/\s+/).includes(word);
  }
  if (indicator === '/') {
    return body.split(/\s+/).some((tag) => {
      const normalized = tag.replace(/^\//, '');
      const words = tags.get(normalized);
      return words ? words.includes(word) : false;
    });
  }
  return false;
}

function match(pattern: string[], words: string[], tags: Map<string, string[]>): string[] | null {
  const backtrack = (pi: number, wi: number, captured: string[]): string[] | null => {
    if (pi === pattern.length) {
      return wi === words.length ? captured : null;
    }
    const token = pattern[pi];
    const n = toInt(token);
    if (n >= 0) {
      if (n === 0) {
        for (let len = 0; len <= words.length - wi; len += 1) {
          const chunk = words.slice(wi, wi + len).join(' ');
          const result = backtrack(pi + 1, wi + len, [...captured, chunk]);
          if (result) return result;
        }
        return null;
      }
      if (wi + n > words.length) {
        return null;
      }
      const chunk = words.slice(wi, wi + n).join(' ');
      return backtrack(pi + 1, wi + n, [...captured, chunk]);
    }
    if (wi >= words.length) {
      return null;
    }
    if (token.startsWith('(')) {
      if (!inList(words[wi], token, tags)) {
        return null;
      }
    } else if (token !== words[wi]) {
      return null;
    }
    return backtrack(pi + 1, wi + 1, [...captured, words[wi]]);
  };
  return backtrack(0, 0, []);
}

function reassemble(reassembly: string[], components: string[]): string[] {
  const result: string[] = [];
  reassembly.forEach((token) => {
    const index = toInt(token);
    if (index < 0) {
      result.push(token);
    } else if (index === 0 || index > components.length) {
      result.push('HMMM');
    } else {
      result.push(...splitForReassembly(components[index - 1]));
    }
  });
  return result;
}

class MemoryManager {
  private readonly queue: string[] = [];

  constructor(private readonly definition: MemoryRuleDefinition) {}

  create(keyword: string, words: string[], tags: Map<string, string[]>): void {
    if (keyword !== this.definition.keyword || words.length === 0) {
      return;
    }
    const lastWord = words[words.length - 1];
    const index = hash(lastChunkAsBcd(lastWord), 2) % this.definition.transformations.length;
    const transformation = this.definition.transformations[index];
    const components = match(transformation.decomposition, words, tags);
    if (!components) return;
    const firstReassembly = transformation.reassemblies[0];
    if (!firstReassembly || firstReassembly.kind !== 'pattern') {
      return;
    }
    const assembled = reassemble(firstReassembly.parts, components);
    const memory = formatElizaText(joinWords(assembled));
    if (memory) {
      this.queue.push(memory);
    }
  }

  hasMemory(): boolean {
    return this.queue.length > 0;
  }

  recall(): string | null {
    return this.queue.shift() ?? null;
  }
}

interface TransformResultComplete {
  status: 'complete';
  words: string[];
}

interface TransformResultLink {
  status: 'link';
  keyword: string;
  updatedWords?: string[];
}

interface TransformResultNewKey {
  status: 'newkey';
}

interface TransformResultFail {
  status: 'fail';
}

type TransformResult =
  | TransformResultComplete
  | TransformResultLink
  | TransformResultNewKey
  | TransformResultFail;

function hasTransformation(rule: KeywordRule): boolean {
  return rule.transformations.length > 0 || Boolean(rule.linkKeyword);
}

class Engine {
  private limit = 1;
  private readonly rules = new Map<string, KeywordRule>();
  private readonly tags = new Map<string, string[]>();
  private readonly memory: MemoryManager;

  constructor(private readonly hello: string[]) {
    parsedScript.rules.forEach((baseRule) => {
      const clone = cloneRule(baseRule);
      this.rules.set(clone.keyword, clone);
    });
    const tagMap = new Map<string, string[]>();
    this.rules.forEach((rule) => {
      rule.tags.forEach((tag) => {
        const list = tagMap.get(tag) ?? [];
        list.push(rule.keyword);
        tagMap.set(tag, list);
      });
    });
    this.tags = tagMap;
    this.memory = new MemoryManager(cloneMemoryRule(parsedScript.memoryRule));
  }

  greeting(): string {
    return formatElizaText(joinWords(this.hello));
  }

  respond(input: string): string {
    const normalized = elizaUppercase(input);
    let words = splitUserInput(normalized);
    if (words.length === 0) {
      return this.greeting();
    }

    this.limit = (this.limit % 4) + 1;
    const keystack: string[] = [];
    let topRank = 0;

    words = [...words];
    let index = 0;
    while (index < words.length) {
      const word = words[index];
      if (WORD_DELIMITERS.has(word)) {
        if (keystack.length === 0) {
          words.splice(0, index + 1);
          index = 0;
          continue;
        }
        words.splice(index);
        break;
      }
      const rule = this.rules.get(word);
      if (rule) {
        if (rule.substitute && word === rule.keyword) {
          words[index] = rule.substitute;
        }
        if (hasTransformation(rule)) {
          if (rule.precedence > topRank) {
            keystack.unshift(rule.keyword);
            topRank = rule.precedence;
          } else {
            keystack.push(rule.keyword);
          }
        }
      }
      index += 1;
    }

    if (keystack.length === 0 && this.limit === 4 && this.memory.hasMemory()) {
      const memoryResponse = this.memory.recall();
      if (memoryResponse) {
        return memoryResponse;
      }
    }

    while (keystack.length > 0) {
      const keyword = keystack.shift()!;
      const rule = this.rules.get(keyword);
      if (!rule) {
        return this.nomatchMessage();
      }
      this.memory.create(keyword, words, this.tags);
      const result = this.applyRule(rule, words);
      if (result.status === 'complete') {
        return formatElizaText(joinWords(result.words));
      }
      if (result.status === 'link') {
        if (result.updatedWords) {
          words = result.updatedWords;
        }
        keystack.unshift(result.keyword === 'NONE' ? SPECIAL_RULE_NONE : result.keyword);
        continue;
      }
      if (result.status === 'newkey') {
        if (keystack.length === 0) {
          break;
        }
        continue;
      }
      if (result.status === 'fail') {
        break;
      }
    }

    const noneRule = this.rules.get(SPECIAL_RULE_NONE);
    if (!noneRule) {
      return this.nomatchMessage();
    }
    const fallback = this.applyRule(noneRule, words);
    if (fallback.status === 'complete') {
        return formatElizaText(joinWords(fallback.words));
    }
    return this.nomatchMessage();
  }

  private nomatchMessage(): string {
    const message = NOMATCH_MESSAGES[this.limit - 1] ?? NOMATCH_MESSAGES[0];
    return formatElizaText(message);
  }

  private applyRule(rule: KeywordRule, words: string[]): TransformResult {
    for (const transform of rule.transformations) {
      const components = match(transform.decomposition, words, this.tags);
      if (!components) {
        continue;
      }
      if (transform.reassemblies.length === 0) {
        continue;
      }
      const reassembly = transform.reassemblies[transform.nextIndex];
      transform.nextIndex = (transform.nextIndex + 1) % transform.reassemblies.length;
      if (reassembly.kind === 'pattern') {
        return { status: 'complete', words: reassemble(reassembly.parts, components) };
      }
      if (reassembly.kind === 'reference') {
        return { status: 'link', keyword: reassembly.keyword };
      }
      if (reassembly.kind === 'newkey') {
        return { status: 'newkey' };
      }
      if (reassembly.kind === 'pre') {
        const updatedWords = reassemble(reassembly.parts, components);
        return { status: 'link', keyword: reassembly.reference, updatedWords };
      }
    }
    if (rule.linkKeyword) {
      return { status: 'link', keyword: rule.linkKeyword };
    }
    return { status: 'fail' };
  }
}

function normalizeQuotes(text: string): string {
  return text
    .replace(/[“”«»„‟]/g, ' ')
    .replace(/[‘‚‛‹›`´]/g, ' ')
    .replace(/’/g, "'");
}

function elizaUppercase(input: string): string {
  let result = normalizeQuotes(input)
    .replace(/[!?]/g, '.')
    .replace(/[;:–—]/g, ',')
    .replace(/[¡¿]/g, ' ');
  result = result.toLocaleUpperCase('en-US');
  return result;
}

export function createEliza() {
  return new Engine(parsedScript.hello);
}
