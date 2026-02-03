const { getDb } = require("../server/db");

const validateOrder = (req, res) => {
  try {
    const orderId = String(req.query.order || "").trim();

    if (!orderId) {
      return res.status(400).json({ message: "Order ID inválido." });
    }

    const db = getDb();
    const order = db
      .prepare("SELECT order_id, status, nome, email, produto FROM orders WHERE order_id = ?")
      .get(orderId);

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    if (String(order.status).toLowerCase() !== "paid") {
      return res.status(403).json({ message: "Pagamento não aprovado." });
    }

    const response = db
      .prepare("SELECT order_id FROM form_responses WHERE order_id = ?")
      .get(orderId);

    if (response) {
      return res.status(409).json({ message: "Formulário já enviado." });
    }

    return res.status(200).json({
      valid: true,
      order: {
        order_id: order.order_id,
        nome: order.nome,
        email: order.email,
        produto: order.produto
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno." });
  }
};

module.exports = {
  validateOrder
};
