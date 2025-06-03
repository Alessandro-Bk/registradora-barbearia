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
  let totalCredito = 0;
  let totalDebito = 0;
  let totalGeral = 0;

  linhas.forEach((linha) => {
    // Verifica se a linha tem as células esperadas (evita erros se a tabela estiver vazia ou malformada)
    if (linha.children.length < 4) return;

    // Pega a forma de pagamento, converte para minúscula e remove acentos
    const formaPagRaw = linha.children[2].textContent.trim().toLowerCase();
    // CORREÇÃO: Usar .replace() em minúsculo e ajustar a expressão regular
    const formaPag = formaPagRaw.normalize("NFD").replace(/[^a-z0-9]/gi, ''); // Remove acentos e caracteres não alfanuméricos

    const valorTexto = linha.children[3].textContent.replace("R$", "").replace(",", ".").trim();
    const valor = parseFloat(valorTexto) || 0;

    totalGeral += valor;

    // CORREÇÃO: Adicionar a soma para credito e debito
    if (formaPag === "pix") {
      totalPix += valor;
    } else if (formaPag === "dinheiro") {
      totalDinheiro += valor;
    } else if (formaPag === "credito") { // Compara 'credito'
      totalCredito += valor; // Adiciona ao totalCredito
    } else if (formaPag === "debito") { // Compara 'debito'
      totalDebito += valor; // Adiciona ao totalDebito
    }
  });

  // Atualiza os valores na tela usando os IDs corretos do HTML
  document.getElementById("totalPix").textContent = totalPix.toFixed(2).replace(".", ",");
  document.getElementById("totalDinheiro").textContent = totalDinheiro.toFixed(2).replace(".", ",");
  // Garante que os IDs com acento sejam usados para atualizar a tela
  document.getElementById("totalCrédito").textContent = totalCredito.toFixed(2).replace(".", ",");
  document.getElementById("totalDébito").textContent = totalDebito.toFixed(2).replace(".", ",");
  document.getElementById("totalGeral").textContent = totalGeral.toFixed(2).replace(".", ",");

  // Atualiza o gráfico (se necessário)
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
