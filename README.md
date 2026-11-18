# PetCare

Sistema de gestão de petshop para organizar clientes, pets, agendamentos, atendimentos, produtos, vendas e relatórios.

## Integrante

- Mariana

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

Os dados ficam salvos no `localStorage` do navegador utilizado. Para testar o acesso, use um dos perfis disponíveis:

| Usuário | Senha |
| --- | --- |
| `atendente` | `123` |
| `veterinario` | `123` |
| `tosador` | `123` |
| `gerente` | `123` |

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
