export const SYMBOLS = ['SOL', 'CRO', 'BTC'];
export function positive(value, label, allowZero = false) {
  const n = typeof value === 'string' && value.trim() === '' ? NaN : Number(value);
  if (!Number.isFinite(n) || (allowZero ? n < 0 : n <= 0) || n > 1e12) throw new Error(`${label}: valore non valido`);
  return n;
}
export function freshPrice(market, symbol, now = Date.now()) {
  const item = market?.prices?.[symbol];
  if (market?.stale || !item || !Number.isFinite(item.eur) || item.eur <= 0 || !Number.isFinite(Date.parse(item.updatedAt)) || now - Date.parse(item.updatedAt) > 600000 || Date.parse(item.updatedAt) > now + 60000) throw new Error('Aggiorna i prezzi prima di simulare un ordine');
  return item.eur;
}
export function newWallet(capital = 4) {
  const cash = positive(capital, 'Capitale');
  return { initial: cash, cash, holdings: { SOL: 0, CRO: 0, BTC: 0 }, fees: 0, trades: [] };
}
export function trade(wallet, market, { symbol, side, amount, feePercent }, now = Date.now()) {
  if (!SYMBOLS.includes(symbol) || !['buy', 'sell'].includes(side)) throw new Error('Operazione non valida');
  const price = freshPrice(market, symbol, now);
  const input = positive(amount, 'Importo');
  const feeRate = positive(feePercent, 'Costo ipotetico', true) / 100;
  if (feeRate > 0.1) throw new Error('Costo ipotetico massimo 10%');
  const next = structuredClone(wallet);
  const gross = side === 'buy' ? input / (1 + feeRate) : input * price;
  const quantity = side === 'buy' ? gross / price : input;
  const fee = gross * feeRate;
  if (side === 'buy' && input > next.cash) throw new Error('Euro virtuali insufficienti');
  if (side === 'sell' && quantity > next.holdings[symbol]) throw new Error('Quantita virtuale insufficiente');
  if (side === 'buy') { next.cash -= input; next.holdings[symbol] += quantity; }
  else { next.cash += gross - fee; next.holdings[symbol] -= quantity; }
  next.fees += fee;
  next.trades.unshift({ at: new Date(now).toISOString(), symbol, side, quantity, price, fee, cashChange: side === 'buy' ? -input : gross - fee });
  next.trades = next.trades.slice(0, 200);
  return next;
}
export function valuation(wallet, market, changes = {}) {
  let total = wallet.cash;
  for (const symbol of SYMBOLS) {
    if (!wallet.holdings[symbol]) continue;
    const p = market?.prices?.[symbol]?.eur;
    const change = changes[symbol] ?? 0;
    if (!Number.isFinite(change) || change < -100 || !Number.isFinite(p) || p <= 0) return null;
    total += wallet.holdings[symbol] * p * (1 + change / 100);
  }
  return Number.isFinite(total) ? total : null;
}
