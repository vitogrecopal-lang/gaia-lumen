(() => {
  const status = document.getElementById("starlinkStatus");
  const list = document.getElementById("starlinkNews");
  const button = document.getElementById("starlinkRefresh");
  if (!status || !list || !button) return;
  const format = (date) => new Date(date).toLocaleString("it-IT", {dateStyle: "medium", timeStyle: "short"});
  let busy = false;
  async function refresh() {
    if (busy) return;
    busy = true;
    button.disabled = true;
    status.textContent = "Aggiornamento delle fonti pubbliche...";
    try {
      const response = await fetch("/api/starlink-news", {cache: "no-store", signal: AbortSignal.timeout(12000)});
      if (!response.ok) throw new Error("Notizie non disponibili");
      const data = await response.json();
      if (!Array.isArray(data.items)) throw new Error("Risposta non valida");
      const rows = data.items.map((item) => {
        const row = document.createElement("li");
        const link = document.createElement("a");
        const url = new URL(item.url);
        if (url.protocol !== "https:" || url.hostname !== "news.google.com") throw new Error("Link non valido");
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = item.title;
        const meta = document.createElement("small");
        meta.textContent = `${item.source} · ${format(item.publishedAt)}`;
        row.append(link, meta);
        return row;
      });
      list.replaceChildren(...rows);
      status.textContent = data.stale
        ? `${data.error} ${data.fetchedAt ? "Ultima lettura riuscita: " + format(data.fetchedAt) : "Nessuna lettura riuscita."}`
        : `${rows.length ? "Fonti lette" : "Nessuna notizia trovata negli ultimi 30 giorni"}: ${format(data.fetchedAt)} · ${data.provider}`;
    } catch {
      status.textContent = "Aggiornamento non riuscito. Le notizie eventualmente visibili sono della lettura precedente. Riprova piu' tardi.";
    } finally {
      busy = false;
      button.disabled = false;
    }
  }
  button.addEventListener("click", refresh);
  window.addEventListener("online", refresh);
  setInterval(() => { if (!document.hidden) refresh(); }, 15 * 60 * 1000);
  refresh();
})();
