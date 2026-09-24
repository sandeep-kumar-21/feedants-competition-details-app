import { describe, it, expect } from 'vitest';
import { env } from '../config/env.js';

describe('Environment Configuration', () => {
  it('should load default port if not overridden', () => {
    expect(typeof env.PORT).toBe('number');
    expect(env.PORT).toBeGreaterThan(0);
  });

  it('should have required environment variables loaded', () => {
    expect(env.MONGODB_URI).toBeDefined();
    expect(env.JWT_SECRET).toBeDefined();
    expect(env.NODE_ENV).toBeDefined();
  });
});

