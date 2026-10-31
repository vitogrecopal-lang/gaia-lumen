const ASSETS = { BTC: 'bitcoin', SOL: 'solana', CRO: 'crypto-com-chain' };
let cached = null;
let pending = null;
export function validatePrices(data, now = Date.now()) {
  const prices = {};
  for (const [symbol, id] of Object.entries(ASSETS)) {
    const item = data?.[id];
    if (!Number.isFinite(item?.eur) || item.eur <= 0 || !Number.isFinite(item.last_updated_at)) throw new Error('Prezzi incompleti');
    const at = item.last_updated_at * 1000;
    if (at > now + 60000 || now - at > 600000) throw new Error('Prezzi non aggiornati');
    prices[symbol] = { eur: item.eur, updatedAt: new Date(at).toISOString() };
  }
  return { source: 'CoinGecko', currency: 'EUR', fetchedAt: new Date(now).toISOString(), stale: false, prices };
}
export async function getCryptoPrices() {
  if (cached && Date.now() - Date.parse(cached.fetchedAt) < 60000) return cached;
  if (pending) return pending;
  pending = (async () => {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,solana,crypto-com-chain&vs_currencies=eur&include_last_updated_at=true';
      const response = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error('Fonte temporaneamente non disponibile');
      cached = validatePrices(await response.json());
      return cached;
    } catch {
      if (cached) return { ...cached, stale: true, warning: 'Aggiornamento non disponibile. Ultimi dati salvati: operazioni virtuali sospese.' };
      return { source: 'CoinGecko', currency: 'EUR', stale: true, prices: {}, error: 'Prezzi non disponibili. Riprova tra un minuto; nessun prezzo inventato.' };
    } finally { pending = null; }
  })();
  return pending;
}
