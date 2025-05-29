// Código JavaScript para o Dashboard da Barbearia

// Dados iniciais (serão substituídos pelos dados do localStorage)
const initialServices = [
    { name: "Corte Simples", price: 30 },
    { name: "Barba", price: 25 },
    { name: "Sobrancelha", price: 15 },
    { name: "Máquina", price: 25 },
    { name: "Tesoura", price: 30 },
    { name: "Nenhum", price: 0 }
];

// Variáveis globais
let services = [];
let records = [];
let weeklyData = {};

// Elementos DOM
const currentDateEl = document.getElementById('current-date');
const service1El = document.getElementById('service1');
const service2El = document.getElementById('service2');
const service3El = document.getElementById('service3');
const paymentMethodEl = document.getElementById('payment-method');
const totalValueEl = document.getElementById('total-value');
const registerButtonEl = document.getElementById('register-button');
const dayTotalValueEl = document.getElementById('day-total-value');
const servicesListEl = document.getElementById('services-list');
const weeklyListEl = document.getElementById('weekly-list');
const weekTotalEl = document.getElementById('week-total');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

// Função de inicialização
function initializeApp() {
    // Carregar dados do localStorage ou usar dados iniciais
    loadData();
    
    // Configurar a data atual
    setCurrentDate();
    
    // Preencher os dropdowns de serviços
    populateServiceDropdowns();
    
    // Atualizar o resumo do dia
    updateDaySummary();
}

// Configurar listeners de eventos
function setupEventListeners() {
    // Atualizar valor total quando serviços são selecionados
    service1El.addEventListener('change', calculateTotal);
    service2El.addEventListener('change', calculateTotal);
    service3El.addEventListener('change', calculateTotal);
    
    // Botão de registro
    registerButtonEl.addEventListener('click', registerService);
}

// Carregar dados do localStorage
function loadData() {
    // Tentar carregar serviços
    const savedServices = localStorage.getItem('barbershopServices');
    services = savedServices ? JSON.parse(savedServices) : initialServices;
    
    // Tentar carregar registros
    const savedRecords = localStorage.getItem('barbershopRecords');
    records = savedRecords ? JSON.parse(savedRecords) : [];
    
    // Processar dados semanais
    processWeeklyData();
}

// Salvar dados no localStorage
function saveData() {
    localStorage.setItem('barbershopServices', JSON.stringify(services));
    localStorage.setItem('barbershopRecords', JSON.stringify(records));
}

// Configurar a data atual
function setCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    currentDateEl.value = `${day}/${month}/${year}`;
}

// Preencher os dropdowns de serviços
function populateServiceDropdowns() {
    // Limpar opções existentes
    service1El.innerHTML = '<option value="">Selecione um serviço</option>';
    service2El.innerHTML = '<option value="">Selecione um serviço</option>';
    service3El.innerHTML = '<option value="">Selecione um serviço</option>';
    
    // Adicionar opções de serviços
    services.forEach(service => {
        const option1 = document.createElement('option');
        option1.value = service.name;
        option1.textContent = service.name;
        service1El.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = service.name;
        option2.textContent = service.name;
        service2El.appendChild(option2);
        
        const option3 = document.createElement('option');
        option3.value = service.name;
        option3.textContent = service.name;
        service3El.appendChild(option3);
    });
}

// Calcular o valor total com base nos serviços selecionados
function calculateTotal() {
    let total = 0;
    
    // Adicionar valor do serviço 1 se selecionado
    if (service1El.value) {
        const service = services.find(s => s.name === service1El.value);
        if (service && service.name !== "Nenhum") {
            total += service.price;
        }
    }
    
    // Adicionar valor do serviço 2 se selecionado
    if (service2El.value) {
        const service = services.find(s => s.name === service2El.value);
        if (service && service.name !== "Nenhum") {
            total += service.price;
        }
    }
    
    // Adicionar valor do serviço 3 se selecionado
    if (service3El.value) {
        const service = services.find(s => s.name === service3El.value);
        if (service && service.name !== "Nenhum") {
            total += service.price;
        }
    }
    
    // Atualizar o campo de valor total
    totalValueEl.value = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Registrar um novo serviço
function registerService() {
    // Verificar se pelo menos um serviço foi selecionado
    const selectedServices = [];
    if (service1El.value && service1El.value !== "Nenhum") selectedServices.push(service1El.value);
    if (service2El.value && service2El.value !== "Nenhum") selectedServices.push(service2El.value);
    if (service3El.value && service3El.value !== "Nenhum") selectedServices.push(service3El.value);
    
    if (selectedServices.length === 0) {
        alert('Por favor, selecione pelo menos um serviço válido antes de registrar.');
        return;
    }
    
    // Verificar se a forma de pagamento foi selecionada
    if (!paymentMethodEl.value) {
        alert('Por favor, selecione a forma de pagamento antes de registrar.');
        return;
    }
    
    // Obter o valor total (remover "R$ " e converter para número)
    const totalValue = parseFloat(totalValueEl.value.replace('R$ ', '').replace(',', '.'));
    
    // Criar o novo registro
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const newRecord = {
        date: formattedDate,
        displayDate: currentDateEl.value,
        services: selectedServices.join(', '),
        payment: paymentMethodEl.value,
        value: totalValue
    };
    
    // Adicionar o registro à lista
    records.push(newRecord);
    
    // Salvar dados atualizados
    saveData();
    
    // Atualizar o resumo do dia
    updateDaySummary();
    
    // Processar dados semanais
    processWeeklyData();
    
    // Limpar os campos de seleção
    service1El.value = '';
    service2El.value = '';
    service3El.value = '';
    paymentMethodEl.value = '';
    totalValueEl.value = 'R$ 0,00';
    
    // Mostrar mensagem de sucesso
    alert('Serviço registrado com sucesso!');
}

// Atualizar o resumo do dia
function updateDaySummary() {
    // Obter a data atual no formato YYYY-MM-DD
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Filtrar registros do dia atual
    const todayRecords = records.filter(record => record.date === formattedDate);
    
    // Calcular o total do dia
    const dayTotal = todayRecords.reduce((sum, record) => sum + record.value, 0);
    dayTotalValueEl.textContent = `R$ ${dayTotal.toFixed(2).replace('.', ',')}`;
    
    // Atualizar a lista de serviços do dia
    if (todayRecords.length > 0) {
        servicesListEl.innerHTML = '';
        
        todayRecords.forEach(record => {
            const row = document.createElement('tr');
            
            const servicesCell = document.createElement('td');
            servicesCell.textContent = record.services;
            row.appendChild(servicesCell);
            
            const paymentCell = document.createElement('td');
            paymentCell.textContent = record.payment;
            row.appendChild(paymentCell);
            
            const valueCell = document.createElement('td');
            valueCell.textContent = `R$ ${record.value.toFixed(2).replace('.', ',')}`;
            row.appendChild(valueCell);
            
            servicesListEl.appendChild(row);
        });
    } else {
        servicesListEl.innerHTML = '<tr class="no-records"><td colspan="3">Nenhum registro hoje</td></tr>';
    }
}

// Processar dados semanais
function processWeeklyData() {
    // Resetar dados semanais
    weeklyData = {};
    
    // Obter a data atual
    const today = new Date();
    
    // Calcular o início da semana (domingo)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    // Calcular o fim da semana (sábado)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    // Formatar datas para comparação
    const startDate = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;
    const endDate = `${endOfWeek.getFullYear()}-${String(endOfWeek.getMonth() + 1).padStart(2, '0')}-${String(endOfWeek.getDate()).padStart(2, '0')}`;
    
    // Filtrar registros da semana atual
    const weekRecords = records.filter(record => record.date >= startDate && record.date <= endDate);
    
    // Agrupar por dia da semana
    weekRecords.forEach(record => {
        const recordDate = new Date(record.date);
        const dayOfWeek = recordDate.getDay(); // 0 = Domingo, 1 = Segunda, ...
        
        // Inicializar o dia se não existir
        if (!weeklyData[dayOfWeek]) {
            weeklyData[dayOfWeek] = {
                displayDate: record.displayDate,
                total: 0
            };
        }
        
        // Adicionar valor ao total do dia
        weeklyData[dayOfWeek].total += record.value;
    });
    
    // Atualizar a tabela semanal
    updateWeeklySummary();
}

// Atualizar o resumo semanal
function updateWeeklySummary() {
    // Limpar a tabela
    weeklyListEl.innerHTML = '';
    
    // Nomes dos dias da semana
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    // Variável para o total da semana
    let weekTotal = 0;
    
    // Adicionar uma linha para cada dia da semana
    for (let i = 0; i < 7; i++) {
        const row = document.createElement('tr');
        
        const dayCell = document.createElement('td');
        dayCell.textContent = dayNames[i];
        row.appendChild(dayCell);
        
        const totalCell = document.createElement('td');
        
        if (weeklyData[i]) {
            totalCell.textContent = `R$ ${weeklyData[i].total.toFixed(2).replace('.', ',')}`;
            weekTotal += weeklyData[i].total;
        } else {
            totalCell.textContent = 'R$ 0,00';
        }
        
        row.appendChild(totalCell);
        weeklyListEl.appendChild(row);
    }
    
    // Atualizar o total da semana
    weekTotalEl.textContent = `R$ ${weekTotal.toFixed(2).replace('.', ',')}`;
}

// Função para mostrar/ocultar o resumo semanal
function toggleWeeklySummary() {
    const weeklySummary = document.getElementById('weekly-summary');
    weeklySummary.style.display = weeklySummary.style.display === 'none' ? 'block' : 'none';
}