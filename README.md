# Família FR

Vitrine de planos de treino e nutrição. Dados no Supabase (tabelas fr_config, fr_pedidos, fr_anamneses e fr_fila).

Fila de espera: enquanto os preços estão escondidos, o botão **Entrar na fila de espera** abre um pré-cadastro (nome, nascimento, sexo, e-mail e celular) que vai para `fr_fila`. A lista aparece na Área do FR e na Área da Nutri (só nutris aprovadas). O código da lista fica em `fila.js`.

Anamnese: cada pedido com nutri ganha um link `anamnese.html?t=...`. O cliente responde quando quiser; a nutri só vê depois que o FR toca em **Confirmar Pix** na Área do FR. As perguntas ficam em `anamnese.js`.

Pedidos pelo link de uma nutri (`ref_nutri`): o resumo vai para o WhatsApp dela, ela recebe o Pix e toca em **Confirmar Pix** na área dela (função `fr_nutri_confirmar_pix`). A coluna `pago_por` guarda quem confirmou (`fr` ou o slug da nutri).
