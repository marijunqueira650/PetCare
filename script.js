// ============ BANCO DE DADOS (LocalStorage) ============
const DB = {
  get(key) { return JSON.parse(localStorage.getItem('petcare_' + key) || '[]'); },
  set(key, val) { localStorage.setItem('petcare_' + key, JSON.stringify(val)); }
};

// Dados iniciais
if (!localStorage.getItem('petcare_initialized')) {
  DB.set('clientes', [
    { nome: 'Maria Silva', cpf: '111.111.111-11', telefone: '(16) 99999-1111', email: 'maria@email.com', endereco: 'Rua A, 100' },
    { nome: 'João Santos', cpf: '222.222.222-22', telefone: '(16) 99999-2222', email: 'joao@email.com', endereco: 'Rua B, 200' }
  ]);
  DB.set('pets', [
    { nome: 'Rex', tutor: '111.111.111-11', especie: 'Cão', raca: 'Labrador', nascimento: '2020-05-10', peso: 25, vacinas: [{ nome: 'Antirrábica', lote: 'AR123', data: '2026-03-15', proxima: '2027-03-15' }] },
    { nome: 'Mia', tutor: '222.222.222-22', especie: 'Gato', raca: 'Siamês', nascimento: '2022-08-20', peso: 4, vacinas: [{ nome: 'Antirrábica', lote: 'AR456', data: '2026-06-10', proxima: '2027-06-10' }] }
  ]);
  DB.set('produtos', [
    { codigo: 'P001', nome: 'Ração Premium 15kg', preco: 180.00, qtd: 25, minimo: 10 },
    { codigo: 'P002', nome: 'Shampoo Pet 500ml', preco: 35.00, qtd: 8, minimo: 10 },
    { codigo: 'P003', nome: 'Coleira Antipulgas', preco: 65.00, qtd: 15, minimo: 5 },
    { codigo: 'P004', nome: 'Brinquedo Mordedor', preco: 25.00, qtd: 3, minimo: 5 }
  ]);
  DB.set('agendamentos', []);
  DB.set('atendimentos', []);
  DB.set('vendas', []);
  localStorage.setItem('petcare_initialized', 'true');
}

const USUARIOS = {
  atendente: { senha: '123', perfil: 'Atendente', nome: 'Atendente' },
  veterinario: { senha: '123', perfil: 'Veterinário', nome: 'Dr. Carlos' },
  tosador: { senha: '123', perfil: 'Tosador', nome: 'Ana' },
  gerente: { senha: '123', perfil: 'Gerente', nome: 'Gerente' }
};

let usuarioAtual = null;
let carrinhoAtual = [];
let horarioSelecionado = null;

// ============ LOGIN ============
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;

  if (USUARIOS[user] && USUARIOS[user].senha === pass) {
    usuarioAtual = { login: user, ...USUARIOS[user] };
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userInfo').textContent = `👤 ${usuarioAtual.nome} (${usuarioAtual.perfil})`;
    atualizarTudo();
  } else {
    alert('❌ Usuário ou senha inválidos!');
  }
});

function logout() {
  usuarioAtual = null;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginForm').reset();
}

// ============ NAVEGAÇÃO ============
function showModule(id) {
  document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelector(`[data-module="${id}"]`).classList.add('active');
  atualizarTudo();
}

function atualizarTudo() {
  renderHome();
  renderClientes();
  renderPets();
  renderAgendamentos();
  renderAtendimentos();
  renderProdutos();
  renderVendas();
  carregarSelects();
}

// ============ HOME ============
function renderHome() {
  const clientes = DB.get('clientes');
  const pets = DB.get('pets');
  const agendamentos = DB.get('agendamentos');
  const vendas = DB.get('vendas');
  const produtos = DB.get('produtos');

  const hoje = new Date().toISOString().split('T')[0];
  const agHoje = agendamentos.filter(a => a.data === hoje);
  const totalVendas = vendas.reduce((s, v) => s + v.total, 0);

  document.getElementById('statsGrid').innerHTML = `
    <div class="stat-card"><div class="icon">👥</div><div class="value">${clientes.length}</div><div class="label">Clientes</div></div>
    <div class="stat-card"><div class="icon">🐾</div><div class="value">${pets.length}</div><div class="label">Pets</div></div>
    <div class="stat-card"><div class="icon">📅</div><div class="value">${agHoje.length}</div><div class="label">Agendamentos Hoje</div></div>
    <div class="stat-card"><div class="icon">💰</div><div class="value">R$ ${totalVendas.toFixed(2)}</div><div class="label">Total em Vendas</div></div>
  `;

  if (agHoje.length === 0) {
    document.getElementById('todayAppointments').innerHTML = '<p style="color:#64748b; text-align:center; padding:15px;">Nenhum agendamento para hoje.</p>';
  } else {
    let html = '<table><tr><th>Horário</th><th>Pet</th><th>Serviço</th><th>Profissional</th><th>Status</th></tr>';
    agHoje.forEach(a => {
      html += `<tr><td>${a.horario}</td><td>${a.pet}</td><td>${a.servico}</td><td>${a.profissional}</td><td><span class="badge badge-info">${a.status}</span></td></tr>`;
    });
    html += '</table>';
    document.getElementById('todayAppointments').innerHTML = html;
  }

  const alertas = produtos.filter(p => p.qtd <= p.minimo);
  if (alertas.length === 0) {
    document.getElementById('stockAlerts').innerHTML = '<div class="alert alert-success">✅ Todos os produtos estão com estoque adequado.</div>';
  } else {
    let html = '';
    alertas.forEach(p => {
      html += `<div class="alert ${p.qtd === 0 ? 'alert-danger' : 'alert-warning'}">⚠️ <strong>${p.nome}</strong> - Estoque: ${p.qtd} (mínimo: ${p.minimo})</div>`;
    });
    document.getElementById('stockAlerts').innerHTML = html;
  }
}

// ============ CLIENTES ============
function normalizarCPF(cpf) {
  return String(cpf || '').replace(/\D/g, '');
}

function formatarCPF(cpf) {
  const digitos = normalizarCPF(cpf);
  if (digitos.length !== 11) return cpf;
  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function cpfValido(cpf) {
  const digitos = normalizarCPF(cpf);
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) return false;

  const calcularDigito = (base, pesoInicial) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (pesoInicial - i);
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return calcularDigito(digitos.slice(0, 9), 10) === Number(digitos[9])
    && calcularDigito(digitos.slice(0, 10), 11) === Number(digitos[10]);
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function telefoneValido(telefone) {
  if (!/^[\d\s()+.-]+$/.test(telefone)) return false;

  const digitos = telefone.replace(/\D/g, '');
  const numeroNacional = digitos.startsWith('55') && [12, 13].includes(digitos.length)
    ? digitos.slice(2)
    : digitos;

  return [10, 11].includes(numeroNacional.length);
}

function salvarCliente() {
  const nome = document.getElementById('cliNome').value.trim();
  const cpfInformado = document.getElementById('cliCpf').value.trim();
  const cpf = normalizarCPF(cpfInformado);
  const telefone = document.getElementById('cliTelefone').value.trim();
  const email = document.getElementById('cliEmail').value.trim();
  const endereco = document.getElementById('cliEndereco').value.trim();

  if (!nome || !cpfInformado) { alert('❌ Nome e CPF são obrigatórios!'); return; }
  if (!cpfValido(cpfInformado)) { alert('❌ Informe um CPF válido!'); return; }
  if (email && !emailValido(email)) { alert('❌ Informe um e-mail válido!'); return; }
  if (telefone && !telefoneValido(telefone)) {
    alert('❌ Informe um telefone válido com DDD!');
    return;
  }

  const clientes = DB.get('clientes');
  if (clientes.some(c => normalizarCPF(c.cpf) === cpf)) {
    alert('❌ Já existe um cliente com este CPF! (RN01)');
    return;
  }

  clientes.push({ nome, cpf, telefone, email, endereco });
  DB.set('clientes', clientes);

  ['cliNome', 'cliCpf', 'cliTelefone', 'cliEmail', 'cliEndereco'].forEach(id => document.getElementById(id).value = '');
  alert('✅ Cliente cadastrado com sucesso!');
  atualizarTudo();
}

function renderClientes() {
  const clientes = DB.get('clientes');
  const busca = (document.getElementById('buscaCliente')?.value || '').toLowerCase();
  const buscaCPF = normalizarCPF(busca);
  const filtrados = clientes.filter(c => c.nome.toLowerCase().includes(busca)
    || (buscaCPF && normalizarCPF(c.cpf).includes(buscaCPF)));

  if (filtrados.length === 0) {
    document.getElementById('listaClientes').innerHTML = '<p style="color:#64748b; text-align:center; padding:15px;">Nenhum cliente encontrado.</p>';
    return;
  }

  let html = '<table><tr><th>Nome</th><th>CPF</th><th>Telefone</th><th>E-mail</th><th>Ações</th></tr>';
  filtrados.forEach(c => {
    html += `<tr>
      <td>${c.nome}</td><td>${formatarCPF(c.cpf)}</td><td>${c.telefone || '-'}</td><td>${c.email || '-'}</td>
      <td>
        <button class="btn btn-small btn-secondary" onclick="verHistoricoCliente('${c.cpf}')">📋 Histórico</button>
        <button class="btn btn-small btn-danger" onclick="excluirCliente('${c.cpf}')">🗑️</button>
      </td>
    </tr>`;
  });
  html += '</table>';
  document.getElementById('listaClientes').innerHTML = html;
}

function excluirCliente(cpf) {
  const cpfNormalizado = normalizarCPF(cpf);
  const temPetsVinculados = DB.get('pets').some(p => normalizarCPF(p.tutor) === cpfNormalizado);
  if (temPetsVinculados) {
    alert('Não é possível excluir este cliente enquanto houver pets vinculados. Remova os pets antes de excluir o cliente.');
    return;
  }

  if (!confirm('Excluir este cliente?')) return;
  DB.set('clientes', DB.get('clientes').filter(c => normalizarCPF(c.cpf) !== cpfNormalizado));
  atualizarTudo();
}

function verHistoricoCliente(cpf) {
  const cliente = DB.get('clientes').find(c => normalizarCPF(c.cpf) === normalizarCPF(cpf));
  const pets = DB.get('pets').filter(p => normalizarCPF(p.tutor) === normalizarCPF(cpf));
  const atendimentos = DB.get('atendimentos').filter(a => pets.some(p => p.nome === a.pet));
  const agendamentos = DB.get('agendamentos').filter(a => pets.some(p => p.nome === a.pet));

  let html = `<p><strong>Cliente:</strong> ${cliente.nome}</p><p><strong>CPF:</strong> ${formatarCPF(cliente.cpf)}</p><hr style="margin:10px 0; border:none; border-top:1px solid #e5e7eb;">`;
  html += `<h4 style="color:#2563eb; margin:12px 0;">🐾 Pets (${pets.length})</h4>`;
  pets.forEach(p => { html += `<p>• ${p.nome} (${p.especie} - ${p.raca})</p>`; });
  html += `<h4 style="color:#2563eb; margin:12px 0;">📅 Agendamentos (${agendamentos.length})</h4>`;
  agendamentos.forEach(a => { html += `<p>• ${a.data} ${a.horario} - ${a.servico} (${a.status})</p>`; });
  html += `<h4 style="color:#2563eb; margin:12px 0;">🩺 Atendimentos (${atendimentos.length})</h4>`;
  atendimentos.forEach(a => { html += `<p>• ${a.data} - ${a.pet}: ${a.diagnostico}</p>`; });

  abrirModal('Histórico do Cliente', html);
}

// ============ PETS ============
function salvarPet() {
  const nome = document.getElementById('petNome').value.trim();
  const tutor = normalizarCPF(document.getElementById('petTutor').value.trim());
  const especie = document.getElementById('petEspecie').value;
  const raca = document.getElementById('petRaca').value.trim();
  const nascimento = document.getElementById('petNasc').value;
  const pesoInformado = document.getElementById('petPeso').value;
  const peso = pesoInformado === '' ? null : Number(pesoInformado);

  if (!nome || !tutor) { alert('❌ Nome e tutor são obrigatórios!'); return; }

  if (nascimento) {
    const dataNascimento = new Date(`${nascimento}T00:00:00`);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (Number.isNaN(dataNascimento.getTime()) || dataNascimento > hoje) {
      alert('❌ A data de nascimento não pode estar no futuro!');
      return;
    }
  }

  if (pesoInformado !== '' && (!Number.isFinite(peso) || peso <= 0)) {
    alert('❌ O peso deve ser maior que zero!');
    return;
  }

  const clientes = DB.get('clientes');
  if (!clientes.some(c => normalizarCPF(c.cpf) === tutor)) {
    alert('❌ Tutor não encontrado! Cadastre o cliente primeiro. (RN02)');
    return;
  }

  const pets = DB.get('pets');
  pets.push({ nome, tutor, especie, raca, nascimento: nascimento || null, peso, vacinas: [] });
  DB.set('pets', pets);

  ['petNome', 'petTutor', 'petRaca', 'petNasc', 'petPeso'].forEach(id => document.getElementById(id).value = '');
  alert('✅ Pet cadastrado com sucesso!');
  atualizarTudo();
}

function renderPets() {
  const pets = DB.get('pets');
  const clientes = DB.get('clientes');
  const busca = (document.getElementById('buscaPet')?.value || '').toLowerCase();
  const especie = document.getElementById('filtroEspecie')?.value || '';
  const filtrados = pets.filter(p => {
    const tutor = clientes.find(c => normalizarCPF(c.cpf) === normalizarCPF(p.tutor));
    const correspondeBusca = p.nome.toLowerCase().includes(busca)
      || (tutor && tutor.nome.toLowerCase().includes(busca));
    return correspondeBusca && (!especie || p.especie === especie);
  });

  if (filtrados.length === 0) {
    document.getElementById('listaPets').innerHTML = '<p style="color:#64748b; text-align:center; padding:15px;">Nenhum pet encontrado.</p>';
    return;
  }

  let html = '<table><tr><th>Nome</th><th>Espécie</th><th>Raça</th><th>Tutor</th><th>Peso</th><th>Vacinas</th><th>Ações</th></tr>';
  filtrados.forEach(p => {
    const tutor = clientes.find(c => normalizarCPF(c.cpf) === normalizarCPF(p.tutor));
    html += `<tr>
      <td>${p.nome}</td><td>${p.especie}</td><td>${p.raca || '-'}</td>
      <td>${tutor ? tutor.nome : p.tutor}</td><td>${p.peso || '-'} kg</td>
      <td>${p.vacinas ? p.vacinas.length : 0}</td>
      <td>
        <button class="btn btn-small btn-secondary" onclick="verHistoricoPet('${p.nome}')">📋 Histórico</button>
        <button class="btn btn-small btn-danger" onclick="excluirPet('${p.nome}')">🗑️</button>
      </td>
    </tr>`;
  });
  html += '</table>';
  document.getElementById('listaPets').innerHTML = html;
}

function excluirPet(nome) {
  if (!confirm('Excluir este pet?')) return;
  DB.set('pets', DB.get('pets').filter(p => p.nome !== nome));
  atualizarTudo();
}

function verHistoricoPet(nome) {
  const pet = DB.get('pets').find(p => p.nome === nome);
  const atendimentos = DB.get('atendimentos').filter(a => a.pet === nome);
  const agendamentos = DB.get('agendamentos').filter(a => a.pet === nome);

  let html = `<h4 style="color:#2563eb;">🐾 ${pet.nome}</h4>`;
  html += `<p>${pet.especie} - ${pet.raca || '-'} | Peso: ${pet.peso || '-'} kg</p><hr style="margin:10px 0; border:none; border-top:1px solid #e5e7eb;">`;

  html += `<h4 style="color:#2563eb; margin:12px 0;">💉 Vacinas</h4>`;
  if (!pet.vacinas || pet.vacinas.length === 0) {
    html += '<p style="color:#64748b;">Nenhuma vacina registrada.</p>';
  } else {
    pet.vacinas.forEach(v => {
      html += `<p>• ${v.nome} (Lote: ${v.lote}) - Aplicada em: ${v.data} | Próxima: ${v.proxima}</p>`;
    });
  }

  html += `<h4 style="color:#2563eb; margin:12px 0;">📅 Agendamentos</h4>`;
  if (agendamentos.length === 0) html += '<p style="color:#64748b;">Nenhum agendamento.</p>';
  agendamentos.forEach(a => { html += `<p>• ${a.data} ${a.horario} - ${a.servico} (${a.status})</p>`; });

  html += `<h4 style="color:#2563eb; margin:12px 0;">🩺 Atendimentos</h4>`;
  if (atendimentos.length === 0) html += '<p style="color:#64748b;">Nenhum atendimento.</p>';
  atendimentos.forEach(a => { html += `<p>• ${a.data} - Diagnóstico: ${a.diagnostico}</p>`; });

  abrirModal('Histórico do Pet', html);
}

// ============ AGENDAMENTOS ============
function carregarPetsCliente() {
  const cpf = normalizarCPF(document.getElementById('agCliente').value.trim());
  const pets = DB.get('pets').filter(p => normalizarCPF(p.tutor) === cpf);
  const select = document.getElementById('agPet');
  if (pets.length === 0) {
    select.innerHTML = '<option>Nenhum pet encontrado</option>';
  } else {
    select.innerHTML = pets.map(p => `<option value="${p.nome}">${p.nome} (${p.especie})</option>`).join('');
  }
}

function renderHorarios() {
  const data = document.getElementById('agData').value;
  const profissional = document.getElementById('agProfissional').value;
  const agendamentos = DB.get('agendamentos');

  const horarios = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const ocupados = agendamentos.filter(a => a.data === data && a.profissional === profissional && a.status !== 'Cancelado').map(a => a.horario);

  let html = '';
  horarios.forEach(h => {
    const ocup = ocupados.includes(h);
    html += `<div class="time-slot ${ocup ? 'occupied' : ''}" onclick="${ocup ? '' : `selecionarHorario('${h}', this)`}">${h}${ocup ? ' ❌' : ''}</div>`;
  });
  document.getElementById('horarios').innerHTML = html;
  horarioSelecionado = null;
}

function selecionarHorario(h, el) {
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  horarioSelecionado = h;
}

function salvarAgendamento() {
  const cpf = normalizarCPF(document.getElementById('agCliente').value.trim());
  const pet = document.getElementById('agPet').value;
  const servico = document.getElementById('agServico').value;
  const profissional = document.getElementById('agProfissional').value;
  const data = document.getElementById('agData').value;

  if (!cpf || !pet || !data || !horarioSelecionado) {
    alert('❌ Preencha todos os campos e selecione um horário!');
    return;
  }

  const dataAgendamento = new Date(`${data}T00:00:00`);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (Number.isNaN(dataAgendamento.getTime()) || dataAgendamento < hoje) {
    alert('❌ Não é possível agendar em uma data passada!');
    return;
  }

  if (servico.includes('Banho') || servico.includes('Tosa')) {
    const petObj = DB.get('pets').find(p => p.nome === pet);
    const hoje = new Date().toISOString().split('T')[0];
    const temVacina = petObj.vacinas && petObj.vacinas.some(v => v.nome === 'Antirrábica' && v.proxima >= hoje);
    if (!temVacina) {
      alert('❌ Este pet não possui vacina antirrábica em dia! (RN05)');
      return;
    }
  }

  const agendamentos = DB.get('agendamentos');
  if (agendamentos.some(a => a.data === data && a.horario === horarioSelecionado && a.profissional === profissional && a.status !== 'Cancelado')) {
    alert('❌ Este horário já está ocupado para este profissional! (RN03)');
    return;
  }

  agendamentos.push({
    cliente: cpf, pet, servico, profissional, data, horario: horarioSelecionado,
    status: 'Agendado', criadoEm: new Date().toISOString()
  });
  DB.set('agendamentos', agendamentos);

  alert('✅ Agendamento confirmado!');
  document.getElementById('agCliente').value = '';
  document.getElementById('agData').value = '';
  document.getElementById('horarios').innerHTML = '';
  horarioSelecionado = null;
  atualizarTudo();
}

function renderAgendamentos() {
  const agendamentos = DB.get('agendamentos');
  const inicio = document.getElementById('filtroAgendaInicio').value;
  const fim = document.getElementById('filtroAgendaFim').value;
  const status = document.getElementById('filtroAgendaStatus').value;
  const filtrados = agendamentos.filter(a =>
    (!inicio || a.data >= inicio)
    && (!fim || a.data <= fim)
    && (!status || a.status === status)
  );

  if (filtrados.length === 0) {
    document.getElementById('listaAgendamentos').innerHTML = '<p style="color:#64748b; text-align:center; padding:15px;">Nenhum agendamento encontrado.</p>';
    return;
  }

  let html = '<table><tr><th>Data</th><th>Horário</th><th>Pet</th><th>Serviço</th><th>Profissional</th><th>Status</th><th>Ações</th></tr>';
  filtrados.sort((a, b) => (b.data + b.horario).localeCompare(a.data + a.horario)).forEach(a => {
    const badge = a.status === 'Agendado' ? 'badge-info' : a.status === 'Cancelado' ? 'badge-danger' : 'badge-success';
    html += `<tr>
      <td>${a.data}</td><td>${a.horario}</td><td>${a.pet}</td><td>${a.servico}</td><td>${a.profissional}</td>
      <td><span class="badge ${badge}">${a.status}</span></td>
      <td>
        ${a.status === 'Agendado' ? `
          <button class="btn btn-small btn-danger" onclick="cancelarAgendamento('${a.criadoEm}')">Cancelar</button>
          <button class="btn btn-small btn-success" onclick="concluirAgendamento('${a.criadoEm}')">Concluir</button>
        ` : ''}
      </td>
    </tr>`;
  });
  html += '</table>';
  document.getElementById('listaAgendamentos').innerHTML = html;
}

function concluirAgendamento(criadoEm) {
  const agendamentos = DB.get('agendamentos');
  const agendamento = agendamentos.find(a => a.criadoEm === criadoEm);
  if (!agendamento) {
    alert('❌ Agendamento não encontrado!');
    return;
  }
  if (agendamento.status !== 'Agendado') {
    alert('❌ Apenas agendamentos ativos podem ser concluídos!');
    return;
  }

  const dataAgendamento = new Date(`${agendamento.data}T${agendamento.horario}`);
  if (Number.isNaN(dataAgendamento.getTime()) || dataAgendamento > new Date()) {
    alert('❌ Só é possível concluir um agendamento depois do horário marcado!');
    return;
  }
  if (!confirm('Marcar este agendamento como concluído?')) return;

  agendamento.status = 'Concluído';
  DB.set('agendamentos', agendamentos);
  atualizarTudo();
}

function cancelarAgendamento(criadoEm) {
  const agendamentos = DB.get('agendamentos');
  const ag = agendamentos.find(a => a.criadoEm === criadoEm);
  if (!ag) return;

  const dataAg = new Date(ag.data + 'T' + ag.horario);
  const agora = new Date();
  const diff = (dataAg - agora) / (1000 * 60 * 60);
  if (diff < 2) {
    alert('❌ O cancelamento deve ser feito com pelo menos 2 horas de antecedência! (RN04)');
    return;
  }

  if (!confirm('Cancelar este agendamento?')) return;
  ag.status = 'Cancelado';
  DB.set('agendamentos', agendamentos);
  atualizarTudo();
}

// ============ ATENDIMENTOS ============
function toggleVacina() {
  document.getElementById('vacinaFields').style.display = document.getElementById('atVacina').checked ? 'block' : 'none';
}

function salvarAtendimento() {
  if (usuarioAtual.perfil !== 'Veterinário') {
    alert('❌ Somente veterinários podem registrar atendimentos! (RN06)');
    return;
  }

  const pet = document.getElementById('atPet').value;
  const diagnostico = document.getElementById('atDiagnostico').value.trim();
  const tratamento = document.getElementById('atTratamento').value.trim();
  const valorInformado = document.getElementById('atValor').value;
  const valor = valorInformado === '' ? 0 : Number(valorInformado);

  if (!pet || !diagnostico) { alert('❌ Pet e diagnóstico são obrigatórios!'); return; }
  if (!Number.isFinite(valor) || valor < 0) {
    alert('❌ O valor do atendimento não pode ser negativo!');
    return;
  }

  const atendimentos = DB.get('atendimentos');
  const atendimento = {
    pet, diagnostico, tratamento, valor,
    data: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    veterinario: usuarioAtual.nome
  };

  if (document.getElementById('atVacina').checked) {
    const vacNome = document.getElementById('vacNome').value.trim();
    const vacLote = document.getElementById('vacLote').value.trim();
    const vacProxima = document.getElementById('vacProxima').value;
    if (!vacNome || !vacLote || !vacProxima) {
      alert('❌ Preencha todos os dados da vacina! (RN10)');
      return;
    }
    const dataAplicacao = new Date(`${atendimento.data}T00:00:00`);
    const proximaDose = new Date(`${vacProxima}T00:00:00`);
    if (Number.isNaN(proximaDose.getTime()) || proximaDose <= dataAplicacao) {
      alert('❌ A próxima dose deve ser posterior à data da aplicação!');
      return;
    }

    atendimento.vacina = { nome: vacNome, lote: vacLote, data: atendimento.data, proxima: vacProxima };

    const pets = DB.get('pets');
    const petObj = pets.find(p => p.nome === pet);
    if (!petObj.vacinas) petObj.vacinas = [];
    petObj.vacinas.push(atendimento.vacina);
    DB.set('pets', pets);
  }

  atendimentos.push(atendimento);
  DB.set('atendimentos', atendimentos);

  ['atDiagnostico', 'atTratamento', 'atValor', 'vacNome', 'vacLote', 'vacProxima'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('atVacina').checked = false;
  document.getElementById('vacinaFields').style.display = 'none';

  alert('✅ Atendimento registrado!');
  atualizarTudo();
}

function renderAtendimentos() {
  const atendimentos = DB.get('atendimentos');
  if (atendimentos.length === 0) {
    document.getElementById('listaAtendimentos').innerHTML = '<p style="color:#64748b; text-align:center; padding:15px;">Nenhum atendimento registrado.</p>';
    return;
  }

  let html = '<table><tr><th>Data</th><th>Pet</th><th>Diagnóstico</th><th>Veterinário</th><th>Valor</th><th>Vacina</th></tr>';
  atendimentos.sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora)).forEach(a => {
    html += `<tr>
      <td>${a.data} ${a.hora}</td><td>${a.pet}</td><td>${a.diagnostico}</td><td>${a.veterinario}</td>
      <td>R$ ${a.valor.toFixed(2)}</td>
      <td>${a.vacina ? `<span class="badge badge-success">💉 ${a.vacina.nome}</span>` : '-'}</td>
    </tr>`;
  });
  html += '</table>';
  document.getElementById('listaAtendimentos').innerHTML = html;
}

// ============ PRODUTOS ============
function salvarProduto() {
  const codigo = document.getElementById('prodCodigo').value.trim();
  const nome = document.getElementById('prodNome').value.trim();
  const preco = parseFloat(document.getElementById('prodPreco').value);
  const qtd = parseInt(document.getElementById('prodQtd').value);
  const minimo = parseInt(document.getElementById('prodMin').value);

  if (!codigo || !nome || isNaN(preco)) { alert('❌ Preencha todos os campos!'); return; }

  const produtos = DB.get('produtos');
  produtos.push({ codigo, nome, preco, qtd: qtd || 0, minimo: minimo || 0 });
  DB.set('produtos', produtos);

  ['prodCodigo', 'prodNome', 'prodPreco', 'prodQtd', 'prodMin'].forEach(id => document.getElementById(id).value = '');
  alert('✅ Produto cadastrado!');
  atualizarTudo();
}

function renderProdutos() {
  const produtos = DB.get('produtos');
  const busca = (document.getElementById('buscaProduto')?.value || '').toLowerCase();
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(busca) || p.codigo.toLowerCase().includes(busca));

  if (filtrados.length === 0) {
    document.getElementById('listaProdutos').innerHTML = '<p style="color:#64748b; text-align:center; padding:15px;">Nenhum produto.</p>';
    return;
  }

  let html = '<table><tr><th>Código</th><th>Nome</th><th>Preço</th><th>Estoque</th><th>Mínimo</th><th>Status</th><th>Ações</th></tr>';
  filtrados.forEach(p => {
    let status, badge;
    if (p.qtd === 0) { status = 'Sem estoque'; badge = 'badge-danger'; }
    else if (p.qtd <= p.minimo) { status = 'Estoque baixo'; badge = 'badge-warning'; }
    else { status = 'Normal'; badge = 'badge-success'; }

    html += `<tr>
      <td>${p.codigo}</td><td>${p.nome}</td><td>R$ ${p.preco.toFixed(2)}</td>
      <td>${p.qtd}</td><td>${p.minimo}</td>
      <td><span class="badge ${badge}">${status}</span></td>
      <td>
        <button class="btn btn-small btn-secondary" onclick="ajustarEstoque('${p.codigo}')">📦 Ajustar</button>
        <button class="btn btn-small btn-danger" onclick="excluirProduto('${p.codigo}')">🗑️</button>
      </td>
    </tr>`;
  });
  html += '</table>';
  document.getElementById('listaProdutos').innerHTML = html;
}

function ajustarEstoque(codigo) {
  const qtd = prompt('Nova quantidade em estoque:');
  if (qtd === null) return;
  const produtos = DB.get('produtos');
  const p = produtos.find(p => p.codigo === codigo);
  p.qtd = parseInt(qtd);
  DB.set('produtos', produtos);

  if (p.qtd <= p.minimo) {
    alert(`⚠️ ALERTA: "${p.nome}" está com estoque baixo! (RF13)`);
  } else {
    alert('✅ Estoque atualizado!');
  }
  atualizarTudo();
}

function excluirProduto(codigo) {
  if (!confirm('Excluir este produto?')) return;
  DB.set('produtos', DB.get('produtos').filter(p => p.codigo !== codigo));
  atualizarTudo();
}

// ============ VENDAS ============
function carregarSelects() {
  const produtos = DB.get('produtos');
  const selectProd = document.getElementById('vendaProduto');
  if (selectProd) {
    selectProd.innerHTML = produtos.map(p => `<option value="${p.codigo}">${p.nome} - R$ ${p.preco.toFixed(2)} (est: ${p.qtd})</option>`).join('');
  }

  const pets = DB.get('pets');
  const selectPet = document.getElementById('atPet');
  if (selectPet) {
    selectPet.innerHTML = pets.map(p => `<option value="${p.nome}">${p.nome} (${p.especie})</option>`).join('');
  }
}

function mostrarPrecoProduto() { }

function adicionarItemVenda() {
  const codigo = document.getElementById('vendaProduto').value;
  const qtd = parseInt(document.getElementById('vendaQtd').value);
  if (!codigo || !qtd) return;

  const produtos = DB.get('produtos');
  const prod = produtos.find(p => p.codigo === codigo);

  const jaNoCarrinho = carrinhoAtual.find(i => i.codigo === codigo);
  const qtdJa = jaNoCarrinho ? jaNoCarrinho.qtd : 0;
  if (qtdJa + qtd > prod.qtd) {
    alert(`❌ Estoque insuficiente! Disponível: ${prod.qtd - qtdJa} (RN07)`);
    return;
  }

  if (jaNoCarrinho) {
    jaNoCarrinho.qtd += qtd;
  } else {
    carrinhoAtual.push({ codigo, nome: prod.nome, preco: prod.preco, qtd });
  }

  renderCarrinho();
}

function renderCarrinho() {
  const div = document.getElementById('carrinho');
  if (carrinhoAtual.length === 0) {
    div.innerHTML = '<p style="color:#64748b; text-align:center; padding:15px;">Carrinho vazio</p>';
    document.getElementById('totalVenda').textContent = '0,00';
    return;
  }

  let html = '';
  let subtotal = 0;
  carrinhoAtual.forEach((item, i) => {
    const total = item.preco * item.qtd;
    subtotal += total;
    html += `<div class="cart-item">
      <div><strong>${item.nome}</strong><br><small>${item.qtd} x R$ ${item.preco.toFixed(2)}</small></div>
      <div style="display:flex; gap:10px; align-items:center;">
        <span>R$ ${total.toFixed(2)}</span>
        <button class="btn btn-small btn-danger" onclick="removerItem(${i})">✕</button>
      </div>
    </div>`;
  });
  div.innerHTML = html;

  const desconto = parseFloat(document.getElementById('vendaDesconto').value) || 0;
  const totalFinal = subtotal * (1 - desconto / 100);
  document.getElementById('totalVenda').textContent = totalFinal.toFixed(2).replace('.', ',');
}

document.addEventListener('input', function (e) {
  if (e.target.id === 'vendaDesconto') {
    const val = parseFloat(e.target.value) || 0;
    if (val > 10 && usuarioAtual.perfil !== 'Gerente') {
      if (!confirm('Desconto acima de 10% exige autorização do gerente. Confirmar? (RN08)')) {
        e.target.value = 10;
      }
    }
    renderCarrinho();
  }
});

function removerItem(i) {
  carrinhoAtual.splice(i, 1);
  renderCarrinho();
}

function finalizarVenda() {
  if (carrinhoAtual.length === 0) { alert('❌ Carrinho vazio!'); return; }

  if (!confirm('Confirmar pagamento e finalizar venda?')) return;

  const cliente = document.getElementById('vendaCliente').value.trim() || null;
  const desconto = parseFloat(document.getElementById('vendaDesconto').value) || 0;
  const pagamento = document.getElementById('vendaPagamento').value;

  const subtotal = carrinhoAtual.reduce((s, i) => s + i.preco * i.qtd, 0);
  const total = subtotal * (1 - desconto / 100);

  const venda = {
    id: Date.now(),
    cliente: normalizarCPF(cliente) || null, itens: [...carrinhoAtual], subtotal, desconto, total, pagamento,
    data: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5)
  };

  const produtos = DB.get('produtos');
  carrinhoAtual.forEach(item => {
    const p = produtos.find(pr => pr.codigo === item.codigo);
    p.qtd -= item.qtd;
  });
  DB.set('produtos', produtos);

  const vendas = DB.get('vendas');
  vendas.push(venda);
  DB.set('vendas', vendas);

  carrinhoAtual = [];
  document.getElementById('vendaCliente').value = '';
  document.getElementById('vendaDesconto').value = '0';

  alert(`✅ Venda finalizada! Total: R$ ${total.toFixed(2)} - Pagamento: ${pagamento}`);
  atualizarTudo();
}

function renderVendas() {
  const vendas = DB.get('vendas');
  if (vendas.length === 0) {
    document.getElementById('listaVendas').innerHTML = '<p style="color:#64748b; text-align:center; padding:15px;">Nenhuma venda registrada.</p>';
    return;
  }

  let html = '<table><tr><th>Data</th><th>Cliente</th><th>Itens</th><th>Desconto</th><th>Total</th><th>Pagamento</th></tr>';
  vendas.sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora)).forEach(v => {
    const cliente = v.cliente
      ? (DB.get('clientes').find(c => normalizarCPF(c.cpf) === normalizarCPF(v.cliente))?.nome || formatarCPF(v.cliente))
      : 'Avulsa';
    html += `<tr>
      <td>${v.data} ${v.hora}</td><td>${cliente}</td>
      <td>${v.itens.length} item(s)</td>
      <td>${v.desconto}%</td>
      <td>R$ ${v.total.toFixed(2)}</td>
      <td><span class="badge badge-success">${v.pagamento}</span></td>
    </tr>`;
  });
  html += '</table>';
  document.getElementById('listaVendas').innerHTML = html;
}

// ============ RELATÓRIOS ============
function gerarRelatorio() {
  const inicio = document.getElementById('relInicio').value;
  const fim = document.getElementById('relFim').value;

  if (inicio && fim && inicio > fim) {
    document.getElementById('resultadoRelatorio').innerHTML = '';
    alert('❌ A data inicial não pode ser posterior à data final!');
    return;
  }

  let vendas = DB.get('vendas');
  let atendimentos = DB.get('atendimentos');
  let agendamentos = DB.get('agendamentos');

  if (inicio) {
    vendas = vendas.filter(v => v.data >= inicio);
    atendimentos = atendimentos.filter(a => a.data >= inicio);
    agendamentos = agendamentos.filter(a => a.data >= inicio);
  }
  if (fim) {
    vendas = vendas.filter(v => v.data <= fim);
    atendimentos = atendimentos.filter(a => a.data <= fim);
    agendamentos = agendamentos.filter(a => a.data <= fim);
  }

  const totalVendas = vendas.reduce((s, v) => s + v.total, 0);
  const totalAtend = atendimentos.reduce((s, a) => s + (a.valor || 0), 0);

  let html = `
    <div class="grid-4">
      <div class="stat-card"><div class="icon">💰</div><div class="value">R$ ${totalVendas.toFixed(2)}</div><div class="label">Total em Vendas</div></div>
      <div class="stat-card"><div class="icon">🧾</div><div class="value">${vendas.length}</div><div class="label">Vendas Realizadas</div></div>
      <div class="stat-card"><div class="icon">🩺</div><div class="value">${atendimentos.length}</div><div class="label">Atendimentos</div></div>
      <div class="stat-card"><div class="icon">📅</div><div class="value">${agendamentos.length}</div><div class="label">Agendamentos</div></div>
    </div>
    
    <div class="card" style="margin-top:20px;">
      <h3 class="card-title">💵 Faturamento Total: R$ ${(totalVendas + totalAtend).toFixed(2)}</h3>
      <p style="color:#64748b;">Vendas: R$ ${totalVendas.toFixed(2)} | Atendimentos: R$ ${totalAtend.toFixed(2)}</p>
    </div>
    
    <div class="card">
      <h3 class="card-title">📦 Situação do Estoque</h3>
  `;

  const produtos = DB.get('produtos');
  const ok = produtos.filter(p => p.qtd > p.minimo).length;
  const baixo = produtos.filter(p => p.qtd > 0 && p.qtd <= p.minimo).length;
  const sem = produtos.filter(p => p.qtd === 0).length;

  html += `
    <div class="grid-3">
      <div class="stat-card"><div class="value" style="color:#16a34a;">${ok}</div><div class="label">✅ Normal</div></div>
      <div class="stat-card"><div class="value" style="color:#f59e0b;">${baixo}</div><div class="label">⚠️ Estoque Baixo</div></div>
      <div class="stat-card"><div class="value" style="color:#dc2626;">${sem}</div><div class="label">❌ Sem Estoque</div></div>
    </div>
  </div>`;

  document.getElementById('resultadoRelatorio').innerHTML = html;
}

// ============ MODAL ============
function abrirModal(titulo, corpo) {
  document.getElementById('modalTitle').textContent = titulo;
  document.getElementById('modalBody').innerHTML = corpo;
  document.getElementById('modal').classList.add('active');
}

function fecharModal() {
  document.getElementById('modal').classList.remove('active');
}

// Data padrão: hoje
document.addEventListener('DOMContentLoaded', () => {
  const hoje = new Date().toISOString().split('T')[0];
  const agData = document.getElementById('agData');
  if (agData) agData.value = hoje;
});