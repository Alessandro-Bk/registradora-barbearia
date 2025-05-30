const servicoValores = {
    "PEZINHO": 10,
    "MÁQUINA": 15,
    "DISFARÇADO": 25,
    "MÁQUINA E TESOURA": 25,
    "TESOURA":20,
    "NAVALHADO TOTAL":20,
    "NAVALHADO DISFARÇADO":30,
    "SOBRANCELHA":10,
    "LUZES":80,
    "BARBA TOTAL":20,
    "BARBA MODELADA":15,
    "ALISANTE":50,
};

let fechamento = 0;

function calcularTotal() {
    const serv1 = document.getElementById('servico1').value;
    const serv2 = document.getElementById('servico2').value;
    const serv3 = document.getElementById('servico3').value;

    let total = 0;
    if (servicoValores[serv1]) total += servicoValores[serv1];
    if (servicoValores[serv2]) total += servicoValores[serv2];
    if (servicoValores[serv3]) total += servicoValores[serv3];

    document.getElementById('valorTotal').value = `R$ ${total.toFixed(2)}`;
    return total;
}

document.getElementById('servico1').addEventListener('change', calcularTotal);
document.getElementById('servico2').addEventListener('change', calcularTotal);
document.getElementById('servico3').addEventListener('change', calcularTotal);

document.getElementById('registrar').addEventListener('click', () => {
    const total = calcularTotal();
    fechamento += total;
    document.getElementById('fechamentoValor').innerText = `R$ ${fechamento.toFixed(2)}`;

    // Limpar os campos após registrar
    document.getElementById('servico1').value = "";
    document.getElementById('servico2').value = "";
    document.getElementById('servico3').value = "";
    document.getElementById('pagamento').value = "";
    document.getElementById('valorTotal').value = "R$ 0,00";
});
