/* Família FR · cores e enfeites das áreas (Área do FR e Área da Nutri).
   Cada área guarda a sua escolha neste aparelho. */
(function(){
  const AREA = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "");
  const VITRINE = AREA === "index"; // vitrine dos clientes: só os enfeites, sem troca de cor
  const KEY = "fr-tema-" + AREA;
  const TEMAS = {
    verde:   {nome:"Verde",   lime:"#d4ff3a", ink:"#141a00", bg:"#0f100d", s1:"#171914", s2:"#20231c", line:"#2c3026"},
    rosa:    {nome:"Rosa",    lime:"#ff6fae", ink:"#2b0016", bg:"#1e0d18", s1:"#2a1422", s2:"#36192c", line:"#4d2a40"},
    roxo:    {nome:"Roxo",    lime:"#b98cff", ink:"#1a0b33", bg:"#170e26", s1:"#211533", s2:"#2c1d42", line:"#432f5e"},
    azul:    {nome:"Azul",    lime:"#55c8ff", ink:"#00213a", bg:"#0b1422", s1:"#111d2f", s2:"#18263c", line:"#283a55"},
    laranja: {nome:"Laranja", lime:"#ff9a3c", ink:"#2a1200", bg:"#1a0f06", s1:"#25170b", s2:"#311f10", line:"#4a311c"},
    dourado: {nome:"Dourado", lime:"#ffd23f", ink:"#2a2000", bg:"#171406", s1:"#211d0b", s2:"#2c2710", line:"#463e1c"}
  };
  const ler = () => { try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } };
  const salvar = o => { try{ localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){} };
  let pref = Object.assign({tema:"verde", enfeites:true}, ler());

  if(VITRINE) pref = {tema:"verde", enfeites:true};
  function aplicar(){
    const t = TEMAS[pref.tema] || TEMAS.verde, r = document.documentElement.style;
    if(!VITRINE) ["lime","ink","bg","s1","s2","line"].forEach(k => r.setProperty("--"+k, t[k]));
    document.documentElement.classList.toggle("fr-sem-enfeite", !pref.enfeites);
    document.querySelectorAll("[data-fr-tema]").forEach(b => b.setAttribute("aria-pressed", b.dataset.frTema === pref.tema));
    const chk = document.getElementById("fr-enf"); if(chk) chk.checked = !!pref.enfeites;
  }
  aplicar(); // antes de desenhar, para não piscar

  const css = `
  html:not(.fr-vitrine) body{background:radial-gradient(130% 55% at 50% -8%, color-mix(in srgb, var(--lime) 26%, transparent), transparent 72%) no-repeat, var(--bg);min-height:100vh}
  .fr-pick{position:fixed;right:14px;bottom:14px;z-index:60;font:14px/1.4 Poppins,system-ui,sans-serif}
  .fr-pick>button{width:48px;height:48px;border-radius:50%;border:1.5px solid var(--line);background:var(--s1);font-size:22px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.4)}
  .fr-pan{position:absolute;right:0;bottom:58px;width:230px;background:var(--s1);border:1px solid var(--line);border-radius:16px;padding:14px;color:var(--tx,#f3f4ef);box-shadow:0 12px 30px rgba(0,0,0,.5)}
  .fr-pan b{display:block;margin-bottom:8px}
  .fr-cores{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .fr-cores button{border:2px solid transparent;border-radius:12px;padding:8px 4px;background:var(--s2);color:inherit;font:inherit;font-size:12px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px}
  .fr-cores button[aria-pressed=true]{border-color:var(--lime)}
  .fr-cores i{width:22px;height:22px;border-radius:50%;display:block}
  .fr-pan label{display:flex;align-items:center;gap:8px;margin:12px 0 0;font-size:14px;color:inherit;cursor:pointer}
  .fr-pan input{width:auto;accent-color:var(--lime)}
  .fr-dvd{position:fixed;left:0;top:0;width:52px;height:52px;z-index:50;pointer-events:none;opacity:.7;will-change:transform;filter:drop-shadow(0 4px 8px rgba(0,0,0,.35))}
  .fr-dvd svg{width:100%;height:100%;display:block;animation:fr-troca .35s ease-out}
  @keyframes fr-troca{from{transform:scale(.6)}to{transform:scale(1)}}
  .fr-dvd .sobe{animation:fr-supino 1.1s ease-in-out infinite alternate;transform-origin:center}
  @keyframes fr-supino{from{transform:translateY(5px)}to{transform:translateY(-3px)}}
  .fr-bicho{position:fixed;left:0;top:0;width:54px;height:54px;z-index:55;pointer-events:none;visibility:hidden;will-change:transform}
  .fr-bicho.vai{visibility:visible}
  .fr-bicho .corpo{animation:fr-pula .36s ease-in-out infinite alternate;transform-origin:50% 100%}
  .fr-bicho .pe1{animation:fr-perna .18s linear infinite alternate;transform-origin:22px 40px}
  .fr-bicho .pe2{animation:fr-perna .18s linear infinite alternate-reverse;transform-origin:32px 40px}
  .fr-bicho.ar .pe1,.fr-bicho.ar .pe2,.fr-bicho.ar .corpo,.fr-bicho.caido .pe1,.fr-bicho.caido .pe2{animation-play-state:paused}
  .fr-bicho.ar .pe1{transform:rotate(-35deg)}.fr-bicho.ar .pe2{transform:rotate(30deg)}
  .fr-bicho.pousa .corpo{animation:fr-amassa .22s ease-out}
  @keyframes fr-amassa{0%{transform:scale(1.15,.8)}100%{transform:scale(1,1)}}
  @keyframes fr-pula{from{transform:translateY(0)}to{transform:translateY(-4px)}}
  @keyframes fr-perna{from{transform:rotate(-28deg)}to{transform:rotate(28deg)}}
  .fr-vitrine .fr-dvd{z-index:40;opacity:.55}.fr-vitrine .fr-bicho{z-index:40}
  .fr-sem-enfeite .fr-dvd,.fr-sem-enfeite .fr-bicho{display:none}
  @media (prefers-reduced-motion: reduce){.fr-dvd{display:none}.fr-bicho .corpo,.fr-bicho .pe1,.fr-bicho .pe2{animation:none}.fr-bicho{display:none}}`;

  // desenhos que batem nas bordas, estilo logo do DVD (trocam a cada batida)
  const LEGUMES = [
    `<svg viewBox="0 0 52 52"><path d="M23 30 l-3 17 h12 l-3 -17z" fill="#8fbf4a"/><path d="M24 34 l-1 9 M28 34 l1 9" stroke="#6d9a33" stroke-width="1.4"/>
      <circle cx="17" cy="22" r="9" fill="#3f8f2e"/><circle cx="35" cy="22" r="9" fill="#3f8f2e"/><circle cx="26" cy="15" r="10" fill="#4caa38"/><circle cx="26" cy="27" r="8" fill="#3f8f2e"/>
      <circle cx="22" cy="12" r="2.2" fill="#6fcb52"/><circle cx="31" cy="14" r="2" fill="#6fcb52"/><circle cx="15" cy="20" r="1.8" fill="#5bb944"/><circle cx="37" cy="19" r="1.8" fill="#5bb944"/></svg>`,
    `<svg viewBox="0 0 52 52"><path d="M27 12 q-6 -9 -2 -10 q3 3 3 8 q2 -7 6 -7 q1 4 -5 10 z" fill="#4caa38"/>
      <path d="M20 14 q8 -4 13 3 L19 48 q-3 1 -3 -2 z" fill="#f08a24"/><path d="M22 22 l5 1 M20 29 l5 1 M19 36 l4 1" stroke="#c96a12" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 52 52"><circle cx="26" cy="29" r="17" fill="#e8413c"/><ellipse cx="19" cy="23" rx="4" ry="6" fill="#ff7a72" opacity=".7"/>
      <path d="M26 13 l-7 -3 l5 6 l-8 1 l9 2 l1 5 l1 -5 l9 -2 l-8 -1 l5 -6 z" fill="#3f8f2e"/></svg>`,
    `<svg viewBox="0 0 52 52"><path d="M26 8 C17 8 15 22 15 30 C15 40 20 46 26 46 C32 46 37 40 37 30 C37 22 35 8 26 8 Z" fill="#f5c63a"/>
      <g fill="#e2a91c"><circle cx="21" cy="18" r="2"/><circle cx="26" cy="16" r="2"/><circle cx="31" cy="18" r="2"/><circle cx="20" cy="25" r="2"/><circle cx="26" cy="24" r="2"/><circle cx="32" cy="25" r="2"/><circle cx="20" cy="32" r="2"/><circle cx="26" cy="31" r="2"/><circle cx="32" cy="32" r="2"/></g>
      <path d="M26 46 C16 44 10 34 12 24 C16 32 20 38 26 40 Z" fill="#6fbf4a"/><path d="M26 46 C36 44 42 34 40 24 C36 32 32 38 26 40 Z" fill="#4caa38"/></svg>`,
    `<svg viewBox="0 0 52 52"><path d="M14 12 q12 -4 24 4 q8 8 4 20 q-6 12 -20 10 q-12 -3 -12 -16 q0 -12 4 -18z" fill="#6a2c8f"/><ellipse cx="20" cy="24" rx="3" ry="7" fill="#9a55c4" opacity=".7"/>
      <path d="M10 14 q4 -10 14 -6 q-4 2 -6 6 q-4 -2 -8 0z" fill="#3f8f2e"/></svg>`
  ];
  const TREINO = [
    `<svg viewBox="0 0 52 52"><rect x="15" y="23" width="22" height="6" rx="2" fill="#c9ced3"/><rect x="7" y="14" width="8" height="24" rx="2.5" fill="#79828b"/><rect x="37" y="14" width="8" height="24" rx="2.5" fill="#79828b"/>
      <rect x="3" y="18" width="5" height="16" rx="2" fill="#6a737b"/><rect x="44" y="18" width="5" height="16" rx="2" fill="#6a737b"/><rect x="9" y="16" width="2" height="20" rx="1" fill="#a3abb3"/><rect x="39" y="16" width="2" height="20" rx="1" fill="#a3abb3"/></svg>`,
    `<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="#5b636b"/><circle cx="26" cy="26" r="22" fill="none" stroke="#8c959e" stroke-width="3"/><circle cx="26" cy="26" r="14" fill="none" stroke="#8c959e" stroke-width="1.5"/>
      <circle cx="26" cy="26" r="5" fill="#c9ced3"/><circle cx="26" cy="26" r="2.5" fill="#2b2f33"/><text x="26" y="13.5" text-anchor="middle" font-size="6.5" font-weight="700" fill="var(--lime)" font-family="Poppins,sans-serif">20 KG</text></svg>`,
    `<svg viewBox="0 0 52 52"><path d="M17 20 q0 -13 9 -13 q9 0 9 13" fill="none" stroke="#79828b" stroke-width="5"/>
      <path d="M12 30 q0 -12 14 -12 q14 0 14 12 q0 15 -14 15 q-14 0 -14 -15z" fill="#79828b"/><rect x="18" y="27" width="16" height="7" rx="2" fill="var(--lime)"/><text x="26" y="32.6" text-anchor="middle" font-size="5.5" font-weight="700" fill="var(--ink)" font-family="Poppins,sans-serif">16kg</text></svg>`,
    `<svg viewBox="0 0 52 52"><g class="sobe"><rect x="4" y="12" width="44" height="3" rx="1.5" fill="#c9ced3"/><rect x="2" y="6" width="5" height="15" rx="1.5" fill="#79828b"/><rect x="45" y="6" width="5" height="15" rx="1.5" fill="#79828b"/>
      <path d="M16 14 L20 24 M36 14 L32 24" stroke="#f1c7a3" stroke-width="3.2" stroke-linecap="round"/></g>
      <circle cx="26" cy="20" r="5" fill="#f1c7a3"/><path d="M21 17 q5 -5 10 0" fill="#3a2a1f"/>
      <rect x="20" y="25" width="12" height="12" rx="4" fill="var(--lime)"/><path d="M22 37 l-3 10 M30 37 l3 10" stroke="#79828b" stroke-width="4" stroke-linecap="round"/></svg>`
  ];
  function dvd(qtd){
    const lista = AREA === "nutri" ? LEGUMES : AREA === "admin" ? TREINO : [...LEGUMES, ...TREINO];
    const sorteia = atual => { let n; do { n = Math.floor(Math.random() * lista.length); } while(lista.length > 1 && n === atual); return n; };
    const itens = [];
    for(let i = 0; i < qtd; i++){
      const el = document.createElement("div"); el.className = "fr-dvd"; el.setAttribute("aria-hidden", "true");
      const it = {el, n: sorteia(itens[0] ? itens[0].n : -1), x: 30 + Math.random() * Math.max(10, innerWidth - 110), y: 60 + Math.random() * Math.max(10, innerHeight - 170),
        vx: (Math.random() < .5 ? -1 : 1) * (32 + Math.random() * 22), vy: (Math.random() < .5 ? -1 : 1) * (26 + Math.random() * 22)};
      el.innerHTML = lista[it.n]; document.body.appendChild(el); itens.push(it);
    }
    const troca = it => { it.n = sorteia(it.n); it.el.innerHTML = lista[it.n]; };
    itens.forEach(it => { it.base = Math.hypot(it.vx, it.vy); it.vel = it.base; });
    // sensível ao toque: foge do dedo/mouse e do que for tocado (sem bloquear os cliques)
    const foge = (it, px, py, forca) => {
      const cx = it.x + 26, cy = it.y + 26;
      let dx = cx - px, dy = cy - py; const d = Math.hypot(dx, dy) || 1;
      dx /= d; dy /= d;
      const ang = Math.atan2(dy, dx) + (Math.random() - .5) * .6; // rumo novo, um pouco variado
      it.vel = Math.max(it.vel, it.base * forca);
      it.vx = Math.cos(ang); it.vy = Math.sin(ang);
    };
    const perto = (it, px, py, raio) => Math.hypot(it.x + 26 - px, it.y + 26 - py) < raio;
    let ultimoMove = 0;
    addEventListener("pointermove", e => {
      if(!pref.enfeites || e.timeStamp - ultimoMove < 40) return; ultimoMove = e.timeStamp;
      itens.forEach(it => { if(perto(it, e.clientX, e.clientY, 110)) foge(it, e.clientX, e.clientY, 4); });
    }, {passive: true});
    addEventListener("pointerdown", e => {
      if(!pref.enfeites) return;
      const alvo = e.target.closest && e.target.closest("button,a,input,select,textarea,label,[role=button]");
      const r = alvo && alvo.getBoundingClientRect();
      itens.forEach(it => {
        const emCima = r && it.x + 52 > r.left - 30 && it.x < r.right + 30 && it.y + 52 > r.top - 30 && it.y < r.bottom + 30;
        if(perto(it, e.clientX, e.clientY, 140) || emCima){
          foge(it, r && emCima ? (r.left + r.right) / 2 : e.clientX, r && emCima ? (r.top + r.bottom) / 2 : e.clientY, 6);
          if(perto(it, e.clientX, e.clientY, 60)) troca(it); // encostou nele: troca de bichinho
        }
      });
    }, {passive: true});
    let ant = null;
    function passo(t){
      const dt = ant == null ? 0 : Math.min(0.05, (t - ant) / 1000); ant = t;
      if(pref.enfeites){
        const W = innerWidth - 52, H = innerHeight - 52;
        itens.forEach(it => {
          it.vel = it.base + (it.vel - it.base) * Math.exp(-dt * 1.6); // o susto passa e volta ao ritmo normal
          const m = Math.hypot(it.vx, it.vy) || 1; it.vx = it.vx / m * it.vel; it.vy = it.vy / m * it.vel;
          it.x += it.vx * dt; it.y += it.vy * dt; let bateu = false;
          if(it.x <= 0){ it.x = 0; it.vx = Math.abs(it.vx); bateu = true; }
          if(it.x >= W){ it.x = W; it.vx = -Math.abs(it.vx); bateu = true; }
          if(it.y <= 0){ it.y = 0; it.vy = Math.abs(it.vy); bateu = true; }
          if(it.y >= H){ it.y = H; it.vy = -Math.abs(it.vy); bateu = true; }
          if(bateu) troca(it);
          it.el.style.transform = `translate(${it.x}px,${it.y}px)`;
        });
      }
      requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
    return itens;
  }

  // abacatinho correndo (personagem próprio da Família FR)
  // corredores da Família FR (personagens próprios): cada um com pernas (pe1/pe2) e corpo
  const CORREDORES = {
    abacate: {vel: 1.0, svg: `<g class="pe1"><path d="M22 40 l-2 9" stroke="#3d5a17" stroke-width="3" stroke-linecap="round"/><ellipse cx="19.5" cy="49.5" rx="3.2" ry="1.7" fill="#2f4511"/></g>
    <g class="pe2"><path d="M32 40 l2 9" stroke="#3d5a17" stroke-width="3" stroke-linecap="round"/><ellipse cx="34.5" cy="49.5" rx="3.2" ry="1.7" fill="#2f4511"/></g>
    <g class="corpo">
      <path d="M27 4 C17 4 13 15 12 24 C10.5 35 17 43 27 43 C37 43 43.5 35 42 24 C41 15 37 4 27 4 Z" fill="#4f7a1f"/>
      <path d="M27 8 C20 8 17 17 16.5 25 C15.5 34 20 39.5 27 39.5 C34 39.5 38.5 34 37.5 25 C37 17 34 8 27 8 Z" fill="#cfe68a"/>
      <circle cx="27" cy="30" r="6.5" fill="#9a5b2c"/><circle cx="25.3" cy="28.3" r="1.8" fill="#c27c45"/>
      <circle cx="23" cy="19" r="1.7" fill="#1d2410"/><circle cx="31" cy="19" r="1.7" fill="#1d2410"/>
      <circle cx="23.5" cy="18.4" r=".55" fill="#fff"/><circle cx="31.5" cy="18.4" r=".55" fill="#fff"/>
      <path d="M24.5 22.5 q2.5 2.2 5 0" stroke="#1d2410" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <circle cx="20.5" cy="22" r="1.6" fill="#f29b9b" opacity=".7"/><circle cx="33.5" cy="22" r="1.6" fill="#f29b9b" opacity=".7"/>
      <path d="M13 27 q-5 -2 -7 -6" stroke="#3d5a17" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M41 27 q5 2 7 -2" stroke="#3d5a17" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    </g>`},
    pera: {vel: 1.0, svg: `<g class="pe1"><path d="M22 40 l-2 9" stroke="#6b6a1c" stroke-width="3" stroke-linecap="round"/><ellipse cx="19.5" cy="49.5" rx="3.2" ry="1.7" fill="#4d4c12"/></g>
      <g class="pe2"><path d="M32 40 l2 9" stroke="#6b6a1c" stroke-width="3" stroke-linecap="round"/><ellipse cx="34.5" cy="49.5" rx="3.2" ry="1.7" fill="#4d4c12"/></g>
      <g class="corpo">
        <path d="M27 9 C22 9 21 15 21 18 C21 22 13 25 12.5 32 C12 39 18.5 43 27 43 C35.5 43 42 39 41.5 32 C41 25 33 22 33 18 C33 15 32 9 27 9 Z" fill="#c9d64a"/>
        <path d="M34 26 C38 29 39 34 37 38" stroke="#e6ee8a" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
        <path d="M27 9 q0 -4 2 -6" stroke="#6b4a22" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M29 5 q6 -3 8 1 q-5 3 -8 -1 Z" fill="#5f9a2a"/>
        <circle cx="23" cy="28" r="1.7" fill="#1d2410"/><circle cx="31" cy="28" r="1.7" fill="#1d2410"/>
        <circle cx="23.5" cy="27.4" r=".55" fill="#fff"/><circle cx="31.5" cy="27.4" r=".55" fill="#fff"/>
        <path d="M24.5 31.5 q2.5 2.2 5 0" stroke="#1d2410" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <circle cx="20" cy="31" r="1.6" fill="#f29b9b" opacity=".75"/><circle cx="34" cy="31" r="1.6" fill="#f29b9b" opacity=".75"/>
        <path d="M13 31 q-5 -2 -7 -6" stroke="#6b6a1c" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M41 31 q5 2 7 -2" stroke="#6b6a1c" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      </g>`},
    maca: {vel: 1.05, svg: `<g class="pe1"><path d="M22 40 l-2 9" stroke="#6b1d1d" stroke-width="3" stroke-linecap="round"/><ellipse cx="19.5" cy="49.5" rx="3.2" ry="1.7" fill="#4a1212"/></g>
      <g class="pe2"><path d="M32 40 l2 9" stroke="#6b1d1d" stroke-width="3" stroke-linecap="round"/><ellipse cx="34.5" cy="49.5" rx="3.2" ry="1.7" fill="#4a1212"/></g>
      <g class="corpo">
        <path d="M27 13 C22 9 12 10 11.5 22 C11 34 18 43 23 43 C25 43 26 42 27 42 C28 42 29 43 31 43 C36 43 43 34 42.5 22 C42 10 32 9 27 13 Z" fill="#e2393b"/>
        <path d="M17 18 C15 21 15 25 16 28" stroke="#ff8a7a" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>
        <path d="M27 13 q-1 -5 1 -8" stroke="#6b4a22" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M28.5 7 q7 -4 9 1 q-6 3 -9 -1 Z" fill="#5f9a2a"/>
        <circle cx="23" cy="25" r="1.7" fill="#1d2410"/><circle cx="31" cy="25" r="1.7" fill="#1d2410"/>
        <circle cx="23.5" cy="24.4" r=".55" fill="#fff"/><circle cx="31.5" cy="24.4" r=".55" fill="#fff"/>
        <path d="M24.5 28.5 q2.5 2.2 5 0" stroke="#1d2410" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <circle cx="20" cy="28" r="1.6" fill="#f29b9b" opacity=".75"/><circle cx="34" cy="28" r="1.6" fill="#f29b9b" opacity=".75"/>
        <path d="M13 29 q-5 -2 -7 -6" stroke="#8f2224" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M41 29 q5 2 7 -2" stroke="#8f2224" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      </g>`},
    melancia: {vel: 0.85, svg: `<g class="pe1"><path d="M22 40 l-2 9" stroke="#2f5d1b" stroke-width="3" stroke-linecap="round"/><ellipse cx="19.5" cy="49.5" rx="3.2" ry="1.7" fill="#1f3f11"/></g>
      <g class="pe2"><path d="M32 40 l2 9" stroke="#2f5d1b" stroke-width="3" stroke-linecap="round"/><ellipse cx="34.5" cy="49.5" rx="3.2" ry="1.7" fill="#1f3f11"/></g>
      <g class="corpo">
        <path d="M6 15 L48 15 C48 33 38 42 27 42 C16 42 6 33 6 15 Z" fill="#2f7d32"/>
        <path d="M9 15 L45 15 C45 30 37 38.5 27 38.5 C17 38.5 9 30 9 15 Z" fill="#c8f2a0"/>
        <path d="M11 15 L43 15 C43 28 36 36 27 36 C18 36 11 28 11 15 Z" fill="#f2525a"/>
        <ellipse cx="18" cy="27" rx="1" ry="1.6" fill="#2b1a10"/><ellipse cx="36" cy="27" rx="1" ry="1.6" fill="#2b1a10"/><ellipse cx="27" cy="32" rx="1" ry="1.6" fill="#2b1a10"/>
        <circle cx="23" cy="20" r="1.7" fill="#1d2410"/><circle cx="31" cy="20" r="1.7" fill="#1d2410"/>
        <circle cx="23.5" cy="19.4" r=".55" fill="#fff"/><circle cx="31.5" cy="19.4" r=".55" fill="#fff"/>
        <path d="M24.5 23.5 q2.5 2.2 5 0" stroke="#1d2410" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <circle cx="20" cy="23" r="1.6" fill="#f29b9b" opacity=".75"/><circle cx="34" cy="23" r="1.6" fill="#f29b9b" opacity=".75"/>
        <path d="M8 24 q-5 -2 -7 -6" stroke="#2f5d1b" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M46 24 q5 2 7 -2" stroke="#2f5d1b" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      </g>`},
    alface: {vel: 0.95, svg: `<g class="pe1"><path d="M22 40 l-2 9" stroke="#3d6b1a" stroke-width="3" stroke-linecap="round"/><ellipse cx="19.5" cy="49.5" rx="3.2" ry="1.7" fill="#2a4c10"/></g>
      <g class="pe2"><path d="M32 40 l2 9" stroke="#3d6b1a" stroke-width="3" stroke-linecap="round"/><ellipse cx="34.5" cy="49.5" rx="3.2" ry="1.7" fill="#2a4c10"/></g>
      <g class="corpo">
        <path d="M27 5 C33 5 35 9 38 9 C43 9 45 14 44 18 C47 21 47 27 44 30 C45 35 42 40 37 41 C34 44 30 43 27 43 C24 43 20 44 17 41 C12 40 9 35 10 30 C7 27 7 21 10 18 C9 14 11 9 16 9 C19 9 21 5 27 5 Z" fill="#7cc443"/>
        <path d="M27 10 C32 10 37 14 38 20 C40 27 37 36 27 37 C17 36 14 27 16 20 C17 14 22 10 27 10 Z" fill="#b6e27a"/>
        <path d="M27 37 L27 14 M27 24 L20 18 M27 28 L34 21" stroke="#e8f7c9" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".9"/>
        <circle cx="23" cy="24" r="1.7" fill="#1d2410"/><circle cx="31" cy="24" r="1.7" fill="#1d2410"/>
        <circle cx="23.5" cy="23.4" r=".55" fill="#fff"/><circle cx="31.5" cy="23.4" r=".55" fill="#fff"/>
        <path d="M24.5 27.5 q2.5 2.2 5 0" stroke="#1d2410" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <circle cx="20" cy="27" r="1.6" fill="#f29b9b" opacity=".75"/><circle cx="34" cy="27" r="1.6" fill="#f29b9b" opacity=".75"/>
        <path d="M10 30 q-5 -2 -7 -6" stroke="#3d6b1a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M44 30 q5 2 7 -2" stroke="#3d6b1a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      </g>`},
    rapaz: {vel: 1.3, svg: `<g class="pe1"><path d="M23 38 l-3 11" stroke="#2a2e3a" stroke-width="3.6" stroke-linecap="round"/><ellipse cx="19.5" cy="49.8" rx="3.8" ry="1.8" fill="#f3f4ef"/></g>
      <g class="pe2"><path d="M31 38 l3 11" stroke="#2a2e3a" stroke-width="3.6" stroke-linecap="round"/><ellipse cx="35" cy="49.8" rx="3.8" ry="1.8" fill="#f3f4ef"/></g>
      <g class="corpo">
        <path d="M21 31 h12 v8 h-12 z" fill="#2a2e3a"/>
        <path d="M19 20 q8 -4 16 0 l0 12 h-16 z" fill="#d4ff3a"/>
        <text x="27" y="29.5" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-weight="800" font-size="6.5" fill="#141a00">FR</text>
        <path d="M19 22 q-6 4 -8 9" stroke="#8a5a3c" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M35 22 q6 -2 8 -8" stroke="#8a5a3c" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="27" cy="12" r="7.5" fill="#a86e48"/>
        <path d="M19.5 11 q1 -8 8 -8 q7 0 7.5 7 q-3 -3 -8 -3 q-4 0 -7.5 4 z" fill="#1d1712"/>
        <circle cx="29.5" cy="12" r="1.2" fill="#1d1712"/><circle cx="33" cy="12" r="1.2" fill="#1d1712"/>
        <path d="M29 15.5 q2.3 1.8 4.5 0" stroke="#1d1712" stroke-width="1.1" fill="none" stroke-linecap="round"/>
      </g>`},
  };

  // corrida: personagens surgem em lugares aleatórios da tela e correm até o outro lado,
  // na horizontal (esquerda/direita) ou na vertical (de baixo para cima e de cima para baixo, "correndo na parede")
  function corrida(voando){
    const SZ = 54, G = 1500, nomes = Object.keys(CORREDORES), lista = [];
    let ant = null;
    const rects = () => [...document.querySelectorAll("button,input,a.btn,.card,.ped,h2,select,textarea")]
      .map(el => el.getBoundingClientRect()).filter(r => r.width > 60 && r.bottom > 60 && r.top < innerHeight - 20);
    function nova(){
      if(!pref.enfeites || document.hidden || lista.length >= 3) return;
      const W = innerWidth, H = innerHeight, nome = nomes[Math.floor(Math.random() * nomes.length)], c = CORREDORES[nome];
      const rs = rects(), sorte = Math.random(), base = (140 + Math.random() * 60) * c.vel;
      let r;
      if(Math.random() < .5){ // horizontal: o "chão" é uma linha na altura sorteada
        let piso = sorte < .5 && rs.length ? Math.round(rs[Math.floor(Math.random() * rs.length)].top) : sorte < .8 ? 110 + Math.random() * (H - 130) : H - 8;
        piso = Math.max(110, Math.min(H - 8, piso));
        if(lista.some(o => o.eixo === "h" && Math.abs(o.piso - piso) < 50)) piso = Math.max(110, Math.min(H - 8, piso + (Math.random() < .5 ? -70 : 70)));
        const dir = Math.random() < .5 ? 1 : -1;
        r = {eixo: "h", piso, dir, s: dir > 0 ? -SZ - 10 : W + 10};
      } else { // vertical: o "chão" é uma parede (borda da tela ou lateral de um botão/campo)
        const sobe = Math.random() < .5; // sobe: pés na parede da direita; desce: pés na parede da esquerda
        let piso;
        if(sorte < .45 && rs.length){ const q = rs[Math.floor(Math.random() * rs.length)]; piso = sobe ? q.left : q.right; }
        else if(sorte < .7) piso = sobe ? W - 2 : 2;
        else piso = 70 + Math.random() * (W - 140);
        piso = sobe ? Math.max(SZ + 4, Math.min(W - 2, piso)) : Math.max(2, Math.min(W - SZ - 4, piso));
        if(lista.some(o => o.eixo === "v" && Math.abs(o.piso - piso) < 50)) piso = sobe ? Math.max(SZ + 4, piso - 70) : Math.min(W - SZ - 4, piso + 70);
        r = {eixo: "v", piso, dir: sobe ? -1 : 1, s: sobe ? H + 10 : -SZ - 10};
      }
      const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el.setAttribute("class", "fr-bicho vai"); el.setAttribute("viewBox", "0 0 54 54"); el.setAttribute("aria-hidden", "true");
      el.innerHTML = c.svg; document.body.appendChild(el);
      el.addEventListener("animationend", e => { if(e.animationName === "fr-amassa") el.classList.remove("pousa"); });
      lista.push(Object.assign(r, {el, base, vel: base, a: 0, va: 0, noChao: true, giro: 0, gira: 0, caido: 0, prox: 1 + Math.random() * 2}));
    }
    // posição na tela a partir do avanço (s) e da altura do pulo (a)
    const xy = r => r.eixo === "h" ? [r.s, r.piso - SZ - r.a] : (r.dir < 0 ? [r.piso - SZ - r.a, r.s] : [r.piso + r.a, r.s]);
    const pula = (r, forca, gira) => { if(!r.noChao || r.caido > 0) return; r.va = forca; r.noChao = false; r.gira = gira || 0; r.el.classList.add("ar"); };
    function passo(t){
      const dt = ant == null ? 0 : Math.min(0.05, (t - ant) / 1000); ant = t;
      for(let i = lista.length - 1; i >= 0; i--){
        const r = lista[i], W = innerWidth, H = innerHeight;
        if(!pref.enfeites){ r.el.remove(); lista.splice(i, 1); continue; }
        r.vel = r.base + (r.vel - r.base) * Math.exp(-dt * 1.2);
        if(r.caido > 0){ // tropeçou: rola e levanta
          r.caido -= dt; r.s += r.dir * r.base * 0.35 * dt; r.giro = Math.min(90, (0.9 - r.caido) * 400);
          if(r.caido <= 0){ r.giro = 0; r.el.classList.remove("caido"); pula(r, 380); }
        } else {
          r.s += r.dir * (r.eixo === "v" ? 0.9 : 1) * r.vel * dt;
          r.prox -= dt;
          if(r.prox <= 0 && r.noChao){
            const s = Math.random();
            if(s < .55) pula(r, 450); else if(s < .85) pula(r, 640, 1); else { r.caido = 0.9; r.el.classList.add("caido"); }
            r.prox = 1.2 + Math.random() * 2.2;
          }
          const [x, y] = xy(r), c = [x + SZ / 2, y + SZ / 2];
          // pula os bichinhos voando e os outros corredores que vêm de frente
          (voando || []).forEach(v => {
            const vc = [v.x + 26, v.y + 26], k = r.eixo === "h" ? 0 : 1;
            const d = (vc[k] - c[k]) * r.dir;
            if(r.noChao && d > 0 && d < 80 && Math.abs(vc[1 - k] - c[1 - k]) < 45) pula(r, 700, 1);
          });
          lista.forEach(o => { if(o === r || o.eixo !== r.eixo || o.dir === r.dir) return; const d = (o.s - r.s) * r.dir;
            if(r.noChao && d > 0 && d < 90 && Math.abs(o.piso - r.piso) < 30) pula(r, 620, Math.random() < .5 ? 1 : 0); });
        }
        if(!r.noChao){
          r.va -= G * dt; r.a += r.va * dt;
          if(r.gira) r.giro += 620 * dt;
          if(r.va < 0 && r.a <= 0){ r.a = 0; r.va = 0; r.noChao = true; r.gira = 0; r.giro = 0;
            r.el.classList.remove("ar", "pousa"); void r.el.getBoundingClientRect(); r.el.classList.add("pousa"); }
        } else if(!r.caido) r.a = 0;
        const [x, y] = xy(r), base = r.eixo === "h" ? 0 : (r.dir < 0 ? -90 : 90);
        r.el.style.transform = r.eixo === "h" ? `translate(${x}px,${y}px) scaleX(${r.dir}) rotate(${r.giro}deg)` : `translate(${x}px,${y}px) rotate(${base + r.giro}deg)`;
        const fora = r.eixo === "h" ? (r.s > W + SZ + 20 || r.s < -SZ - 30) : (r.s > H + SZ + 20 || r.s < -SZ - 30);
        if(fora){ r.el.remove(); lista.splice(i, 1); }
      }
      requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
    // encostou (ou passou perto): pulo alto com giro e dispara correndo
    const assusta = (e, forte) => lista.forEach(r => {
      if(r.caido > 0) return;
      const [x, y] = xy(r);
      if(Math.hypot(e.clientX - (x + SZ / 2), e.clientY - (y + SZ / 2)) < (forte ? 90 : 70)){ pula(r, forte ? 760 : 560, 1); r.vel = r.base * (forte ? 2 : 1.5); }
    });
    addEventListener("pointerdown", e => assusta(e, true), {passive: true});
    addEventListener("pointermove", e => assusta(e, false), {passive: true});
    const agenda = () => setTimeout(() => { nova(); agenda(); }, 3500 + Math.random() * 5500);
    setTimeout(nova, 1000 + Math.random() * 1500); agenda();
    return nova;
  }

  function montar(){
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    if(VITRINE) document.documentElement.classList.add("fr-vitrine");
    const voando = dvd(2);
    const corre = corrida(voando);
    if(VITRINE) return; // na vitrine não tem troca de cor
    const box = document.createElement("div"); box.className = "fr-pick";
    box.innerHTML = `<button type="button" aria-label="Cores e enfeites" aria-expanded="false">🎨</button>
      <div class="fr-pan" hidden><b>Cor da sua área</b><div class="fr-cores">${Object.entries(TEMAS).map(([k,t]) =>
        `<button type="button" data-fr-tema="${k}"><i style="background:${t.lime}"></i>${t.nome}</button>`).join("")}</div>
        <label><input type="checkbox" id="fr-enf"> Enfeites animados</label></div>`;
    document.body.appendChild(box);
    const btn = box.firstElementChild, pan = box.querySelector(".fr-pan");
    btn.onclick = () => { pan.hidden = !pan.hidden; btn.setAttribute("aria-expanded", !pan.hidden); };
    document.addEventListener("click", e => { if(!box.contains(e.target)){ pan.hidden = true; btn.setAttribute("aria-expanded", "false"); } });
    box.querySelectorAll("[data-fr-tema]").forEach(b => b.onclick = () => { pref.tema = b.dataset.frTema; salvar(pref); aplicar(); });
    box.querySelector("#fr-enf").onchange = e => { pref.enfeites = e.target.checked; salvar(pref); aplicar(); if(pref.enfeites) corre(); };
    aplicar();
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar); else montar();
})();
