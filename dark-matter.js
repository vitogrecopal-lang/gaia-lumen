(() => {
  const canvas = document.querySelector("#darkMatterCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const haloMass = document.querySelector("#haloMassInput");
  const concentration = document.querySelector("#haloConcentrationInput");
  const baryonMass = document.querySelector("#baryonMassInput");
  const haloMassValue = document.querySelector("#haloMassValue");
  const concentrationValue = document.querySelector("#haloConcentrationValue");
  const baryonMassValue = document.querySelector("#baryonMassValue");
  const log = document.querySelector("#darkMatterLog");
  const G = 4.30091e-6; // kpc (km/s)^2 / solar mass
  const r200 = 210;
  const diskScale = 3;

  const nfwF = (x) => Math.log(1 + x) - x / (1 + x);
  const visibleEnclosed = (r, mass) => mass * (1 - Math.exp(-r / diskScale) * (1 + r / diskScale));
  const haloEnclosed = (r, mass, c) => mass * nfwF(c * r / r200) / nfwF(c);
  const speed = (mass, r) => Math.sqrt(Math.max(0, G * mass / r));

  function draw() {
    const halo = 10 ** Number(haloMass.value);
    const c = Number(concentration.value);
    const baryons = 10 ** Number(baryonMass.value);
    haloMassValue.textContent = `${halo.toExponential(1)} M☉`;
    concentrationValue.textContent = String(c);
    baryonMassValue.textContent = `${baryons.toExponential(1)} M☉`;
    const points = Array.from({ length: 80 }, (_, i) => {
      const r = 0.5 + i * 0.5;
      const mb = visibleEnclosed(r, baryons);
      const mh = haloEnclosed(r, halo, c);
      const visible = speed(mb, r);
      return { r, visible, total: Math.sqrt(visible ** 2 + speed(mh, r) ** 2) };
    });
    const w = canvas.width, h = canvas.height, left = 58, right = 18, top = 22, bottom = 46;
    const maxV = Math.max(300, ...points.map((p) => p.total)) * 1.08;
    const x = (r) => left + (r / 40) * (w - left - right);
    const y = (v) => h - bottom - (v / maxV) * (h - top - bottom);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#05070b"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(153,169,189,.22)"; ctx.fillStyle = "#c9d8e8"; ctx.font = "12px Segoe UI";
    for (let v = 0; v <= maxV; v += 100) { ctx.beginPath(); ctx.moveTo(left, y(v)); ctx.lineTo(w-right, y(v)); ctx.stroke(); ctx.fillText(String(v), 20, y(v)+4); }
    ctx.strokeStyle = "#6ee7ff"; ctx.lineWidth = 3; ctx.beginPath(); points.forEach((p,i)=>i?ctx.lineTo(x(p.r),y(p.visible)):ctx.moveTo(x(p.r),y(p.visible))); ctx.stroke();
    ctx.strokeStyle = "#b58cff"; ctx.lineWidth = 3; ctx.beginPath(); points.forEach((p,i)=>i?ctx.lineTo(x(p.r),y(p.total)):ctx.moveTo(x(p.r),y(p.total))); ctx.stroke();
    ctx.fillStyle = "#6ee7ff"; ctx.fillText("solo materia visibile", left+8, top+12);
    ctx.fillStyle = "#d9b7ff"; ctx.fillText("visibile + alone NFW", left+170, top+12);
    ctx.fillStyle = "#c9d8e8"; ctx.fillText("raggio galattico (kpc)", w/2-62, h-12);
    ctx.save(); ctx.translate(12,h/2+48); ctx.rotate(-Math.PI/2); ctx.fillText("velocita' circolare (km/s)",0,0); ctx.restore();
    const outer = points[points.length-1];
    log.textContent = [`Profilo: Navarro-Frenk-White (NFW)`, `Raggio: ${outer.r.toFixed(0)} kpc`, `Velocita' visibile: ${outer.visible.toFixed(0)} km/s`, `Velocita' con alone: ${outer.total.toFixed(0)} km/s`, `Eccesso dinamico simulato: ${(outer.total-outer.visible).toFixed(0)} km/s`].join("\n");
  }
  [haloMass, concentration, baryonMass].forEach((input) => input.addEventListener("input", draw));
  draw();
})();
