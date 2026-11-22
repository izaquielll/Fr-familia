/* Família FR · artes de fundo dos cards (desenhos originais em linha, cor herdada do card) */
window.FR_ARTES = (function(){
  const S = (body) => `<svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const halter = (x, y, s=1, r=0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <rect x="-70" y="-6" width="140" height="12" rx="6"/><rect x="-62" y="-30" width="14" height="60" rx="5"/><rect x="-46" y="-22" width="12" height="44" rx="5"/>
    <rect x="48" y="-30" width="14" height="60" rx="5"/><rect x="34" y="-22" width="12" height="44" rx="5"/></g>`;
  const brilhos = (pts) => pts.map(([x,y,s]) => `<path d="M${x} ${y-s}v${2*s}M${x-s} ${y}h${2*s}"/>`).join("");

  return {
    /* Arena de prova: pórtico de largada, raias em perspectiva, trenó, alvo do wall ball, marcação de 1 km */
    hyrox: S(`
      <path d="M40 210V58h320v152" stroke-width="3"/><path d="M40 58h320v30H40z" fill="currentColor" fill-opacity=".10"/>
      ${Array.from({length:10},(_,i)=>`<rect x="${40+i*32}" y="${i%2?73:58}" width="16" height="15" fill="currentColor" fill-opacity=".35" stroke="none"/><rect x="${56+i*32}" y="${i%2?58:73}" width="16" height="15" fill="currentColor" fill-opacity=".35" stroke="none"/>`).join("")}
      <path d="M200 215L-60 520M200 215L70 520M200 215l130 305M200 215l260 305" stroke-width="1.6" stroke-dasharray="2 9"/>
      <path d="M118 300h164M74 360h252M20 440h360" stroke-width="1.4" opacity=".7"/>
      <g transform="translate(92 392)"><path d="M0 40h96l-10 18H10z" fill="currentColor" fill-opacity=".15"/><path d="M14 40V-8M82 40V-8M14 -8h68"/><circle cx="48" cy="20" r="18"/><circle cx="48" cy="20" r="6"/></g>
      <g transform="translate(318 168)"><circle r="30"/><circle r="19"/><circle r="8" fill="currentColor" fill-opacity=".35"/></g>
      <circle cx="278" cy="262" r="16" fill="currentColor" fill-opacity=".18"/><path d="M286 248q22-40 30-64" stroke-dasharray="3 7"/>
      <g transform="translate(300 330)"><path d="M0 70V0"/><path d="M0 0h48l-10 12 10 12H0" fill="currentColor" fill-opacity=".2"/><text x="6" y="17" font-family="Poppins,sans-serif" font-size="11" font-weight="800" fill="currentColor" stroke="none">1 KM</text></g>
      ${brilhos([[70,140,6],[340,250,5],[150,250,4]])}`),

    gluteo: S(`
      <g transform="translate(270 360)"><path d="M-34-56a34 30 0 0 1 68 0" stroke-width="10" opacity=".9"/><path d="M-58 12a58 58 0 1 0 116 0a58 58 0 1 0-116 0" fill="currentColor" fill-opacity=".12"/><path d="M-30-40h60"/></g>
      <path d="M40 430h150v50H40z" fill="currentColor" fill-opacity=".08"/><path d="M40 430l20-24h150l-20 24M190 480l20-24v-50"/>
      <ellipse cx="120" cy="300" rx="70" ry="22" stroke-width="7" opacity=".55"/>
      <path d="M60 120q80-90 160 0t160 0" stroke-dasharray="2 10" stroke-width="2"/>
      ${brilhos([[330,130,7],[90,220,5],[350,250,4]])}`),

    abdomen: S(`
      <g transform="translate(260 380)"><circle r="62" fill="currentColor" fill-opacity=".08"/><circle r="46"/><circle r="10" fill="currentColor" fill-opacity=".4"/><path d="M-110 0h220" stroke-width="8"/><path d="M-110-14v28M110-14v28" stroke-width="5"/></g>
      <path d="M30 470l120-60h120l-120 60z" fill="currentColor" fill-opacity=".1"/><path d="M150 410a18 18 0 0 1 0 36"/>
      ${[0,1,2].map(r=>[0,1].map(c=>`<rect x="${70+c*46}" y="${120+r*52}" width="38" height="44" rx="14" opacity=".55"/>`).join("")).join("")}
      ${brilhos([[340,140,7],[300,240,4],[50,300,5]])}`),

    metabolica: S(`
      <g transform="translate(250 300)"><circle r="90" fill="currentColor" fill-opacity=".07"/><circle r="74"/><path d="M0-90v-22M-14-112h28"/><path d="M0 0V-50M0 0l34 22" stroke-width="4"/>
      ${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M${(Math.sin(a)*62).toFixed(1)} ${(-Math.cos(a)*62).toFixed(1)}L${(Math.sin(a)*70).toFixed(1)} ${(-Math.cos(a)*70).toFixed(1)}"/>`}).join("")}</g>
      <path d="M0 150h90l16-40 22 80 20-110 18 70h234" stroke-width="3"/>
      <path d="M40 470q120-140 280 0" stroke-width="3"/><rect x="26" y="464" width="16" height="40" rx="7"/><rect x="314" y="464" width="16" height="40" rx="7"/>
      ${brilhos([[80,250,6],[360,420,5]])}`),

    consultoria: S(`
      <g transform="translate(220 150) rotate(8)"><rect width="140" height="250" rx="22" fill="currentColor" fill-opacity=".06"/><path d="M52 16h36"/>
      <path d="M26 190v-34M52 190v-62M78 190v-48M104 190v-86" stroke-width="10"/><path d="M24 80l12 12 22-24M24 120l12 12 22-24" opacity=".7"/><path d="M68 80h44M68 120h44" opacity=".7"/></g>
      ${halter(130, 440, 1, -18)}
      ${brilhos([[70,120,7],[200,110,4],[60,300,5]])}`),

    combo: S(`
      <g transform="translate(270 330)"><circle r="78" fill="currentColor" fill-opacity=".07"/><circle r="58"/>
      <path d="M-10-20q30-40 52-10q-28 30-52 10z" fill="currentColor" fill-opacity=".25"/><path d="M-10-20q20 10 32 30"/></g>
      <path d="M150 260v120M138 260v40q12 12 24 0v-40M150 300v80" stroke-width="3"/>
      ${halter(120, 460, .9, 14)}
      ${brilhos([[330,140,7],[80,170,5],[360,470,4]])}`),

    convite: S(`
      <g transform="translate(150 230) rotate(-10)"><path d="M0 0h220v40a18 18 0 0 0 0 36v40H0V76a18 18 0 0 0 0-36z" fill="currentColor" fill-opacity=".08"/>
      <path d="M150 6v104" stroke-dasharray="4 8"/><path d="M40 40h80M40 60h60M40 80h70" opacity=".7"/><path d="M185 46l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2z" fill="currentColor" fill-opacity=".35"/></g>
      <g transform="translate(110 420)"><rect x="-46" y="-30" width="92" height="66" rx="6"/><path d="M-52-46h104v18H-52zM0-46v82M0-46q-30-30-40-6q20 10 40 6q30-30 40-6q-20 10-40 6"/></g>
      ${brilhos([[340,120,7],[70,140,5],[350,430,5]])}`),

    nutri: S(`
      <g transform="translate(260 340)"><circle r="80" fill="currentColor" fill-opacity=".07"/><circle r="60"/>
      <path d="M-24-10q36-48 66-14q-34 36-66 14z" fill="currentColor" fill-opacity=".25"/><path d="M-24-10q26 14 40 38"/></g>
      <path d="M120 240v150M108 240v44q12 14 24 0v-44M150 240q22 40 0 70v80" stroke-width="3"/>
      ${brilhos([[80,140,6],[340,150,5]])}`),

    halter: S(`${halter(250, 330, 1.3, -20)}${halter(120, 450, .8, 10)}${brilhos([[80,150,6],[330,140,5]])}`)
  };
})();
