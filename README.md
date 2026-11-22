# Família FR

Vitrine de planos de treino e nutrição. Dados no Supabase (tabelas fr_config, fr_pedidos e fr_anamneses).

Anamnese: cada pedido com nutri ganha um link `anamnese.html?t=...`. O cliente responde quando quiser; a nutri só vê depois que o FR toca em **Confirmar Pix** na Área do FR. As perguntas ficam em `anamnese.js`.

Pedidos pelo link de uma nutri (`ref_nutri`): o resumo vai para o WhatsApp dela, ela recebe o Pix e toca em **Confirmar Pix** na área dela (função `fr_nutri_confirmar_pix`). A coluna `pago_por` guarda quem confirmou (`fr` ou o slug da nutri).
