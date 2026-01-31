import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseWhatsAppChat, analyzeChat, generateDetailedFinancialSummary } from './utils/parser';

// --- Shared Components ---

const Header = ({ title, subtitle, showBack, onBack }) => (
  <header className="sticky top-0 z-50 glass">
    <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={onBack} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors mr-1 cursor-pointer">
            <span className="material-symbols-outlined text-white text-[20px]">arrow_back_ios</span>
          </button>
        )}
        <div className="bg-primary p-2 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-white text-[22px]">trending_up</span>
        </div>
        <h1 className="text-[18px] font-bold tracking-tight text-white">
          {title} <span className="text-primary">{subtitle}</span>
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9px] font-black text-primary uppercase tracking-[2px] leading-none mb-1 text-right">ARQUITECTURAS DE CRECIMIENTO</span>
          <span className="text-[14px] font-black text-white tracking-widest leading-none">Dmente Digital</span>
        </div>
      </div>
    </div>
  </header>
);

const DetailModal = ({ isOpen, onClose, title, messages }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl max-h-[80vh] bg-[#0c1c18] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[4px] mb-1">DETALLE ESTRATÉGICO</p>
              <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl hover:bg-white/5 flex items-center justify-center text-white/40 transition-colors cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className="space-y-2 group">
                <div className="flex justify-between items-center px-1">
                  <span className="text-primary text-[10px] font-black uppercase tracking-widest">{m.sender}</span>
                  <span className="text-white/20 text-[9px] font-bold">{m.date} | {m.time}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-white/70 text-sm leading-relaxed group-hover:border-primary/20 transition-colors">
                  {m.content}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-white/20 py-12 italic">No se encontraron evidencias directas.</p>
            )}
          </div>
          <div className="p-6 bg-white/[0.02] border-t border-white/5 text-center">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[4px]">DMENTE DIGITAL INTELLIGENCE UNIT</p>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Screen 1: Upload ---

const UploadScreen = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const handleFile = (file) => (file && file.name.endsWith('.txt')) && onUpload(file);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto px-6 py-12 lg:py-24 flex flex-col items-center">
      <div className="w-full grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="inline-flex px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[3px] uppercase">INVESTMENT INTELLIGENCE V4</div>
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-white leading-tight">
              Análisis <br /><span className="text-primary">WhatsApp</span>
            </h2>
            <p className="text-white/40 text-xl font-medium max-w-lg leading-relaxed">
              Exporta tu chat, cárgalo aquí y obtén una radiografía completa de tus finanzas e inversiones.
            </p>
          </div>

          <div
            onClick={() => fileInputRef.current.click()}
            className="group relative flex flex-col items-center gap-8 rounded-[3rem] border-2 border-dashed border-white/10 bg-white/5 p-12 transition-all hover:border-primary/60 cursor-pointer shadow-2xl hover:bg-white/[0.08]"
          >
            <input type="file" ref={fileInputRef} className="hidden" accept=".txt" onChange={(e) => handleFile(e.target.files[0])} />
            <div className="w-24 h-24 rounded-[2rem] bg-primary/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-[48px]">account_balance_wallet</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-white text-2xl font-bold">Carga tu histórico de WhatsApp</h3>
              <p className="text-white/40 text-sm">Sube el .txt para iniciar el análisis</p>
            </div>
            <button className="flex min-w-[240px] items-center justify-center rounded-2xl h-16 bg-primary text-white font-black uppercase tracking-widest text-xs transition-all hover:bg-emerald-600 shadow-xl shadow-primary/30 text-center">
              EXPLORAR DISPOSITIVO
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border-white/5 shadow-2xl space-y-8">
            <h4 className="text-[11px] font-black text-primary uppercase tracking-[5px]">¿CÓMO EXPORTAR TU CHAT?</h4>
            <div className="space-y-6">
              {[
                {
                  icon: 'smartphone',
                  title: 'En Android',
                  desc: 'Abre el chat > ⋮ > Más > Exportar chat > Sin archivos.'
                },
                {
                  icon: 'apple',
                  title: 'En iPhone',
                  desc: 'Abre el chat > Tap nombre > Exportar chat > Sin archivos.'
                },
                {
                  icon: 'upload_file',
                  title: 'Carga el archivo',
                  desc: 'Busca el archivo .txt generado y cárgalo en el recuadro de la izquierda.'
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/5 flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                  </div>
                  <div className="flex flex-col pt-1">
                    <p className="text-white text-lg font-bold leading-none mb-2">{step.title}</p>
                    <p className="text-white/40 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center pt-4 space-y-3">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[4px]">DESARROLLADO POR </p>
            <p className="text-[12px] font-bold text-white tracking-[2px] opacity-80 italic">"Arquitecturas de crecimiento diseñadas para dominar mercados <br className="hidden md:block" />y escalar la prospección de forma exponencial."</p>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

// --- Screen 2: Processing ---

const ProcessingScreen = ({ fileName }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setProgress(p => p >= 100 ? 100 : p + 1.2), 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.main className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[85vh]">
      <div className="text-center mb-16 space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase">MOTOR FINANCIERO ACTIVO</div>
        <h2 className="text-6xl font-black tracking-tighter text-white">Cuantificando...</h2>
        <p className="text-white/40 text-xl font-medium">Procesando activos en '{fileName}'</p>
      </div>

      <div className="w-full max-w-2xl glass-card rounded-[4rem] p-16 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-4">
            <p className="text-[11px] font-black text-primary uppercase tracking-[4px]">DMENTE IA CORE</p>
            <p className="text-white text-3xl font-bold">Analizando Riesgo...</p>
          </div>
          <p className="text-primary text-7xl font-black tabular-nums tracking-tighter">{Math.floor(progress)}%</p>
        </div>
        <div className="h-6 w-full bg-white/5 rounded-full overflow-hidden shadow-inner p-2">
          <motion.div className="h-full bg-primary rounded-full shadow-[0_0_40px_rgba(5,148,103,0.7)]" animate={{ width: `${progress}%` }} />
        </div>
      </div>
    </motion.main>
  );
};

// --- Screen 3: Dashboard ---

const Dashboard = ({ allMessages, initialData, tone, setTone, onReset }) => {
  const [dateFilter, setDateFilter] = useState({ start: initialData.dateRange.min, end: initialData.dateRange.max });
  const [modal, setModal] = useState({ open: false, title: '', messages: [] });

  const filteredMessages = useMemo(() => {
    return allMessages.filter(m => {
      if (!m.isoDate) return true;
      return m.isoDate >= dateFilter.start && m.isoDate <= dateFilter.end;
    });
  }, [dateFilter, allMessages]);

  const filteredAnalysis = useMemo(() => {
    const stats = analyzeChat(filteredMessages);
    return { ...stats, summary: generateDetailedFinancialSummary(filteredMessages, tone) };
  }, [filteredMessages, tone]);

  const showTopicDetails = (topic) => {
    const related = filteredMessages.filter(m => m.content.toLowerCase().includes(topic.toLowerCase()));
    setModal({ open: true, title: `Evidencias: "${topic}"`, messages: related.slice(0, 50) });
  };

  const showTaskDetails = (category) => {
    const categoryKeywords = {
      'Orden Compra': /compra|buy|adquirir|entrada/i,
      'Orden Venta': /venta|sell|liquidar|salida/i,
      'Dividendos': /dividendo|pago|utilidad/i,
      'Investigación': /análisis|técnico|fundamental|gráfica/i,
      'Gestión Riesgo': /riesgo|varianza|stop|pérdida/i
    };
    const regex = categoryKeywords[category] || new RegExp(category, 'i');
    const related = filteredMessages.filter(m => regex.test(m.content));
    setModal({ open: true, title: `Exploración: ${category}`, messages: related.slice(0, 50) });
  };

  return (
    <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-12 max-w-7xl mx-auto pb-60">
      <DetailModal isOpen={modal.open} onClose={() => setModal({ ...modal, open: false })} title={modal.title} messages={modal.messages} />

      {/* Header */}
      <section className="flex flex-col lg:grid lg:grid-cols-12 gap-10 border-b border-white/5 pb-12">
        <div className="lg:col-span-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-black tracking-[4px] uppercase rounded">BVC INSIGHTS</span>
              <span className="text-white/20 font-black text-[10px] uppercase tracking-[4px]">ALPHA VERSION</span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter text-white leading-none">Investment Terminal</h1>
            <p className="text-white/30 uppercase tracking-[5px] text-xs font-bold pl-1">ARQUITECTURAS DE CRECIMIENTO: DMENTE DIGITAL</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="glass-card px-8 py-5 rounded-[2.5rem] flex flex-col gap-3">
              <p className="text-[10px] font-black text-primary uppercase tracking-[3px]">VENTANA TEMPORAL</p>
              <div className="flex items-center gap-4">
                <input type="date" value={dateFilter.start} onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" />
                <span className="text-white/30">/</span>
                <input type="date" value={dateFilter.end} onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" />
              </div>
            </div>
            <div className="glass-card px-10 py-7 rounded-[2.5rem] text-center bg-primary/5">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[3px] mb-1">MÉTRICAS</p>
              <p className="text-white text-4xl font-black tabular-nums">{filteredAnalysis.totalMessages}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Executive Summary */}
          <div className="bento-card p-14 rounded-[4rem] relative overflow-hidden group bg-gradient-to-br from-[#1c382f] to-[#0f231d]">
            <div className="absolute -top-16 -right-16 text-primary opacity-[0.05] rotate-12">
              <span className="material-symbols-outlined text-[360px]">candlestick_chart</span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <h3 className="text-white/50 text-[11px] font-black uppercase tracking-[6px]">SÍNTESIS ESTRATÉGICA BVC</h3>
            </div>
            <div className="relative z-10 space-y-4">
              {filteredAnalysis.summary.split('\n').map((line, i) => (
                <p key={i} className="text-2xl md:text-3xl text-white/90 leading-[1.8] font-medium tracking-tight antialiased italic">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="glass-card p-12 rounded-[3.5rem]">
              <h3 className="text-[12px] font-black text-primary uppercase tracking-[5px] mb-12 text-center">EXPOSICIÓN DE TEMAS</h3>
              <div className="space-y-8">
                {filteredAnalysis.topics.map((item, i) => (
                  <div key={i} className="space-y-3 group cursor-pointer" onClick={() => showTopicDetails(item.label)}>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-white group-hover:text-primary transition-colors">{item.label}</span>
                      <span className="text-white/30 tabular-nums italic text-[10px] group-hover:text-primary transition-colors">(Clic para ver mensajes)</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.weight / filteredAnalysis.topics[0].weight) * 100}%` }}
                        className="h-full bg-primary rounded-full transition-all group-hover:bg-emerald-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-12 rounded-[3.5rem]">
              <h3 className="text-[12px] font-black text-primary uppercase tracking-[5px] mb-12 text-center">CHECKLIST DE ACTIVOS</h3>
              <div className="space-y-6">
                {filteredAnalysis.tasks.map((task, i) => (
                  <div key={i} className="flex gap-6 group cursor-pointer selection:bg-transparent" onClick={() => showTaskDetails(task.category)}>
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                    </div>
                    <div className="space-y-1 pt-1 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[9px] font-black tracking-widest uppercase">{task.category}</span>
                        <span className="text-[8px] text-white/20 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver Detalles</span>
                      </div>
                      <p className="text-white/80 text-base font-bold leading-tight line-clamp-2 transition-colors group-hover:text-white">{task.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bento-card p-14 rounded-[4rem] bg-[#0c1c18]">
            <h3 className="text-[12px] font-black text-primary uppercase tracking-[6px] mb-14">FLUJO OPERATIVO (24H)</h3>
            <div className="h-72 flex items-end justify-between gap-3 px-2">
              {filteredAnalysis.hourlyActivity.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="flex-1 bg-primary/20 rounded-t-xl hover:bg-primary transition-all relative group origin-bottom"
                  style={{ height: `${Math.max(2, (val / (Math.max(...filteredAnalysis.hourlyActivity) || 1)) * 100)}%` }}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all shadow-2xl pointer-events-none mb-2 z-20">
                    {val} msgs
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <div className="glass-card p-12 rounded-[4rem] bg-white/[0.02] flex flex-col h-full">
            <h3 className="text-[12px] font-black text-primary uppercase tracking-[6px] mb-16 text-center">SHARE OF VOICE</h3>
            <div className="space-y-12 flex-1">
              {filteredAnalysis.participation.map((user, i) => (
                <div key={user.name} className="space-y-5">
                  <div className="flex justify-between items-end px-1">
                    <span className="text-white text-2xl font-black">{user.name}</span>
                    <span className="text-primary text-3xl font-black tabular-nums">{user.percentage}%</span>
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded-full p-1 shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${user.percentage}%` }} transition={{ duration: 1.5 }} className="h-full bg-primary rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 space-y-8">
              <h4 className="text-[11px] font-black text-white/50 uppercase tracking-[5px] text-center">TONO DEL ANÁLISIS</h4>
              <div className="grid grid-cols-1 gap-3">
                {['Conciso', 'Ejecutivo', 'Creativo'].map(t => (
                  <button key={t} onClick={() => setTone(t)} className={`h-16 rounded-2xl font-black uppercase tracking-[4px] text-[11px] transition-all cursor-pointer ${tone === t ? 'bg-primary text-white shadow-xl scale-[1.02]' : 'text-white/20 hover:text-white/40 bg-white/5'}`}>{t}</button>
                ))}
              </div>
            </div>

            <div className="mt-20 text-center space-y-8">
              <div className="inline-flex px-6 py-2 border border-primary/20 bg-primary/10 rounded-xl tracking-[4px] text-primary text-[10px] font-black">DMENTE STRATEGY</div>
              <p className="text-[11px] font-bold text-white/30 italic leading-relaxed px-4">
                "Arquitecturas de crecimiento diseñadas para dominar mercados y escalar la prospección de forma exponencial."
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto pt-20">
        <button className="flex-[3] h-24 bg-primary hover:bg-emerald-600 text-white font-black uppercase tracking-[5px] text-[13px] rounded-[2rem] shadow-[0_20px_70px_rgba(5,148,103,0.5)] transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-5 cursor-pointer">
          <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
          DESCARGAR ALPHA REPORT
        </button>
        <button onClick={onReset} className="flex-1 h-24 glass-card hover:bg-white/10 text-white/40 font-black uppercase tracking-[5px] text-[11px] rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-5 cursor-pointer">
          <span className="material-symbols-outlined text-2xl">refresh</span>
          RESET
        </button>
      </div>
    </motion.main>
  );
};

// --- Container Component ---

const App = () => {
  const [screen, setScreen] = useState('upload');
  const [file, setFile] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [initialAnalysis, setInitialAnalysis] = useState(null);
  const [tone, setTone] = useState('Ejecutivo');

  const handleUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setScreen('processing');
    const reader = new FileReader();
    reader.onload = (e) => {
      const messages = parseWhatsAppChat(e.target.result);
      setAllMessages(messages);
      const stats = analyzeChat(messages);
      setTimeout(() => {
        setInitialAnalysis(stats);
        setScreen('dashboard');
      }, 5000);
    };
    reader.readAsText(uploadedFile);
  };

  return (
    <div className="min-h-screen bg-[#0f231d] text-white selection:bg-primary/30">
      <Header title="BVC" subtitle="Intelligence Pro" showBack={screen === 'dashboard'} onBack={() => { setScreen('upload'); setAllMessages([]); setInitialAnalysis(null); }} />
      <AnimatePresence mode="wait">
        {screen === 'upload' && <UploadScreen key="u" onUpload={handleUpload} />}
        {screen === 'processing' && <ProcessingScreen key="p" fileName={file?.name || 'Archivo'} />}
        {screen === 'dashboard' && <Dashboard key="d" allMessages={allMessages} initialData={initialAnalysis} tone={tone} setTone={setTone} onReset={() => setScreen('upload')} />}
      </AnimatePresence>
      <footer className="fixed bottom-0 left-0 right-0 glass pb-12 pt-6 px-12 z-50">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex flex-col items-center gap-2 text-primary cursor-pointer transition-transform hover:scale-110" onClick={() => setScreen('upload')}>
            <span className="material-symbols-outlined text-[36px] font-bold">rocket_launch</span>
            <span className="text-[10px] font-black tracking-[4px] uppercase">ALPHA</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-white/10 cursor-not-allowed">
            <span className="material-symbols-outlined text-[36px]">candlestick_chart</span>
            <span className="text-[10px] font-black tracking-[4px] uppercase">OPERAR</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-white/40 group cursor-pointer" onClick={() => window.open('https://diegosan52.github.io/landing-dmente-digital/', '_blank')}>
            <span className="material-symbols-outlined text-[36px] group-hover:text-primary transition-colors">hub</span>
            <span className="text-[10px] font-black tracking-[4px] uppercase group-hover:text-primary transition-colors text-center leading-none">DMENTE<br />DGTAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
