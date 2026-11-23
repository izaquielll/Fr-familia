/* Fila de espera (pré-cadastro): lista para a Área do FR e a Área da Nutri */
window.FRFila = (() => {
  const esc = s => String(s??"").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const dataBR = d => d ? String(d).split("-").reverse().join("/") : "";
  const idade = d => { if(!d) return ""; const n = new Date(d+"T12:00:00"), h = new Date(); let a = h.getFullYear()-n.getFullYear(); if(h < new Date(h.getFullYear(), n.getMonth(), n.getDate())) a--; return a; };
  const celBR = c => { c = String(c||""); return c.length===11 ? `(${c.slice(0,2)}) ${c.slice(2,7)}-${c.slice(7)}` : c.length===10 ? `(${c.slice(0,2)}) ${c.slice(2,6)}-${c.slice(6)}` : c; };
  const zap = c => { c = String(c||"").replace(/\D/g,""); return c.startsWith("55") ? c : "55"+c; };
  function csv(L){
    const q = v => `"${String(v??"").replace(/"/g,'""')}"`;
    const linhas = [["Entrou em","Nome","Nascimento","Idade","Sexo","E-mail","Celular","Plano","Link da nutri"]].concat(L.map(p => [new Date(p.created_at).toLocaleString("pt-BR"), p.nome, dataBR(p.nascimento), idade(p.nascimento), p.sexo, p.email, celBR(p.celular), p.plano||"", p.ref_nutri||""]));
    const blob = new Blob(["﻿" + linhas.map(l => l.map(q).join(";")).join("\r\n")], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "fila-de-espera-familia-fr.csv"; document.body.appendChild(a); a.click(); a.remove();
  }
  async function mount(el, { sb, admin }){
    el.innerHTML = `<span class="mut">Carregando…</span>`;
    const { data, error } = await sb.from("fr_fila").select("*").order("created_at",{ascending:false}).limit(1000);
    if(error){ el.innerHTML = `<span class="mut">Não deu para carregar a fila${admin ? "" : ". Ela aparece aqui depois que a equipe FR aprovar o seu cadastro"}.</span>`; return; }
    let L = data || [];
    const draw = () => {
      if(!L.length){ el.innerHTML = `<span class="mut">Ninguém na fila ainda.</span>`; return; }
      const f = L.filter(p=>p.sexo==="feminino").length;
      el.innerHTML = `<div class="row" style="margin-top:0"><b>${L.length} ${L.length===1?"pessoa":"pessoas"} na fila</b><span class="mut" style="font-size:13px">${f} feminino · ${L.length-f} masculino</span><button class="btn line mini" data-fila-csv style="margin-left:auto">Baixar planilha</button></div>` +
        L.map(p => `<div class="ped"><b>${esc(p.nome)}</b><span class="tag">${p.sexo==="feminino"?"Feminino":"Masculino"}</span><span class="tag">Nasc. ${dataBR(p.nascimento)} · ${idade(p.nascimento)} anos</span>${p.plano?`<span class="tag">${esc(p.plano)}</span>`:""}${p.ref_nutri?`<span class="tag">Link da nutri: ${esc(p.ref_nutri)}</span>`:""}
          <div class="mut" style="font-size:13px">${esc(p.email)} · ${celBR(p.celular)} · entrou em ${new Date(p.created_at).toLocaleString("pt-BR")}</div>
          <div class="row" style="margin-top:8px"><a class="btn line mini" target="_blank" rel="noopener" href="https://wa.me/${zap(p.celular)}?text=${encodeURIComponent(`Oi, ${String(p.nome).split(" ")[0]}! Aqui é da Família FR 💪`)}">WhatsApp</a>${admin?`<button class="btn line mini del" data-fila-del="${p.id}">Excluir</button>`:""}</div></div>`).join("");
    };
    draw();
    el.onclick = async e => {
      if(e.target.closest("[data-fila-csv]")){ csv(L); return; }
      const d = e.target.closest("[data-fila-del]"); if(!d) return;
      const p = L.find(x => String(x.id) === d.dataset.filaDel); if(!p || !confirm(`Tirar ${p.nome} da fila? Não dá para desfazer.`)) return;
      d.disabled = true;
      const { error, count } = await sb.from("fr_fila").delete({ count: "exact" }).eq("id", p.id);
      if(error || !count){ d.disabled = false; alert("Não deu para excluir. Confira a internet."); return; }
      L = L.filter(x => x.id !== p.id); draw();
    };
  }
  return { mount };
})();
