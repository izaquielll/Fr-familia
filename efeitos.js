/* Família FR · efeitos da vitrine
   1) Abertura: na primeira visita da sessão, tela com o FR e "a melhor consultoria do Brasil".
   2) Foguete: toda vez que a pessoa escolhe um plano, um foguete decola antes de abrir o plano. */
(function(){
  const calmo = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = `
  .fx-splash{position:fixed;inset:0;z-index:100;background:#0b0c09;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden;cursor:pointer;
    transition:opacity .55s ease, transform .7s cubic-bezier(.6,0,.4,1), filter .7s ease}
  .fx-splash.sai{opacity:0;transform:scale(1.35);filter:blur(6px)}
  .fx-splash .glow{position:absolute;width:140vmax;height:140vmax;left:50%;top:42%;transform:translate(-50%,-50%);
    background:radial-gradient(circle, rgba(212,255,58,.28) 0%, rgba(212,255,58,.08) 28%, transparent 55%);animation:fxPulse 2.4s ease-in-out infinite}
  .fx-splash .aneis{position:absolute;left:50%;top:40%;width:0;height:0}
  .fx-splash .aneis i{position:absolute;border:1.5px solid rgba(212,255,58,.35);border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%) scale(.2);opacity:0;animation:fxAnel 2.6s ease-out infinite}
  .fx-splash .aneis i:nth-child(2){animation-delay:.85s}.fx-splash .aneis i:nth-child(3){animation-delay:1.7s}
  .fx-splash .aneis i{width:90vmin;height:90vmin}
  .fx-splash .ft{position:relative;height:min(62vh,560px);max-width:96vw;object-fit:contain;object-position:bottom;
    -webkit-mask-image:linear-gradient(#000 62%,transparent);mask-image:linear-gradient(#000 62%,transparent);
    transform:translateY(40px);opacity:0;animation:fxSobe 1s .25s cubic-bezier(.2,.8,.2,1) forwards}
  .fx-splash .tx{position:absolute;left:0;right:0;top:9vh;text-align:center;padding:0 22px}
  .fx-splash .badge{width:86px;height:86px;margin:0 auto;border-radius:24px;background:#d4ff3a;color:#141a00;display:grid;place-items:center;
    font:800 36px/1 Poppins,system-ui,sans-serif;letter-spacing:-.02em;box-shadow:0 0 0 0 rgba(212,255,58,.6),0 18px 60px rgba(212,255,58,.35);
    transform:scale(0) rotate(-25deg);animation:fxBadge .8s cubic-bezier(.3,1.6,.5,1) forwards, fxBrilho 1.8s 1s ease-out infinite}
  .fx-splash .nome{margin-top:12px;font:800 14px Poppins,system-ui,sans-serif;letter-spacing:.32em;color:#f3f4ef;opacity:0;animation:fxIn .6s .45s forwards}
  .fx-splash .l1{margin-top:22px;font:500 17px Poppins,system-ui,sans-serif;color:#c9cdc0;opacity:0;animation:fxIn .6s .7s forwards}
  .fx-splash .l2{margin-top:4px;font:800 clamp(30px,8.6vw,58px)/1.02 Poppins,system-ui,sans-serif;letter-spacing:-.01em;color:#f3f4ef;opacity:0;animation:fxIn .7s .9s forwards}
  .fx-splash .l2 em{font-style:normal;color:#d4ff3a;text-shadow:0 0 28px rgba(212,255,58,.45)}
  .fx-splash .barra{position:absolute;left:50%;bottom:34px;width:min(220px,60vw);height:4px;border-radius:9px;background:rgba(255,255,255,.12);transform:translateX(-50%);overflow:hidden}
  .fx-splash .barra b{display:block;height:100%;width:0;background:#d4ff3a;box-shadow:0 0 12px #d4ff3a;animation:fxBarra 2.5s .2s ease-in-out forwards}
  .fx-splash .pt{position:absolute;bottom:-10px;width:4px;height:4px;border-radius:50%;background:#d4ff3a;opacity:.0;animation:fxPart linear infinite}
  @keyframes fxPulse{50%{transform:translate(-50%,-50%) scale(1.08);opacity:.8}}
  @keyframes fxAnel{0%{opacity:.9;transform:translate(-50%,-50%) scale(.15)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.25)}}
  @keyframes fxSobe{to{transform:none;opacity:1}}
  @keyframes fxBadge{to{transform:none}}
  @keyframes fxBrilho{0%{box-shadow:0 0 0 0 rgba(212,255,58,.55),0 18px 60px rgba(212,255,58,.35)}100%{box-shadow:0 0 0 26px rgba(212,255,58,0),0 18px 60px rgba(212,255,58,.35)}}
  @keyframes fxIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  @keyframes fxBarra{to{width:100%}}
  @keyframes fxPart{0%{transform:translateY(0);opacity:0}15%{opacity:.9}100%{transform:translateY(-105vh);opacity:0}}

  .fx-voo{position:fixed;inset:0;z-index:90;pointer-events:none;overflow:hidden;background:radial-gradient(ellipse at 50% 120%, #1d2410 0%, #0b0c09 60%);opacity:0;animation:fxVooFundo 1.35s ease forwards}
  .fx-voo .st{position:absolute;top:-20vh;width:2px;border-radius:2px;background:linear-gradient(transparent,#fff);opacity:.8;animation:fxEstrela linear forwards}
  .fx-voo .fog{position:absolute;left:50%;bottom:-180px;width:96px;margin-left:-48px;animation:fxDecola 1.15s .1s cubic-bezier(.55,0,.75,.2) forwards}
  .fx-voo .fog svg{display:block;width:100%;filter:drop-shadow(0 0 18px rgba(212,255,58,.5))}
  .fx-voo .chama{transform-box:fill-box;transform-origin:50% 0;animation:fxChama .08s ease-in-out infinite alternate}
  .fx-voo .fum{position:absolute;bottom:-40px;left:50%;width:70px;height:70px;margin-left:-35px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.35),rgba(255,255,255,0) 70%);animation:fxFumaca 1.1s ease-out forwards}
  .fx-voo .tx{position:absolute;left:0;right:0;top:38%;text-align:center;font:800 clamp(22px,6vw,34px) Poppins,system-ui,sans-serif;color:#f3f4ef;opacity:0;animation:fxTexto 1.2s .15s ease forwards}
  .fx-voo .tx em{font-style:normal;color:#d4ff3a}
  .fx-voo .flash{position:absolute;inset:0;background:#d4ff3a;opacity:0;animation:fxFlash .5s .95s ease-out forwards}
  @keyframes fxVooFundo{0%{opacity:0}12%{opacity:1}82%{opacity:1}100%{opacity:0}}
  @keyframes fxEstrela{to{transform:translateY(150vh)}}
  @keyframes fxDecola{0%{transform:translateY(0) scale(.9)}30%{transform:translateY(-38vh) scale(1)}100%{transform:translateY(-140vh) scale(1.15)}}
  @keyframes fxChama{from{transform:scaleY(.8)}to{transform:scaleY(1.25)}}
  @keyframes fxFumaca{0%{transform:scale(.4);opacity:.9}100%{transform:scale(5);opacity:0}}
  @keyframes fxTexto{0%{opacity:0;transform:scale(.9)}25%{opacity:1;transform:none}75%{opacity:1}100%{opacity:0;transform:scale(1.15)}}
  @keyframes fxFlash{0%{opacity:0}30%{opacity:.35}100%{opacity:0}}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ===== Abertura ===== */
  let liberar; const pronto = new Promise(r => liberar = r);
  window.FRDepoisDaAbertura = fn => pronto.then(fn);
  let viu = false; try{ viu = sessionStorage.getItem("fr-abertura") === "1"; sessionStorage.setItem("fr-abertura","1"); }catch(e){}
  if(viu || calmo || !document.body){ liberar(); }
  else {
    const s = document.createElement("div"); s.className = "fx-splash"; s.setAttribute("role","dialog"); s.setAttribute("aria-label","Família FR");
    let pts = ""; for(let i=0;i<22;i++) pts += `<i class="pt" style="left:${Math.random()*100}%;animation-duration:${2.2+Math.random()*2.5}s;animation-delay:${Math.random()*2}s;transform:scale(${.5+Math.random()})"></i>`;
    s.innerHTML = `<div class="glow"></div><div class="aneis"><i></i><i></i><i></i></div>${pts}
      <img class="ft" src="img/fr-frente.webp" alt="">
      <div class="tx"><div class="badge">FR</div><div class="nome">FAMÍLIA FR</div>
        <div class="l1">Você está entrando na</div><div class="l2"><em>melhor consultoria</em><br>do Brasil</div></div>
      <div class="barra"><b></b></div>`;
    document.body.appendChild(s); document.documentElement.style.overflow = "hidden";
    let fechou = false;
    const fecha = () => { if(fechou) return; fechou = true; s.classList.add("sai"); document.documentElement.style.overflow = "";
      setTimeout(() => { s.remove(); liberar(); }, 650); };
    s.addEventListener("click", fecha);
    setTimeout(fecha, 2900);
  }

  /* ===== Foguete ao escolher um plano ===== */
  const foguete = `<svg viewBox="0 0 64 150" aria-hidden="true">
    <g class="chama"><path d="M22 104 Q32 150 42 104 Z" fill="#ff7a2f"/><path d="M26 104 Q32 135 38 104 Z" fill="#ffd23f"/><path d="M29 104 Q32 122 35 104 Z" fill="#fff"/></g>
    <path d="M32 2 C50 18 52 50 48 96 L16 96 C12 50 14 18 32 2 Z" fill="#f3f4ef"/>
    <path d="M32 2 C40 9 45 18 47 28 L17 28 C19 18 24 9 32 2 Z" fill="#d4ff3a"/>
    <circle cx="32" cy="50" r="9" fill="#0f100d" stroke="#d4ff3a" stroke-width="3"/>
    <path d="M16 70 L2 96 L2 106 L16 96 Z" fill="#d4ff3a"/><path d="M48 70 L62 96 L62 106 L48 96 Z" fill="#d4ff3a"/>
    <rect x="18" y="96" width="28" height="9" rx="2" fill="#a4a99c"/>
    <text x="32" y="83" text-anchor="middle" font-family="Poppins,system-ui,sans-serif" font-weight="800" font-size="13" fill="#0f100d">FR</text></svg>`;
  let voando = false;
  window.FRFoguete = function(depois){
    if(calmo || voando){ depois && depois(); return; }
    voando = true;
    const v = document.createElement("div"); v.className = "fx-voo";
    let estrelas = ""; for(let i=0;i<34;i++){ const h = 40 + Math.random()*120; estrelas += `<i class="st" style="left:${Math.random()*100}%;height:${h}px;animation-duration:${.35+Math.random()*.5}s;animation-delay:${Math.random()*.6}s;opacity:${.3+Math.random()*.7}"></i>`; }
    v.innerHTML = `${estrelas}<div class="fum"></div><div class="tx">Decolando rumo ao<br><em>seu melhor resultado</em></div><div class="fog">${foguete}</div><div class="flash"></div>`;
    document.body.appendChild(v);
    try{ navigator.vibrate && navigator.vibrate([20,40,30]); }catch(e){}
    setTimeout(() => { depois && depois(); }, 1050);
    setTimeout(() => { v.remove(); voando = false; }, 1400);
  };
})();
