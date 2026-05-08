const { isLate } = require('../lambdas/healthcheck/isLate');

const MINUTE = 60 * 1000;
const now = 1_700_000_000_000; // fixed reference point

describe('isLate', () => {
  describe('basic behaviour', () => {
    it('returns false when last ping is within the interval', () => {
      const lastSeenAt = now - 2 * MINUTE;
      expect(isLate(lastSeenAt, 300, 0, now)).toBe(false);
    });

    it('returns true when last ping is past the interval', () => {
      const lastSeenAt = now - 10 * MINUTE;
      expect(isLate(lastSeenAt, 300, 0, now)).toBe(true);
    });

    it('returns false exactly at the deadline', () => {
      const lastSeenAt = now - 5 * MINUTE;
      expect(isLate(lastSeenAt, 300, 0, now)).toBe(false);
    });

    it('returns true one millisecond past the deadline', () => {
      const lastSeenAt = now - 5 * MINUTE - 1;
      expect(isLate(lastSeenAt, 300, 0, now)).toBe(true);
    });
  });

  describe('grace period', () => {
    it('returns false when within interval + grace period', () => {
      const lastSeenAt = now - 6 * MINUTE;
      expect(isLate(lastSeenAt, 300, 60, now)).toBe(false);
    });

    it('returns true when past interval + grace period', () => {
      const lastSeenAt = now - 7 * MINUTE;
      expect(isLate(lastSeenAt, 300, 60, now)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles a monitor that just pinged (lastSeenAt = now)', () => {
      expect(isLate(now, 300, 0, now)).toBe(false);
    });

    it('handles very short intervals (1 second)', () => {
      const lastSeenAt = now - 2000;
      expect(isLate(lastSeenAt, 1, 0, now)).toBe(true);
    });

    it('handles large intervals (24 hours)', () => {
      const lastSeenAt = now - 23 * 60 * MINUTE;
      expect(isLate(lastSeenAt, 86400, 0, now)).toBe(false);
    });

    it('throws if lastSeenAt is NaN', () => {
      expect(() => isLate(NaN, 300, 0, now)).toThrow('lastSeenAt must be a valid number');
    });

    it('throws if lastSeenAt is not a number', () => {
      expect(() => isLate('yesterday', 300, 0, now)).toThrow('lastSeenAt must be a valid number');
    });

    it('throws if intervalSeconds is zero', () => {
      expect(() => isLate(now, 0, 0, now)).toThrow('intervalSeconds must be greater than 0');
    });

    it('throws if intervalSeconds is negative', () => {
      expect(() => isLate(now, -60, 0, now)).toThrow('intervalSeconds must be greater than 0');
    });
  });

  describe('simultaneous pings (multiple monitors)', () => {
    it('correctly evaluates multiple monitors independently', () => {
      const monitors = [
        { lastSeenAt: now - 2 * MINUTE, interval: 300, expected: false },
        { lastSeenAt: now - 10 * MINUTE, interval: 300, expected: true },
        { lastSeenAt: now - 1 * MINUTE, interval: 60, expected: false },
        { lastSeenAt: now - 5 * MINUTE, interval: 60, expected: true },
      ];

      monitors.forEach(({ lastSeenAt, interval, expected }) => {
        expect(isLate(lastSeenAt, interval, 0, now)).toBe(expected);
      });
    });
  });
});