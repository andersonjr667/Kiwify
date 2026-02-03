const crypto = require("crypto");
const { getDb } = require("../server/db");

const safeText = (value) => String(value || "").trim();

const validateSignature = (req) => {
  const secret = process.env.KIWIFY_WEBHOOK_SECRET || "";
  const signatureHeader = process.env.KIWIFY_SIGNATURE_HEADER || "x-kiwify-signature";
  if (!secret) return true; // permite rodar em dev sem assinatura

  const signature = req.header(signatureHeader) || "";
  if (!signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody || "")
    .digest("hex");

  if (signature.length !== expected.length) return false;

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

const validateToken = (req) => {
  const token = process.env.KIWIFY_WEBHOOK_TOKEN || "";
  if (!token) return true; // permite rodar em dev sem token

  const provided = req.header("x-webhook-token") || "";
  if (provided.length !== token.length) return false;
  return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(token));
};

const handleKiwifyWebhook = (req, res) => {
  try {
    if (!validateToken(req)) {
      return res.status(401).json({ message: "Token inválido." });
    }

    if (!validateSignature(req)) {
      return res.status(401).json({ message: "Assinatura inválida." });
    }

    const eventName = process.env.KIWIFY_EVENT_NAME || "order_paid";
    const payload = req.body || {};

    if (!payload.event || payload.event !== eventName) {
      return res.status(200).json({ message: "Evento ignorado." });
    }

    const data = payload.data || {};

    const orderId = safeText(data.order_id || data.orderId || data.id);
    const nome = safeText(data.customer_name || data.nome || data.name);
    const email = safeText(data.customer_email || data.email);
    const produto = safeText(data.product_name || data.produto || "Produto");
    const status = safeText(data.status || payload.status || "");

    if (!orderId || !nome || !email) {
      return res.status(400).json({ message: "Payload inválido." });
    }

    const paidStatus = process.env.KIWIFY_PAID_STATUS || "paid";
    if (status.toLowerCase() !== paidStatus.toLowerCase()) {
      return res.status(200).json({ message: "Pagamento não aprovado." });
    }

    const db = getDb();

    const existing = db
      .prepare("SELECT order_id FROM orders WHERE order_id = ?")
      .get(orderId);

    if (existing) {
      return res.status(200).json({ message: "Pedido duplicado ignorado." });
    }

    db.prepare(
      "INSERT INTO orders (order_id, nome, email, produto, status, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(orderId, nome, email, produto, "paid", new Date().toISOString());

    return res.status(200).json({ message: "Pedido registrado." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno." });
  }
};

module.exports = {
  handleKiwifyWebhook
};
