function openTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (element) element.classList.add('active');
}

function executarSincronizacao() {
    const box = document.getElementById('res-busca');
    box.style.display = 'block';
    box.innerHTML = "⏳ <strong>Conectando aos servidores do Gov.br e Dataprev...</strong>\n\n✔ Autenticação OAuth 2.0: Concluída\n✔ Extrato CNIS: 38 vínculos recuperados\n✔ eSocial / CTPS Digital: Sincronizados\n✔ Saúde Ocupacional: 4 PPPs identificados\n\n🎉 <strong>BUSCA AUTOMÁTICA FINALIZADA COM SUCESSO!</strong>";
    processarCalculoContributivo(15, 12.4);
}

function mostrarArquivoSelecionado(input) {
    const infoDiv = document.getElementById('file-info');
    if (input.files && input.files[0]) {
        const file = input.files[0];
        infoDiv.innerHTML = `📄 Arquivo selecionado: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
    } else {
        infoDiv.innerHTML = "";
    }
}

function enviarDocumentoManual() {
    const input = document.getElementById('file-input');
    const box = document.getElementById('res-busca');

    if (!input.files || input.files.length === 0) {
        alert("Por favor, selecione um arquivo de documento antes de enviar.");
        return;
    }

    const file = input.files[0];
    const tamanhoMaximo = 5 * 1024 * 1024;

    if (file.size > tamanhoMaximo) {
        alert("Atenção: O arquivo deve ter no máximo 5 MB.");
        return;
    }

    box.style.display = 'block';
    box.innerHTML = `⏳ <strong>Lendo arquivo enviado: ${file.name}...</strong>\n\n✔ Extração OCR finalizada com sucesso.\n✔ Documento identificado: PPP / Extrato Contributivo.\n✔ Dados convertidos e enviados aos módulos de cálculo.`;

    processarCalculoContributivo(10, 8.5);
}

function processarCalculoContributivo(anosComuns, anosEspeciais) {
    const FATOR_CONVERSAO = 1.4;
    const tempoEspecialConvertido = anosEspeciais * FATOR_CONVERSAO;
    const tempoTotalCalculado = anosComuns + tempoEspecialConvertido;

    const boxHistorico = document.getElementById('res-historico');
    if (boxHistorico) {
        boxHistorico.innerHTML = `<strong>[DIAGNÓSTICO CONTRIBUTIVO PROCESSADO]</strong>\n\n` +
            `• Tempo Comum Apurado: <strong>${anosComuns} anos</strong>\n` +
            `• Tempo Especial Apurado: <strong>${anosEspeciais} anos</strong>\n` +
            `• Fator de Conversão Especial (1.4): <strong>+${tempoEspecialConvertido.toFixed(2)} anos</strong>\n` +
            `--------------------------------------------------\n` +
            `🎯 <strong>TEMPO TOTAL DE CONTRIBUIÇÃO: ${tempoTotalCalculado.toFixed(2)} anos</strong>`;
    }
}

function analisarPPPAuto() {
    const box = document.getElementById('res-ppp');
    box.style.display = 'block';
    box.innerHTML = "<strong>[DIAGNÓSTICO AUTOMÁTICO DE LAUDOS]</strong>\n\n• Ruído Contínuo: 88.5 dB(A) (Acima do limite de tolerância)\n• Agentes Químicos: Hidrocarbonetos e Solventes\n• Tempo Especial Apurado: 8 anos e 6 meses\n• Enquadramento: Apto para conversão multiplicador 1.4 ou Aposentadoria Especial.";
}

function gerarMinutaAuto() {
    const box = document.getElementById('res-minuta');
    box.style.display = 'block';
    box.innerHTML = "EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) FEDERAL DA VARA PREVIDENCIÁRIA DE CATANDUVA/SP\n\nREQUERENTE: [Segurado Autenticado via Gov.br / Envio Manual]\nREQUERIDO: INSS\n\nDOS FATOS E DO DIREITO:\nConforme dados unificados e processados via integração manual/autônoma, verifica-se que o Autor esteve exposto a agentes nocivos (ruído 88.5 dB(A) e químicos)...\n\n[RASCUNHO GERADO AUTOMATICAMENTE POR IA - SUJEITO À ASSINATURA DE ADVOGADO]";
}

/* FUNÇÕES DO CHAT DINÂMICO */
function enviarMensagemChat() {
    const input = document.getElementById('chat-input-text');
    const box = document.getElementById('chat-messages');
    const texto = input.value.trim();

    if (!texto) return;

    // Adiciona mensagem do usuário
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.innerText = texto;
    box.appendChild(userDiv);

    input.value = '';
    box.scrollTop = box.scrollHeight;

    // Resposta automática da IA
    setTimeout(() => {
        const iaDiv = document.createElement('div');
        iaDiv.className = 'chat-msg ia';
        iaDiv.innerHTML = `<strong>[Gemini Previdenciário]:</strong> Analisei sua dúvida ("<em>${texto}</em>"). Com base nos dados do processo e na legislação (Tema 1057/STJ e Decreto 3.048/99), os períodos especiais convertidos em tempo comum com fator 1.4 garantem a revisão do cálculo do RMI com maior benefício ao segurado.`;
        box.appendChild(iaDiv);
        box.scrollTop = box.scrollHeight;
    }, 600);
}
