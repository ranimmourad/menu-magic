import { describe, expect, it } from 'vitest';
import { categories, formatPrice } from './menu';

describe('Original PDF menu', () => {
  it('preserves the Basique breakfast price of 8 DT', () => {
    expect(categories.find(c => c.id === 'petits-dejeuners')?.groups[0]?.items.find(i => i.name === 'Basique')?.price).toBe(8);
  });
  it('preserves the Neptune pizza price of 16 DT', () => {
    expect(categories.find(c => c.id === 'pizzas')?.groups[0]?.items.find(i => i.name === 'Neptune')?.price).toBe(16);
  });
  it('preserves both Mokkaccino prices printed in the original', () => {
    expect(categories.find(c => c.id === 'boissons-chaudes')?.groups[0]?.items.filter(i => i.name === 'Mokkaccino').map(i => i.price)).toEqual([7.5, 6]);
  });
  it('displays fractional prices without rounding them to integers', () => {
    expect(formatPrice(11.5)).toBe('11,5');
  });
});