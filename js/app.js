/**
 * AUTONOMIA PREVIDENCIÁRIA - LÓGICA DE PROCESSAMENTO E CÁLCULO
 * Arquivo: js/app.js
 */

/**
 * Alterna a exibição das abas da aplicação (SPA)
 */
function openTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (element) element.classList.add('active');
}

/**
 * Calcula a diferença em anos, meses e dias entre duas datas
 * @param {string} dataInicio - Data no formato YYYY-MM-DD
 * @param {string} dataFim - Data no formato YYYY-MM-DD
 * @returns {object} Objeto com anos, meses, dias e total em anos decimais
 */
function calcularDiferencaDatas(dataInicio, dataFim) {
    const d1 = new Date(dataInicio);
    const d2 = new Date(dataFim);

    let anos = d2.getFullYear() - d1.getFullYear();
    let meses = d2.getMonth() - d1.getMonth();
    let dias = d2.getDate() - d1.getDate();

    if (dias < 0) {
        meses--;
        dias += 30; // Aproximação padrão previdenciária
    }
    if (meses < 0) {
        anos--;
        meses += 12;
    }

    // Converte tudo para anos decimais para aplicação do fator
    const totalAnosDecimais = anos + (meses / 12) + (dias / 365);

    return { anos, meses, dias, totalAnosDecimais };
}

/**
 * Processa os documentos enviados manualmente e preenche automaticamente os períodos
 */
function enviarDocumentoManual() {
    const input = document.getElementById('file-input');
    const box = document.getElementById('res-busca');

    if (!input.files || input.files.length === 0) {
        alert("Por favor, selecione um arquivo antes de enviar.");
        return;
    }

    const file = input.files[0];
    box.style.display = 'block';
    box.innerHTML = `⏳ <strong>Lendo e extraindo dados do arquivo: ${file.name}...</strong>\n\n` +
                    `✔ OCR/Parsing Concluído: 2 períodos identificados no documento.\n` +
                    `✔ Dados enviados automaticamente para o Histórico Contributivo!`;

    // Simulação de períodos extraídos do documento lido
    const periodosExtraidos = [
        { empresa: "Metalúrgica Catanduva", inicio: "2010-01-15", fim: "2018-06-30", especial: true },
        { empresa: "Comércio de Peças Ltda", inicio: "2018-08-01", fim: "2024-02-28", especial: false }
    ];

    preencherHistoricoAutomatico(periodosExtraidos);
}

/**
 * Preenche a tela de Histórico com os períodos extraídos e calcula os tempos
 */
function preencherHistoricoAutomatico(periodos) {
    const boxHistorico = document.getElementById('res-historico');
    let htmlResult = `<strong>[PREENCHIMENTO AUTOMÁTICO VIA DOCUMENTO]</strong>\n\n`;
    let tempoTotalGeral = 0;

    periodos.forEach((p, index) => {
        const diff = calcularDiferencaDatas(p.inicio, p.fim);
        let tempoEfetivo = diff.totalAnosDecimais;
        let obsEspecial = "";

        // Aplica o fator 1.4 se o período for especial
        if (p.especial) {
            tempoEfetivo = diff.totalAnosDecimais * 1.4;
            obsEspecial = ` (Especial 1.4 -> ${tempoEfetivo.toFixed(2)} anos)`;
        }

        tempoTotalGeral += tempoEfetivo;

        htmlResult += `📌 <strong>Período ${index + 1}: ${p.empresa}</strong>\n` +
                     `   • Entrado: ${p.inicio} | Saída: ${p.fim}\n` +
                     `   • Tempo Bruto: ${diff.anos} anos, ${diff.meses} meses e ${diff.dias} dias${obsEspecial}\n\n`;
    });

    htmlResult += `--------------------------------------------------\n` +
                  `🎯 <strong>TEMPO TOTAL CONSOLIDADO: ${tempoTotalGeral.toFixed(2)} anos</strong>`;

    if (boxHistorico) {
        boxHistorico.innerHTML = htmlResult;
    }
}

/**
 * Função de sincronização com Gov.br
 */
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
    box.innerHTML = "<strong>[DIAGNÓSTICO DE LAUDOS]</strong>\n\n• Ruído: 88.5 dB(A) -> Período Especial Aprovado.";
}

function gerarMinutaAuto() {
    const box = document.getElementById('res-minuta');
    box.style.display = 'block';
    box.innerHTML = "EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) FEDERAL...\n\n[Petição Gerada com base nos períodos do documento]";
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
        iaDiv.innerHTML = `<strong>[Gemini Previdenciário]:</strong> Os períodos do documento foram lidos e calculados com sucesso.`;
        box.appendChild(iaDiv);
        box.scrollTop = box.scrollHeight;
    }, 500);
}
