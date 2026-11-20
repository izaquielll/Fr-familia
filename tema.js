/* Família FR · cores e enfeites das áreas (Área do FR e Área da Nutri).
   Cada área guarda a sua escolha neste aparelho. */
(function(){
  const AREA = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "");
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

  function aplicar(){
    const t = TEMAS[pref.tema] || TEMAS.verde, r = document.documentElement.style;
    ["lime","ink","bg","s1","s2","line"].forEach(k => r.setProperty("--"+k, t[k]));
    document.documentElement.classList.toggle("fr-sem-enfeite", !pref.enfeites);
    document.querySelectorAll("[data-fr-tema]").forEach(b => b.setAttribute("aria-pressed", b.dataset.frTema === pref.tema));
    const chk = document.getElementById("fr-enf"); if(chk) chk.checked = !!pref.enfeites;
  }
  aplicar(); // antes de desenhar, para não piscar

  const css = `
  body{background:radial-gradient(130% 55% at 50% -8%, color-mix(in srgb, var(--lime) 26%, transparent), transparent 72%) no-repeat, var(--bg);min-height:100vh}
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
  .fr-prato{width:38px;height:38px;flex:none;animation:fr-gira 14s linear infinite}
  @keyframes fr-gira{to{transform:rotate(360deg)}}
  .fr-bicho{position:fixed;left:0;bottom:8px;width:54px;height:54px;z-index:55;pointer-events:none;transform:translateX(-80px);visibility:hidden}
  .fr-bicho.vai{visibility:visible;animation:fr-corre 7s linear forwards}
  .fr-bicho .corpo{animation:fr-pula .36s ease-in-out infinite alternate;transform-origin:50% 100%}
  .fr-bicho .pe1{animation:fr-perna .18s linear infinite alternate;transform-origin:22px 40px}
  .fr-bicho .pe2{animation:fr-perna .18s linear infinite alternate-reverse;transform-origin:32px 40px}
  @keyframes fr-corre{from{transform:translateX(-80px)}to{transform:translateX(calc(100vw + 20px))}}
  @keyframes fr-pula{from{transform:translateY(0)}to{transform:translateY(-4px)}}
  @keyframes fr-perna{from{transform:rotate(-28deg)}to{transform:rotate(28deg)}}
  .fr-sem-enfeite .fr-prato,.fr-sem-enfeite .fr-bicho{display:none}
  @media (prefers-reduced-motion: reduce){.fr-prato,.fr-bicho .corpo,.fr-bicho .pe1,.fr-bicho .pe2{animation:none}.fr-bicho{display:none}}`;

  // pratinho de dieta (visto de cima)
  const PRATO = `<svg class="fr-prato" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#f4f4ef"/><circle cx="20" cy="20" r="14.5" fill="#e6e7df"/>
    <path d="M20 20 L20 6.5 A13.5 13.5 0 0 1 33.2 17.4 Z" fill="#7cc243"/><path d="M22 11 q4 1 6 5 M21.5 15 q4 0 6.5 3" stroke="#4f8f25" stroke-width="1.2" fill="none"/>
    <path d="M20 20 L33.2 17.4 A13.5 13.5 0 0 1 24 32.9 Z" fill="#f0a24a"/><path d="M26 22 l4 2 M24.5 25.5 l4 2.5" stroke="#d47f22" stroke-width="1.2"/>
    <path d="M20 20 L24 32.9 A13.5 13.5 0 0 1 7.2 24.5 Z" fill="#f6efe0"/><circle cx="15" cy="26" r="1" fill="#e3d6bb"/><circle cx="18" cy="28.5" r="1" fill="#e3d6bb"/><circle cx="12.5" cy="23.5" r="1" fill="#e3d6bb"/>
    <path d="M20 20 L7.2 24.5 A13.5 13.5 0 0 1 20 6.5 Z" fill="#c98a5a"/><path d="M11 17 l6-5 M12.5 20 l6.5-5.5" stroke="#a8693c" stroke-width="1.3"/>
    <circle cx="20" cy="20" r="3" fill="#e84b4b"/><circle cx="19" cy="19" r=".9" fill="#ff9a9a"/></svg>`;

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

  function montar(){
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    const h1 = document.querySelector("h1");
    if(h1){ h1.insertAdjacentHTML("beforebegin", PRATO); }

    document.body.insertAdjacentHTML("beforeend", BICHO);
    const bicho = document.querySelector(".fr-bicho");
    const corre = () => { if(!pref.enfeites || document.hidden) return; bicho.classList.remove("vai"); void bicho.offsetWidth; bicho.classList.add("vai"); };
    bicho.addEventListener("animationend", e => { if(e.animationName === "fr-corre") bicho.classList.remove("vai"); });
    setTimeout(corre, 2500); setInterval(corre, 35000);

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
