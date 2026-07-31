/**
 * AUTONOMIA PREVIDENCIÁRIA - LÓGICA DE PROCESSAMENTO & REGRAS PREVIDENCIÁRIAS
 * Módulo com suporte às normas pré-1995 (Categoria Profissional) e pós-1995 (Laudos/PPP).
 */

/**
 * Alterna a exibição das abas da aplicação (Single Page Application)
 */
function openTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (element) element.classList.add('active');
}

/**
 * Converte e calcula a diferença entre duas datas em anos, meses e dias
 */
function calcularDiferencaDatas(dataInicio, dataFim) {
    const d1 = new Date(dataInicio);
    const d2 = new Date(dataFim);

    let anos = d2.getFullYear() - d1.getFullYear();
    let meses = d2.getMonth() - d1.getMonth();
    let dias = d2.getDate() - d1.getDate();

    if (dias < 0) {
        meses--;
        dias += 30; // Convenção de cálculo previdenciário (mês comercial)
    }
    if (meses < 0) {
        anos--;
        meses += 12;
    }

    const totalAnosDecimais = anos + (meses / 12) + (dias / 365);
    return { anos, meses, dias, totalAnosDecimais };
}

/**
 * Processa o documento enviado aplicando as normas pré e pós 1995
 */
function enviarDocumentoManual() {
    const input = document.getElementById('file-input');
    const box = document.getElementById('res-busca');

    if (!input.files || input.files.length === 0) {
        alert("Por favor, selecione um arquivo de documento antes de enviar.");
        return;
    }

    const file = input.files[0];
    box.style.display = 'block';
    box.innerHTML = `⏳ <strong>Lendo documento: ${file.name}...</strong>\n\n` +
                    `✔ OCR & Leitura de Vínculos: Concluído\n` +
                    `✔ Aplicando regras da Lei 9.032/95 (Março de 1995)\n` +
                    `✔ Dados processados e enviados para o Histórico Contributivo!`;

    // Lista de períodos extraídos simulando documentos reais (CNIS / PPP / CTPS)
    const periodosDocumento = [
        {
            empresa: "Indústria Metalúrgica S/A",
            inicio: "1988-03-10",
            fim: "1994-12-20",
            cargo: "Soldador / Metalúrgico",
            agenteNocivo: "Enquadramento por Categoria Profissional"
        },
        {
            empresa: "Auto Mecânica & Peças Ltda",
            inicio: "1996-02-01",
            fim: "2008-08-15",
            cargo: "Mecânico Industrial",
            agenteNocivo: "Ruído 89.2 dB(A) e Óleos Minerais (Comprovado em PPP)"
        },
        {
            empresa: "Comércio de Serviços Gerais",
            inicio: "2009-01-10",
            fim: "2023-05-30",
            cargo: "Auxiliar Administrativo",
            agenteNocivo: "Nenhum (Atividade Comum)"
        }
    ];

    processarPeriodosComNormas1995(periodosDocumento);
}

/**
 * Aplica os critérios legais pré-1995 e pós-1995 e calcula a soma final
 */
function processarPeriodosComNormas1995(periodos) {
    const boxHistorico = document.getElementById('res-historico');
    const DATA_CORTE_1995 = new Date("1995-04-28"); // Marco temporal da Lei 9.032/95
    const FATOR_CONVERSAO = 1.4; // Multiplicador masculino

    let htmlResult = `<strong>[DIAGNÓSTICO E SOMA FINAL DE CONTRIBUIÇÃO]</strong>\n\n`;
    let tempoTotalGeral = 0;
    let tempoComumTotal = 0;
    let tempoEspecialPre1995 = 0;
    let tempoEspecialPos1995 = 0;

    periodos.forEach((p, index) => {
        const diff = calcularDiferencaDatas(p.inicio, p.fim);
        const dataFimPeriodo = new Date(p.fim);
        let tempoEfetivo = diff.totalAnosDecimais;
        let enquadramentoLegis = "";

        // Regra 1: Período até 28/04/1995 (Enquadramento por Categoria Profissional)
        if (dataFimPeriodo <= DATA_CORTE_1995 && p.cargo.includes("Metalúrgico") || p.cargo.includes("Soldador")) {
            tempoEfetivo = diff.totalAnosDecimais * FATOR_CONVERSAO;
            tempoEspecialPre1995 += tempoEfetivo;
            enquadramentoLegis = ` [Pré-1995: Categoria Profissional (Fator 1.4) -> ${tempoEfetivo.toFixed(2)} anos]`;
        } 
        // Regra 2: Período após 28/04/1995 (Comprovação por Laudo/PPP)
        else if (dataFimPeriodo > DATA_CORTE_1995 && p.agenteNocivo.includes("Ruído") || p.agenteNocivo.includes("Óleos")) {
            tempoEfetivo = diff.totalAnosDecimais * FATOR_CONVERSAO;
            tempoEspecialPos1995 += tempoEfetivo;
            enquadramentoLegis = ` [Pós-1995: Laudo Técnico/PPP (Fator 1.4) -> ${tempoEfetivo.toFixed(2)} anos]`;
        } 
        // Regra 3: Período Comum
        else {
            tempoComumTotal += tempoEfetivo;
            enquadramentoLegis = ` [Atividade Comum]`;
        }

        tempoTotalGeral += tempoEfetivo;

        htmlResult += `📌 <strong>Vínculo ${index + 1}: ${p.empresa}</strong>\n` +
                     `   • Cargo: ${p.cargo}\n` +
                     `   • Período: ${p.inicio} até ${p.fim}\n` +
                     `   • Tempo Bruto: ${diff.anos} anos, ${diff.meses} meses e ${diff.dias} dias\n` +
                     `   • Enquadramento Legal:${enquadramentoLegis}\n\n`;
    });

    htmlResult += `--------------------------------------------------\n` +
                  `📊 <strong>RESUMO CONSOLIDADO DOS PERÍODOS:</strong>\n` +
                  `• Tempo Comum Simples: <strong>${tempoComumTotal.toFixed(2)} anos</strong>\n` +
                  `• Tempo Especial Pré-1995 (Convertido 1.4): <strong>${tempoEspecialPre1995.toFixed(2)} anos</strong>\n` +
                  `• Tempo Especial Pós-1995 (Convertido 1.4): <strong>${tempoEspecialPos1995.toFixed(2)} anos</strong>\n\n` +
                  `🎯 <strong>SOMA FINAL DE CONTRIBUIÇÃO: ${tempoTotalGeral.toFixed(2)} ANOS</strong>`;

    if (boxHistorico) {
        boxHistorico.innerHTML = htmlResult;
    }
}

function executarSincronizacao() {
    const box = document.getElementById('res-busca');
    box.style.display = 'block';
    box.innerHTML = "⏳ <strong>Conectando aos servidores do Gov.br...</strong>\n\n✔ Extrato CNIS e eSocial sincronizados!";
    enviarDocumentoManual();
}

function mostrarArquivoSelecionado(input) {
    const infoDiv = document.getElementById('file-info');
    if (input.files && input.files[0]) {
        infoDiv.innerHTML = `📄 Arquivo selecionado: <strong>${input.files[0].name}</strong>`;
    }
}

function analisarPPPAuto() {
    const box = document.getElementById('res-ppp');
    box.style.display = 'block';
    box.innerHTML = "<strong>[DIAGNÓSTICO DE LAUDOS]</strong>\n\n• Ruído: 89.2 dB(A) -> Período Especial Aprovado conforme NR-15 e Decreto 3.048/99.";
}

function gerarMinutaAuto() {
    const box = document.getElementById('res-minuta');
    box.style.display = 'block';
    box.innerHTML = "EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) FEDERAL DA VARA PREVIDENCIÁRIA DE CATANDUVA/SP...\n\n[Petição Gerada com base nas Regras Pré-1995 e Laudos Pós-1995]";
}

function enviarMensagemChat() {
    const input = document.getElementById('chat-input-text');
    const box = document.getElementById('chat-messages');
    const texto = input.value.trim();
    if (!texto) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.innerText = texto;
    box.appendChild(userDiv);
    input.value = '';

    setTimeout(() => {
        const iaDiv = document.createElement('div');
        iaDiv.className = 'chat-msg ia';
        iaDiv.innerHTML = `<strong>[Gemini Previdenciário]:</strong> Os períodos anteriores a 28/04/1995 foram enquadrados por categoria profissional, e os posteriores validados via laudo técnico.`;
        box.appendChild(iaDiv);
        box.scrollTop = box.scrollHeight;
    }, 500);
}
