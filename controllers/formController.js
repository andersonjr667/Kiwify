const { getDb } = require("../server/db");

const submitForm = (req, res) => {
  try {
    const { order_id, respostas } = req.body || {};

    if (!order_id || !respostas) {
      return res.status(400).json({ message: "Dados obrigatórios ausentes." });
    }

    const db = getDb();

    const order = db
      .prepare("SELECT order_id, status FROM orders WHERE order_id = ?")
      .get(String(order_id));

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    if (String(order.status).toLowerCase() !== "paid") {
      return res.status(403).json({ message: "Pagamento não aprovado." });
    }

    const existingResponse = db
      .prepare("SELECT order_id FROM form_responses WHERE order_id = ?")
      .get(String(order_id));

    if (existingResponse) {
      return res.status(409).json({ message: "Formulário já enviado para este pedido." });
    }

    db.prepare(
      "INSERT INTO form_responses (order_id, respostas, submitted_at) VALUES (?, ?, ?)"
    ).run(String(order_id), JSON.stringify(respostas), new Date().toISOString());

    return res.status(200).json({ message: "Formulário enviado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno." });
  }
};

module.exports = {
  submitForm
};
