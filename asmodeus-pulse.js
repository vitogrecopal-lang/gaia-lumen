// Symbolic pulse contract. No network, credentials, trading or predictions.
const STEPS = [5, -5, 10, -10, 15, -15, 0];
export function createAsmodeusPulse(sequence, source = 'crypto') {
  if (!Number.isSafeInteger(sequence) || sequence < 1 || !['crypto','homepage'].includes(source)) throw new Error('Impulso non valido');
  return { type:'gaia-asmodeus-simulation-v1', id:`${source}-${Date.now()}-${sequence}`, source, sequence, at:Date.now(), solChange:STEPS[(sequence-1)%STEPS.length] };
}
export function validAsmodeusPulse(pulse, now = Date.now()) {
  return pulse?.type==='gaia-asmodeus-simulation-v1' && typeof pulse.id==='string' && pulse.id.length<=100 && ['crypto','homepage'].includes(pulse.source) && Number.isSafeInteger(pulse.sequence) && pulse.sequence>=1 && Number.isFinite(pulse.at) && Math.abs(now-pulse.at)<30000 && STEPS.includes(pulse.solChange);
}
export function pulseChannel() {
  try { return typeof BroadcastChannel==='function' ? new BroadcastChannel('gaia-asmodeus-simulation-v1') : null; } catch { return null; }
}
