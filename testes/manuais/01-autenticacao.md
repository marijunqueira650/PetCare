# Teste manual 01 — Autenticação

## Objetivo

Verificar o acesso ao sistema com credenciais válidas e a rejeição de credenciais inválidas.

## Pré-condição

Inicie o servidor Express e abra `http://localhost:3000`, conforme as instruções do README. A conta de demonstração `atendente` usa a senha `123`.

## Passos

1. Informe `atendente` e `123` e selecione **Entrar**.
2. Confirme que o painel é exibido e mostra o perfil conectado.
3. Selecione **Sair**.
4. Informe `atendente` com uma senha incorreta e selecione **Entrar**.

## Resultado esperado

- As credenciais válidas abrem o painel.
- As credenciais inválidas exibem uma mensagem de erro e mantêm a tela de login.
