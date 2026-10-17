(() => {
  const root = document.getElementById("starlink-simulator");
  if (!root) return;
  const power = document.getElementById("starlinkPower");
  const policy = document.getElementById("starlinkPolicy");
  const result = document.getElementById("starlinkSimResult");
  const names = ["Military", "Civil", "Cooperation"];
  const controls = names.map(name => document.getElementById(`starlink${name}`));
  const presets = {balanced: [50, 70, 60], restricted: [90, 25, 20], civil: [20, 95, 90]};
  function render() {
    const [m,g,c] = controls.map((input,i) => {
      const value = Math.max(0,Math.min(100,Number(input.value) || 0));
      document.getElementById(`starlink${names[i]}Value`).textContent = value;
      return value;
    });
    const title = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `Scenario ipotetico: ${power.selectedOptions[0].textContent}`;
    title.append(strong);
    const scores = [["Accesso civile", .7*g + .3*(100-m)], ["Autonomia dell'attore", .7*m+.3*(100-c)], ["Cooperazione", c], ["Rischio di esclusione", .5*m+.3*(100-g)+.2*(100-c)]];
    const grid = document.createElement("dl");
    grid.className = "starlink-sim-metrics";
    for (const [label, score] of scores) {
      const metric = document.createElement("div");
      const dt = document.createElement("dt"); dt.textContent = label;
      const dd = document.createElement("dd"); dd.textContent = `${Math.round(score)} / 100 punti`;
      metric.append(dt,dd); grid.append(metric);
    }
    const summary = document.createElement("p");
    summary.textContent = m >= 75
      ? "In questo modello, la priorita' militare concentra le decisioni nell'attore selezionato e riduce lo spazio riservato agli usi civili. Garanzie e cooperazione possono attenuare l'esclusione."
      : g >= 80 && c >= 75
        ? "In questo modello, garanzie civili e cooperazione sostengono un accesso piu' ampio. Le decisioni condivise riducono l'autonomia unilaterale dell'attore."
        : "In questo modello, l'accesso civile, l'autonomia dell'attore e la cooperazione dipendono dai tre parametri scelti. Modificali per confrontare i compromessi.";
    const boundary = document.createElement("p");
    boundary.className = "matrix-boundary";
    boundary.textContent = "Risultati inventati dal modello didattico. Nessun controllo reale, comando, bersaglio o telemetria satellitare.";
    result.replaceChildren(title,grid,summary,boundary);
  }
  function applyPreset() {
    const values = presets[policy.value] || presets.balanced;
    controls.forEach((input,i) => { input.value = values[i]; });
    render();
  }
  policy.addEventListener("change", applyPreset);
  power.addEventListener("change", render);
  controls.forEach(input => input.addEventListener("input", render));
  document.getElementById("starlinkSimReset").addEventListener("click", () => {
    power.value = "USA"; policy.value = "balanced"; applyPreset();
  });
  render();
})();
