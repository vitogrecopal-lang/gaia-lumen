import { SYMBOLS, newWallet, trade, valuation, freshPrice, importWalletCsv } from './crypto-model.js';
import { createAsmodeusPulse, validAsmodeusPulse, pulseChannel, cumulativeSolChange, compoundFactor } from './asmodeus-pulse.js';
const $ = id => document.getElementById(id);
const euro = value => value === null ? '--' : new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 4 }).format(value);
const qty = value => new Intl.NumberFormat('it-IT', { maximumFractionDigits: 10 }).format(value);
const date = value => new Date(value).toLocaleString('it-IT');
const key = 'gaia-crypto-paper-v1';
let wallet = newWallet();
try {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved && Number.isFinite(saved.initial) && saved.initial > 0 && Number.isFinite(saved.cash) && saved.cash >= 0 && Number.isFinite(saved.fees) && saved.fees >= 0 && SYMBOLS.every(s => Number.isFinite(saved.holdings?.[s]) && saved.holdings[s] >= 0) && Array.isArray(saved.trades) && saved.trades.length <= 200 && saved.trades.every(t => SYMBOLS.includes(t.symbol) && ['buy','sell'].includes(t.side) && [t.quantity,t.price,t.fee].every(n=>Number.isFinite(n)&&n>=0) && Number.isFinite(Date.parse(t.at)))) wallet = saved;
} catch { /* A blocked or damaged local store does not prevent simulation. */ }
let market = { stale: true, prices: {} };
let busy = false;
let pendingImport = null;
const changes = Object.fromEntries(SYMBOLS.map(s => [s, 0]));
const asmodeusChannel = pulseChannel();
let impulseTimer = null, impulseActive = false, impulseSequence = 0, receivedCount = 0;
let compoundCount = 0n, scenarioReference = null;
let pulseLog = [], seenPulses = new Set();
function pulseStatus(message) {
  $('asmodeusStatus').textContent = message;
  $('asmodeusStart').disabled = impulseActive;
  $('asmodeusStop').disabled = !impulseActive;
}
function stopImpulses(reason = 'Impulsi arrestati. Lo scenario corrente resta visibile.') {
  if (impulseTimer !== null) clearInterval(impulseTimer);
  impulseTimer = null; impulseActive = false; pulseStatus(reason);
}
function applyCryptoPulse(pulse) {
  if (!impulseActive || !validAsmodeusPulse(pulse) || seenPulses.has(pulse.id)) return;
  try { freshPrice(market, 'SOL'); } catch { stopImpulses('Prezzi non aggiornati: aggiorna i dati e riavvia gli impulsi.'); return; }
  if (!scenarioReference) scenarioReference = { ...market.prices.SOL };
  seenPulses.add(pulse.id); if (seenPulses.size > 100) seenPulses.delete(seenPulses.values().next().value);
  receivedCount += 1;
  compoundCount += 1n;
  changes.SOL = cumulativeSolChange(compoundCount);
  const input = $('change-SOL'); input.max = Math.max(100, changes.SOL ?? 100); input.value = changes.SOL ?? 100;
  input.previousElementSibling.querySelector('output').textContent = changes.SOL === null ? `2^${compoundCount} volte il riferimento` : `${changes.SOL}%`;
  const entry = `${date(pulse.at)} / ${pulse.source === 'homepage' ? 'Home Gaia-Lumen' : 'Ciclo locale'} / raddoppio ${compoundCount}: SOL ${compoundFactor(compoundCount)} il riferimento (ipotetico)`;
  pulseLog.unshift(entry); pulseLog = pulseLog.slice(0, 8);
  $('asmodeusLog').replaceChildren(...pulseLog.map(text => { const li=document.createElement('li'); li.textContent=text; return li; }));
  pulseStatus(`${compoundCount} raddoppi virtuali: SOL ${compoundFactor(compoundCount)} il prezzo di riferimento ${euro(scenarioReference.eur)}. Non e un rendimento atteso o reale.`);
  render();
}
function localPulse() {
  if (document.hidden) return;
  impulseSequence += 1; applyCryptoPulse(createAsmodeusPulse(impulseSequence));
}
asmodeusChannel?.addEventListener('message', event => {
  if ($('asmodeusSource').value === 'homepage' && event.data?.source === 'homepage') applyCryptoPulse(event.data);
});
function save() { try { localStorage.setItem(key, JSON.stringify(wallet)); } catch { $('tradeStatus').textContent += ' Salvataggio locale non disponibile: mantieni aperta la pagina.'; } }
function cell(row, text) { const td=document.createElement('td'); td.textContent=text; row.append(td); }
function render() {
  const total = valuation(wallet, market);
  $('total').textContent = euro(total);
  $('cash').textContent = euro(wallet.cash);
  $('fees').textContent = euro(wallet.fees);
  $('pnl').textContent = total === null ? 'Prezzi necessari per valutare le posizioni' : `Risultato virtuale: ${euro(total-wallet.initial)} rispetto al capitale iniziale`;
  $('holdings').replaceChildren();
  for (const symbol of SYMBOLS) {
    const row=document.createElement('div'); row.className='holding';
    const label=document.createElement('span'); label.textContent=symbol;
    const amount=document.createElement('b'); amount.textContent=`${qty(wallet.holdings[symbol])} ${symbol}`;
    row.append(label,amount); $('holdings').append(row);
  }
  let valid = true;
  try { for (const symbol of SYMBOLS) freshPrice(market,symbol); } catch { valid = false; }
  $('tradeButton').disabled=!valid || busy;
  const sale=$('side').value==='sell';
  $('tradeButton').textContent=sale?'Simula vendita':'Simula acquisto';
  $('amountLabel').textContent=sale?`Quantita di ${$('symbol').value} da vendere`:'Spesa totale in EUR, costi inclusi';
  const scenarioMarket=scenarioReference?{...market,prices:{...market.prices,SOL:scenarioReference}}:market;
  const scenarioBase=valuation(wallet,scenarioMarket);
  const scenario=valuation(wallet,scenarioMarket,{...changes,SOL:changes.SOL ?? 0});
  $('scenarioTotal').textContent=scenarioReference && changes.SOL === null && wallet.holdings.SOL > 0 ? `${euro(wallet.holdings.SOL * scenarioReference.eur)} × 2^${compoundCount} + altre posizioni` : euro(scenario);
  $('scenarioDifference').textContent=changes.SOL === null ? 'Valore simbolico: raddoppi senza limite prefissato, solo didattici' : scenario===null||scenarioBase===null?'Prezzi non disponibili':`${euro(scenario-scenarioBase)} rispetto ${scenarioReference?'al riferimento SOL fissato all\'avvio':'agli ultimi prezzi'}`;
  $('history').replaceChildren();
  for (const t of wallet.trades) {
    const row=document.createElement('tr');
    [date(t.at),t.side==='buy'?'Acquisto virtuale':'Vendita virtuale',t.symbol,qty(t.quantity),euro(t.price),euro(t.fee)].forEach(x=>cell(row,x));
    $('history').append(row);
  }
  if (!wallet.trades.length) { const row=document.createElement('tr'); const td=document.createElement('td'); td.colSpan=6; td.textContent='Nessuna operazione virtuale. Il conto reale non viene utilizzato.'; row.append(td); $('history').append(row); }
}
async function refresh() {
  if (busy) return;
  busy=true; $('refresh').disabled=true; render();
  try {
    const response=await fetch('/api/crypto-prices',{cache:'no-store',signal:AbortSignal.timeout(12000)});
    if (!response.ok) throw new Error('Servizio prezzi non disponibile');
    const data=await response.json();
    if (!data.prices || data.source !== 'CoinGecko') throw new Error('Risposta prezzi non valida');
    market=data;
    $('marketStatus').textContent=data.stale?(data.warning||data.error):`Dati pubblici / ricevuti il ${date(data.fetchedAt)}`;
    $('marketStatus').className=data.stale?'error':'';
    $('quotes').replaceChildren();
    for (const symbol of SYMBOLS) {
      const p=market.prices[symbol]; const card=document.createElement('div'); card.className='quote';
      const name=document.createElement('span'); name.textContent=symbol;
      const price=document.createElement('strong'); price.textContent=p?euro(p.eur):'Non disponibile';
      const at=document.createElement('small'); at.textContent=p?`Fonte aggiornata: ${date(p.updatedAt)}`:'In attesa della fonte';
      card.append(name,price,at); $('quotes').append(card);
    }
  } catch {
    market={...market,stale:true};
    $('marketStatus').className='error';
    $('marketStatus').textContent='Connessione prezzi non disponibile. Ultime quotazioni eventualmente mostrate non aggiornate; operazioni virtuali sospese.';
  } finally { busy=false; $('refresh').disabled=false; render(); }
}
for (const symbol of SYMBOLS) {
  const wrap=document.createElement('div');
  const label=document.createElement('label'); label.className='slider-label'; label.htmlFor=`change-${symbol}`;
  const title=document.createElement('span'); title.textContent=symbol;
  const output=document.createElement('output'); output.textContent='0%'; output.htmlFor=`change-${symbol}`;
  label.append(title,output);
  const input=document.createElement('input'); input.type='range'; input.id=`change-${symbol}`; input.min='-100'; input.max='100'; input.value='0';
  input.addEventListener('input',()=>{stopImpulses('Modifica manuale: impulsi arrestati.');scenarioReference=null;changes[symbol]=Number(input.value);output.textContent=`${input.value}%`;render();});
  wrap.append(label,input); $('sliders').append(wrap);
}
$('tradeForm').addEventListener('submit',event=>{
  event.preventDefault();
  try {
    wallet=trade(wallet,market,{symbol:$('symbol').value,side:$('side').value,amount:$('amount').value,feePercent:$('fee').value});
    $('tradeStatus').className=''; $('tradeStatus').textContent='Operazione virtuale registrata. Nessun ordine reale inviato.';
    save();render();
  } catch(error) { $('tradeStatus').className='error';$('tradeStatus').textContent=error.message; }
});
$('resetForm').addEventListener('submit',event=>{
  event.preventDefault();
  try {
    if (wallet.trades.length && !confirm('Azzerare soltanto il portafoglio e il registro virtuali di questo browser?')) return;
    stopImpulses(); scenarioReference=null; wallet=newWallet($('capital').value); $('tradeStatus').textContent='Nuovo esperimento virtuale avviato.';save();render();
  } catch(error) { $('tradeStatus').textContent=error.message; }
});
for (const id of ['symbol','side']) $(id).addEventListener('change',render);
$('asmodeusStart').addEventListener('click',()=>{
  if (impulseActive) return;
  if ($('asmodeusSource').value==='homepage' && !asmodeusChannel) { pulseStatus('Collegamento tra schede non disponibile. Scegli il ciclo locale.');return; }
  compoundCount=0n; scenarioReference=null; changes.SOL=0;
  const input=$('change-SOL'); input.max='100';input.value='0';input.previousElementSibling.querySelector('output').textContent='0%';render();
  impulseActive=true;
  if ($('asmodeusSource').value==='local') { impulseTimer=setInterval(localPulse,10000); localPulse(); }
  else pulseStatus('In ascolto della home Gaia-Lumen nello stesso browser. Avvia li gli impulsi; il ricevitore aggiorna solo questo scenario virtuale.');
});
$('asmodeusStop').addEventListener('click',()=>stopImpulses());
$('asmodeusSource').addEventListener('change',()=>stopImpulses('Sorgente modificata: premi Avvia per collegarla.'));
document.addEventListener('visibilitychange',()=>{
  if (impulseActive && $('asmodeusSource').value==='local') pulseStatus(document.hidden?'Ciclo locale sospeso: pagina nascosta.':'Ciclo locale attivo: un impulso ogni 10 secondi, senza recupero arretrati.');
});
window.addEventListener('pagehide',()=>{stopImpulses();asmodeusChannel?.close();});
$('refresh').addEventListener('click',refresh);
$('csvFile').addEventListener('change',async()=>{
  pendingImport=null; $('confirmImport').disabled=true;
  try {
    const file=$('csvFile').files[0];
    if (!file) { $('importStatus').textContent='Nessun file selezionato.'; return; }
    if (file.size>100000) throw new Error('File troppo grande: massimo 100 KB');
    pendingImport=importWalletCsv(await file.text(),$('capital').value);
    $('importStatus').className='';
    $('importStatus').textContent=`Anteprima: ${pendingImport.trades.length} operazioni; capitale iniziale ${euro(pendingImport.initial)}; euro virtuali residui ${euro(pendingImport.cash)}; ${SYMBOLS.map(s=>`${qty(pendingImport.holdings[s])} ${s}`).join(', ')}. Premi Carica registro per sostituire il solo esperimento virtuale.`;
    $('confirmImport').disabled=false;
  } catch(error) { $('importStatus').className='error'; $('importStatus').textContent=error.message; }
});
$('capital').addEventListener('input',()=>{pendingImport=null;$('confirmImport').disabled=true;$('importStatus').textContent='Capitale modificato: seleziona di nuovo il CSV per verificarlo.';});
$('csvText').addEventListener('input',()=>{pendingImport=null;$('confirmImport').disabled=true;});
$('previewCsvText').addEventListener('click',()=>{
  pendingImport=null; $('confirmImport').disabled=true;
  try {
    pendingImport=importWalletCsv($('csvText').value,$('capital').value);
    $('importStatus').className='';
    $('importStatus').textContent=`Anteprima CSV: ${pendingImport.trades.length} operazioni; capitale ${euro(pendingImport.initial)}; euro residui ${euro(pendingImport.cash)}; ${SYMBOLS.map(s=>`${qty(pendingImport.holdings[s])} ${s}`).join(', ')}. Premi Carica registro per applicare.`;
    $('confirmImport').disabled=false;
  } catch(error) { $('importStatus').className='error'; $('importStatus').textContent=error.message; }
});
$('confirmImport').addEventListener('click',()=>{
  if (!pendingImport) return;
  wallet=pendingImport;pendingImport=null;$('confirmImport').disabled=true;
  $('tradeStatus').textContent='';save();render();
  $('importStatus').textContent='CSV caricato nel simulatore e salvato in questo browser. Nessun file pubblicato o ordine reale inviato.';
});
$('export').addEventListener('click',()=>{
  const rows=[['data','operazione_virtuale','moneta','quantita','prezzo_eur','costo_eur'],...wallet.trades.map(t=>[t.at,t.side,t.symbol,t.quantity,t.price,t.fee])];
  const blob=new Blob(['\uFEFF'+rows.map(r=>r.join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download='gaia-operazioni-virtuali.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
setInterval(()=>{if(!document.hidden)refresh();},60000);
// Recheck freshness even when the timer or network has been throttled.
setInterval(render,15000);
render();refresh();
