# Teste manual 04 — Vendas e relatórios

## Objetivo

Verificar a finalização de uma venda, a atualização do estoque e a inclusão do valor no relatório.

## Pré-condição

Inicie o servidor Express, acesse o PetCare e entre com uma conta de demonstração, conforme as instruções do README. Use um produto com estoque disponível; a venda altera os dados no `localStorage` do navegador.

## Passos

1. Em **Vendas**, selecione um produto disponível e adicione uma unidade ao carrinho.
2. Finalize a venda e confirme o pagamento.
3. Verifique o registro no histórico de vendas.
4. Confira que o estoque do produto diminuiu em uma unidade.
5. Em **Relatórios**, escolha um período que inclua a data da venda e gere o relatório.

## Resultado esperado

- A venda aparece no histórico com o valor esperado.
- O estoque diminui em uma unidade.
- O total de vendas do relatório inclui a venda realizada.
