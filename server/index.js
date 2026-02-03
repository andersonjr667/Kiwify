require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const path = require("path");

const { initDatabase } = require("./db");
const webhookRoutes = require("../routes/webhookRoutes");
const formRoutes = require("../routes/formRoutes");
const orderRoutes = require("../routes/orderRoutes");

const app = express();

// Captura o corpo bruto para validação de assinatura do webhook
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

app.use(helmet());

// Banco de dados
initDatabase();

// Rotas de API
app.use("/api/webhook", webhookRoutes);
app.use("/api/form", formRoutes);
app.use("/api/order", orderRoutes);

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "..", "public")));

// Fallback para página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "cadastro.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
