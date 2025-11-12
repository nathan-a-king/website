import { describe, it, expect, beforeEach } from 'vitest';
import { createEliza } from '../elizaEngine';

describe('elizaEngine', () => {
  let eliza: ReturnType<typeof createEliza>;

  beforeEach(() => {
    eliza = createEliza();
  });

  it('returns the canonical greeting from the original script', () => {
    expect(eliza.greeting()).toMatch(/how do you do/i);
  });

  it('responds to salutations defined in the script', () => {
    const response = eliza.respond('Hello there');
    expect(response).toMatch(/please state your problem/i);
  });

  it('generates natural casing rather than shouting in all caps', () => {
    const response = eliza.respond('HELLO!');
    expect(response).not.toEqual(response.toUpperCase());
    expect(response).toMatch(/[a-z]/);
  });

  it('recalls stored memories when no keywords are present', () => {
    eliza.respond('My mother was kind');
    eliza.respond('This sentence has no notable keywords.');
    const recalled = eliza.respond('Still nothing specific here.');
    expect(recalled).toMatch(/mother/i);
  });
});
