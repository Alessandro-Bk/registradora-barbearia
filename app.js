const servicoValores = {
  PEZINHO: 10,
  MÁQUINA: 15,
  DISFARÇADO: 20,
  "MÁQUINA E TESOURA": 25,
  TESOURA: 30,
  "NAVALHADO TOTAL": 20,
  "NAVALHADO DISFARÇADO": 30,
  SOBRANCELHA: 05,
  LUZES: 30,
  "BARBA TOTAL": 10,
  "BARBA MODELADA": 15,
  ALISANTE: 10,
  "PIGMENTAÇAO": 05,
};

function calcularTotal() {
  const serv1 = document.getElementById("servico1").value;
  const serv2 = document.getElementById("servico2").value;
  const serv3 = document.getElementById("servico3").value;

  let total = 0;
  if (servicoValores[serv1]) total += servicoValores[serv1];
  if (servicoValores[serv2]) total += servicoValores[serv2];
  if (servicoValores[serv3]) total += servicoValores[serv3];

  document.getElementById("valorTotal").value = `R$ ${total.toFixed(2)}`;
  return total;
}

function atualizarFechamento() {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];

  const total = registros.reduce((soma, item) => {
    return soma + parseFloat(item.valor);
  }, 0);

  document.getElementById("fechamentoValor").innerText = `R$ ${total.toFixed(
    2
  )}`;
}

document.getElementById("servico1").addEventListener("change", calcularTotal);
document.getElementById("servico2").addEventListener("change", calcularTotal);
document.getElementById("servico3").addEventListener("change", calcularTotal);

document.getElementById("registrar").addEventListener("click", () => {
  const total = calcularTotal();
  const pagamento = document.getElementById("pagamento").value;

  if (!pagamento) {
    alert("Selecione uma forma de pagamento.");
    return;
  }

  const dataAtual = new Date().toLocaleDateString();

  const servicosSelecionados = [
    document.getElementById("servico1").value,
    document.getElementById("servico2").value,
    document.getElementById("servico3").value,
  ]
    .filter((s) => s)
    .join(" + ");

  const registro = {
    data: dataAtual,
    servicos: servicosSelecionados,
    pagamento: pagamento,
    valor: total.toFixed(2),
  };

  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  registros.push(registro);
  localStorage.setItem("registros", JSON.stringify(registros));

  atualizarFechamento();

  // Limpar os campos
  document.getElementById("servico1").value = "";
  document.getElementById("servico2").value = "";
  document.getElementById("servico3").value = "";
  document.getElementById("pagamento").value = "";
  document.getElementById("valorTotal").value = "R$ 0,00";
});

// Executa assim que carregar a página
atualizarFechamento();
