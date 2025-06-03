// Dados do gráfico
const dadosPagamento = {
  labels: ["Pix", "Dinheiro", "Crédito","Débito"],
  datasets: [
    {
      label: "Formas de Pagamento",
      data: [0, 0, 0],
      backgroundColor: ["#FF9900", "#000000", "#FF3300"],
      borderColor: "#ffffff",
      borderWidth: 2,
    },
  ],
};

// Configuração do gráfico
const config = {
  type: "bar",
  data: dadosPagamento,
  options: {
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

const ctx = document.getElementById("graficoFormas").getContext("2d");
const graficoFormas = new Chart(ctx, config);

// Preenche a tabela com dados do localStorage
function carregarTabela() {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  const tbody = document.querySelector("#tabelaServicos tbody");
  tbody.innerHTML = ""; // Limpa antes de preencher

  registros.forEach((reg) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${reg.data}</td>
      <td>${reg.servicos}</td>
      <td>${reg.pagamento}</td>
      <td>R$ ${parseFloat(reg.valor).toFixed(2).replace(".", ",")}</td>
    `;

    tbody.appendChild(tr);
  });
}

// Atualiza dados no gráfico
function atualizarGrafico(pix, dinheiro, credito, debito) {
  graficoFormas.data.datasets[0].data = [pix, dinheiro, credito, debito];
  graficoFormas.update();
}

// Atualiza totais na tela e no gráfico
function atualizarTotais() {
  const linhas = document.querySelectorAll("#tabelaServicos tbody tr");
  let totalPix = 0;
  let totalDinheiro = 0;
  let totalCredito = 0; // Variável para somar crédito
  let totalDebito = 0; // Variável para somar débito
  let totalGeral = 0;

  linhas.forEach((linha) => {
    // Pega a forma de pagamento, converte para minúscula e remove acentos para comparar
    const formaPagRaw = linha.children[2].textContent.trim().toLowerCase();
    const formaPag = formaPagRaw.normalize("NFD").REPLACE(/ [^\w\s]/gi,''); // Remove acentos e caracteres especiais
    const valor =
      parseFloat(
        linha.children[3].textContent.replace("R$", "").replace(",", ".")
      ) || 0;

    totalGeral += valor;

    //  soma nos totais corretos
    if (formaPag === "pix") {
      totalPix += valor;
    } else if (formaPag === "dinheiro") {
      totalDinheiro += valor;
    } else if (formaPag === "credito") { // Comparar 'credito' (sem acento)
    } else if (formaPag === "debito") { // Comparar 'debito' (sem acento)
      totalCartao += valor;
    }
  });

  document.getElementById("totalPix").textContent = totalPix
    .toFixed(2)
    .replace(".", ",");
  document.getElementById("totalDinheiro").textContent = totalDinheiro
    .toFixed(2)
    .replace(".", ",");
  document.getElementById("totalCrédito").textContent = totalCredito
    .toFixed(2)
    .replace(".", ",");
  document.getElementById("totalDébito").textContent = totalDebito
    .toFixed(2)
    .replace(".", ",");
  document.getElementById("totalGeral").textContent = totalGeral
    .toFixed(2)
    .replace(".", ",");

  atualizarGrafico(totalPix, totalDinheiro, totalCredito, totalDebito);
}

// Limpa dados
function limparDados() {
  if (confirm("Deseja realmente limpar todos os dados?")) {
    localStorage.removeItem("registros");
    location.reload();
  }
}

// Atualiza na abertura da página
document.addEventListener("DOMContentLoaded", () => {
  carregarTabela();
  atualizarTotais();
});
