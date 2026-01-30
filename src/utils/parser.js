/**
 * Robust WhatsApp Chat Parser for Android and iOS
 */
export const parseWhatsAppChat = (text) => {
  const lines = text.split('\n');
  const messages = [];

  const messageRegex = /^(?:\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]\.?\s?m\.?)?)\]?\s-?\s?)([^:]+):\s(.+)$/i;

  const systemPatterns = [
    /cifrados de extremo a extremo/i,
    /cambió (el ícono|la descripción|el asunto|tu código)/i,
    /añadió a/i,
    /salió/i,
    /unió desde/i,
    /creó este grupo/i,
    /llamada perdida/i,
    /video perdido/i,
    /se eliminó este mensaje/i
  ];

  let currentMessage = null;

  lines.forEach(line => {
    const cleanLine = line.replace(/\u202f/g, ' ').replace(/\u00a0/g, ' ').trim();
    if (!cleanLine) return;

    const match = cleanLine.match(messageRegex);

    if (match) {
      if (currentMessage) messages.push(currentMessage);

      const dateStr = match[1];
      const parts = dateStr.split('/');
      let normalizedDate;

      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        normalizedDate = `${year}-${month}-${day}`;
      }

      const sender = match[3].trim();
      const content = match[4].trim();
      const isSystem = systemPatterns.some(pattern => pattern.test(content) || pattern.test(line));

      if (!isSystem && content !== '<Multimedia omitido>') {
        currentMessage = {
          date: dateStr,
          isoDate: normalizedDate,
          time: match[2],
          sender: sender,
          content: content
        };
      } else {
        currentMessage = null;
      }
    } else if (currentMessage) {
      currentMessage.content += '\n' + cleanLine;
    }
  });

  if (currentMessage) messages.push(currentMessage);
  return messages;
};

/**
 * Generates dashboard analytics with financial/investment focus
 */
export const analyzeChat = (messages) => {
  if (!messages.length) return { participation: [], topics: [], tasks: [], totalMessages: 0, hourlyActivity: [], dateRange: { min: '', max: '' } };

  // Participation
  const participationMap = {};
  messages.forEach(m => {
    participationMap[m.sender] = (participationMap[m.sender] || 0) + 1;
  });

  const total = messages.length;
  const participation = Object.entries(participationMap)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Financial Topic Extraction
  const financialStopWords = new Set(['el', 'la', 'de', 'que', 'en', 'y', 'a', 'los', 'un', 'con', 'por', 'lo', 'como', 'para', 'las', 'del', 'los', 'está', 'este', 'esta', 'pero', 'una', 'sus', 'sobre', 'este', 'estos', 'estamos', 'todo', 'bien', 'muy', 'más', 'pero', 'mensaje', 'grupo', 'ahora', 'donde', 'siempre', 'hola', 'cómo', 'estás', 'gracias']);

  const wordFreq = {};
  messages.forEach(m => {
    const cleaned = m.content.toLowerCase().replace(/[^\wáéíóúñ\s]/g, '');
    const mWords = cleaned.split(/\s+/);
    mWords.forEach(word => {
      if (word.length > 4 && !financialStopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
  });

  const topics = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, freq]) => ({
      label: word.charAt(0).toUpperCase() + word.slice(1),
      weight: freq
    }));

  // Financial Actions
  const financialPatterns = [
    { key: /compra|buy|adquirir|entrada/i, label: 'Orden Compra' },
    { key: /venta|sell|liquidar|salida/i, label: 'Orden Venta' },
    { key: /dividendo|pago|utilidad/i, label: 'Dividendos' },
    { key: /análisis|técnico|fundamental|gráfica/i, label: 'Investigación' },
    { key: /riesgo|varianza|stop|pérdida/i, label: 'Gestión Riesgo' }
  ];

  const tasks = [];
  messages.forEach(m => {
    financialPatterns.forEach(pattern => {
      if (pattern.key.test(m.content)) {
        const text = m.content.split('\n')[0].substring(0, 60);
        tasks.push({ category: pattern.label, text: text + (text.length === 60 ? '...' : ''), sender: m.sender });
      }
    });
  });

  // Activity Curve
  const hourlyActivity = Array(24).fill(0);
  messages.forEach(m => {
    const parts = m.time.split(':');
    let hour = parseInt(parts[0]);
    const isPM = /p\.?\s?m\.?/i.test(m.time);
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    if (hour < 24) hourlyActivity[hour]++;
  });

  // Date Range
  const sortedDates = messages.map(m => m.isoDate).filter(Boolean).sort();
  const dateRange = {
    min: sortedDates[0] || '',
    max: sortedDates[sortedDates.length - 1] || ''
  };

  return {
    participation,
    topics,
    tasks: tasks.slice(0, 6),
    totalMessages: total,
    hourlyActivity,
    dateRange
  };
};

export const generateDetailedFinancialSummary = (messages, tone = 'Ejecutivo') => {
  if (!messages.length) return "No hay datos suficientes para el análisis BVC.";

  const totalInteractions = messages.length;
  const sendsRaw = messages.length;

  // Participant analysis
  const partMap = messages.reduce((acc, m) => { acc[m.sender] = (acc[m.sender] || 0) + 1; return acc; }, {});
  const topParticipants = Object.entries(partMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);

  // Thematic Analysis Logic
  const hasVarianza = messages.some(m => /varianza|riesgo|volatilidad/i.test(m.content));
  const hasETFs = messages.some(m => /etf|fondo|canasta/i.test(m.content));
  const hasAccionesBVC = messages.some(m => /acción|emisores|bvc|colcap/i.test(m.content));

  const sections = {
    intro: `Análisis BVC Intelligence: El flujo de comunicación analizado comprende ${totalInteractions} interacciones estratégicas enfocadas en el mercado de valores de Colombia e internacional.`,
    dynamics: `La dinámica del grupo está liderada principalmente por ${topParticipants.join(', ')}, quienes han centrado la discusión en análisis de emisores y sentimiento del mercado.`,
    themes: `Respecto a los temas clave, ${hasAccionesBVC ? 'se identifica un fuerte seguimiento a los emisores locales de la BVC y sus dividendos.' : ''} ${hasETFs ? 'Además, hay un interés marcado en ETFs como instrumentos de diversificación.' : ''}`,
    risk: `${hasVarianza ? 'En cuanto a la gestión de riesgo, se discutieron portafolios de mínima varianza pos-pandemia, advirtiendo sobre la volatilidad observada en los retornos negativos recientes.' : 'Se recomienda reforzar el análisis de riesgo de varianza para los portafolios discutidos.'}`,
    conclusion: `El sentimiento general es de cautela estratégica, orientada a la búsqueda de oportunidades en activos de renta variable con fundamentales sólidos.`
  };

  if (tone === 'Conciso') {
    return `REPORTE BVC: ${totalInteractions} mensajes. Líderes: ${topParticipants[0]}. Enfoque: ${hasAccionesBVC ? 'Acciones BVC' : 'Mercados'}. Riesgo: ${hasVarianza ? 'Ajuste por varianza' : 'Estable'}. Estrategia: Cautela competitiva.`;
  }

  if (tone === 'Creativo') {
    return `🚀 ¡Oportunidad en el radar! El mercado ha hablado a través de ${totalInteractions} mensajes. ${topParticipants[0]} está liderando la carga hacia nuevos horizontes financieros. Estamos viendo un movimiento interesantísimo en ${hasAccionesBVC ? 'emisores locales' : 'activos globales'}. ¡El riesgo está bajo control con un ojo en la varianza! ✨`;
  }

  // Executive (Detailed)
  return `${sections.intro} ${sections.dynamics} ${sections.themes} ${sections.risk} ${sections.conclusion}`;
};
