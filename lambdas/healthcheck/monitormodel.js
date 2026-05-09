/**
 * Monitor model
 *
 * Represents a single monitored job or script.
 * Stored in DynamoDB with monitorId as the partition key.
 */

/**
 * @typedef {Object} Monitor
 * @property {string} monitorId       - Unique identifier (e.g. "prod-backup-job")
 * @property {string} userId          - Owner of this monitor
 * @property {string} name            - Human-readable label
 * @property {number} intervalSeconds - How often a ping is expected
 * @property {number} gracePeriodSeconds - Extra buffer before alerting
 * @property {number} lastSeenAt      - Unix timestamp (ms) of last ping
 * @property {'healthy'|'late'|'paused'} status - Current state
 * @property {string} alertEmail      - Where to send alerts
 * @property {string} createdAt       - ISO timestamp
 */

/**
 * Creates a new monitor object with defaults applied.
 *
 * @param {Partial<Monitor>} fields
 * @returns {Monitor}
 */
function createMonitor(fields = {}) {
  if (!fields.monitorId) throw new Error('monitorId is required');
  if (!fields.userId) throw new Error('userId is required');
  if (!fields.intervalSeconds) throw new Error('intervalSeconds is required');
  if (!fields.alertEmail) throw new Error('alertEmail is required');

  return {
    monitorId: fields.monitorId,
    userId: fields.userId,
    name: fields.name || fields.monitorId,
    intervalSeconds: fields.intervalSeconds,
    gracePeriodSeconds: fields.gracePeriodSeconds ?? 60,
    lastSeenAt: fields.lastSeenAt ?? null,
    status: fields.status || 'healthy',
    alertEmail: fields.alertEmail,
    createdAt: fields.createdAt || new Date().toISOString(),
  };
}

module.exports = { createMonitor };