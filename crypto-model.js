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
export function importWalletCsv(text, capital = 4) {
  if (typeof text !== 'string' || text.length > 100000) throw new Error('CSV troppo grande (massimo 100 KB)');
  const lines=text.replace(/^\uFEFF/,'').trim().split(/\r?\n/);
  if (lines.shift() !== 'data;operazione_virtuale;moneta;quantita;prezzo_eur;costo_eur') throw new Error('Formato non valido: usa il CSV esportato da Gaia-Lumen');
  if (lines.length < 1 || lines.length > 200) throw new Error('Il registro deve contenere da 1 a 200 operazioni');
  const decimal = value => {
    if (!/^[0-9]+(?:\.[0-9]+)?(?:e[+-]?[0-9]+)?$/i.test(value)) throw new Error('Importo CSV non valido');
    return positive(value,'Importo CSV',true);
  };
  const rows=lines.map((line,index)=>{
    const parts=line.split(';');
    if (parts.length!==6) throw new Error(`Riga ${index+2} non valida`);
    const [at,side,symbol,q,p,f]=parts;
    if (!/^\d{4}-\d{2}-\d{2}T/.test(at) || !Number.isFinite(Date.parse(at)) || Date.parse(at)>Date.now()+60000 || !['buy','sell'].includes(side) || !SYMBOLS.includes(symbol)) throw new Error(`Riga ${index+2}: data o operazione non valida`);
    const quantity=decimal(q), price=decimal(p), fee=decimal(f);
    if (!quantity || !price || fee>quantity*price) throw new Error(`Riga ${index+2}: quantita, prezzo o costo non valido`);
    return {at:new Date(at).toISOString(),side,symbol,quantity,price,fee};
  });
  // Export is newest-first. Reverse before stable chronological replay.
  rows.reverse(); rows.sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
  const wallet=newWallet(capital);
  for (const row of rows) {
    const gross=row.quantity*row.price;
    if (!Number.isFinite(gross) || gross>1e12) throw new Error('Importo totale CSV fuori intervallo');
    const cashChange=row.side==='buy'?-(gross+row.fee):gross-row.fee;
    if (wallet.cash+cashChange < -1e-9 || (row.side==='sell' && row.quantity-wallet.holdings[row.symbol]>1e-12)) throw new Error('Registro incompleto o capitale iniziale insufficiente. Il CSV deve contenere tutte le operazioni dell\'esperimento.');
    wallet.cash=Math.max(0,wallet.cash+cashChange);
    wallet.holdings[row.symbol]=Math.max(0,wallet.holdings[row.symbol]+(row.side==='buy'?row.quantity:-row.quantity));
    wallet.fees+=row.fee; wallet.trades.unshift({...row,cashChange});
  }
  return wallet;
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
