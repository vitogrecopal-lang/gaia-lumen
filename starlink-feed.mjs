const FEED_URL = "https://news.google.com/rss/search?q=" + encodeURIComponent('(Starlink OR Starshield) (military OR defense OR militare OR difesa) when:30d') + "&hl=it&gl=IT&ceid=IT:it";
const TTL = 15 * 60 * 1000;
let cached = null;
let nextAttempt = 0;
let pending;

function decode(value) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, code) => {
    const n = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code);
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
  }).replace(/&(amp|quot|apos|lt|gt);/g, (_, name) => ({amp:"&",quot:'"',apos:"'",lt:"<",gt:">"})[name]);
}
function tag(xml, name) {
  return decode(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`))?.[1] || "").trim();
}
export function parseStarlinkFeed(xml) {
  if (!/<rss[\s>]/i.test(xml) || !/<channel[\s>]/i.test(xml)) throw new Error("Invalid RSS");
  const seen = new Set();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].flatMap((match) => {
    const title = tag(match[1], "title").slice(0, 500);
    const link = tag(match[1], "link");
    const date = Date.parse(tag(match[1], "pubDate"));
    let url;
    try { url = new URL(link); } catch { return []; }
    if (url.protocol !== "https:" || url.hostname !== "news.google.com" || !title || !Number.isFinite(date) || seen.has(link)) return [];
    seen.add(link);
    return [{title, url: url.href, source: tag(match[1], "source").slice(0, 150) || "Fonte non indicata", publishedAt: new Date(date).toISOString()}];
  }).sort((a,b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0,12);
}
export async function getStarlinkNews() {
  if (Date.now() < nextAttempt) return cached;
  if (pending) return pending;
  pending = (async () => {
    try {
      const response = await fetch(FEED_URL, {signal: AbortSignal.timeout(8000), headers: {accept: "application/rss+xml, application/xml"}});
      if (!response.ok) throw new Error("Feed unavailable");
      const xml = await response.text();
      if (xml.length > 2000000) throw new Error("Feed too large");
      cached = {items: parseStarlinkFeed(xml), fetchedAt: new Date().toISOString(), stale: false, provider: "Google News RSS", error: null};
      nextAttempt = Date.now() + TTL;
    } catch {
      cached = {items: cached?.items || [], fetchedAt: cached?.fetchedAt || null, stale: true, provider: "Google News RSS", error: "Notizie temporaneamente non disponibili. Riprova tra qualche minuto."};
      nextAttempt = Date.now() + 60000;
    }
    return cached;
  })();
  try { return await pending; } finally { pending = null; }
}
