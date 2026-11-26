/* Notificações no celular (Área do FR e Área da Nutri).
   FRPush.mount(el, { sb, quem: "nutri" | "fr" }) desenha o botão "Ativar notificações" e guarda a inscrição em fr_push.
   O envio é feito pelo banco (gatilhos em fr_pedidos e fr_anamneses chamam a função fr-notificar). */
(function(){
  const VAPID = "BDDPDunsu0gLmDQ1Q_ptQpyhVFqL_-iCQdq6QQMTdEyYDnUgA0uALMEm6VPOiVqJYBEReGkH6So5BVMPnpmh-58";
  const b64 = s => { const p = "=".repeat((4 - s.length % 4) % 4), r = atob((s + p).replace(/-/g,"+").replace(/_/g,"/")); return Uint8Array.from(r, c => c.charCodeAt(0)); };
  const ios = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const instalado = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const suporta = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

  async function registro(){ return navigator.serviceWorker.register("sw.js", { scope: "./" }); }
  async function salvar(sb, sub){
    const j = sub.toJSON();
    const { data: u } = await sb.auth.getUser(); if(!u || !u.user) throw new Error("sem login");
    const { error } = await sb.from("fr_push").upsert({ endpoint: j.endpoint, user_id: u.user.id, p256dh: j.keys.p256dh, auth: j.keys.auth }, { onConflict: "endpoint" });
    if(error) throw error;
  }

  async function mount(el, o){
    if(!el) return;
    const sb = o.sb, txt = o.quem === "nutri" ? "Receba um aviso no celular quando um cliente escolher você e quando a anamnese dele chegar." : "Receba um aviso no celular a cada pedido novo e a cada anamnese respondida.";
    const desenha = (estado, extra) => {
      const ok = estado === "ativo";
      el.innerHTML = `<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><b style="flex:1;min-width:180px">${ok ? "🔔 Notificações ativas neste aparelho" : "🔕 Notificações no celular"}</b>
        ${estado === "pode" ? `<button class="btn mini" data-push-on>Ativar notificações</button>` : ""}
        ${ok ? `<button class="btn line mini" data-push-teste>Testar</button>` : ""}</div>
        <div class="mut" style="font-size:13px;margin-top:6px">${extra || txt}</div>`;
    };
    if(!suporta()){
      desenha("nao", ios() && !instalado()
        ? "No iPhone: toque em <b>Compartilhar</b> → <b>Adicionar à Tela de Início</b>, abra a Área pelo ícone novo e ative aqui. (Precisa do iOS 16.4 ou mais novo.)"
        : "Este navegador não aceita notificações. Use o Chrome no Android ou o app instalado na Tela de Início no iPhone.");
      return;
    }
    try{
      const reg = await registro();
      const sub = await reg.pushManager.getSubscription();
      if(sub && Notification.permission === "granted"){ salvar(sb, sub).catch(()=>{}); desenha("ativo"); }
      else if(Notification.permission === "denied") desenha("nao", "As notificações estão bloqueadas para este site. Libere nas configurações do navegador (Notificações → permitir) e volte aqui.");
      else desenha("pode");
    }catch(e){ desenha("nao", "Não deu para preparar as notificações agora. Recarregue a página."); return; }

    el.onclick = async ev => {
      if(ev.target.closest("[data-push-on]")){
        const b = ev.target.closest("[data-push-on]"); b.disabled = true; b.textContent = "Ativando…";
        try{
          const perm = await Notification.requestPermission();
          if(perm !== "granted"){ desenha("nao", "Você não permitiu as notificações. Para ativar depois, libere nas configurações do navegador."); return; }
          const reg = await navigator.serviceWorker.ready;
          const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(VAPID) });
          await salvar(sb, sub); desenha("ativo");
        }catch(e){ desenha("pode", "Não deu para ativar. Confira a internet e tente de novo."); }
        return;
      }
      if(ev.target.closest("[data-push-teste]")){
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification("Família FR · teste ✅", { body: "As notificações estão funcionando neste aparelho.", icon: o.quem === "nutri" ? "img/icone/nutri-192.png" : "img/icone/fr-192.png" });
      }
    };
  }
  window.FRPush = { mount };
})();
