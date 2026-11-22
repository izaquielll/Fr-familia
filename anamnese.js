/* Família FR · Anamnese (Plano Start) das nutricionistas.
   As perguntas ficam só aqui: o formulário do cliente e a leitura da nutri usam esta mesma lista. */
(function(){
  const SN = ["Não","Sim"];
  const SECOES = [
    {t:"1. Informações pessoais", q:[
      {id:"peso", l:"Peso atual", tipo:"text", ph:"Ex.: 72 kg", req:true},
      {id:"altura", l:"Altura", tipo:"text", ph:"Ex.: 1,68 m", req:true}]},
    {t:"2. Objetivos e motivação", q:[
      {id:"objetivos", l:"Quais são seus principais objetivos para iniciar a consultoria?", dica:"Marque todos que se aplicam", tipo:"multi", req:true,
        o:["Emagrecimento","Ganho de massa magra","Auxiliar no tratamento de doenças","Reeducação alimentar","Auxiliar na seletividade alimentar","Qualidade de vida"]},
      {id:"meta", l:"Você possui alguma meta específica de peso, saúde ou bem-estar? Se sim, qual?", tipo:"area"},
      {id:"expectativas", l:"Quais são suas expectativas em relação ao acompanhamento nutricional?", tipo:"area"}]},
    {t:"3. Hábitos e preferências alimentares", q:[
      {id:"refeicoes", l:"Quais das refeições a seguir você costuma fazer?", tipo:"multi", outros:true, req:true,
        o:["Desjejum (café da manhã)","Colação (lanche)","Almoço","Café da tarde","Jantar","Ceia"]},
      {id:"horarios", l:"Quais são os horários das suas refeições? E o que você costuma consumir com mais frequência?", tipo:"area", grande:true, req:true,
        dica:"Descreva os horários e os alimentos que costuma consumir. Liste todas as refeições que costuma realizar com o máximo de detalhes possíveis.",
        ph:"Exemplo:\nCafé da manhã: normalmente entre 7h e 8h - pão, queijo, ovo, café (às vezes como uma tapioca)\nAlmoço: 12h - arroz, feijão (1 concha), carne, legumes, verduras.\nJantar: 21h - nem sempre eu janto, às vezes faço um lanche em casa ou como um hambúrguer.\nCeia: não costumo fazer"},
      {id:"fome", l:"Durante o dia, qual horário tem mais fome?", tipo:"text"},
      {id:"beliscar", l:"Quando tem vontade de beliscar, come qual tipo de alimento?", tipo:"multi", outros:true, o:["Frutas","Pães","Biscoitos","Doces"]},
      {id:"favoritos", l:"Quais são seus alimentos favoritos?", tipo:"area"},
      {id:"nao_gosta", l:"Quais alimentos você não gosta ou não come?", tipo:"area"},
      {id:"estilo", l:"Você segue algum estilo de alimentação específico? Vegetarianismo, Veganismo, Low Carb, alguma restrição alimentar?", tipo:"area"},
      {id:"fim_semana", l:"Sua rotina alimentar muda durante o final de semana?", dica:"Marque a opção que melhor descreve sua rotina nos finais de semana", tipo:"one",
        o:["Não, minha alimentação é igual durante a semana e no final de semana","Sim, costumo consumir mais alimentos que não como durante a semana (doces, lanches, frituras, etc.)","Sim, costumo comer mais durante o final de semana em comparação com a semana","Sim, costumo pular mais refeições ou comer menos no final de semana"]}]},
    {t:"4. Hidratação e funcionamento intestinal", q:[
      {id:"agua", l:"Quantos copos de água bebe por dia?", tipo:"one", req:true, o:["1-2 copos","3-5 copos","6-8 copos","7-10 copos","Mais de 10 copos"]},
      {id:"evacuacao", l:"Qual a sua frequência de evacuação na semana?", tipo:"one", req:true, o:["Menos de 2 vezes","3-4 vezes","Diariamente","1-2 vezes ao dia","3 ou mais vezes ao dia"]}]},
    {t:"5. Comportamento alimentar", q:[
      {id:"comportamento", l:"Marque os itens que mais combinam com você", tipo:"multi",
        o:["Planejo minhas refeições","Não planejo minhas refeições","Pulo refeições","Beliscador","Como pouco quando estou estressado","Como muito quando estou estressado","Como muito tarde","Como fazendo outras coisas (TV, lendo, Celular)","Como demais","Como pouco","Sem padrão no dia a dia","Comer emocional (quando triste, sozinho, deprimido, chateado)","Relação ruim com a comida","Exagero no fim de semana"]}]},
    {t:"6. Saúde e medicamentos", q:[
      {id:"sono", l:"Qualidade do sono", dica:"Pode marcar mais de uma alternativa", tipo:"multi", o:["Excelente (6-8 horas)","Bom (4-6 horas)","Ruim (menos de 4 horas)"]},
      {id:"atividade", l:"Pratica atividade física?", tipo:"one", req:true, o:["Não","Sim (2 a 3 vezes na semana)","Sim (4 a 5 vezes na semana)","Sim (mais de 5 vezes na semana)"]},
      {id:"atividade_tipo", l:"Qual tipo de atividade pratica?", tipo:"multi", outros:true, o:["Caminhada","Corrida","Natação","Ciclismo","Musculação","Lutas","Crossfit"]},
      {id:"atividade_detalhes", l:"Descreva dias, horários e detalhes da atividade", dica:"Se treina sozinho, com personal, se faz consultoria, frequência, etc.", tipo:"area"},
      {id:"saude", l:"Em geral, minha saúde é:", tipo:"one", req:true, o:["Excelente","Boa","Razoável","Ruim"]},
      {id:"alergia", l:"Possui alguma alergia ou intolerância alimentar?", tipo:"one", o:SN},
      {id:"alergia_quais", l:"Quais?", tipo:"area", se:["alergia","Sim"]},
      {id:"doencas_tem", l:"Já foi diagnosticado por um médico com alguma doença/sintoma?", tipo:"one", o:SN},
      {id:"doencas", l:"Selecione os itens", tipo:"multi", se:["doencas_tem","Sim"],
        o:["Azia","Gastrite","Refluxo","Síndrome do intestino irritável","Hipertensão","Colesterol alto","Edema","Doenças cardiovasculares","Hipotireoidismo","Hipertireoidismo","Diabetes","Anemia","SOP (síndrome do ovário policístico)","Pedra nos rins","Artrite","Osteoporose","Alergias alimentares","Alergias ou doenças respiratórias","Ansiedade","Depressão"]},
      {id:"outras_doencas", l:"Possui alguma outra doença ou sintoma que não foi listado acima? Quais?", tipo:"area"},
      {id:"medicamentos", l:"Faz uso de medicamentos?", tipo:"one", o:SN},
      {id:"medicamentos_quais", l:"Quais medicamentos você utiliza?", tipo:"area", se:["medicamentos","Sim"]},
      {id:"suplementos", l:"Faz uso de algum suplemento ou fitoterápico?", tipo:"one", o:SN},
      {id:"suplementos_quais", l:"Quais suplementos e fitoterápicos você utiliza?", tipo:"area", se:["suplementos","Sim"]},
      {id:"exames", l:"Fez algum exame nos últimos 6 meses?", tipo:"one", o:SN},
      {id:"exames_quais", l:"Quais?", dica:"Se possível, mande os resultados dos exames para a sua nutricionista pelo WhatsApp.", tipo:"area", se:["exames","Sim"]},
      {id:"fuma", l:"Tem hábito de fumar?", tipo:"one", o:SN},
      {id:"alcool", l:"Consome bebidas alcoólicas?", tipo:"one", o:["Não","Sim, ocasionalmente.","Sim, 2 a 3 vezes no mês.","Sim, uma vez por semana.","Sim, duas ou mais vezes na semana"]},
      {id:"extra", l:"Tem algo importante que eu não perguntei e que você acha que devo saber? Escreve aqui!", tipo:"area"}]}
  ];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const visivel = (q, R) => !q.se || R[q.se[0]] === q.se[1];
  const temValor = v => Array.isArray(v) ? v.length > 0 : String(v ?? "").trim() !== "";

  /* Formulário do cliente */
  function form(el, R){
    el.innerHTML = SECOES.map(s => `<div class="sec"><h2>${esc(s.t)}</h2>${s.q.map(q => {
      const v = R[q.id];
      let c = "";
      if(q.tipo === "text") c = `<input type="text" name="${q.id}" maxlength="200" placeholder="${esc(q.ph||"")}" value="${esc(v||"")}">`;
      if(q.tipo === "area") c = `<textarea name="${q.id}" maxlength="4000" rows="${q.grande?8:3}" placeholder="${esc(q.ph||"")}">${esc(v||"")}</textarea>`;
      if(q.tipo === "one" || q.tipo === "multi"){
        const t = q.tipo === "one" ? "radio" : "checkbox", sel = Array.isArray(v) ? v : [v];
        c = `<div class="opts">${q.o.map(o => `<label class="opt"><input type="${t}" name="${q.id}" value="${esc(o)}" ${sel.includes(o)?"checked":""}><span>${esc(o)}</span></label>`).join("")}</div>`;
        if(q.outros) c += `<input type="text" name="${q.id}__outros" maxlength="200" placeholder="Outros: escreva aqui" value="${esc(R[q.id+"__outros"]||"")}" style="margin-top:8px">`;
      }
      return `<div class="q" data-q="${q.id}" ${visivel(q,R)?"":'hidden'}><div class="ql">${esc(q.l)}${q.req?' <i>*</i>':""}</div>${q.dica?`<div class="qd">${esc(q.dica)}</div>`:""}${c}</div>`;
    }).join("")}</div>`).join("");
  }
  function ler(el){
    const R = {};
    for(const s of SECOES) for(const q of s.q){
      if(q.tipo === "multi") R[q.id] = [...el.querySelectorAll(`[name="${q.id}"]:checked`)].map(i => i.value);
      else if(q.tipo === "one") R[q.id] = el.querySelector(`[name="${q.id}"]:checked`)?.value || "";
      else R[q.id] = (el.querySelector(`[name="${q.id}"]`)?.value || "").trim();
      if(q.outros) R[q.id+"__outros"] = (el.querySelector(`[name="${q.id}__outros"]`)?.value || "").trim();
    }
    return R;
  }
  function atualizar(el){
    const R = ler(el);
    for(const s of SECOES) for(const q of s.q){ const d = el.querySelector(`[data-q="${q.id}"]`); if(d) d.hidden = !visivel(q, R); }
  }
  function faltando(R){
    const f = [];
    for(const s of SECOES) for(const q of s.q) if(q.req && visivel(q,R) && !temValor(R[q.id]) && !(q.outros && temValor(R[q.id+"__outros"]))) f.push(q);
    return f;
  }

  /* Leitura das respostas (nutri e FR) */
  function respostas(R){
    R = R || {};
    return SECOES.map(s => {
      const itens = s.q.filter(q => visivel(q,R)).map(q => {
        let v = R[q.id]; v = Array.isArray(v) ? v.slice() : (temValor(v) ? [v] : []);
        if(q.outros && temValor(R[q.id+"__outros"])) v.push("Outros: " + R[q.id+"__outros"]);
        return {l:q.l, v};
      });
      return {t:s.t, itens};
    });
  }
  function html(R){
    return respostas(R).map(s => `<h4 class="an-sec">${esc(s.t)}</h4>${s.itens.map(i => `<div class="an-i"><div class="an-l">${esc(i.l)}</div><div class="an-v">${i.v.length ? i.v.map(esc).join("<br>").replace(/\n/g,"<br>") : '<span class="an-vazio">Não respondeu</span>'}</div></div>`).join("")}`).join("");
  }
  function texto(R, cab){
    return (cab ? cab + "\n\n" : "") + respostas(R).map(s => s.t.toUpperCase() + "\n" + s.itens.map(i => `- ${i.l}\n  ${i.v.length ? i.v.join("; ").replace(/\n/g,"\n  ") : "Não respondeu"}`).join("\n")).join("\n\n");
  }
  function imprimir(R, titulo, sub){
    const w = window.open("", "_blank"); if(!w) return false;
    w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(titulo)}</title><style>
      body{font:13px/1.45 system-ui,sans-serif;color:#111;max-width:760px;margin:24px auto;padding:0 18px}
      h1{font-size:20px;margin:0}.sub{color:#555;margin:4px 0 16px}.an-sec{font-size:14px;margin:18px 0 6px;padding-bottom:4px;border-bottom:2px solid #111;text-transform:uppercase}
      .an-i{padding:6px 0;border-bottom:1px solid #ddd;break-inside:avoid}.an-l{color:#555;font-size:12px}.an-v{font-weight:600}.an-vazio{color:#999;font-weight:400}
    </style></head><body><h1>${esc(titulo)}</h1><div class="sub">${esc(sub||"")}</div>${html(R)}<script>setTimeout(()=>print(),300)<\/script></body></html>`);
    w.document.close(); return true;
  }
  window.FRAnamnese = {SECOES, form, ler, atualizar, faltando, html, texto, imprimir};
})();
