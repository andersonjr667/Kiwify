# Kiwify + Formulário próprio

Sistema web profissional para receber webhooks do Kiwify e liberar o acesso ao formulário apenas para compras aprovadas.

## ✅ Recursos
- API REST em Node.js + Express
- Webhook Kiwify (Order Paid)
- Banco de dados SQLite
- Formulário seguro com validação do pedido
- Bloqueio de pedidos duplicados e múltiplos envios

## 📂 Estrutura
- /server
- /routes
- /controllers
- /public

## 🚀 Como rodar
1. Instale dependências:
   - `npm install`
2. Crie um arquivo `.env` baseado em `.env.example`
3. Inicie o servidor:
   - `npm run dev`
4. Acesse:
   - `http://localhost:3000/cadastro.html?order=SEU_ORDER_ID`

## 🔐 Variáveis de ambiente
Veja o arquivo `.env.example`.

## 🔔 Configuração do webhook no Kiwify
1. Aponte o webhook para:
   - `POST https://SEU_DOMINIO/api/webhook/kiwify`
2. Configure o evento **Order Paid**.
3. Envie no header `x-webhook-token` o mesmo valor de `KIWIFY_WEBHOOK_TOKEN`.
4. Se utilizar assinatura, envie HMAC SHA256 do corpo bruto no header `x-kiwify-signature`.

## 🔄 Fluxo do usuário
1. Compra aprovada no Kiwify
2. Kiwify envia webhook para a API
3. Pedido salvo no banco
4. Usuário é redirecionado para `/cadastro.html?order=ID`
5. Sistema valida pedido
6. Formulário é exibido
7. Resposta salva e vinculada à compra
# Kiwify
