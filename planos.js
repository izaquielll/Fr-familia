/* Família FR · gestão de planos e links (usado na Área do FR e na Área da Nutri) */
window.FRPlanos = (function(){
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const brl = n => "R$ " + Number(n||0).toLocaleString("pt-BR",{minimumFractionDigits: n%1?2:0, maximumFractionDigits:2});
  const slugify = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,34);
  const STATIC = ["consultoria","combo","convite","gluteo","abdomen","metabolica"];
  const SECOES = {feminino:"Programas femininos", programas:"Mais programas", nutri:"Planos das nutris"};
  const ativo = ate => ate && new Date() <= new Date(ate+"T23:59:59");

  function linkFor(base, slug, ref){
    if(ref) return base + "n/" + ref + "/" + (slug ? "?plano=" + slug : "");
    return STATIC.includes(slug) ? base + slug + "/" : base + "?plano=" + slug;
  }

  /* ---------- Links para enviar ---------- */
  async function mountLinks(el, {sb, base, ref, quem}){
    el.innerHTML = `<span class="mut">Carregando…</span>`;
    let C = {};
    try{ const { data } = await sb.from("fr_config").select("dados").eq("id",1).maybeSingle(); C = data?.dados || {}; }catch(e){}
    const { data: extras } = await sb.from("fr_planos").select("slug,nome,preco,preco_guia,tem_guia,periodo,secao,ordem,ativo,aprovado,nutri_id,fr_nutris(nome)").eq("ativo",true).eq("aprovado",true).order("ordem");
    const promo = ativo(C.promoAte);
    const combo = (C.consultoria||200) + (C.nutri||250);
    const lista = [];
    lista.push({nome:"Vitrine completa", url: ref ? linkFor(base, "", ref) : base, txt:"Oi! 💪 Conheça os planos da Família FR: treino e nutrição do seu jeito. Escolha o seu aqui:"});
    if(C.mostrarConsultoria !== false) lista.push({nome:"Consultoria Online", url: linkFor(base,"consultoria",ref),
      txt: promo ? `Oi! 💪 Chegou a ${C.promoNome||"promoção"} da Família FR: renovando agora, a consultoria sai por ${brl(C.consultoriaPromo)} o ciclo de 60 dias. Monte o seu plano aqui:` : `Oi! 💪 Consultoria online da Família FR por ${brl(C.consultoria||200)} o ciclo de 60 dias. Monte o seu plano aqui:`});
    if(C.mostrarCombo !== false) lista.push({nome:"Consultoria + Nutri", url: linkFor(base,"combo",ref),
      txt: `Oi! 💪🥗 Treino + plano alimentar com nutricionista parceira${promo ? `, de ${brl(combo)} por ${brl(C.comboPromo)}` : ` por ${brl(combo)}`}. Monte o seu plano aqui:`});
    // Na Área do FR: um link do Consultoria + Nutri já com cada nutri escolhida
    if(!ref && C.mostrarCombo !== false){
      let ns = [{slug:"fabiola", nome:"Fabíola Amorim"}];
      try{ const { data } = await sb.from("fr_nutris").select("slug,nome").eq("status","aprovada").order("created_at");
        (data||[]).forEach(n => { ns = ns.filter(x => x.slug !== n.slug); ns.push(n); }); }catch(e){}
      ns.forEach(n => lista.push({nome:`Consultoria + Nutri · com ${n.nome}`, url: base + "combo/" + encodeURIComponent(n.slug) + "/",
        txt: `Oi! 💪🥗 Treino + plano alimentar com a nutricionista ${n.nome}${promo ? `, de ${brl(combo)} por ${brl(C.comboPromo)}` : ` por ${brl(combo)}`}. Monte o seu plano aqui:`}));
    }
    if(C.mostrarConvite !== false && ativo(C.conviteAte)) lista.push({nome:"Convite de aluno (amigo)", url: linkFor(base,"convite",ref),
      txt: `Oi! 🎁 Você ganhou um convite da Família FR: Consultoria + Nutri 100% online de ${brl(combo)} por ${brl(C.convite)}. Garanta o seu aqui:`});
    (extras||[]).filter(p => !p.nutri_id || p.fr_nutris).forEach(p => lista.push({nome: p.nome + (p.fr_nutris ? ` · ${p.fr_nutris.nome}` : ""), url: linkFor(base, p.slug, ref),
      txt: `Oi! 💪 ${p.nome}${p.fr_nutris ? ` com ${p.fr_nutris.nome}` : ""}: ${brl(p.preco)} (${p.periodo||""})${p.tem_guia && p.preco_guia ? `, ou ${brl(p.preco_guia)} com guia alimentar` : ""}. Veja aqui:`}));
    el.innerHTML = lista.map(l => {
      const wa = "https://wa.me/?text=" + encodeURIComponent(l.txt + "\n" + l.url);
      return `<div class="ped"><b>${esc(l.nome)}</b><div class="row" style="margin-top:6px"><input readonly value="${esc(l.url)}" style="flex:1;min-width:0">
        <a class="btn" href="${esc(wa)}" target="_blank" rel="noopener" style="text-decoration:none">Enviar no WhatsApp</a><button class="btn line" data-fr-copy="${esc(l.url)}">Copiar</button></div></div>`;
    }).join("");
  }
  document.addEventListener("click", async e => {
    const b = e.target.closest("[data-fr-copy]"); if(!b) return;
    try{ await navigator.clipboard.writeText(b.dataset.frCopy); b.textContent = "Copiado ✓"; }catch(err){ b.textContent = "Segure o link"; }
    setTimeout(()=>b.textContent="Copiar",1600);
  });

  /* ---------- Gestão de planos ---------- */
  function mountPlanos(el, {sb, admin, nutriId, onChange}){
    let planos = [], editando = null, apagar = null;
    async function load(){
      let q = sb.from("fr_planos").select("*, fr_nutris(nome)").order("ordem").order("created_at");
      if(!admin) q = q.eq("nutri_id", nutriId);
      const { data, error } = await q;
      planos = error ? [] : data; draw(error);
    }
    function form(p){
      p = p || {periodo: admin ? "programa de 30 dias" : "por mês", secao: admin ? "programas" : "nutri", ordem: 100};
      return `<div class="card" style="margin-top:10px;border-color:var(--lime)">
        <b>${p.id ? "Editar plano" : "Novo plano"}</b>
        <label>Nome do plano</label><input id="pf-nome" maxlength="80" value="${esc(p.nome)}" placeholder="Ex.: Base de Pernas">
        ${admin ? `<label>Onde aparece na vitrine</label><select id="pf-secao" style="width:100%;background:var(--s2);border:1.5px solid var(--line);border-radius:10px;padding:11px 12px;color:var(--tx);font:inherit">
          ${Object.entries(SECOES).map(([k,v])=>`<option value="${k}" ${p.secao===k?"selected":""}>${v}</option>`).join("")}</select>` : ""}
        <label>Descrição curta</label><input id="pf-desc" maxlength="300" value="${esc(p.descricao)}">
        <label>O que inclui (um item por linha)</label><textarea id="pf-itens" maxlength="600" style="width:100%;min-height:80px;background:var(--s2);border:1.5px solid var(--line);border-radius:10px;padding:11px 12px;color:var(--tx);font:inherit">${esc(p.itens)}</textarea>
        <div class="g">
          <div><label>Preço (R$)</label><input id="pf-preco" type="number" min="0" step="0.01" value="${p.preco ?? ""}"></div>
          <div><label>Preço "de" riscado (opcional)</label><input id="pf-de" type="number" min="0" step="0.01" value="${p.preco_de ?? ""}"></div>
          <div><label>Período (ex.: programa de 30 dias)</label><input id="pf-per" maxlength="60" value="${esc(p.periodo)}"></div>
          <div><label>Ordem na vitrine (menor aparece antes)</label><input id="pf-ordem" type="number" value="${p.ordem ?? 100}"></div>
        </div>
        <label style="display:flex;gap:8px;align-items:center;margin-top:14px"><input id="pf-guia" type="checkbox" style="width:auto" ${p.tem_guia?"checked":""}> Oferecer opção com guia alimentar</label>
        <div><label>Preço com guia alimentar (R$)</label><input id="pf-pguia" type="number" min="0" step="0.01" value="${p.preco_guia ?? ""}"></div>
        ${!admin ? `<p class="mut" style="font-size:13px;margin:10px 0 0">Planos novos ou alterados passam pela aprovação da equipe FR antes de aparecer na vitrine.</p>` : ""}
        <div class="row"><button class="btn" data-pf="salvar">Salvar plano</button><button class="btn line" data-pf="cancelar">Cancelar</button><span id="pf-st" class="mut"></span></div>
      </div>`;
    }
    function draw(err){
      const linhas = planos.map(p => {
        const status = !p.ativo ? "Oculto" : (p.aprovado ? "Na vitrine" : "Em análise");
        return `<div class="ped"><b>${esc(p.nome)} · ${brl(p.preco)}</b>
          <span class="tag">${status}</span><span class="tag">${SECOES[p.secao]}</span>${p.fr_nutris ? `<span class="tag">${esc(p.fr_nutris.nome)}</span>` : ""}
          <div class="row" style="margin-top:8px">
            <button class="btn line" data-pf="editar" data-id="${p.id}">Editar</button>
            <button class="btn line" data-pf="${p.ativo ? "ocultar" : "mostrar"}" data-id="${p.id}">${p.ativo ? "Ocultar" : "Mostrar"}</button>
            ${admin && !p.aprovado ? `<button class="btn" data-pf="aprovar" data-id="${p.id}">Aprovar</button>` : ""}
            <button class="btn line" data-pf="${apagar===p.id ? "confirmar" : "excluir"}" data-id="${p.id}" style="${apagar===p.id ? "color:#ff8a80" : ""}">${apagar===p.id ? "Confirmar exclusão" : "Excluir"}</button>
          </div>${editando===p.id ? form(p) : ""}</div>`;
      }).join("");
      el.innerHTML = `<div class="row" style="margin-top:0"><button class="btn" data-pf="novo">+ Novo plano</button></div>
        ${editando==="novo" ? form(null) : ""}
        ${err ? `<p class="mut">Não deu para carregar os planos.</p>` : (planos.length ? linhas : `<p class="mut">Nenhum plano ainda.</p>`)}`;
    }
    async function salvar(){
      const st = el.querySelector("#pf-st"), v = id => el.querySelector(id)?.value ?? "";
      const num = s => s === "" ? null : Number(s);
      const dados = { nome: v("#pf-nome").trim(), descricao: v("#pf-desc").trim() || null, itens: v("#pf-itens").trim() || null,
        preco: num(v("#pf-preco")), preco_de: num(v("#pf-de")), periodo: v("#pf-per").trim() || "por ciclo de 60 dias",
        ordem: parseInt(v("#pf-ordem")) || 100, tem_guia: el.querySelector("#pf-guia").checked, preco_guia: num(v("#pf-pguia")) };
      if(admin) dados.secao = v("#pf-secao");
      if(dados.nome.length < 2){ st.textContent = "Coloque o nome do plano."; return; }
      if(dados.preco === null || isNaN(dados.preco)){ st.textContent = "Coloque o preço."; return; }
      if(dados.tem_guia && !dados.preco_guia){ st.textContent = "Coloque o preço com guia alimentar."; return; }
      st.textContent = "Salvando…";
      let res;
      if(editando !== "novo"){ res = await sb.from("fr_planos").update(dados).eq("id", editando).select(); }
      else {
        const extra = admin ? { aprovado: true } : { aprovado: false, secao: "nutri", nutri_id: nutriId };
        let slug = slugify(dados.nome); if(slug.length < 2) slug = "plano-" + slug;
        res = await sb.from("fr_planos").insert({ ...dados, ...extra, slug }).select();
        if(res.error && /duplicate|unique/i.test(res.error.message)) res = await sb.from("fr_planos").insert({ ...dados, ...extra, slug: (slug + "-" + Math.random().toString(36).slice(2,5)).slice(0,40) }).select();
      }
      if(res.error || !res.data?.length){ st.textContent = "Não deu para salvar" + (res.error ? ": " + res.error.message : "."); return; }
      editando = null; await load(); onChange && onChange();
    }
    el.addEventListener("click", async e => {
      const b = e.target.closest("[data-pf]"); if(!b) return;
      const a = b.dataset.pf, id = b.dataset.id;
      if(a === "novo"){ editando = "novo"; apagar = null; draw(); return; }
      if(a === "editar"){ editando = editando === id ? null : id; apagar = null; draw(); return; }
      if(a === "cancelar"){ editando = null; draw(); return; }
      if(a === "salvar"){ salvar(); return; }
      if(a === "excluir"){ apagar = id; draw(); return; }
      b.disabled = true;
      if(a === "confirmar") await sb.from("fr_planos").delete().eq("id", id);
      if(a === "ocultar" || a === "mostrar") await sb.from("fr_planos").update({ ativo: a === "mostrar" }).eq("id", id);
      if(a === "aprovar") await sb.from("fr_planos").update({ aprovado: true }).eq("id", id);
      apagar = null; await load(); onChange && onChange();
    });
    load();
    return { reload: load };
  }
  return { mountLinks, mountPlanos, linkFor };
})();
