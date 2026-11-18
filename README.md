# PetCare

## Descrição do projeto

O PetCare é um sistema web para apoiar a gestão de um petshop. Ele reúne cadastros de clientes e pets, agendamentos, atendimentos veterinários, controle de produtos e vendas em uma única interface. O Express hospeda os arquivos estáticos; o sistema não possui API de dados e salva as informações no navegador.

## Integrante

- Mariana

## Perfis de usuário

O sistema oferece quatro perfis demonstrativos:

| Perfil | Usuário | Responsabilidade no sistema |
| --- | --- | --- |
| Atendente | `atendente` | Apoia cadastros, agendamentos e vendas. |
| Veterinário | `veterinario` | Registra atendimentos e informações de vacinação. |
| Tosador | `tosador` | Consulta pets e organiza serviços de banho e tosa. |
| Gerente | `gerente` | Acompanha a operação e autoriza descontos acima de 10%. |

## Funcionalidades

- Painel com indicadores, agendamentos do dia e alertas de estoque.
- Cadastro de clientes e pets, com consulta de históricos.
- Agendamento de serviços e consulta de horários ocupados.
- Registro de atendimentos veterinários e vacinas.
- Cadastro de produtos, ajuste de estoque e alertas de estoque baixo.
- Registro de vendas, atualização de estoque e relatórios.

## Tecnologias

- HTML
- CSS
- JavaScript
- Node.js e Express para hospedar os arquivos do site
- `localStorage` do navegador para armazenar os dados

## Como executar

1. Instale o Node.js 22 ou superior.
2. Clone o repositório e instale as dependências:

   ```bash
   git clone https://github.com/marijunqueira650/PetCare.git
   cd PetCare
   npm install
   ```

3. Inicie o servidor Express:

   ```bash
   npm start
   ```

4. Acesse `http://localhost:3000`.

Os dados ficam no `localStorage` do navegador e não são compartilhados entre dispositivos. Os perfis e senhas abaixo são apenas demonstrações: a autenticação é feita no frontend e não deve ser usada para proteger dados reais.

| Usuário | Senha |
| --- | --- |
| `atendente` | `123` |
| `veterinario` | `123` |
| `tosador` | `123` |
| `gerente` | `123` |

## Documentação

Os artigos de análise e de projeto ficam na raiz do repositório; o PDF atualmente versionado é `PetCareF.pdf`. Os roteiros de testes manuais ficam em `testes/manuais/`.

## Testes

Execute o teste do servidor estático com:

```bash
npm test
```

## Publicação no Render

O arquivo `render.yaml` configura o serviço Node.js. Crie um Blueprint no Render a partir deste repositório. O Express hospeda somente os arquivos do site; os dados continuam no armazenamento local de cada navegador.

## Versionamento

As alterações do projeto devem ser registradas no Git em etapas pequenas, com mensagens no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/). Exemplos:

```text
feat: adiciona cadastro de clientes
fix: corrige validação do agendamento
docs: atualiza instruções de execução
```
