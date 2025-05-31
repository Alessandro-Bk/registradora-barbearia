// Dados do gráfico
const dadosPagamento = {
  labels: ["Pix", "Dinheiro", "Cartão"],
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

// Cria o gráfico
const ctx = document.getElementById("graficoFormas").getContext("2d");
const graficoFormas = new Chart(ctx, config);

// Atualiza dados no gráfico
function atualizarGrafico(pix, dinheiro, cartao) {
  graficoFormas.data.datasets[0].data = [pix, dinheiro, cartao];
  graficoFormas.update();
}

// Atualiza totais na tela e no gráfico
function atualizarTotais() {
  const linhas = document.querySelectorAll("#tabelaServicos tbody tr");
  let totalPix = 0;
  let totalDinheiro = 0;
  let totalCartao = 0;
  let totalGeral = 0;

  linhas.forEach((linha) => {
    const formaPag = linha.children[2].textContent.trim().toLowerCase();
    const valor =
      parseFloat(
        linha.children[3].textContent.replace("R$", "").replace(",", ".")
      ) || 0;

    totalGeral += valor;

    if (formaPag === "pix") {
      totalPix += valor;
    } else if (formaPag === "dinheiro") {
      totalDinheiro += valor;
    } else if (formaPag === "cartao" || formaPag === "cartão") {
      totalCartao += valor;
    }
  });

  document.getElementById("totalPix").textContent = totalPix
    .toFixed(2)
    .replace(".", ",");
  document.getElementById("totalDinheiro").textContent = totalDinheiro
    .toFixed(2)
    .replace(".", ",");
  document.getElementById("totalCartao").textContent = totalCartao
    .toFixed(2)
    .replace(".", ",");
  document.getElementById("totalGeral").textContent = totalGeral
    .toFixed(2)
    .replace(".", ",");

  atualizarGrafico(totalPix, totalDinheiro, totalCartao);
}

// Limpa dados
function limparDados() {
  if (confirm("Deseja realmente limpar todos os dados?")) {
    localStorage.clear();
    location.reload();
  }
}

// Atualiza na abertura da página
document.addEventListener("DOMContentLoaded", () => {
  atualizarTotais();
});
