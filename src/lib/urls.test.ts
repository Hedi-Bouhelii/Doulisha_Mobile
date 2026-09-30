import { describe, expect, it, vi } from 'vitest';

vi.mock('./config', () => ({ API_URL: 'http://10.0.2.2:3000' }));

const { absoluteUrl } = await import('./urls');

describe('absoluteUrl', () => {
  it('prefixes paths with the API address', () => {
    expect(absoluteUrl('/images/events/zaghouan.jpg')).toBe(
      'http://10.0.2.2:3000/images/events/zaghouan.jpg',
    );
  });

  it('keeps full addresses', () => {
    expect(absoluteUrl('https://cdn.example.com/a.webp')).toBe('https://cdn.example.com/a.webp');
  });
});
