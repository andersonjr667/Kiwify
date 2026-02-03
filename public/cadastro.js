const statusBox = document.getElementById("status");
const form = document.getElementById("form");

const setStatus = (message, type = "info") => {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`.trim();
  statusBox.style.display = "block";
};

const getOrderId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("order");
};

const validateOrder = async (orderId) => {
  const response = await fetch(`/api/order/validate?order=${encodeURIComponent(orderId)}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Pedido inválido.");
  }
  return response.json();
};

const submitForm = async (payload) => {
  const response = await fetch("/api/form/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao enviar.");
  }
  return data;
};

const init = async () => {
  const orderId = getOrderId();
  if (!orderId) {
    setStatus("Order ID ausente. Verifique o link enviado.", "error");
    return;
  }

  try {
    const validation = await validateOrder(orderId);
    form.classList.remove("hidden");
    setStatus(`Pedido confirmado para ${validation.order.produto}.`, "success");
  } catch (error) {
    setStatus(error.message, "error");
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const orderId = getOrderId();
  if (!orderId) {
    setStatus("Order ID ausente.", "error");
    return;
  }

  const payload = {
    order_id: orderId,
    respostas: {
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      objetivo: document.getElementById("objetivo").value.trim()
    }
  };

  try {
    const result = await submitForm(payload);
    setStatus(result.message, "success");
    form.reset();
    form.classList.add("hidden");
  } catch (error) {
    setStatus(error.message, "error");
  }
});

init();
