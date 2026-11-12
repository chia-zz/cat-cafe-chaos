import { describe, expect, it } from 'vitest';
import {
  GUEST_PLAYER,
  PLAYER_NAME_MAX,
  getPlayer,
  normalizePlayerName,
  playerFromSearch,
  setPlayer,
} from '../src/utils/player.js';

describe('normalizePlayerName', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizePlayerName('  小  橘 ')).toBe('小 橘');
  });

  it('rejects empty or non-string values', () => {
    expect(normalizePlayerName('   ')).toBeNull();
    expect(normalizePlayerName(null)).toBeNull();
    expect(normalizePlayerName(123)).toBeNull();
  });

  it('strips control characters', () => {
    expect(normalizePlayerName('a\u0000b\u001Fc')).toBe('abc');
  });

  it('truncates by characters, not UTF-16 units', () => {
    const long = '貓'.repeat(PLAYER_NAME_MAX + 5);
    expect(Array.from(normalizePlayerName(long))).toHaveLength(PLAYER_NAME_MAX);
    expect(Array.from(normalizePlayerName('🐱'.repeat(20)))).toHaveLength(PLAYER_NAME_MAX);
  });
});

describe('playerFromSearch', () => {
  it('reads ?player= from the URL', () => {
    expect(playerFromSearch('?player=%E5%B0%8F%E6%A9%98')).toEqual({ name: '小橘', source: 'url' });
  });

  it('falls back to guest', () => {
    expect(playerFromSearch('')).toBe(GUEST_PLAYER);
    expect(playerFromSearch('?player=')).toBe(GUEST_PLAYER);
    expect(playerFromSearch(undefined)).toBe(GUEST_PLAYER);
  });
});

describe('setPlayer', () => {
  it('updates the current player and falls back to guest on bad input', () => {
    expect(setPlayer({ name: 'Tester' })).toEqual({ name: 'Tester', source: 'platform' });
    expect(getPlayer().name).toBe('Tester');
    expect(setPlayer({ name: '' })).toBe(GUEST_PLAYER);
    expect(getPlayer()).toBe(GUEST_PLAYER);
  });
});
