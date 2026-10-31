// Read-only account snapshot. Never feeds the simulation or trade model.
export function parseAccountSnapshot(text) {
  if (typeof text !== 'string' || text.length > 20000) throw new Error('Copia non valida');
  const value = JSON.parse(text);
  if (value.source !== 'Crypto.com App API' || !Number.isFinite(Date.parse(value.at)) || Date.parse(value.at) > Date.now()+60000 || !Array.isArray(value.wallets) || value.wallets.length>100 || !Array.isArray(value.fiat) || value.fiat.length>100) throw new Error('Copia non valida');
  const clean = rows => {
    const seen = new Set();
    return rows.map(row => {
      if (!/^[A-Z0-9]{2,20}$/.test(row.currency) || seen.has(row.currency) || typeof row.balance !== 'string' || !/^\d+(?:\.\d+)?$/.test(row.balance) || !Number.isFinite(Number(row.balance))) throw new Error('Saldo non valido');
      seen.add(row.currency);
      return {currency:row.currency,balance:row.balance};
    });
  };
  return {source:value.source,at:new Date(value.at).toISOString(),wallets:clean(value.wallets),fiat:clean(value.fiat)};
}
if (typeof document !== 'undefined') {
  const panel=document.createElement('section');panel.className='panel';panel.setAttribute('aria-labelledby','accountTitle');
  panel.innerHTML=`<h2 id="accountTitle">Conto Crypto.com / copia dei saldi reali</h2><p class="small">Copia datata ottenuta tramite Crypto Monitor. Aggiornamento su richiesta in chat, senza sincronizzazione continua. Rimane solo in questa scheda; i raddoppi virtuali non si applicano a questi saldi.</p><p id="accountStatus" role="status">Nessuna copia caricata.</p><div id="accountBalances"></div><details><summary>Aggiorna copia dei saldi</summary><label for="accountSnapshot">Dati dei saldi da Crypto Monitor (JSON, senza chiavi API)</label><textarea id="accountSnapshot" rows="4" maxlength="20000" style="width:100%"></textarea><button type="button" id="loadAccountSnapshot">Carica saldi reali</button></details><button type="button" id="clearAccountSnapshot">Rimuovi copia locale</button>`;
  document.querySelector('.hero').after(panel);
  const status=panel.querySelector('#accountStatus'), balances=panel.querySelector('#accountBalances'), input=panel.querySelector('textarea');
  function show(snapshot) {
    status.textContent=`Fonte: ${snapshot.source}. Letti il ${new Date(snapshot.at).toLocaleString('it-IT')}. Copia datata, non aggiornamento continuo.`;
    balances.replaceChildren();
    for (const row of [...snapshot.wallets,...snapshot.fiat]) {
      const line=document.createElement('p');line.textContent=`${row.currency}: ${row.balance}`;balances.append(line);
    }
    if (!snapshot.wallets.length) { const line=document.createElement('p');line.textContent='Nessun saldo crypto non nullo restituito.';balances.append(line); }
    if (!snapshot.fiat.length) { const line=document.createElement('p');line.textContent='Nessun saldo fiat non nullo restituito.';balances.append(line); }
  }
  panel.querySelector('#loadAccountSnapshot').addEventListener('click',()=>{
    try { const snapshot=parseAccountSnapshot(input.value); show(snapshot); input.value=''; try { sessionStorage.setItem('gaia-account-snapshot-v1',JSON.stringify(snapshot)); } catch { status.textContent+=' Memoria della scheda non disponibile.'; } }
    catch { status.textContent='Dati non validi. Usa una copia dei saldi restituiti da Crypto Monitor.'; }
  });
  panel.querySelector('#clearAccountSnapshot').addEventListener('click',()=>{try {sessionStorage.removeItem('gaia-account-snapshot-v1');}catch{} input.value='';balances.replaceChildren();status.textContent='Copia locale rimossa.';});
  try { const saved=sessionStorage.getItem('gaia-account-snapshot-v1');if(saved)show(parseAccountSnapshot(saved)); } catch { status.textContent='Copia precedente non disponibile: aggiorna i saldi dalla chat.'; }
}
