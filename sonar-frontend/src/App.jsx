import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  BarChart3, MessageSquare, Users, Upload, 
  ArrowLeft, ChevronRight, Settings, Bot, Send, X, PlayCircle, FileText,
  Bell, Printer, TrendingUp, TrendingDown, AlertTriangle, Award
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';

// ==========================================
// DADOS COMPLETOS (10 REUNIÕES)
// ==========================================
const MOCK_REUNIOES = [
  { 
    id: "49021", cliente: "Metalúrgica Campos", vendedor: "Ana Martins", setor: "Manufatura", dataRaw: 0, data: "Hoje às 14h30", duracao: "48min", 
    risco: "Atrito Alto", statusRisco: "AVALIANDO MIGRAÇÃO DE SISTEMA", saasAtual: "Protheus", faturamento: "FATURAMENTO CORE ATIVO", concorrente: "Senior ERP", janelaOrcamento: "50.000", score: 4.1, talkTimeVendedor: 68, talkTimeCliente: 32, 
    atores: [{ nome: "Ana Martins", cargo: "Executiva de Contas Sênior — Equipe Interna", sigla: "AM" }, { nome: "João Campos", cargo: "Diretor de Operações — Decisor de Software", sigla: "JC" }, { nome: "Roberto Campos", cargo: "CFO Corporativo — Controlador", sigla: "RC" }], 
    dores: [
      { nivel: "URGENTE", texto: "Colaboradores do setor de RH alegam exaustão operacional com o processamento da folha — Gestão seduzida pela abordagem comercial da Senior ERP." },
      { nivel: "MODERADO", texto: "O sistema de Backoffice atual resolve os gargalos, mas a percepção interna de integrações nativas está desgastada." },
      { nivel: "FATOR CHAVE", texto: "O CFO foca estritamente no ROI trimestral. Demonstra alta sensibilidade a novos investimentos sem comprovação de ganho matemático de caixa." }
    ], 
    planoAcao: ["Apresentar módulo de RH nativo imediatamente para contornar Senior ERP.", "Desenhar cenário matemático de ROI focado nas dores do CFO."],
    justificativaIA: "O score baixo (4.1) reflete a falha da vendedora em contornar a objeção sobre o ROI. A postura foi defensiva e a monopolização da fala (68%) impediu o cliente de expor suas restrições orçamentárias reais."
  },
  { 
    id: "49022", cliente: "Agropecuária Guimarães", vendedor: "Carlos Souza", setor: "Agro", dataRaw: 0, data: "Hoje às 10h00", duracao: "35min", 
    risco: "Promissor", statusRisco: "CROSS-SELL OPORTUNO", saasAtual: "TOTVS Agro", faturamento: "MÓDULO SECUNDÁRIO", concorrente: "SAP", janelaOrcamento: "120.000", score: 8.5, talkTimeVendedor: 45, talkTimeCliente: 55, 
    atores: [{ nome: "Carlos Souza", cargo: "Especialista Agro", sigla: "CS" }, { nome: "Marcelo Guimarães", cargo: "Proprietário", sigla: "MG" }], 
    dores: [{ nivel: "FATOR CHAVE", texto: "Desejo de automatizar a telemetria de colheita para a próxima safra. Buscam integração direta com os maquinários." }], 
    planoAcao: ["Apresentar módulo Inteligência de Safra com TOTVS IA.", "Validar viabilidade técnica de rollout rápido em 45 dias."],
    justificativaIA: "Desempenho excelente (8.5). O vendedor adotou postura consultiva, ouviu o cliente por 55% do tempo e identificou a brecha operacional, pavimentando a entrada da telemetria de forma orgânica."
  },
  { 
    id: "49023", cliente: "Varejo SuperMais", vendedor: "Mariana Rios", setor: "Varejo", dataRaw: 1, data: "Ontem às 16h00", duracao: "55min", risco: "Neutro", statusRisco: "MONITORAMENTO", saasAtual: "TOTVS Varejo", faturamento: "OMNICHANNEL", concorrente: "Omie", janelaOrcamento: "80.000", score: 6.8, talkTimeVendedor: 50, talkTimeCliente: 50, 
    atores: [{ nome: "Mariana Rios", cargo: "Closer Varejo", sigla: "MR" }, { nome: "Bruno Silveira", cargo: "Head de Expansão", sigla: "BS" }], 
    dores: [{ nivel: "MODERADO", texto: "Lentidão de sincronismo do PDV nos fins de semana, gerando filas nas lojas físicas." }], 
    planoAcao: ["Agendar tuning de banco de dados emergencial."],
    justificativaIA: "Nota mediana (6.8). A vendedora demonstrou boa empatia (equilíbrio de fala 50/50), mas faltou firmeza técnica para garantir ao cliente que o problema do PDV será resolvido rapidamente."
  },
  { 
    id: "49024", cliente: "Indústria Alvorada", vendedor: "Ana Martins", setor: "Manufatura", dataRaw: 1, data: "Ontem às 11h00", duracao: "40min", risco: "Crítico", statusRisco: "CHURN IMINENTE", saasAtual: "TOTVS Manufatura", faturamento: "FATURAMENTO CORE", concorrente: "Senior ERP", janelaOrcamento: "35.000", score: 3.8, talkTimeVendedor: 72, talkTimeCliente: 28, 
    atores: [{ nome: "Ana Martins", cargo: "Executiva", sigla: "AM" }, { nome: "Ricardo Paz", cargo: "Gerente Industrial", sigla: "RP" }], 
    dores: [{ nivel: "URGENTE", texto: "Chão de fábrica reclama severamente da usabilidade dos coletores de dados atuais." }], 
    planoAcao: ["Disponibilizar o app Minha Produção para testes em tablets industriais."],
    justificativaIA: "Score crítico (3.8). A vendedora interrompeu o cliente 4 vezes e não demonstrou conhecimento técnico profundo sobre as operações industriais, gerando frustração audível no gestor."
  },
  { 
    id: "49025", cliente: "Construtora Apex", vendedor: "Rodrigo Ramos", setor: "Construção", dataRaw: 3, data: "Há 3 dias", duracao: "30min", risco: "Cross-sell", statusRisco: "UPSELL DETECTADO", saasAtual: "TOTVS Obras", faturamento: "CONTRATO PADRÃO", concorrente: "Sienge", janelaOrcamento: "90.000", score: 7.9, talkTimeVendedor: 40, talkTimeCliente: 60, 
    atores: [{ nome: "Rodrigo Ramos", cargo: "Executivo CS", sigla: "RR" }, { nome: "Fernanda Costa", cargo: "Diretora de Engenharia", sigla: "FC" }], 
    dores: [{ nivel: "FATOR CHAVE", texto: "Falta de integração entre o avanço físico das medições e o setor de compras automáticas." }], 
    planoAcao: ["Montar Prova de Conceito (POC) do módulo de Gestão de Suprimentos Integrado."],
    justificativaIA: "Boa condução (7.9). O vendedor fez perguntas abertas de alto valor, estimulando a cliente a relatar as dores de integração, e criou o gancho exato para o upsell do módulo de suprimentos."
  },
  { 
    id: "49026", cliente: "Logística Express", vendedor: "Juliana Paes", setor: "Logística", dataRaw: 4, data: "Há 4 dias", duracao: "50min", risco: "Neutro", statusRisco: "MONITORAMENTO", saasAtual: "TOTVS WMS", faturamento: "CONTRATO PADRÃO", concorrente: "SAP", janelaOrcamento: "150.000", score: 6.0, talkTimeVendedor: 55, talkTimeCliente: 45, 
    atores: [{ nome: "Juliana Paes", cargo: "Executiva Supply", sigla: "JP" }, { nome: "Marcos Nogueira", cargo: "Gerente Logístico", sigla: "MN" }], 
    dores: [{ nivel: "MODERADO", texto: "Reclamação pontual sobre demora no SLA de atendimento do suporte N2." }], 
    planoAcao: ["Acionar time de Customer Success para agendar follow-up de alinhamento técnico."],
    justificativaIA: "Desempenho aceitável (6.0). A objeção sobre a lentidão do suporte foi apaziguada com sucesso, porém a executiva perdeu a chance de mapear novas oportunidades na área de frotas."
  },
  { 
    id: "49027", cliente: "Hospital MedCare", vendedor: "Carlos Souza", setor: "Saúde", dataRaw: 8, data: "Semana Passada", duracao: "60min", risco: "Crítico", statusRisco: "CHURN IMINENTE", saasAtual: "TOTVS Saúde", faturamento: "FATURAMENTO ALTO", concorrente: "MV", janelaOrcamento: "250.000", score: 4.5, talkTimeVendedor: 65, talkTimeCliente: 35, 
    atores: [{ nome: "Carlos Souza", cargo: "Executivo Saúde", sigla: "CS" }, { nome: "Dra. Helena", cargo: "Diretora Médica", sigla: "HL" }], 
    dores: [{ nivel: "URGENTE", texto: "Falta de integração fluida do Prontuário Eletrônico com o sistema de agendamento." }], 
    planoAcao: ["Envolver arquiteto de soluções urgente para mapear as APIs abertas."],
    justificativaIA: "Score baixo (4.5) justificado pela falta de clareza nas respostas técnicas sobre arquitetura de APIs. A Diretora Médica demonstrou impaciência nas inflexões de voz."
  },
  { 
    id: "49028", cliente: "Escola Futuro", vendedor: "Mariana Rios", setor: "Educacional", dataRaw: 10, data: "Semana Passada", duracao: "45min", risco: "Cross-sell", statusRisco: "CROSS-SELL OPORTUNO", saasAtual: "TOTVS Educacional", faturamento: "MÓDULO BÁSICO", concorrente: "Gera", janelaOrcamento: "40.000", score: 8.8, talkTimeVendedor: 35, talkTimeCliente: 65, 
    atores: [{ nome: "Mariana Rios", cargo: "Closer Edu", sigla: "MR" }, { nome: "Paulo Silveira", cargo: "Mantenedor", sigla: "PS" }], 
    dores: [{ nivel: "FATOR CHAVE", texto: "Busca urgente por um aplicativo amigável para os pais acompanharem notas e boletos." }], 
    planoAcao: ["Apresentar módulo App MeuEduca com foco na retenção de alunos."],
    justificativaIA: "Abordagem excelente (8.8). A vendedora posicionou perfeitamente o produto secundário (App MeuEduca) como solução direta para a dor de comunicação relatada pelo tomador de decisão."
  },
  { 
    id: "49029", cliente: "Tech Solutions", vendedor: "Lucas Silva", setor: "TI", dataRaw: 15, data: "Há 15 dias", duracao: "38min", risco: "Neutro", statusRisco: "MONITORAMENTO", saasAtual: "Protheus", faturamento: "PADRÃO", concorrente: "Omie", janelaOrcamento: "60.000", score: 7.1, talkTimeVendedor: 48, talkTimeCliente: 52, 
    atores: [{ nome: "Lucas Silva", cargo: "Executivo TI", sigla: "LS" }, { nome: "Diego Luz", cargo: "CTO", sigla: "DL" }], 
    dores: [{ nivel: "MODERADO", texto: "Dúvidas técnicas sobre o impacto da atualização da nova release no ambiente customizado." }], 
    planoAcao: ["Enviar documentação técnica e Release Notes com urgência."],
    justificativaIA: "Postura segura (7.1). O executivo demonstrou pleno domínio do Roadmap técnico do produto, transmitindo confiança ao CTO. Contudo, não houveram gatilhos para expansão de conta."
  },
  { 
    id: "49030", cliente: "Rede Farmácia Bem", vendedor: "Juliana Paes", setor: "Varejo", dataRaw: 20, data: "Há 20 dias", duracao: "52min", risco: "Crítico", statusRisco: "CHURN IMINENTE", saasAtual: "TOTVS Varejo", faturamento: "FATURAMENTO ALTO", concorrente: "Linx", janelaOrcamento: "180.000", score: 3.5, talkTimeVendedor: 75, talkTimeCliente: 25, 
    atores: [{ nome: "Juliana Paes", cargo: "Executiva Varejo", sigla: "JP" }, { nome: "Sonia Maia", cargo: "Gestora Regional", sigla: "SM" }], 
    dores: [{ nivel: "URGENTE", texto: "Problemas recorrentes e travamentos na emissão de cupons fiscais em horário de pico." }], 
    planoAcao: ["Acionar suporte N3 Imediatamente para war room com o cliente."],
    justificativaIA: "Score crítico (3.5). A vendedora monopolizou 75% da conversa com discursos genéricos de contorno, falhando em validar o impacto financeiro do problema fiscal."
  }
];

const getCorRisco = (risco) => {
  if (risco.includes('Atrito') || risco.includes('Crítico')) return { bg: 'bg-[#f43f5e]/10', text: 'text-[#f43f5e]', border: 'border-[#f43f5e]/20', solida: '#f43f5e' };
  if (risco.includes('Promissor') || risco.includes('Cross')) return { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', border: 'border-[#f59e0b]/20', solida: '#f59e0b' };
  return { bg: 'bg-[#10b981]/10', text: 'text-[#10b981]', border: 'border-[#10b981]/20', solida: '#10b981' };
}

const getCorNivel = (nivel) => {
  if (nivel === 'URGENTE') return 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30';
  if (nivel === 'MODERADO') return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30';
  return 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30';
}

const getCorAtor = (index) => {
  if (index === 0) return 'bg-[#f43f5e]/20 text-[#f43f5e]'; 
  if (index === 1) return 'bg-[#3b82f6]/20 text-[#3b82f6]'; 
  return 'bg-[#f59e0b]/20 text-[#f59e0b]'; 
}

export default function App() {
  const [sistemaAtivo, setSistemaAtivo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("painel");
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState(null);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

  const [filtroTempo, setFiltroTempo] = useState("Mensal");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas as Chamadas");
  const [filtroSetor, setFiltroSetor] = useState("Todos os Setores");

  const [filtroEquipeSetor, setFiltroEquipeSetor] = useState("Todos os Setores");
  const [filtroEquipeStatus, setFiltroEquipeStatus] = useState("Todos");

  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [historicoChat, setHistoricoChat] = useState([
    { autor: "ia", texto: "Olá Gestor! Conectei com a base de transcrições. O que deseja saber?" }
  ]);
  const chatEndRef = useRef(null);

  const simularUpload = () => {
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      setSistemaAtivo(true);
    }, 1500);
  };

  const setoresDisponiveis = ["Todos os Setores", ...new Set(MOCK_REUNIOES.map(r => r.setor))].sort();

  const reunioesFiltradas = useMemo(() => {
    return MOCK_REUNIOES.filter(r => {
      let matchTempo = true;
      if (filtroTempo === "Diário") matchTempo = r.dataRaw <= 1;
      if (filtroTempo === "Semanal") matchTempo = r.dataRaw <= 7;
      const matchSetor = filtroSetor === "Todos os Setores" || r.setor === filtroSetor;
      let matchCategoria = true;
      if (filtroCategoria === "Riscos") matchCategoria = r.risco.includes("Crítico") || r.risco.includes("Atrito");
      if (filtroCategoria === "Oportunidades") matchCategoria = r.risco.includes("Cross-sell") || r.risco.includes("Promissor");
      return matchTempo && matchSetor && matchCategoria;
    });
  }, [filtroTempo, filtroCategoria, filtroSetor]);

  const kpis = useMemo(() => {
    const total = reunioesFiltradas.length;
    const churns = reunioesFiltradas.filter(r => r.risco.includes("Crítico") || r.risco.includes("Atrito")).length;
    const upsells = reunioesFiltradas.filter(r => r.risco.includes("Cross") || r.risco.includes("Promissor")).length;
    const neutros = total - churns - upsells;
    const scoreMedio = total > 0 ? (reunioesFiltradas.reduce((acc, r) => acc + r.score, 0) / total).toFixed(1) : 0;
    return { total, churns, upsells, neutros, scoreMedio };
  }, [reunioesFiltradas]);

  const dadosGraficoRosca = [
    { name: 'Churn', value: kpis.churns, color: '#f43f5e' },
    { name: 'Upsell', value: kpis.upsells, color: '#f59e0b' },
    { name: 'Neutro', value: kpis.neutros, color: '#10b981' },
  ];

  const equipeStats = useMemo(() => {
    const stats = {};
    MOCK_REUNIOES.forEach(r => {
      if(!stats[r.vendedor]) stats[r.vendedor] = { nome: r.vendedor, setor: r.setor, reunioes: 0, somaScore: 0, somaTalkTime: 0 };
      stats[r.vendedor].reunioes += 1;
      stats[r.vendedor].somaScore += r.score;
      stats[r.vendedor].somaTalkTime += r.talkTimeVendedor;
    });
    
    return Object.values(stats).map(v => {
      const mediaScore = Number((v.somaScore / v.reunioes).toFixed(1));
      return {
        ...v,
        score: mediaScore,
        talkTime: Math.round(v.somaTalkTime / v.reunioes),
        status: mediaScore >= 6 ? 'DENTRO DA META' : 'ABAIXO DA META'
      };
    }).filter(v => {
      if(filtroEquipeSetor !== "Todos os Setores" && v.setor !== filtroEquipeSetor) return false;
      if(filtroEquipeStatus === "Acima da Meta" && v.score < 6) return false;
      if(filtroEquipeStatus === "Abaixo da Meta" && v.score >= 6) return false;
      return true;
    }).sort((a,b) => b.score - a.score);
  }, [filtroEquipeSetor, filtroEquipeStatus]);

  const enviarMensagemChat = (textoManual = null) => {
    const texto = textoManual || mensagem;
    if (!texto.trim()) return;
    setHistoricoChat(prev => [...prev, { autor: "usuario", texto }]);
    setMensagem("");
    setTimeout(() => {
      let resposta = "Conecte a uma LLM (ex: Groq) enviando as transcrições via API para gerar respostas reais.";
      const txt = texto.toLowerCase();
      if (txt.includes("metalúrgica") || txt.includes("campos")) {
        resposta = "⚠️ A Metalúrgica Campos (Setor: Manufatura) está em risco crítico. O CFO foca em ROI e a vendedora Ana monopolizou 68% do tempo da chamada.";
      } else if (txt.includes("agro") || txt.includes("guimarães")) {
        resposta = "🌱 Na Agropecuária Guimarães o cliente quer automatizar telemetria. Ofereça o Módulo de Inteligência de Safra.";
      } else if (txt.includes("treinamento") || txt.includes("piores")) {
        resposta = "📉 Ana Martins (Score 3.9) e Juliana Paes (Score 4.7) estão com médias baixas e monopolizando a fala. Sugiro clínicas de Roleplay.";
      } else if (txt.includes("email")) {
        resposta = "📧 Rascunho:\n'Olá Roberto, compreendo a preocupação com o orçamento. Gostaria de mostrar como nosso módulo de RH nativo elimina custos invisíveis. Tem 15 min amanhã?'";
      }
      setHistoricoChat(prev => [...prev, { autor: "ia", texto: resposta }]);
    }, 1200);
  };

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [historicoChat]);

  const exportarPDF = () => window.print();

  return (
    <div className="flex h-screen bg-[#070a13] text-[#a0aabf] font-sans overflow-hidden print:h-auto print:bg-white print:text-black">
      
      {/* ================= BARRA LATERAL ================= */}
      <aside className="w-64 border-r border-[#1a2235] bg-[#0a0f1d] flex flex-col h-full z-10 print:hidden">
        <div className="p-5">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
              Sonar <span className="text-[#3b82f6] ml-1">Sales</span>
            </h1>
            <p className="text-[10px] text-[#64748b] mt-1">Auditoria e Visibilidade por IA</p>
          </div>

          <nav className="space-y-2">
            <button onClick={() => { setAbaAtiva("painel"); setReuniaoSelecionada(null); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${abaAtiva === "painel" && !reuniaoSelecionada ? "bg-[#1e3a8a]/20 text-[#3b82f6] border border-[#1e3a8a]/30" : "hover:bg-[#1a2235] text-[#8b9bb4]"}`}>
              <BarChart3 size={16} /> Painel Executivo
            </button>
            <button onClick={() => setAbaAtiva("historico")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${abaAtiva === "historico" ? "bg-[#1e3a8a]/20 text-[#3b82f6] border border-[#1e3a8a]/30" : "hover:bg-[#1a2235] text-[#8b9bb4]"}`}>
              <MessageSquare size={16} /> Repositório Áudios
            </button>
            <button onClick={() => setAbaAtiva("equipe")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${abaAtiva === "equipe" ? "bg-[#1e3a8a]/20 text-[#3b82f6] border border-[#1e3a8a]/30" : "hover:bg-[#1a2235] text-[#8b9bb4]"}`}>
              <Users size={16} /> Gestão de Equipe
            </button>
          </nav>
        </div>

        <div className="mt-auto p-5 border-t border-[#1a2235]">
          {!sistemaAtivo ? (
            <button onClick={simularUpload} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] cursor-pointer text-xs font-bold text-white transition shadow-lg">
              <Upload size={14} /> <span>Subir Excel TOTVS</span>
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 text-xs font-bold">
               Base Sincronizada
            </div>
          )}
        </div>
      </aside>

      {/* ================= ÁREA PRINCIPAL ================= */}
      <main className="flex-1 overflow-y-auto p-8 bg-[#0b1120] h-full relative print:p-0 print:bg-white">
        
        {/* TELA DE LOADING */}
        {!sistemaAtivo && !carregando && (
          <div className="flex flex-col items-center justify-center h-full opacity-50 animate-in fade-in print:hidden">
            <Upload size={64} className="text-[#334155] mb-4" />
            <p className="text-[#64748b] font-medium text-sm">Clique em "Subir Excel TOTVS" na barra lateral para iniciar.</p>
          </div>
        )}
        
        {carregando && (
          <div className="flex flex-col items-center justify-center h-full print:hidden">
            <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#3b82f6] text-sm font-bold animate-pulse">Lendo transcrições (Groq API)... Extraindo Insights...</p>
          </div>
        )}

        {/* ================= TELA 1: PAINEL EXECUTIVO ================= */}
        {sistemaAtivo && abaAtiva === "painel" && !reuniaoSelecionada && (
          <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
            
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-[22px] font-bold text-white">Painel Executivo de Vendas</h1>
              
              <div className="flex items-center gap-6">
                <div className="relative">
                  <button onClick={() => setNotificacoesAbertas(!notificacoesAbertas)} className="text-[#64748b] hover:text-white transition relative p-2">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#f43f5e] rounded-full ring-2 ring-[#0b1120] animate-pulse"></span>
                  </button>
                  
                  {notificacoesAbertas && (
                    <div className="absolute right-0 top-10 w-80 bg-[#111827] border border-[#1f2937] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="p-3 bg-[#1a2235] border-b border-[#1f2937]">
                        <span className="text-xs font-bold text-white uppercase">Alertas da IA (Tempo Real)</span>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="flex items-start gap-3 cursor-pointer hover:bg-[#1a2235] p-2 rounded-lg transition" onClick={() => {setReuniaoSelecionada(MOCK_REUNIOES[0]); setNotificacoesAbertas(false);}}>
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-[#f43f5e]"></div>
                          <div>
                            <p className="text-[12px] font-bold text-white">Risco Crítico: Metalúrgica</p>
                            <p className="text-[10px] text-[#94a3b8]">O CFO rejeitou a proposta de ROI.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 cursor-pointer hover:bg-[#1a2235] p-2 rounded-lg transition" onClick={() => {setReuniaoSelecionada(MOCK_REUNIOES[1]); setNotificacoesAbertas(false);}}>
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-[#f59e0b]"></div>
                          <div>
                            <p className="text-[12px] font-bold text-white">Cross-sell: Agropecuária</p>
                            <p className="text-[10px] text-[#94a3b8]">Interesse em Telemetria detectado.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex bg-[#111827] rounded-full p-1 border border-[#1f2937]">
                  {["Diário", "Semanal", "Mensal"].map(t => (
                    <button key={t} onClick={() => setFiltroTempo(t)} className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${filtroTempo === t ? 'bg-[#3b82f6] text-white' : 'text-[#64748b] hover:text-white'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="col-span-1 bg-[#111827] p-4 rounded-xl border border-[#1f2937] flex flex-col items-center justify-center relative">
                <h3 className="absolute top-3 left-3 text-[10px] font-bold text-[#64748b] uppercase">Visão Geral</h3>
                <div className="h-24 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dadosGraficoRosca} innerRadius={25} outerRadius={40} paddingAngle={2} dataKey="value" stroke="none">
                        {dadosGraficoRosca.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#cbd5e1'}} itemStyle={{fontSize: '11px', fontWeight: 'bold'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] flex flex-col justify-center">
                <h2 className="text-[32px] font-bold text-white mb-1">{kpis.total}</h2>
                <p className="text-[11px] text-[#94a3b8]">Reuniões Analisadas ({filtroTempo})</p>
              </div>
              <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] flex flex-col justify-center">
                <h2 className="text-[32px] font-bold text-[#f43f5e] mb-1">{kpis.churns}</h2>
                <p className="text-[11px] text-[#94a3b8]">Alertas de Churn Latente</p>
              </div>
              <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] flex flex-col justify-center">
                <h2 className="text-[32px] font-bold text-[#f59e0b] mb-1">{kpis.upsells}</h2>
                <p className="text-[11px] text-[#94a3b8]">Gatilhos Cross-sell Encontrados</p>
              </div>
              <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#3b82f6]/10 to-transparent rounded-bl-full"></div>
                <h2 className="text-[32px] font-bold text-[#3b82f6] mb-1">{kpis.scoreMedio}</h2>
                <p className="text-[11px] text-[#94a3b8]">Score Médio (1 a 10)</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 bg-[#111827] p-3 rounded-xl border border-[#1f2937]">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-[#64748b]">Exibir:</span>
                <div className="flex gap-2">
                  {["Todas as Chamadas", "Riscos", "Oportunidades"].map(cat => (
                    <button key={cat} onClick={() => setFiltroCategoria(cat)} className={`px-4 py-1.5 rounded-full text-[11px] font-semibold transition ${filtroCategoria === cat ? 'bg-[#3b82f6] text-white' : 'bg-[#1f2937] text-[#94a3b8] hover:text-white'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#64748b]">Vertical/Setor:</span>
                <select className="bg-[#1f2937] text-[#e2e8f0] text-xs font-semibold rounded border border-[#334155] px-3 py-1.5 outline-none cursor-pointer" value={filtroSetor} onChange={(e) => setFiltroSetor(e.target.value)}>
                  {setoresDisponiveis.map(s => <option key={s} value={s} className="bg-[#0f172a] text-[#e2e8f0]">{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {reunioesFiltradas.length === 0 ? (
                <div className="text-center py-10 text-sm text-[#64748b]">Nenhum dado encontrado para o filtro selecionado.</div>
              ) : (
                reunioesFiltradas.map((reuniao, i) => {
                  const cores = getCorRisco(reuniao.risco);
                  return (
                    <div key={i} onClick={() => setReuniaoSelecionada(reuniao)} className="p-4 rounded-xl border border-[#1f2937] bg-[#111827] hover:bg-[#1a2235] cursor-pointer transition flex items-center justify-between relative overflow-hidden group shadow-sm">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${cores.solida}`}></div>
                      <div className="flex items-center gap-4 pl-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${cores.bg} ${cores.text} border ${cores.border}`}>
                          {reuniao.cliente.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-[16px] font-bold text-white leading-tight">{reuniao.cliente} <span className="text-[10px] font-normal text-[#64748b] ml-2">({reuniao.setor})</span></h4>
                          <p className="text-[12px] text-[#94a3b8] mt-1">Resp: {reuniao.vendedor} • {reuniao.data} • Duração: {reuniao.duracao}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center justify-end">
                        <span className={`text-[10px] px-3 py-1.5 rounded-md font-bold uppercase border ${cores.bg} ${cores.text} ${cores.border}`}>
                          {reuniao.statusRisco}
                        </span>
                        <ChevronRight className="text-[#475569] group-hover:text-white transition w-5 h-5" />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TELA 2: AUDITORIA INDIVIDUAL ================= */}
        {sistemaAtivo && reuniaoSelecionada && abaAtiva === "painel" && (
           <div className="max-w-[1100px] mx-auto animate-in slide-in-from-right-8 pb-10">
              
              <div className="flex items-center justify-between mb-8 print:mb-4">
                <div className="flex items-center gap-4 print:hidden">
                  <button onClick={() => setReuniaoSelecionada(null)} className="px-4 py-2 rounded-lg bg-[#1f2937] hover:bg-[#374151] text-[12px] font-bold text-white flex items-center gap-2 transition">
                    <ArrowLeft size={16}/> Voltar para o Painel
                  </button>
                  <h1 className="text-[22px] font-bold text-white">Auditoria de Reunião: {reuniaoSelecionada.cliente}</h1>
                </div>
                
                <div className="flex gap-3 print:hidden">
                  <button onClick={exportarPDF} className="px-3 py-2 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] text-[12px] font-bold text-white flex items-center gap-2 transition">
                    <Printer size={16}/> Exportar
                  </button>
                  <span className="text-[12px] font-mono bg-[#111827] border border-[#1f2937] px-4 py-2 rounded-lg text-[#94a3b8]">
                    ID: #{reuniaoSelecionada.id} - Transcrição Assíncrona
                  </span>
                </div>

                <div className="hidden print:block w-full border-b pb-4 mb-4">
                  <h1 className="text-2xl font-bold text-black">Relatório de Auditoria IA (Sonar Sales)</h1>
                  <p className="text-gray-600">Cliente: {reuniaoSelecionada.cliente} | Setor: {reuniaoSelecionada.setor} | ID: #{reuniaoSelecionada.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-5 mb-5">
                <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] print:bg-white print:border-gray-300">
                  <p className="text-[10px] font-bold text-[#64748b] print:text-gray-500 uppercase tracking-wider mb-2">Nível de Risco Detectado</p>
                  <h3 className={`text-[22px] font-bold mb-3 ${getCorRisco(reuniaoSelecionada.risco).text} print:text-black`}>
                    {reuniaoSelecionada.risco}
                  </h3>
                  <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${getCorRisco(reuniaoSelecionada.risco).bg} ${getCorRisco(reuniaoSelecionada.risco).text} ${getCorRisco(reuniaoSelecionada.risco).border}`}>
                    {reuniaoSelecionada.statusRisco}
                  </span>
                </div>
                
                <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] print:bg-white print:border-gray-300">
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-2">Métrica de Firmeza (Vendedor)</p>
                  <h3 className={`text-[22px] font-bold mb-3 ${reuniaoSelecionada.score < 6 ? 'text-[#f43f5e]' : 'text-white'}`}>
                    {reuniaoSelecionada.score} <span className="text-[14px] text-[#475569]">/ 10</span>
                  </h3>
                  <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-[#1e293b] text-[#94a3b8] border border-[#334155]">
                    {reuniaoSelecionada.score < 6 ? "ABAIXO DO ESPERADO" : "BOM DESEMPENHO"}
                  </span>
                </div>
                
                <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] print:bg-white print:border-gray-300">
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-2">SaaS/Licenciamento Atual</p>
                  <h3 className="text-[22px] font-bold text-white mb-3 leading-tight">{reuniaoSelecionada.saasAtual}</h3>
                  <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20">
                    {reuniaoSelecionada.faturamento}
                  </span>
                </div>
                
                <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] print:bg-white print:border-gray-300">
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-2">Janela de Orçamento</p>
                  <h3 className="text-[22px] font-bold text-white mb-3">R$ {reuniaoSelecionada.janelaOrcamento}</h3>
                  <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                    SINALIZADO NA CALL
                  </span>
                </div>
              </div>

              <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937] mb-5 print:bg-white print:border-gray-300">
                <h2 className="text-[13px] font-bold text-white mb-3 flex items-center gap-2">
                  <Bot size={16} className="text-[#3b82f6]"/> Parecer Analítico da IA
                </h2>
                <p className="text-[13.5px] text-[#cbd5e1] leading-relaxed border-l-2 border-[#3b82f6] pl-4 italic">
                  "{reuniaoSelecionada.justificativaIA}"
                </p>
              </div>

              <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937] mb-5 print:bg-white print:border-gray-300">
                <h2 className="text-[15px] font-bold text-white mb-6">Dores e Gargalos Mapeados na Conversa</h2>
                <div className="space-y-5">
                  {reuniaoSelecionada.dores.map((dor, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="mt-0.5">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${getCorNivel(dor.nivel)} tracking-wide whitespace-nowrap`}>
                          {dor.nivel}
                        </span>
                      </div>
                      <p className="text-[13.5px] text-[#cbd5e1] leading-relaxed pt-0.5">
                        {dor.texto}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937] print:bg-white print:border-gray-300 flex flex-col justify-between">
                  <div>
                    <h2 className="text-[15px] font-bold text-white mb-6">Divisão de Janela de Fala (%)</h2>
                    <div className="flex items-center gap-6 mb-8">
                      <div className={`w-[72px] h-[72px] rounded-full border-[5px] flex items-center justify-center ${reuniaoSelecionada.score < 6 ? 'border-[#f59e0b]' : 'border-[#3b82f6]'}`}>
                        <span className="font-bold text-white text-[22px]">{reuniaoSelecionada.score}</span>
                      </div>
                      <div className="text-[13px] text-[#94a3b8] space-y-2">
                        <p>Tempo de fala {reuniaoSelecionada.vendedor}: <span className="font-bold text-white">{reuniaoSelecionada.talkTimeVendedor}%</span></p>
                        <p>Tempo de fala do Cliente: <span className="font-bold text-white">{reuniaoSelecionada.talkTimeCliente}%</span></p>
                      </div>
                    </div>
                  </div>
                  {reuniaoSelecionada.talkTimeVendedor > 60 && (
                    <div className="p-4 rounded-lg bg-[#f43f5e]/10 border border-[#f43f5e]/20 mt-auto">
                      <p className="text-[12px] text-[#f43f5e] font-medium leading-relaxed">
                        ↘ Desvio de Diretriz Comercial: O vendedor monopolizou o diálogo, reduzindo o espaço para o diagnóstico das objeções do cliente.
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937] print:bg-white print:border-gray-300">
                  <h2 className="text-[15px] font-bold text-white mb-6">Atores Mapeados na Chamada</h2>
                  <div className="space-y-6">
                    {reuniaoSelecionada.atores.map((ator, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold border ${getCorAtor(i)} border-current/30`}>
                          {ator.sigla}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-white">{ator.nome}</p>
                          <p className="text-[12px] text-[#64748b] mt-0.5">{ator.cargo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#1e3a8a]/10 p-6 rounded-xl border border-[#1e3a8a]/30 print:bg-gray-50 print:border-gray-300">
                <h2 className="text-[14px] font-bold text-[#3b82f6] flex items-center gap-2 mb-5">
                  ✦ Plano de Ação Sugerido pela IA
                </h2>
                <div className="space-y-4">
                  {reuniaoSelecionada.planoAcao.map((passo, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 mt-0.5 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center text-[11px] font-bold border border-[#3b82f6]/30">
                        {i+1}
                      </div>
                      <p className="text-[13px] text-[#cbd5e1] leading-relaxed pt-1">{passo}</p>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        )}

        {/* ================= TELA 3: HISTÓRICO DE ÁUDIOS ================= */}
        {sistemaAtivo && abaAtiva === "historico" && (
          <div className="max-w-[1000px] mx-auto animate-in fade-in print:hidden">
            <h1 className="text-[22px] font-bold text-white mb-6">Repositório de Transcrições</h1>
            <div className="bg-[#111827] rounded-xl border border-[#1f2937] overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1a2235] text-[#64748b] text-[11px] uppercase font-bold">
                  <tr>
                    <th className="p-4">ID Reunião</th>
                    <th className="p-4">Cliente (Setor)</th>
                    <th className="p-4">Data</th>
                    <th className="p-4">Transcrição</th>
                    <th className="p-4">Áudio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]">
                  {MOCK_REUNIOES.map((r, i) => (
                    <tr key={i} className="hover:bg-[#1a2235] transition">
                      <td className="p-4 text-[#94a3b8] font-mono">#{r.id}</td>
                      <td className="p-4 font-bold text-white">{r.cliente} <span className="text-[10px] font-normal text-[#64748b] block">{r.setor}</span></td>
                      <td className="p-4 text-[#94a3b8]">{r.data}</td>
                      <td className="p-4"><button className="flex items-center gap-1 text-[#3b82f6] text-xs hover:underline"><FileText size={14}/> Texto</button></td>
                      <td className="p-4"><button className="flex items-center gap-1 text-[#10b981] text-xs hover:underline"><PlayCircle size={14}/> {r.duracao}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TELA 4: GESTÃO DE EQUIPE ================= */}
        {sistemaAtivo && abaAtiva === "equipe" && (
          <div className="max-w-[1200px] mx-auto animate-in fade-in print:hidden">
            
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-[22px] font-bold text-white">Gestão e Performance da Equipe</h1>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-[#111827] px-4 py-2 rounded-lg border border-[#1f2937]">
                  <span className="text-[11px] font-semibold text-[#64748b]">Setor:</span>
                  {/* SELECT COM A COR CORRIGIDA NO OPTION */}
                  <select className="bg-transparent text-[#e2e8f0] text-xs font-bold outline-none cursor-pointer" value={filtroEquipeSetor} onChange={(e) => setFiltroEquipeSetor(e.target.value)}>
                    {setoresDisponiveis.map(s => <option key={s} value={s} className="bg-[#0f172a] text-[#e2e8f0]">{s}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-[#111827] px-4 py-2 rounded-lg border border-[#1f2937]">
                  <span className="text-[11px] font-semibold text-[#64748b]">Status:</span>
                  {/* SELECT COM A COR CORRIGIDA NO OPTION */}
                  <select className="bg-transparent text-[#e2e8f0] text-xs font-bold outline-none cursor-pointer" value={filtroEquipeStatus} onChange={(e) => setFiltroEquipeStatus(e.target.value)}>
                    <option value="Todos" className="bg-[#0f172a] text-[#e2e8f0]">Todos os Vendedores</option>
                    <option value="Acima da Meta" className="bg-[#0f172a] text-[#e2e8f0]">Acima da Meta (Score ≥ 6)</option>
                    <option value="Abaixo da Meta" className="bg-[#0f172a] text-[#e2e8f0]">Abaixo da Meta (Score &lt; 6)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#64748b] uppercase mb-1">Membros Ativos</p>
                  <h2 className="text-[28px] font-bold text-white">{equipeStats.length}</h2>
                </div>
                <Users size={32} className="text-[#3b82f6]/50" />
              </div>
              <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#64748b] uppercase mb-1">Média Global do Time</p>
                  <h2 className="text-[28px] font-bold text-[#3b82f6]">
                    {(equipeStats.reduce((acc, curr) => acc + curr.score, 0) / (equipeStats.length || 1)).toFixed(1)}
                  </h2>
                </div>
                <Award size={32} className="text-[#3b82f6]/50" />
              </div>
              <div className="bg-[#111827] p-5 rounded-xl border border-[#1f2937] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#64748b] uppercase mb-1">Destaques (Acima da Meta)</p>
                  <h2 className="text-[28px] font-bold text-[#10b981]">{equipeStats.filter(v => v.score >= 6).length}</h2>
                </div>
                <TrendingUp size={32} className="text-[#10b981]/50" />
              </div>
              <div className="bg-[#f43f5e]/10 p-5 rounded-xl border border-[#f43f5e]/30 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#f43f5e] uppercase mb-1">Alerta: Abaixo da Meta</p>
                  <h2 className="text-[28px] font-bold text-[#f43f5e]">{equipeStats.filter(v => v.score < 6).length}</h2>
                </div>
                <AlertTriangle size={32} className="text-[#f43f5e]/50" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 bg-[#111827] p-6 rounded-xl border border-[#1f2937] flex flex-col">
                <h3 className="text-[14px] font-bold text-white mb-6">Comparativo de Score Médio</h3>
                <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={equipeStats} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 10]} hide />
                      <YAxis dataKey="nome" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={80} />
                      {/* TOOLTIP COM COR DE TEXTO E FUNDO CORRIGIDOS */}
                      <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#cbd5e1'}} itemStyle={{color: '#cbd5e1'}} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                        {equipeStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score >= 7 ? '#10b981' : entry.score >= 6 ? '#3b82f6' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="col-span-2 bg-[#111827] rounded-xl border border-[#1f2937] overflow-hidden">
                <div className="p-5 border-b border-[#1f2937] flex justify-between items-center bg-[#1a2235]">
                  <h3 className="text-[14px] font-bold text-white">Análise Individual (Rankeado)</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#111827] text-[#64748b] text-[10px] uppercase font-bold border-b border-[#1f2937]">
                    <tr>
                      <th className="p-4 font-semibold">Vendedor</th>
                      <th className="p-4 font-semibold">Score Médio</th>
                      <th className="p-4 font-semibold">Tempo de Fala (Talk Time)</th>
                      <th className="p-4 font-semibold">Status IA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2937]">
                    {equipeStats.length === 0 ? (
                      <tr><td colSpan="4" className="p-8 text-center text-[#64748b]">Nenhum vendedor encontrado com este filtro.</td></tr>
                    ) : (
                      equipeStats.map((vendedor, i) => (
                        <tr key={i} className="hover:bg-[#1a2235] transition">
                          <td className="p-4">
                            <p className="font-bold text-white">{vendedor.nome}</p>
                            <p className="text-[11px] text-[#64748b] mt-0.5">{vendedor.reunioes} reuniões analisadas • {vendedor.setor}</p>
                          </td>
                          <td className="p-4">
                            <span className={`text-[16px] font-bold ${vendedor.score >= 6 ? 'text-white' : 'text-[#f43f5e]'}`}>
                              {vendedor.score}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <span className={`text-[12px] font-bold w-8 ${vendedor.talkTime > 60 ? 'text-[#f43f5e]' : 'text-[#10b981]'}`}>{vendedor.talkTime}%</span>
                              <div className="flex-1 h-2 bg-[#1f2937] rounded-full overflow-hidden w-24">
                                <div 
                                  className={`h-full rounded-full ${vendedor.talkTime > 60 ? 'bg-[#f43f5e]' : 'bg-[#10b981]'}`} 
                                  style={{ width: `${vendedor.talkTime}%` }}
                                ></div>
                              </div>
                            </div>
                            {vendedor.talkTime > 60 && <p className="text-[10px] text-[#f43f5e] mt-1">Monopolizando fala</p>}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${vendedor.score >= 6 ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' : 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30'}`}>
                              {vendedor.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= CHATBOT FLUTUANTE ================= */}
      {sistemaAtivo && (
        <div className="print:hidden">
          <button onClick={() => setChatAberto(!chatAberto)} className="fixed bottom-6 right-6 bg-[#3b82f6] text-white p-4 rounded-full shadow-2xl hover:bg-[#2563eb] transition-transform hover:scale-105 z-50">
            <Bot size={24} />
          </button>

          {chatAberto && (
            <div className="fixed bottom-24 right-6 w-[360px] bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden z-50 animate-in slide-in-from-bottom-4">
              <div className="p-4 bg-[#111827] flex justify-between items-center border-b border-[#1e293b]">
                <span className="font-bold text-sm text-white flex items-center gap-2"><Bot size={18} className="text-[#3b82f6]"/> Sonar Copilot</span>
                <button onClick={() => setChatAberto(false)} className="text-[#64748b] hover:text-white"><X size={18}/></button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#070b14]">
                {historicoChat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.autor === "usuario" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] shadow-sm whitespace-pre-wrap ${msg.autor === "usuario" ? "bg-[#3b82f6] text-white rounded-br-none" : "bg-[#1e293b] border border-[#334155] text-[#e2e8f0] rounded-bl-none"}`}>
                      {msg.texto}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="px-3 pb-2 bg-[#111827] flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <button onClick={() => enviarMensagemChat("Resumo da Metalúrgica")} className="bg-[#1e293b] border border-[#334155] text-[10px] text-[#cbd5e1] px-3 py-1.5 rounded-full hover:bg-[#334155]">⚠️ Metalúrgica</button>
                <button onClick={() => enviarMensagemChat("Como foi na Agropecuária?")} className="bg-[#1e293b] border border-[#334155] text-[10px] text-[#cbd5e1] px-3 py-1.5 rounded-full hover:bg-[#334155]">🌱 Agropecuária</button>
              </div>

              <div className="p-3 bg-[#111827] border-t border-[#1e293b] flex gap-2">
                <input type="text" value={mensagem} onChange={(e) => setMensagem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && enviarMensagemChat()} placeholder="Pergunte à IA..." className="flex-1 bg-[#070b14] px-4 rounded-lg border border-[#334155] outline-none text-xs text-white focus:border-[#3b82f6] transition" />
                <button onClick={() => enviarMensagemChat()} className="bg-[#3b82f6] p-2.5 rounded-lg hover:bg-[#2563eb]"><Send size={16} /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}