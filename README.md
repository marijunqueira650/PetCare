# PetCare

## Descrição do projeto

O PetCare é um sistema web de gestão de petshop. Ele reúne em uma única interface o cadastro de clientes e seus pets, a organização de agendamentos e atendimentos, o controle de produtos e vendas e a consulta de relatórios. Os dados da aplicação são armazenados no navegador usando `localStorage`.

## Funcionalidades

- Exibe um painel com indicadores, agendamentos do dia e alertas de estoque.
- Cadastra clientes e pets e permite consultar seus históricos.
- Organiza agendamentos e permite visualizar e cancelar horários.
- Registra atendimentos veterinários e informações de vacinação.
- Cadastra produtos, acompanha quantidades em estoque e permite ajustá-las.
- Monta o carrinho e registra vendas.
- Gera relatórios do sistema.

## Integrante

- Mariana

## Tecnologias

- HTML
- CSS
- JavaScript
- `localStorage` do navegador para armazenar os dados

## Como executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/marijunqueira650/PetCare.git
   ```

2. Abra a pasta do projeto.
3. Abra o arquivo `index.html` em um navegador. Não é necessário instalar dependências para executar a aplicação.

## Perfis de usuário

O sistema disponibiliza estes perfis para acesso de demonstração:

| Perfil | Usuário | Senha |
| --- | --- | --- |
| Atendente | `atendente` | `123` |
| Veterinário | `veterinario` | `123` |
| Tosador | `tosador` | `123` |
| Gerente | `gerente` | `123` |

Os dados são salvos no navegador utilizado.

## Versionamento

As alterações do projeto devem ser registradas no Git em etapas pequenas, com mensagens no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/). Exemplos:

```text
feat: adiciona cadastro de clientes
fix: corrige validação do agendamento
docs: atualiza instruções de execução
```

## Documentação

Os arquivos dos artigos de análise e projeto ficam na raiz do repositório, junto ao README e aos arquivos da aplicação. O material em PDF atualmente versionado é `PetCareF.pdf`.
