/**
 * AUTONOMIA PREVIDENCIÁRIA - LÓGICA PRINCIPAL (js/app.js)
 * Módulo de manipulação de DOM, cálculos, validações e chat.
 */

/**
 * Alterna a exibição das abas da aplicação (Single Page Application)
 * @param {string} tabId - ID do contêiner da aba
 * @param {HTMLElement} element - Botão clicado para aplicar o estilo ativo
 */
function openTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (element) element.classList.add('active');
}

/**
 * Simula a busca automática conectando às bases Gov.br
 */
function executarSincronizacao() {
    const box = document.getElementById('res-busca');
    box.style.display = 'block';
    box.innerHTML = "⏳ <strong>Conectando aos servidores do Gov.br e Dataprev...</strong>\n\n✔ Autenticação OAuth 2.0: Concluída\n✔ Extrato CNIS: 38 vínculos recuperados\n✔ eSocial / CTPS Digital: Sincronizados\n✔ Saúde Ocupacional: 4 PPPs identificados\n\n🎉 <strong>BUSCA AUTOMÁTICA FINALIZADA COM SUCESSO!</strong>";
    processarCalculoContributivo(15, 12.4);
}

/**
 * Exibe o nome e o tamanho do arquivo selecionado no input manual
 * @param {HTMLInputElement} input - Elemento HTML do tipo file
 */
function mostrarArquivoSelecionado(input) {
    const infoDiv = document.getElementById('file-info');
    if (input.files && input.files[0]) {
        const file = input.files[0];
        infoDiv.innerHTML = `📄 Arquivo selecionado: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
    } else {
        infoDiv.innerHTML = "";
    }
}

/**
 * Processa o documento enviado manualmente e simula a leitura de dados (OCR)
 */
function enviarDocumentoManual() {
    const input = document.getElementById('file-input');
    const box = document.getElementById('res-busca');

    if (!input.files || input.files.length === 0) {
        alert("Por favor, selecione um arquivo de documento antes de enviar.");
        return;
    }

    const file = input.files[0];
    const tamanhoMaximo = 5 * 1024 * 1024; // Limitador de 5 MB

    if (file.size > tamanhoMaximo) {
        alert("Atenção: O arquivo deve ter no máximo 5 MB.");
        return;
    }

    box.style.display = 'block';
    box.innerHTML = `⏳ <strong>Lendo e extraindo dados de: ${file.name}...</strong>\n\n` +
                    `✔ OCR / Parsing de Texto: Concluído\n` +
                    `✔ Segurado Identificado: José Junior de Oliveira\n` +
                    `✔ Documento: Perfil Profissiográfico Previdenciário (PPP)\n` +
                    `✔ Registros integrados ao Módulo de Inteligência Sociojurídica.`;

    // Processa automaticamente os tempos no histórico
    processarCalculoContributivo(12, 9.8);
}

/**
 * Realiza a soma do tempo comum e converte tempo especial (Fator 1.4)
 * @param {number} anosComuns - Anos em atividade comum
 * @param {number} anosEspeciais - Anos sob agentes nocivos
 */
function processarCalculoContributivo(anosComuns, anosEspeciais) {
    const FATOR_CONVERSAO = 1.4; // Multiplicador masculino padrão (25 anos)
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

/**
 * Audita os laudos ambientais e PPPs
 */
function analisarPPPAuto() {
    const box = document.getElementById('res-ppp');
    box.style.display = 'block';
    box.innerHTML = "<strong>[DIAGNÓSTICO AUTOMÁTICO DE LAUDOS]</strong>\n\n• Ruído Contínuo: 88.5 dB(A) (Acima do limite de tolerância)\n• Agentes Químicos: Hidrocarbonetos e Solventes\n• Tempo Especial Apurado: 9 anos e 9 meses\n• Enquadramento: Apto para conversão multiplicador 1.4 ou Aposentadoria Especial.";
}

/**
 * Gera a minuta da petição exordial
 */
function gerarMinutaAuto() {
    const box = document.getElementById('res-minuta');
    box.style.display = 'block';
    box.innerHTML = "EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) FEDERAL DA VARA PREVIDENCIÁRIA DE CATANDUVA/SP\n\nREQUERENTE: José Junior de Oliveira\nREQUERIDO: INSS\n\nDOS FATOS E DO DIREITO:\nConforme dados unificados e processados via integração manual/autônoma, verifica-se que o Autor esteve exposto a agentes nocivos (ruído 88.5 dB(A) e químicos)...\n\n[RASCUNHO GERADO AUTOMATICAMENTE POR IA - SUJEITO À ASSINATURA DE ADVOGADO]";
}

/**
 * Gerencia as mensagens enviadas no Chat com o Assistente Gemini
 */
function enviarMensagemChat() {
    const input = document.getElementById('chat-input-text');
    const box = document.getElementById('chat-messages');
    const texto = input.value.trim();

    if (!texto) return;

    // Adiciona a mensagem do usuário na tela
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.innerText = texto;
    box.appendChild(userDiv);

    input.value = '';
    box.scrollTop = box.scrollHeight;

    // Resposta simulada da IA com base no contexto do projeto
    setTimeout(() => {
        const iaDiv = document.createElement('div');
        iaDiv.className = 'chat-msg ia';
        iaDiv.innerHTML = `<strong>[Gemini Previdenciário]:</strong> Analisei seu comando ("<em>${texto}</em>"). Com base no Decreto 3.048/99 e nas regras de conversão, os períodos apurados garantem a contagem otimizada do tempo de contribuição com o multiplicador 1.4.`;
        box.appendChild(iaDiv);
        box.scrollTop = box.scrollHeight;
    }, 600);
}
