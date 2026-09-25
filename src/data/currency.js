// Standard conversion rate for Japan travel budgeting
export const JPY_PER_USD = 155;

/**
 * Formats a JPY amount with dual currency display (JPY + USD)
 * @param {number} jpy - Amount in Japanese Yen
 * @param {'JPY' | 'USD'} primary - Which currency to emphasize
 * @returns {{ primary: string, secondary: string, full: string, usdAmount: number, jpyAmount: number }}
 */
export function formatDualPrice(jpy, primary = 'JPY') {
  const safeJpy = Math.max(0, Math.round(Number(jpy) || 0));
  const usd = Math.round(safeJpy / JPY_PER_USD);
  
  const jpyStr = `¥${safeJpy.toLocaleString()}`;
  const usdStr = `$${usd.toLocaleString()} USD`;

  if (primary === 'USD') {
    return {
      primary: `$${usd.toLocaleString()}`,
      secondary: `~${jpyStr}`,
      full: `$${usd.toLocaleString()} (~${jpyStr})`,
      usdAmount: usd,
      jpyAmount: safeJpy
    };
  }

  return {
    primary: jpyStr,
    secondary: `~${usdStr}`,
    full: `${jpyStr} (~$${usd.toLocaleString()} USD)`,
    usdAmount: usd,
    jpyAmount: safeJpy
  };
}
