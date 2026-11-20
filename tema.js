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
  .fr-obs{position:fixed;bottom:8px;z-index:54;pointer-events:none;transform-origin:50% 100%;animation:fr-surge .35s cubic-bezier(.3,1.6,.5,1);transition:transform .45s ease-in,opacity .45s;filter:drop-shadow(0 3px 5px rgba(0,0,0,.35))}
  .fr-obs svg{width:100%;height:100%;display:block}
  .fr-obs.cai{transform:rotate(80deg) translateX(10px)}
  .fr-obs.some{opacity:0;transform:scale(.4)}
  .fr-obs.ban svg{animation:fr-bandeira .5s ease-in-out infinite alternate;transform-origin:10% 100%}
  @keyframes fr-bandeira{from{transform:skewY(-4deg)}to{transform:skewY(4deg)}}
  @keyframes fr-surge{from{transform:scale(0)}to{transform:scale(1)}}
  .fr-vitrine .fr-dvd{z-index:40;opacity:.55}.fr-vitrine .fr-bicho{z-index:40}.fr-vitrine .fr-obs{z-index:39}
  .fr-sem-enfeite .fr-dvd,.fr-sem-enfeite .fr-bicho,.fr-sem-enfeite .fr-obs{display:none}
  @media (prefers-reduced-motion: reduce){.fr-dvd{display:none}.fr-bicho .corpo,.fr-bicho .pe1,.fr-bicho .pe2{animation:none}.fr-bicho,.fr-obs{display:none}}`;

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
  const BICHO = `<svg class="fr-bicho" viewBox="0 0 54 54" aria-hidden="true">
    <g class="pe1"><path d="M22 40 l-2 9" stroke="#3d5a17" stroke-width="3" stroke-linecap="round"/><ellipse cx="19.5" cy="49.5" rx="3.2" ry="1.7" fill="#2f4511"/></g>
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
    </g></svg>`;

  // corrida de obstáculos do abacatinho: cones, barreira, caixa e anilha no chão, pula os bichinhos que passam
  const OBS = {
    cone: {w:28, h:32, alto:false, svg:`<svg viewBox="0 0 30 34"><path d="M15 2 L26 30 H4Z" fill="#ff7a2f"/><path d="M11 13h8l2 6H9z" fill="#fff"/><rect x="1" y="29" width="28" height="4.5" rx="1.5" fill="#c4521a"/></svg>`},
    barreira: {w:40, h:40, alto:true, svg:`<svg viewBox="0 0 40 40"><rect x="5" y="10" width="3.2" height="29" rx="1" fill="#cfd3c8"/><rect x="31.8" y="10" width="3.2" height="29" rx="1" fill="#cfd3c8"/><rect x="1" y="36" width="11" height="3" rx="1" fill="#8b8f86"/><rect x="28" y="36" width="11" height="3" rx="1" fill="#8b8f86"/><rect x="1" y="7" width="38" height="8" rx="2" fill="#d4ff3a"/><path d="M9 7h6l-4 8H5zM23 7h6l-4 8h-6z" fill="#141a00" opacity=".55"/></svg>`},
    caixa: {w:32, h:30, alto:false, svg:`<svg viewBox="0 0 32 30"><rect x="1" y="1" width="30" height="28" rx="2.5" fill="#a8743f"/><rect x="1" y="1" width="30" height="28" rx="2.5" fill="none" stroke="#7a4f24" stroke-width="2.5"/><path d="M3 3 L29 27 M29 3 L3 27" stroke="#7a4f24" stroke-width="2.5"/></svg>`},
    anilha: {w:30, h:30, alto:false, svg:`<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="14" fill="#2b2e27"/><circle cx="15" cy="15" r="14" fill="none" stroke="#d4ff3a" stroke-width="2"/><circle cx="15" cy="15" r="8.5" fill="none" stroke="#4a4e44" stroke-width="2"/><circle cx="15" cy="15" r="3.2" fill="#8b8f86"/></svg>`},
  };
  const BANDEIRA = `<svg viewBox="0 0 30 46"><rect x="3" y="2" width="2.6" height="43" rx="1" fill="#cfd3c8"/><path d="M5.6 3h22v15h-22z" fill="#fff"/><path d="M5.6 3h5.5v5h-5.5zM16.6 3h5.5v5h-5.5zM11.1 8h5.5v5h-5.5zM22.1 8h5.5v5h-5.5zM5.6 13h5.5v5h-5.5zM16.6 13h5.5v5h-5.5z" fill="#141a00"/></svg>`;

  function corrida(voando){
    document.body.insertAdjacentHTML("beforeend", BICHO);
    const bicho = document.querySelector(".fr-bicho"), SZ = 54, G = 1500;
    let run = null, ant = null;
    const chao = () => innerHeight - 8 - SZ;
    const poe = (tipo, x, svg, w, h, cls) => {
      const el = document.createElement("div"); el.className = "fr-obs" + (cls ? " " + cls : ""); el.setAttribute("aria-hidden", "true");
      el.style.cssText = `left:${x - w / 2}px;width:${w}px;height:${h}px`; el.innerHTML = svg; document.body.appendChild(el);
      return {tipo, x, w, h, el, passou: false};
    };
    function nova(){
      if(run || !pref.enfeites || document.hidden) return;
      const W = innerWidth, dir = Math.random() < .5 ? 1 : -1, base = 150 + Math.random() * 70;
      const tipos = Object.keys(OBS), n = Math.max(2, Math.min(5, Math.floor(W / 150)));
      const obs = [];
      for(let i = 0; i < n; i++){
        const t = tipos[Math.floor(Math.random() * tipos.length)], o = OBS[t];
        let x = W * (0.16 + 0.62 * (i + 0.2 + Math.random() * 0.6) / n);
        if(dir < 0) x = W - x;
        obs.push(poe(t, x, o.svg, o.w, o.h));
      }
      obs.push(poe("bandeira", dir > 0 ? W - 74 : 30, BANDEIRA, 30, 46, "ban")); // longe do botão 🎨 no canto
      run = {x: dir > 0 ? -SZ - 10 : W + 10, y: chao(), vy: 0, dir, base, vel: base, obs, noChao: true, giro: 0, gira: 0, caido: 0};
      bicho.classList.add("vai");
    }
    const pula = (forca, gira) => { if(!run || !run.noChao) return; run.vy = -forca; run.noChao = false; run.gira = gira || 0; bicho.classList.add("ar"); };
    function fim(){
      run.obs.forEach(o => { o.el.classList.add("some"); setTimeout(() => o.el.remove(), 500); });
      run = null; bicho.classList.remove("vai", "ar", "caido");
    }
    function passo(t){
      const dt = ant == null ? 0 : Math.min(0.05, (t - ant) / 1000); ant = t;
      if(run){
        if(!pref.enfeites){ fim(); }
        else {
          const r = run, cx = () => r.x + SZ / 2;
          r.vel = r.base + (r.vel - r.base) * Math.exp(-dt * 1.2);
          if(r.caido > 0){ // tropeçou: rola no chão e levanta
            r.caido -= dt; r.x += r.dir * r.base * 0.35 * dt; r.giro = r.dir * Math.min(90, (0.9 - r.caido) * 400);
            if(r.caido <= 0){ r.giro = 0; bicho.classList.remove("caido"); pula(380); }
          } else {
            r.x += r.dir * r.vel * dt;
            // obstáculos do chão
            r.obs.forEach(o => {
              const d = (o.x - cx()) * r.dir;
              if(!o.passou && r.noChao && d > 0 && d < 46 + o.w / 2 + r.vel * 0.06){
                o.passou = true;
                if(o.tipo === "bandeira") pula(560, 1);            // chegada: pulo comemorando com giro
                else if(!OBS[o.tipo].alto && Math.random() < .12){ // às vezes tropeça e derruba o obstáculo
                  r.caido = 0.9; bicho.classList.add("caido"); setTimeout(() => o.el.classList.add("cai"), 120);
                }
                else pula(OBS[o.tipo].alto ? 640 : 520, OBS[o.tipo].alto && Math.random() < .5 ? 1 : 0);
              }
            });
            // bichinhos voando que chegam perto do chão também são obstáculos
            (voando || []).forEach(v => {
              const d = (v.x + 26 - cx()) * r.dir;
              if(r.noChao && d > 0 && d < 80 && v.y + 52 > chao() - 10) pula(700, 1);
            });
          }
          if(!r.noChao){
            r.vy += G * dt; r.y += r.vy * dt;
            if(r.gira) r.giro += r.dir * 620 * dt;
            if(r.y >= chao()){ r.y = chao(); r.vy = 0; r.noChao = true; r.gira = 0; r.giro = 0;
              bicho.classList.remove("ar"); bicho.classList.remove("pousa"); void bicho.offsetWidth; bicho.classList.add("pousa"); }
          } else if(!r.caido) r.y = chao();
          bicho.style.transform = `translate(${r.x}px,${r.y}px) scaleX(${r.dir}) rotate(${r.giro * r.dir}deg)`;
          if(r.x > innerWidth + SZ + 20 || r.x < -SZ - 30) fim();
        }
      }
      requestAnimationFrame(passo);
    }
    bicho.addEventListener("animationend", e => { if(e.animationName === "fr-amassa") bicho.classList.remove("pousa"); });
    requestAnimationFrame(passo);
    // encostou (ou passou perto) do abacatinho: pulo alto com giro e dispara correndo
    const assusta = (e, forte) => {
      if(!run || run.caido > 0) return;
      const d = Math.hypot(e.clientX - (run.x + SZ / 2), e.clientY - (run.y + SZ / 2));
      if(d < (forte ? 90 : 70)){ pula(forte ? 760 : 560, 1); run.vel = run.base * (forte ? 2 : 1.5); }
    };
    addEventListener("pointerdown", e => assusta(e, true), {passive: true});
    addEventListener("pointermove", e => assusta(e, false), {passive: true});
    const agenda = () => setTimeout(() => { nova(); agenda(); }, 8000 + Math.random() * 10000);
    setTimeout(nova, 1200 + Math.random() * 2500); agenda();
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
