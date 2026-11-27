/* Família FR · efeitos da vitrine
   1) Abertura: na primeira visita da sessão, tela com o FR, 3-2-1 e LANÇAR. O foguete sai da Terra,
      passa pela Lua, entra na galáxia, cai num buraco negro e um portal abre a consultoria.
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
  .fx-splash{justify-content:center;cursor:default}
  .fx-splash .tx{top:7vh}
  .fx-splash .cont{position:absolute;left:0;right:0;top:44%;text-align:center;font:800 clamp(90px,28vw,160px)/1 Poppins,system-ui,sans-serif;color:#d4ff3a;text-shadow:0 0 40px rgba(212,255,58,.6);pointer-events:none}
  .fx-splash .cont.bate{animation:fxConta .8s ease-out forwards}
  .fx-splash .base{position:absolute;left:50%;bottom:150px;width:120px;margin-left:-60px}
  .fx-splash .fog-s{width:84px;margin:0 auto;position:relative;z-index:2;animation:fxPreparo .12s ease-in-out infinite alternate}
  .fx-splash .fog-s svg{display:block;width:100%;filter:drop-shadow(0 0 16px rgba(212,255,58,.45))}
  .fx-splash .fog-s .chama{transform-box:fill-box;transform-origin:50% 0;transform:scaleY(.35);transition:transform .4s}
  .fx-splash .pad{height:10px;margin:-54px auto 0;width:150px;margin-left:-15px;border-radius:6px;background:linear-gradient(#3a3f31,#20231c);box-shadow:0 0 30px rgba(212,255,58,.25)}
  .fx-splash .vap{position:absolute;bottom:-4px;left:50%;width:60px;height:60px;margin-left:-30px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.22),transparent 70%);animation:fxVapor 2s ease-out infinite}
  .fx-splash .vap.v2{animation-delay:.7s;margin-left:-60px}.fx-splash .vap.v3{animation-delay:1.3s;margin-left:0}
  .fx-splash .lancar{position:absolute;left:50%;bottom:34px;transform:translateX(-50%) scale(.6);opacity:0;pointer-events:none;border:0;border-radius:999px;padding:16px 38px;
    background:#d4ff3a;color:#141a00;font:800 20px Poppins,system-ui,sans-serif;letter-spacing:.08em;white-space:nowrap;cursor:pointer;transition:transform .35s cubic-bezier(.3,1.6,.5,1),opacity .25s}
  .fx-splash .lancar.ok{opacity:1;pointer-events:auto;transform:translateX(-50%);animation:fxBotao 1.3s .4s ease-out infinite}
  .fx-splash.decola .lancar{opacity:0;pointer-events:none;animation:none}
  .fx-splash .ceu{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
  .fx-splash.viagem .fog-s{opacity:0;animation:none}
  .fx-splash.decola .vap{animation:fxFumaca 1.2s ease-out forwards}
  .fx-splash.decola .pad{transform:translateY(75vh);opacity:0;transition:transform 1.7s cubic-bezier(.55,0,.85,.35),opacity .9s .7s}
  .fx-splash.decola .glow,.fx-splash.decola .aneis{opacity:0;transition:opacity 1.1s}
  .fx-splash.decola .pt{display:none}
  .fx-splash.decola .glow{animation:none}
  .fx-splash.decola .tx{transition:opacity .6s .4s, transform .9s .3s;opacity:0;transform:translateY(-40px)}
  .fx-splash .bv{position:absolute;left:0;right:0;top:36%;transform:translateY(-50%) scale(.92);text-align:center;padding:0 20px;opacity:0;pointer-events:none;
    font:800 clamp(30px,9vw,56px)/1.04 Poppins,system-ui,sans-serif;color:#f3f4ef;transition:opacity .45s, transform 1.2s cubic-bezier(.2,.8,.2,1)}
  .fx-splash .bv small{display:block;margin-bottom:10px;font:700 13px Poppins,system-ui,sans-serif;letter-spacing:.32em;color:#a4a99c}
  .fx-splash .bv em{font-style:normal;color:#d4ff3a;text-shadow:0 0 30px rgba(212,255,58,.55)}
  .fx-splash .bv.on{opacity:1;transform:translateY(-50%)}
  .fx-splash .pular{position:absolute;top:14px;right:14px;z-index:3;border:0;border-radius:999px;padding:8px 14px;background:rgba(255,255,255,.08);color:#c9cdc0;
    font:600 13px Poppins,system-ui,sans-serif;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .4s .8s}
  .fx-splash.decola .pular{opacity:1;pointer-events:auto}
  @keyframes fxConta{0%{transform:scale(1.9);opacity:0}25%{opacity:1}100%{transform:scale(.7);opacity:0}}
  @keyframes fxPreparo{from{transform:translateX(-.6px)}to{transform:translateX(.6px)}}
  @keyframes fxVapor{0%{transform:scale(.5);opacity:0}30%{opacity:.8}100%{transform:scale(2.2) translateY(-10px);opacity:0}}
  @keyframes fxBotao{0%{box-shadow:0 0 0 0 rgba(212,255,58,.6)}100%{box-shadow:0 0 0 22px rgba(212,255,58,0)}}
  @keyframes fxSubida{0%{transform:translateY(4px)}100%{transform:translateY(-130vh) scale(1.2)}}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ===== Foguete ao escolher um plano ===== */
  const foguete = `<svg viewBox="0 0 64 150" aria-hidden="true">
    <g class="chama"><path d="M22 104 Q32 150 42 104 Z" fill="#ff7a2f"/><path d="M26 104 Q32 135 38 104 Z" fill="#ffd23f"/><path d="M29 104 Q32 122 35 104 Z" fill="#fff"/></g>
    <path d="M32 2 C50 18 52 50 48 96 L16 96 C12 50 14 18 32 2 Z" fill="#f3f4ef"/>
    <path d="M32 2 C40 9 45 18 47 28 L17 28 C19 18 24 9 32 2 Z" fill="#d4ff3a"/>
    <circle cx="32" cy="50" r="9" fill="#0f100d" stroke="#d4ff3a" stroke-width="3"/>
    <path d="M16 70 L2 96 L2 106 L16 96 Z" fill="#d4ff3a"/><path d="M48 70 L62 96 L62 106 L48 96 Z" fill="#d4ff3a"/>
    <rect x="18" y="96" width="28" height="9" rx="2" fill="#a4a99c"/>
    <text x="32" y="83" text-anchor="middle" font-family="Poppins,system-ui,sans-serif" font-weight="800" font-size="13" fill="#0f100d">FR</text></svg>`;
  /* ===== Céu da abertura: Terra → Lua → galáxia → buraco negro → portal para a consultoria =====
     Tudo desenhado num canvas. Terra, Lua, galáxia e disco do buraco negro são gerados uma vez,
     em pedaços, durante a contagem 3-2-1, para não travar a tela. */
  const pausa = () => new Promise(r => setTimeout(r, 0));
  const mk = (w, h = w) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const cl = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const suave = x => x * x * (3 - 2 * x);
  const hash = (x, y, z) => { let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1274126177)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h & 0xffff) / 65535; };
  function ruido(x, y, z){
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
    const u = xf*xf*(3-2*xf), v = yf*yf*(3-2*yf), w = zf*zf*(3-2*zf), L = (a, b, t) => a + (b - a) * t;
    return L(L(L(hash(xi,yi,zi),hash(xi+1,yi,zi),u),L(hash(xi,yi+1,zi),hash(xi+1,yi+1,zi),u),v),
             L(L(hash(xi,yi,zi+1),hash(xi+1,yi,zi+1),u),L(hash(xi,yi+1,zi+1),hash(xi+1,yi+1,zi+1),u),v),w);
  }
  function fbm(x, y, z, o){ let s = 0, a = .5, f = 1, n = 0; for(let i = 0; i < o; i++){ s += a * ruido(x*f, y*f, z*f); n += a; f *= 2.03; a *= .5; } return s / n; }
  const unit = (x, y, z) => { const n = Math.hypot(x, y, z); return [x/n, y/n, z/n]; };

  async function gerarTerra(S){
    const c = mk(S), g = c.getContext("2d"), im = g.createImageData(S, S), d = im.data, r = S / 2;
    const [lx, ly, lz] = unit(-.5, -.66, .56), [hx, hy, hz] = unit(lx, ly, lz + 1);
    for(let py = 0; py < S; py++){
      for(let px = 0; px < S; px++){
        const x = (px + .5 - r) / r, y = (py + .5 - r) / r, q = x*x + y*y; if(q >= 1) continue;
        const z = Math.sqrt(1 - q), h = fbm(x*1.7+3.1, y*1.7-1.3, z*1.7+.7, 5), terra = h > .52;
        let R, G, B;
        if(terra){ const m = fbm(x*5+9, y*5, z*5, 2), k = cl((h - .52) / .15);
          R = 52 + 70*m + 50*k; G = 88 + 40*m + 18*k; B = 40 + 22*m + 20*k;
          if(m > .58){ const dz = cl((m - .58) / .12); R += (178-R)*dz; G += (150-G)*dz; B += (100-B)*dz; } }
        else { const k = cl((.52 - h) / .2); R = 12 + 20*(1-k); G = 44 + 46*(1-k); B = 100 + 50*(1-k); }
        if(y > .86){ R = G = 232; B = 240; }
        const nuvem = cl((fbm(x*2.6+20, y*4.2, z*2.6, 4) - .5) / .16) * .92;
        R += (248-R)*nuvem; G += (250-G)*nuvem; B += (255-B)*nuvem;
        const dif = Math.max(0, x*lx + y*ly + z*lz), luz = .035 + 1.05*dif;
        const brilho = (!terra && nuvem < .4) ? Math.pow(Math.max(0, x*hx + y*hy + z*hz), 60) * .8 : 0;
        R = R*luz + brilho*255; G = G*luz + brilho*240; B = B*luz + brilho*220;
        if(terra && dif < .06 && nuvem < .5){ const c2 = fbm(x*22, y*22, z*22, 2); if(c2 > .58){ const a = (1 - dif/.06) * cl((c2 - .58) / .1) * .9; R += 255*a; G += 185*a; B += 90*a; } }
        const at = Math.pow(1 - z, 2.2) * .85 * cl(dif*2 + .1);
        R += (110-R)*at; G += (165-G)*at; B += (255-B)*at;
        const i = (py*S + px) * 4; d[i] = R; d[i+1] = G; d[i+2] = B; d[i+3] = 255 * cl((1 - Math.sqrt(q)) * r);
      }
      if(py % 16 === 15) await pausa();
    }
    g.putImageData(im, 0, 0); return c;
  }

  async function gerarLua(S){
    const c = mk(S), g = c.getContext("2d"), im = g.createImageData(S, S), d = im.data, r = S / 2;
    const [lx, ly, lz] = unit(-.82, -.28, .5), cr = [];
    for(let i = 0; i < 85; i++){ const zz = Math.random()*1.1 - .1, ph = Math.random()*6.283, s = Math.sqrt(1 - zz*zz), rr = .02 + .17*Math.pow(Math.random(), 3);
      cr.push({x: s*Math.cos(ph), y: s*Math.sin(ph), z: zz, r: rr, c: 1 - (rr*1.3)*(rr*1.3)/2}); }
    for(let py = 0; py < S; py++){
      for(let px = 0; px < S; px++){
        const x = (px + .5 - r) / r, y = (py + .5 - r) / r, q = x*x + y*y; if(q >= 1) continue;
        const z = Math.sqrt(1 - q);
        let alb = .48 + .34*fbm(x*3.5+2, y*3.5, z*3.5, 4);
        const m = fbm(x*1.4+8, y*1.4, z*1.4, 3); if(m > .52) alb *= 1 - .4*cl((m - .52) / .08);
        let nx = x, ny = y, nz = z;
        for(const k of cr){ if(x*k.x + y*k.y + z*k.z < k.c) continue;
          const vx = x - k.x, vy = y - k.y, vz = z - k.z, t = Math.sqrt(vx*vx + vy*vy + vz*vz) / k.r;
          if(t < 1){ const f = .95*(1 - t*.3) / k.r; nx -= vx*f; ny -= vy*f; nz -= vz*f; alb *= .94; }
          else if(t < 1.3){ const f = .8*(1.3 - t) / k.r; nx += vx*f; ny += vy*f; nz += vz*f; alb *= 1.05; } }
        const nn = Math.hypot(nx, ny, nz), dif = Math.max(0, (nx*lx + ny*ly + nz*lz) / nn), v = 255 * alb * (.025 + 1.05*dif);
        const i = (py*S + px) * 4; d[i] = v; d[i+1] = v*.98; d[i+2] = v*.93; d[i+3] = 255 * cl((1 - Math.sqrt(q)) * r);
      }
      if(py % 24 === 23) await pausa();
    }
    g.putImageData(im, 0, 0); return c;
  }

  async function gerarGalaxia(S){
    const c = mk(S), g = c.getContext("2d"), m = S / 2, gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 1.15;
    const gr = g.createRadialGradient(m, m, 0, m, m, m);
    [[0,"rgba(255,238,210,1)"],[.05,"rgba(255,214,165,.6)"],[.18,"rgba(200,160,190,.16)"],[.5,"rgba(90,110,190,.06)"],[1,"rgba(0,0,0,0)"]].forEach(([o,k]) => gr.addColorStop(o,k));
    g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(0, 0, S, S);
    const b = .25, a0 = S*.035, rmax = S*.47;
    const braco = (k, desv) => { const th = Math.pow(Math.random(), .75)*10, r = a0*Math.exp(b*th); return {r, f: r/rmax, ph: th + k*Math.PI + gauss()*desv, rr: r*(1 + gauss()*.14)}; };
    for(let i = 0; i < 20000; i++){
      const p = braco(i & 1, .28); if(p.r > rmax) continue;
      g.fillStyle = `rgba(${255-110*p.f|0},${225-60*p.f|0},${190+65*p.f|0},${(.1+Math.random()*.4).toFixed(2)})`;
      const s = .8 + Math.random()*1.8*(1 - p.f*.5); g.fillRect(m + p.rr*Math.cos(p.ph) - s/2, m + p.rr*Math.sin(p.ph) - s/2, s, s);
      if(i % 4000 === 3999) await pausa();
    }
    for(let i = 0; i < 7000; i++){ const r = rmax*Math.pow(Math.random(), 1.8), ph = Math.random()*6.283;
      g.fillStyle = `rgba(220,215,235,${(.04+Math.random()*.08).toFixed(2)})`; g.fillRect(m + r*Math.cos(ph), m + r*Math.sin(ph), 1.2, 1.2); }
    for(let i = 0; i < 600; i++){ const p = braco(i & 1, .2); if(p.f < .22 || p.r > rmax) continue; const s = 1.5 + Math.random()*2.4;
      g.fillStyle = Math.random() < .55 ? "rgba(255,120,175,.55)" : "rgba(190,215,255,.85)"; g.beginPath(); g.arc(m + p.rr*Math.cos(p.ph), m + p.rr*Math.sin(p.ph), s/2, 0, 7); g.fill(); }
    g.globalCompositeOperation = "source-over";
    for(let i = 0; i < 3500; i++){ const p = braco(i & 1, .12); if(p.f < .1 || p.f > .8) continue; const s = 2 + Math.random()*4, ph = p.ph - .18;
      g.fillStyle = `rgba(14,8,6,${(.05+Math.random()*.1).toFixed(2)})`; g.fillRect(m + p.rr*Math.cos(ph) - s/2, m + p.rr*Math.sin(ph) - s/2, s, s); }
    return c;
  }

  function gerarDisco(S, rin, stops, nb, nd){
    const c = mk(S), g = c.getContext("2d"), m = S / 2, R0 = m * rin, gr = g.createRadialGradient(m, m, R0, m, m, m);
    stops.forEach(([o,k]) => gr.addColorStop(o,k));
    g.fillStyle = gr; g.beginPath(); g.arc(m, m, m, 0, Math.PI*2); g.moveTo(m + R0, m); g.arc(m, m, R0, 0, Math.PI*2, true); g.fill();
    g.lineCap = "round"; g.globalCompositeOperation = "lighter";
    const risco = (estilo) => { const r = R0 + (m - R0)*Math.pow(Math.random(), 1.7), a = Math.random()*7; g.strokeStyle = estilo; g.lineWidth = (.6 + Math.random()*2.8) * S/1024; g.beginPath(); g.arc(m, m, r, a, a + .25 + Math.random()*1.3); g.stroke(); };
    for(let i = 0; i < nb; i++) risco(`rgba(255,${200+Math.random()*55|0},${150+Math.random()*90|0},${(.03+Math.random()*.14).toFixed(2)})`);
    g.globalCompositeOperation = "destination-out";
    for(let i = 0; i < nd; i++) risco(`rgba(0,0,0,${(.05+Math.random()*.28).toFixed(2)})`);
    return c;
  }

  function sprite(stops){ const c = mk(64), g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); stops.forEach(([o,k]) => gr.addColorStop(o,k)); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return c; }

  function montarCeu(s){
    const cv = document.createElement("canvas"); cv.className = "ceu"; s.prepend(cv);
    const ctx = cv.getContext("2d"); if(!ctx) return null;
    let W = 0, H = 0, dpr = 1;
    const tam = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); W = s.clientWidth; H = s.clientHeight; cv.width = W*dpr | 0; cv.height = H*dpr | 0; };
    tam(); addEventListener("resize", tam);

    const SP = {};
    const spFogo = sprite([[0,"rgba(255,255,240,1)"],[.22,"rgba(255,225,130,.95)"],[.55,"rgba(255,122,47,.5)"],[1,"rgba(255,70,20,0)"]]);
    const spFum = sprite([[0,"rgba(205,205,200,.6)"],[.5,"rgba(150,150,145,.28)"],[1,"rgba(120,120,120,0)"]]);
    const spLuz = sprite([[0,"rgba(212,255,58,.5)"],[1,"rgba(212,255,58,0)"]]);
    const img = new Image(); let imgOk = false; img.onload = () => imgOk = true;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(foguete.replace(/<g class="chama">[\s\S]*?<\/g>/, "").replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="600" '));
    (async () => {
      try{
        SP.lua = await gerarLua(300);
        SP.terra = await gerarTerra(640); await pausa();
        SP.disco = gerarDisco(1024, .3, [[0,"rgba(255,253,245,1)"],[.1,"rgba(255,232,185,.95)"],[.35,"rgba(255,168,85,.78)"],[.65,"rgba(215,90,35,.42)"],[1,"rgba(110,25,8,0)"]], 1600, 1000); await pausa();
        SP.anel = gerarDisco(768, .58, [[0,"rgba(255,250,235,1)"],[.25,"rgba(255,205,140,.8)"],[.6,"rgba(230,110,45,.35)"],[1,"rgba(150,40,10,0)"]], 900, 500); await pausa();
        SP.gal = await gerarGalaxia(1024);
      }catch(e){}
    })();

    // Estrelas em 3D: o ponto de fuga fica onde aparecem a galáxia e o buraco negro
    const est = [], NE = 360;
    const vpx = () => W/2, vpy = () => H*.36, foco = () => Math.max(W, H)*.55;
    const nova = (z) => { const sx = Math.random()*W*1.3 - W*.15, sy = Math.random()*H*1.3 - H*.15; return {x: (sx - vpx())*z/foco(), y: (sy - vpy())*z/foco(), z, b: .35 + Math.random()*.65, tw: Math.random()*6.3, px: null, py: null}; };
    for(let i = 0; i < NE; i++) est.push(nova(.08 + Math.random()*.92));

    const part = []; let acF = 0, acS = 0, acC = 0;
    const emitir = (x, y, vx, vy, tipo, s, g, vida, a) => part.push({x, y, vx, vy, tipo, s, g, vida, max: vida, a});
    let t0 = null, ult = performance.now(), fog = null, aoFim = null, bvOn = false, vibrou = false, rodando = true, base = null;
    const bv = document.createElement("div"); bv.className = "bv"; bv.innerHTML = "<small>BEM-VINDO À</small>Família <em>FR</em>"; s.appendChild(bv);

    // posição do foguete em cruzeiro (antes de cair no buraco negro)
    const cruzeiro = (t) => {
      const up = suave(seg(t, .12, 1.7)); let x = fog.x, y = fog.y + (H*.6 - fog.y)*up;
      x += Math.sin(t*2.1) * 3 * seg(t, 1.5, 2.5); return [x, y];
    };
    const espiral = (p) => {
      const [bx, by] = base, cx = vpx(), cy = vpy(), r0 = Math.hypot(bx - cx, by - cy), th0 = Math.atan2(by - cy, bx - cx);
      const pe = Math.pow(p, 1.6), r = r0*(1 - pe), th = th0 - 2.4*Math.PI*pe;
      return [cx + r*Math.cos(th), cy + r*Math.sin(th)*(1 - .68*pe)];
    };

    function buracoNegro(cx, cy, Rs, rot, a){
      if(!SP.disco || !SP.anel) return;
      ctx.save(); ctx.globalAlpha = a;
      const gl = ctx.createRadialGradient(cx, cy, Rs*.8, cx, cy, Rs*9);
      gl.addColorStop(0, "rgba(255,180,100,.35)"); gl.addColorStop(.3, "rgba(255,120,60,.1)"); gl.addColorStop(1, "rgba(255,90,40,0)");
      ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = gl; ctx.fillRect(cx - Rs*9, cy - Rs*9, Rs*18, Rs*18);
      ctx.globalCompositeOperation = "source-over";
      const D = Rs*5, inc = -.1, ach = .24;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(inc); ctx.scale(1, ach); ctx.rotate(rot); ctx.drawImage(SP.disco, -D, -D, 2*D, 2*D); ctx.restore();
      const Ra = Rs*1.95; ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot*1.3); ctx.drawImage(SP.anel, -Ra, -Ra, 2*Ra, 2*Ra); ctx.restore();
      ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, Rs, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = "rgba(255,236,205,.85)"; ctx.lineWidth = Math.max(1, Rs*.028);
      ctx.beginPath(); ctx.arc(cx, cy, Rs*1.025, 0, 7); ctx.stroke(); ctx.globalCompositeOperation = "source-over";
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(inc); ctx.beginPath(); ctx.rect(-D*1.1, 0, D*2.2, D); ctx.clip();
      ctx.scale(1, ach); ctx.rotate(rot); ctx.drawImage(SP.disco, -D, -D, 2*D, 2*D); ctx.restore();
      ctx.restore();
    }

    function desenhaFoguete(x, y, ang, esc, sy, alf, empuxo){
      const w = fog.w*esc, h = fog.h*esc, ny = h*.2;
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(1, sy); ctx.globalAlpha = alf;
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = alf*.35; ctx.drawImage(spFogo, -w*1.3, ny - w*1.1, w*2.6, w*2.6);
      ctx.globalAlpha = alf;
      const fl = h*(.42 + .14*Math.random())*empuxo, fw = w*.46;
      ctx.drawImage(spFogo, -fw/2, ny - fl*.3, fw, fl*1.3);
      ctx.drawImage(spFogo, -fw*.28, ny - fl*.12, fw*.56, fl*.6);
      ctx.globalCompositeOperation = "source-over";
      if(imgOk){ ctx.shadowColor = "rgba(212,255,58,.45)"; ctx.shadowBlur = 16*esc; ctx.drawImage(img, -w/2, -h/2, w, h); }
      ctx.restore();
    }

    function quadro(agora){
      if(!rodando) return;
      const dt = Math.min(.05, (agora - ult)/1000); ult = agora;
      const t = t0 === null ? -1 : (agora - t0)/1000;
      const cx = vpx(), cy = vpy(), F = foco(), diag = Math.hypot(W, H);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

      if(t >= 0 && t < 6.05){
        // fundo do espaço
        const aBg = seg(t, 0, 1.1);
        const fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, diag*.8);
        fg.addColorStop(0, "#0d1430"); fg.addColorStop(.45, "#070a18"); fg.addColorStop(1, "#020308");
        ctx.globalAlpha = aBg; ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
        const aNeb = seg(t, 2.2, 3.1) * (1 - seg(t, 4.6, 5.4));
        if(aNeb > 0){ ctx.globalCompositeOperation = "lighter";
          [[cx - W*.25, cy + H*.12, H*.6, `rgba(110,50,190,${.24*aNeb})`], [cx + W*.3, cy - H*.15, H*.5, `rgba(30,120,170,${.18*aNeb})`], [cx, cy + H*.3, H*.45, `rgba(212,255,58,${.05*aNeb})`]].forEach(([x, y, r, k]) => {
            const n = ctx.createRadialGradient(x, y, 0, x, y, r); n.addColorStop(0, k); n.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = n; ctx.fillRect(x - r, y - r, 2*r, 2*r); });
          ctx.globalCompositeOperation = "source-over"; }
      }

      // estrelas
      if(t < 6.05){
        const vel = t < 0 ? 0 : t < 1.5 ? .04 + .16*seg(t, 0, 1.5) : t < 2.4 ? .2 + .5*suave(seg(t, 1.5, 2.4)) : t < 3.3 ? .7 + 2.3*suave(seg(t, 2.4, 3.3)) : t < 4.4 ? 3 : 3 - 2.2*suave(seg(t, 4.4, 5.4));
        ctx.lineCap = "round"; ctx.strokeStyle = ctx.fillStyle = "#eef3ff";
        for(let i = 0; i < NE; i++){
          const e = est[i]; e.z -= vel*dt;
          let sx = cx + e.x/e.z*F, sy = cy + e.y/e.z*F;
          if(e.z < .03 || sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60){ if(vel > 0){ est[i] = nova(1); } continue; }
          const pxp = e.px ?? sx, pyp = e.py ?? sy; e.px = sx; e.py = sy;
          const tw = t < 0 ? .65 + .35*Math.sin(agora/600 + e.tw) : 1;
          const lw = .5 + 1.5*(1 - e.z)*e.b; ctx.globalAlpha = Math.min(1, e.b*(1.1 - e.z*.6)*tw);
          const dl = Math.hypot(sx - pxp, sy - pyp);
          if(dl < 1){ ctx.fillRect(sx - lw/2, sy - lw/2, lw, lw); }
          else { ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(pxp, pyp); ctx.lineTo(sx, sy); ctx.stroke(); }
        }
        ctx.globalAlpha = 1;
      }

      // galáxia
      if(SP.gal && t > 2.2 && t < 5.6){
        const G = 18*Math.exp(1.45*(t - 2.2)), a = seg(t, 2.2, 2.9)*(1 - seg(t, 4.7, 5.5));
        ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.rotate(-.42); ctx.scale(1, .52); ctx.rotate(t*.35);
        ctx.drawImage(SP.gal, -G, -G, 2*G, 2*G); ctx.restore();
      }
      // buraco negro
      if(t > 3.6 && t < 6.05){
        const Rs = 2*Math.exp(2.6*(t - 3.6)), rot = t*1.6 + Math.pow(seg(t, 3.6, 6), 2)*5;
        const sh = t > 4.6 ? (Math.random() - .5)*3*seg(t, 4.6, 5.6) : 0;
        buracoNegro(cx + sh, cy + sh, Rs, rot, seg(t, 3.6, 4));
      }
      // Lua
      if(SP.lua && t < 3.4){
        const r0 = Math.min(W*.085, 54), x0 = W - r0 - W*.06, y0 = Math.max(H*.075, r0 + 18);
        const m = t < 0 ? 0 : seg(t, 1, 3.2), lr = r0*(1 + 11*Math.pow(m, 2.4)), lx = x0 + (W*.5 + lr)*Math.pow(m, 3), ly = y0 + H*.25*m*m;
        ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = .55;
        const lg = ctx.createRadialGradient(lx, ly, lr*.9, lx, ly, lr*1.5); lg.addColorStop(0, "rgba(200,215,255,.22)"); lg.addColorStop(1, "rgba(200,215,255,0)");
        ctx.fillStyle = lg; ctx.fillRect(lx - lr*1.5, ly - lr*1.5, lr*3, lr*3);
        ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = t < 0 ? .95 : 1;
        ctx.drawImage(SP.lua, lx - lr, ly - lr, 2*lr, 2*lr); ctx.globalAlpha = 1;
      }
      // Terra ficando para trás
      if(SP.terra && t > 0 && t < 3.2){
        const e = suave(seg(t, .05, 3)), b = Math.max(W, H*.6), R = b*(1.6 - 1.25*e), ex = W*(.5 - .36*e), ey = H + R*(.78 - .45*e);
        const a = seg(t, .05, .7)*(1 - seg(t, 2.5, 3.1));
        ctx.globalAlpha = a;
        const atm = ctx.createRadialGradient(ex, ey, R*.96, ex, ey, R*1.12);
        atm.addColorStop(0, "rgba(120,180,255,0)"); atm.addColorStop(.22, "rgba(130,190,255,.6)"); atm.addColorStop(1, "rgba(50,110,255,0)");
        ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = atm; ctx.fillRect(ex - R*1.12, ey - R*1.12, R*2.24, R*2.24);
        ctx.globalCompositeOperation = "source-over"; ctx.drawImage(SP.terra, ex - R, ey - R, 2*R, 2*R); ctx.globalAlpha = 1;
      }

      // foguete e fumaça
      if(t >= 0 && fog){
        let x, y, ang = 0, esc = 1, sy = 1, alf = 1;
        if(t < 3.9){ [x, y] = cruzeiro(t); }
        else { if(!base) base = cruzeiro(3.9); const p = seg(t, 3.9, 5.55);
          [x, y] = espiral(p); const [x2, y2] = espiral(Math.min(1, p + .01));
          let alvo = Math.atan2(y2 - y, x2 - x) + Math.PI/2; alvo = Math.atan2(Math.sin(alvo), Math.cos(alvo));
          ang = alvo * seg(p, 0, .25); esc = 1 - .88*Math.pow(p, 1.6); sy = 1 + 1.4*seg(p, .7, 1); alf = 1 - seg(p, .85, 1);
          if(p > .9 && !vibrou){ vibrou = true; try{ navigator.vibrate && navigator.vibrate([15,30,15,30,90]); }catch(e){} }
        }
        const tre = t < .9 ? (1 - t/.9)*2.4 : (t > 2.6 && t < 4.4 ? .9 : 0);
        x += (Math.random() - .5)*2*tre; y += (Math.random() - .5)*tre;
        const mundo = 560*seg(t, .15, 1.2)*(1 - seg(t, 3.7, 4.3));
        const d = fog.h*esc*.24, nx = x - Math.sin(ang)*d, ny = y + Math.cos(ang)*d, dx = -Math.sin(ang), dy = Math.cos(ang);
        if(alf > .05){
          acF += 95*dt*esc; acS += 38*dt*esc;
          for(; acF >= 1; acF--) emitir(nx + (Math.random() - .5)*6*esc, ny, dx*(240 + Math.random()*140) + (Math.random() - .5)*50, dy*(240 + Math.random()*140), 0, 10*esc, 26*esc, .22 + Math.random()*.2, .7);
          for(; acS >= 1; acS--) emitir(nx, ny + 6*esc, dx*(160 + Math.random()*90) + (Math.random() - .5)*70, dy*(160 + Math.random()*90), 1, 14*esc, 55*esc, .7 + Math.random()*.6, .55);
        }
        if(t < .85){ acC += 48*dt; for(; acC >= 1; acC--){ const lado = Math.random() < .5 ? -1 : 1;
          emitir(fog.x + lado*Math.random()*20, fog.y + fog.h*.32, lado*(80 + Math.random()*220), -10 - Math.random()*40, 1, 28 + Math.random()*26, 70, 1.3 + Math.random()*.8, .75); } }
        for(let i = part.length - 1; i >= 0; i--){ const p = part[i]; p.vida -= dt; if(p.vida <= 0){ part.splice(i, 1); continue; }
          p.x += p.vx*dt; p.y += (p.vy + mundo)*dt; p.vx *= .985; p.s += p.g*dt; }
        for(const p of part) if(p.tipo === 1){ ctx.globalAlpha = p.a*(p.vida/p.max); ctx.drawImage(spFum, p.x - p.s, p.y - p.s, 2*p.s, 2*p.s); }
        ctx.globalCompositeOperation = "lighter";
        for(const p of part) if(p.tipo === 0){ ctx.globalAlpha = p.a*(p.vida/p.max); ctx.drawImage(spFogo, p.x - p.s, p.y - p.s, 2*p.s, 2*p.s); }
        ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
        if(alf > 0) desenhaFoguete(x, y, ang, esc, sy, alf, Math.min(1.25, .45 + t*2.6));
      }

      // escuridão total dentro do buraco negro
      const aP = seg(t, 5.6, 6);
      if(aP > 0){ ctx.fillStyle = `rgba(0,0,0,${aP})`; ctx.fillRect(0, 0, W, H); }
      if(t > 5.85 && !bvOn){ bvOn = true; bv.classList.add("on"); }
      if(t > 6.3 && bvOn){ bv.classList.remove("on"); bv.style.opacity = "0"; }

      // portal: abre um círculo que mostra a consultoria
      if(t >= 6.6){
        const p = seg(t, 6.6, 7.4), R = diag*1.08*p*p*(3 - 2*p);
        const mk2 = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${R}px, #000 ${R + 2}px)`;
        s.style.webkitMaskImage = mk2; s.style.maskImage = mk2;
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(spLuz, cx - R - 70, cy - R - 70, 2*R + 140, 2*R + 140);
        ctx.strokeStyle = "rgba(212,255,58,.28)"; ctx.lineWidth = 36; ctx.beginPath(); ctx.arc(cx, cy, R + 20, 0, 7); ctx.stroke();
        ctx.strokeStyle = "rgba(212,255,58,.95)"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, R + 5, 0, 7); ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R + 2.5, 0, 7); ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      }
      if(t >= 7.45){ fim(); return; }
      requestAnimationFrame(quadro);
    }
    function fim(){ if(!rodando) return; rodando = false; removeEventListener("resize", tam); aoFim && aoFim(); }
    requestAnimationFrame(quadro);

    return {
      lancar(rect, depois){
        const sr = s.getBoundingClientRect();
        fog = {x: rect.left - sr.left + rect.width/2, y: rect.top - sr.top + rect.height/2, w: rect.width, h: rect.height};
        aoFim = depois; t0 = performance.now(); s.classList.add("viagem");
      },
      pular(){ if(t0 !== null) t0 = Math.min(t0, performance.now() - 6000); }
    };
  }

  /* ===== Abertura: preparação, 3-2-1 e LANÇAR ===== */
  let liberar; const pronto = new Promise(r => liberar = r);
  window.FRDepoisDaAbertura = fn => pronto.then(fn);
  // Cada página pode trocar o texto da abertura com window.FR_ABERTURA = { chave, l1, l2 } antes de carregar este arquivo
  const AB = Object.assign({ chave: "fr-abertura", l1: "Preparando o lançamento da", l2: "<em>melhor consultoria</em><br>do Brasil" }, window.FR_ABERTURA || {});
  let viu = false; try{ viu = sessionStorage.getItem(AB.chave) === "1"; }catch(e){}
  if(viu || calmo || !document.body){ liberar(); }
  else {
    const s = document.createElement("div"); s.className = "fx-splash"; s.setAttribute("role","dialog"); s.setAttribute("aria-label","Família FR");
    let pts = ""; for(let i=0;i<22;i++) pts += `<i class="pt" style="left:${Math.random()*100}%;animation-duration:${2.2+Math.random()*2.5}s;animation-delay:${Math.random()*2}s;transform:scale(${.5+Math.random()})"></i>`;
    s.innerHTML = `<div class="glow"></div><div class="aneis"><i></i><i></i><i></i></div>${pts}
      <div class="tx"><div class="badge">FR</div><div class="nome">FAMÍLIA FR</div>
        <div class="l1">${AB.l1}</div><div class="l2"${AB.l2menor?' style="font-size:clamp(26px,7.4vw,50px)"':""}>${AB.l2}</div></div>
      <div class="cont" aria-live="polite"></div>
      <div class="base"><div class="fog-s">${foguete}</div><div class="pad"></div><i class="vap"></i><i class="vap v2"></i><i class="vap v3"></i></div>
      <button class="lancar" type="button">🚀 LANÇAR</button><button class="pular" type="button">Pular ›</button>`;
    document.body.appendChild(s); document.documentElement.style.overflow = "hidden";
    let ceu = null; try{ ceu = montarCeu(s); }catch(e){ ceu = null; }
    const cont = s.querySelector(".cont"), btn = s.querySelector(".lancar");
    [["3",900],["2",1700],["1",2500]].forEach(([n,t]) => setTimeout(() => { cont.textContent = n; cont.classList.remove("bate"); void cont.offsetWidth; cont.classList.add("bate"); }, t));
    setTimeout(() => { cont.textContent = ""; btn.classList.add("ok"); }, 3300);
    let saiu = false;
    const sair = () => { if(saiu) return; saiu = true; document.documentElement.style.overflow = ""; s.remove(); liberar(); };
    btn.addEventListener("click", () => {
      if(s.classList.contains("decola")) return;
      try{ sessionStorage.setItem(AB.chave,"1"); }catch(e){}
      try{ navigator.vibrate && navigator.vibrate([30,30,60]); }catch(e){}
      s.classList.add("decola");
      if(ceu){ ceu.lancar(s.querySelector(".fog-s").getBoundingClientRect(), sair); setTimeout(sair, 12000); }
      else { setTimeout(() => s.classList.add("sai"), 1250); setTimeout(sair, 1850); }
    });
    s.querySelector(".pular").addEventListener("click", () => { ceu ? ceu.pular() : sair(); });
  }

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
