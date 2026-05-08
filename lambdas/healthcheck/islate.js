/**
 * Determines whether a monitor has missed its expected check-in window.
 *
 * @param {number} lastSeenAt - Unix timestamp (ms) of the last received ping
 * @param {number} intervalSeconds - How often the monitor is expected to ping
 * @param {number} gracePeriodSeconds - Extra buffer before triggering an alert
 * @param {number} [now] - Current time in ms (injectable for testing)
 * @returns {boolean}
 */
function isLate(lastSeenAt, intervalSeconds, gracePeriodSeconds = 0, now = Date.now()) {
  if (typeof lastSeenAt !== 'number' || isNaN(lastSeenAt)) {
    throw new Error('lastSeenAt must be a valid number');
  }
  if (intervalSeconds <= 0) {
    throw new Error('intervalSeconds must be greater than 0');
  }

  const deadlineMs = lastSeenAt + (intervalSeconds + gracePeriodSeconds) * 1000;
  return now > deadlineMs;
}

module.exports = { isLate };