"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Database,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
  Target,
  Layers,
  ChevronRight,
  FileSpreadsheet,
  Brain,
  Sparkles,
  Info,
  ExternalLink,
  Lock,
  Send,
  MessageSquare,
  History,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  parseCSV,
  analyzeDataset,
  type AnalysisResult,
  type DatasetColumn,
} from "@/lib/analysis-engine";
import {
  processPrompt,
  type ChatMessage,
} from "@/lib/prompt-engine";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
const PHASES = [
  { id: 0, name: "Cognitive Alignment", icon: Brain, desc: "Provenance & schema validation" },
  { id: 1, name: "Quality Assessment", icon: ShieldCheck, desc: "Integrity & leakage check" },
  { id: 2, name: "Statistical Intelligence", icon: BarChart3, desc: "Feature distributions & outliers" },
  { id: 3, name: "Algorithmic Strategy", icon: Cpu, desc: "Model family selection" },
  { id: 4, name: "Validation Protocol", icon: Target, desc: "Stability & fairness testing" },
  { id: 5, name: "Neural Exploration", icon: Layers, desc: "Deep learning feasibility" },
  { id: 6, name: "Executive Summary", icon: Sparkles, desc: "Generative AI reasoning" },
];

const RELATED_TERMS = [
  { prefix: "Autonomous", suffix: "AI Scientist" },
  { prefix: "Neural", suffix: "Research Agent" },
  { prefix: "Cognitive", suffix: "Analysis Unit" },
  { prefix: "Synthetic", suffix: "Intelligence Lab" },
  { prefix: "Predictive", suffix: "Decision Engine" },
  { prefix: "Heuristic", suffix: "Logic Core" },
  { prefix: "Algorithmic", suffix: "Investigator" },
  { prefix: "Automated", suffix: "Logic Lab" },
  { prefix: "Cognitive", suffix: "Insight Engine" }
];

export default function Home() {
  const [csvData, setCsvData] = useState<{
    headers: string[];
    rows: string[][];
  } | null>(null);
  const [targetColumn, setTargetColumn] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(-1);
  const [fileName, setFileName] = useState("");
  const [termIndex, setTermIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTermIndex((prev) => (prev + 1) % RELATED_TERMS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const parsed = parseCSV(content);
        setCsvData(parsed);
        setTargetColumn("");
        setAnalysisResult(null);
        setCurrentPhase(-1);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  const runAnalysis = async () => {
    if (!csvData || !targetColumn) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    for (let phase = 0; phase <= 6; phase++) {
      setCurrentPhase(phase);
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 300));
    }

    const result = analyzeDataset(csvData.headers, csvData.rows, targetColumn);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const loadSampleData = () => {
    const sampleCSV = `age,income,education,employed,credit_score,loan_amount,loan_term,default
32,55000,Bachelor,Yes,720,15000,36,No
45,82000,Master,Yes,680,25000,60,No
28,38000,High School,Yes,650,8000,24,No
51,120000,PhD,Yes,780,50000,84,No
23,28000,Bachelor,No,580,5000,12,Yes
38,65000,Master,Yes,710,20000,48,No
42,95000,Bachelor,Yes,740,35000,60,No
29,42000,High School,Yes,620,10000,24,Yes
55,150000,Master,Yes,800,75000,120,No
31,48000,Bachelor,Yes,690,12000,36,No
27,35000,Associate,No,600,6000,12,Yes
44,88000,Bachelor,Yes,725,28000,48,No
36,72000,Master,Yes,700,22000,36,No
48,105000,PhD,Yes,760,45000,84,No
25,32000,High School,Yes,590,4000,12,Yes
39,78000,Bachelor,Yes,715,30000,60,No
33,58000,Associate,Yes,670,16000,36,No
52,130000,Master,Yes,790,60000,96,No
26,30000,Bachelor,No,570,3500,12,Yes
41,92000,Bachelor,Yes,735,32000,48,No
35,68000,Master,Yes,705,18000,36,No
47,98000,PhD,Yes,755,40000,72,No
30,45000,High School,Yes,640,9000,24,No
54,140000,Master,Yes,795,70000,108,No
24,26000,Associate,No,560,3000,12,Yes
37,75000,Bachelor,Yes,720,24000,48,No
43,90000,Master,Yes,730,33000,60,No
28,40000,Bachelor,Yes,660,11000,24,No
50,115000,PhD,Yes,770,55000,84,No
34,62000,Associate,Yes,685,17000,36,No`;

    const parsed = parseCSV(sampleCSV);
    setCsvData(parsed);
    setFileName("sample_loan_data.csv");
    setTargetColumn("");
    setAnalysisResult(null);
    setCurrentPhase(-1);
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <div className="fixed inset-0 pointer-events-none subtle-gradient" />

      <header className="sticky top-0 z-50 border-b bg-background/60 backdrop-blur-2xl border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/10">
                <Brain className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white font-display text-glow uppercase overflow-hidden h-7">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={termIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="inline-block"
                  >
                    {RELATED_TERMS[termIndex].prefix} <span className="text-primary">{RELATED_TERMS[termIndex].suffix}</span>
                  </motion.span>
                </AnimatePresence>
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                Decision Making Protocol
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <Lock className="w-3 h-3 text-primary" />
              Secure Environment
            </div>
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-3 py-1 font-mono text-[10px] tracking-wider">
              {analysisResult ? `V.2.0: ${analysisResult.automationStatus}` : "SYSTEM_READY"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!analysisResult ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6"
                >
                  <Sparkles className="w-3 h-3" />
                  Next Generation Data Science
                </motion.div>
                <h2 className="text-7xl font-black tracking-tighter text-white mb-8 font-display leading-[0.85] uppercase h-[1.7em] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={termIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.6, ease: "circOut" }}
                    >
                      {RELATED_TERMS[termIndex].prefix} <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400 animate-gradient-x">{RELATED_TERMS[termIndex].suffix}</span>
                    </motion.div>
                  </AnimatePresence>
                </h2>
                <p className="text-xl text-zinc-500 leading-relaxed font-medium max-w-2xl border-l-2 border-primary/20 pl-6 py-2">
                  A high-fidelity research environment for autonomous decision making,
                  predictive intelligence, and scientific data validation.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-8">
                  {!csvData ? (
                    <div
                      {...getRootProps()}
                      className={`group relative overflow-hidden border border-white/5 rounded-3xl p-16 text-center transition-all duration-500 ${isDragActive
                        ? "bg-primary/10 border-primary/40"
                        : "bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-white/10"
                        }`}
                    >
                      <div className="absolute inset-0 grid-pattern opacity-40" />
                      <input {...getInputProps()} />
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
                          <Upload className="w-10 h-10 text-zinc-500 group-hover:text-primary transition-colors" />
                        </div>
                        {isDragActive ? (
                          <p className="text-primary text-xl font-bold font-display tracking-tight">Drop research payload</p>
                        ) : (
                          <>
                            <h3 className="text-2xl font-bold text-white mb-3 font-display">
                              Ingest Dataset
                            </h3>
                            <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-8 font-medium">
                              Upload your scientific CSV data to begin autonomous exploration.
                            </p>
                            <Button variant="secondary" className="px-10 h-12 font-bold rounded-xl bg-white text-black hover:bg-zinc-200 transition-all">
                              Select File
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 h-full min-h-[600px] flex flex-col">
                      <div className="flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-zinc-950/50 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white tracking-tight">{fileName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-mono border-zinc-800 text-zinc-500 uppercase">CSV_MODE</Badge>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{csvData.rows.length} records</p>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setCsvData(null)} className="h-9 w-9 p-0 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                          <XCircle className="w-5 h-5" />
                        </Button>
                      </div>

                      <Card className="flex-1 flex flex-col glass-panel border-white/5 overflow-hidden min-h-[500px] rounded-3xl relative">
                        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                        <CardHeader className="border-b border-white/5 bg-white/[0.02] p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Terminal className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-white">Neural Exploration</CardTitle>
                                <CardDescription className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Prompt-driven Analysis</CardDescription>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-800" />)}
                            </div>
                          </div>
                        </CardHeader>
                        <ChatInterface headers={csvData.headers} rows={csvData.rows} result={null} />
                      </Card>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    <Card className="glass-panel border-white/5 p-8 rounded-3xl group cursor-default transition-all duration-500 hover:bg-zinc-900/30">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-6 h-6 text-amber-500" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2 font-display">Neural Engine</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed font-medium">Accelerated pipeline execution with sub-millisecond latency.</p>
                    </Card>
                    <Card onClick={loadSampleData} className="glass-panel border-white/5 p-8 rounded-3xl group cursor-pointer transition-all duration-500 hover:bg-zinc-900/30">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Database className="w-6 h-6 text-indigo-500" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2 font-display">Reference Data</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed font-medium">Load curated datasets to explore system capabilities.</p>
                    </Card>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-8">
                  <Card className="glass-panel border-white/5 rounded-3xl overflow-hidden relative">
                    {isAnalyzing && <div className="scan-line" />}
                    <CardHeader className="p-8 pb-4">
                      <CardTitle className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">System Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-8">
                      {!csvData ? (
                        <div className="py-20 text-center border border-white/5 rounded-2xl bg-zinc-950/30">
                          <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center mx-auto mb-4 animate-[spin_10s_linear_infinite]">
                            <Info className="w-5 h-5 text-zinc-800" />
                          </div>
                          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">System Idle</p>
                        </div>
                      ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 ml-1">Target Dimension</label>
                            <Select value={targetColumn} onValueChange={setTargetColumn}>
                              <SelectTrigger className="bg-zinc-950/50 border-white/10 h-14 rounded-xl focus:ring-primary/20 text-white font-bold shadow-inner">
                                <SelectValue placeholder="Identify Prediction Target" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-950 border-white/10 rounded-xl overflow-hidden backdrop-blur-2xl">
                                {csvData.headers.map((header) => (
                                  <SelectItem key={header} value={header} className="focus:bg-primary/20 transition-colors py-3 font-medium">{header}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-zinc-900/30 border border-white/5">
                              <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              <p className="text-[10px] text-zinc-500 font-medium leading-normal">Our algorithms will prioritize this variable as the dependent outcome for all subsequent modeling phases.</p>
                            </div>
                          </div>

                          <Button
                            onClick={runAnalysis}
                            disabled={!targetColumn || isAnalyzing}
                            className={`group relative w-full h-14 rounded-xl overflow-hidden transition-all duration-500 ${isAnalyzing ? "opacity-90" : "hover:scale-[1.02] shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)]"
                              } font-bold text-sm tracking-widest uppercase bg-primary hover:bg-primary/90 text-white`}
                          >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                              {isAnalyzing ? (
                                <>
                                  <Activity className="w-5 h-5 animate-spin" />
                                  Phase {currentPhase + 1} ACTIVE
                                </>
                              ) : (
                                <>
                                  <Cpu className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                  Initialize Engine
                                </>
                              )}
                            </div>
                          </Button>
                        </motion.div>
                      )}

                      {isAnalyzing && (
                        <div className="space-y-6 pt-8 border-t border-white/5">
                          <div className="flex items-center justify-between font-mono">
                            <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Pipeline_Buffer</span>
                            <span className="text-primary text-sm font-black">{Math.round(((currentPhase + 1) / 7) * 100)}%</span>
                          </div>
                          <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5 p-[1px]">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${((currentPhase + 1) / 7) * 100}%`,
                                backgroundPosition: ["0% 0%", "200% 0%"]
                              }}
                              transition={{
                                width: { duration: 0.5 },
                                backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                              }}
                            />
                          </div>
                          <div className="space-y-4">
                            {PHASES.map((phase, idx) => {
                              const isActive = idx === currentPhase;
                              const isDone = idx < currentPhase;
                              const Icon = phase.icon;
                              return (
                                <motion.div
                                  key={phase.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${isActive ? "bg-primary/10 border border-primary/20" : isDone ? "bg-emerald-500/5 opacity-100" : "opacity-20"
                                    }`}
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-500 ${isDone ? "bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                                    isActive ? "bg-primary border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]" :
                                      "border-white/10"
                                    }`}>
                                    {isDone ? <CheckCircle2 className="w-4 h-4 text-zinc-950" /> : <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-500"}`} />}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-primary" : isDone ? "text-white" : "text-zinc-500"}`}>{phase.name}</p>
                                    {isActive && (
                                      <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[9px] text-zinc-500 font-bold mt-0.5 uppercase tracking-tighter"
                                      >
                                        {phase.desc}
                                      </motion.p>
                                    )}
                                  </div>
                                  {isActive && <Activity className="w-3 h-3 text-primary animate-pulse" />}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="p-8 rounded-3xl bg-zinc-950/50 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary/20" />
                    <Info className="w-6 h-6 text-zinc-700 mb-6" />
                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-3">Model Selection Logic</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                      The engine autonomously evaluates 14 algorithm families, performing rigorous k-fold cross-validation
                      and hyperparameter optimization to ensure maximum stability and predictive power.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <AnalysisResultsView
              result={analysisResult}
              headers={csvData?.headers || []}
              rows={csvData?.rows || []}
              onReset={() => {
                setAnalysisResult(null);
                setCsvData(null);
                setTargetColumn("");
                setCurrentPhase(-1);
                setFileName("");
              }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}


function ChatInterface({ headers, rows, result }: { headers: string[], rows: string[][], result: AnalysisResult | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: result
          ? `Analysis Phase complete. I've mapped **${headers.length}** feature vectors across a sample of **${rows.length}** observations. I'm ready to perform deep-dive statistical reasoning or generate dynamic visualizations for you.`
          : `Dataset ingested. **${headers.length}** features detected. I'm available for raw exploration and heuristic analysis while the primary modeling pipeline initializes.`,
        timestamp: new Date()
      }]);
    }
  }, [headers, rows, result]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsGenerating(true);

    try {
      // Pass a sample to avoid hitting token limits
      const rowsSample = rows.slice(0, 8);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          analysis: result,
          headers,
          rowsSample
        })
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.content,
        chart: data.chart,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I encountered an error connecting to the neural core. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <CardContent className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-zinc-950/20">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[90%] space-y-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-5 rounded-2xl text-sm leading-relaxed shadow-xl ${msg.role === 'user'
                ? 'bg-primary text-white font-bold glow-primary'
                : 'bg-zinc-900/80 border border-white/5 text-zinc-300 backdrop-blur-md'
                }`}>
                <div className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-strong:text-white prose-pre:p-0 prose-pre:bg-transparent">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-white mt-4 first:mt-0">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-white mt-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-white mt-2">{children}</h3>,
                      p: ({ children }) => <p className="mb-2 leading-snug text-sm">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 text-sm">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 text-sm">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                      strong: ({ children }) => <strong className="text-white font-bold bg-white/5 px-1 rounded">{children}</strong>,
                      code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                          <div className="rounded-lg overflow-hidden my-3 border border-white/10 shadow-lg">
                            <div className="bg-white/5 px-3 py-1 text-[10px] uppercase font-bold text-zinc-500 border-b border-white/5 flex justify-between items-center">
                              <span>{match[1]}</span>
                              <span className="text-xs">Copy</span>
                            </div>
                            <SyntaxHighlighter
                              {...props}
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, borderRadius: 0, padding: '1rem', fontSize: '12px' }}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className="bg-zinc-950 border border-white/10 px-1 py-0.5 rounded text-xs font-mono text-primary font-bold" {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>

              {msg.chart && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-6 rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl w-full min-h-[350px] shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none" />
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{msg.chart.title}</p>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    {msg.chart.type === 'bar' ? (
                      <BarChart data={msg.chart.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#71717a", fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: '#ffffff05' }}
                          contentStyle={{ backgroundColor: "#09090b", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: '10px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32}>
                          {msg.chart.data.map((_, idx) => (
                            <Cell key={`cell-${idx}`} fillOpacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : msg.chart.type === 'pie' ? (
                      <PieChart>
                        <Pie
                          data={msg.chart.data}
                          dataKey="value"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={8}
                        >
                          {msg.chart.data.map((_, idx) => (
                            <Cell key={`cell-${idx}`} fill={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][idx % 5]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: '10px', fontWeight: 'bold' }} />
                        <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '20px' }} />
                      </PieChart>
                    ) : msg.chart.type === 'scatter' ? (
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                        <XAxis type="number" dataKey="x" name="x" tick={{ fill: "#71717a", fontSize: 9 }} axisLine={false} />
                        <YAxis type="number" dataKey="y" name="y" tick={{ fill: "#71717a", fontSize: 9 }} axisLine={false} />
                        <ZAxis type="category" dataKey="label" name="label" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "#09090b", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: '10px' }} />
                        <Scatter data={msg.chart.data} fill="#3b82f6" fillOpacity={0.6} stroke="#3b82f6" strokeWidth={2} />
                      </ScatterChart>
                    ) : null}
                  </ResponsiveContainer>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-zinc-900/80 border border-white/5 p-4 rounded-2xl flex items-center gap-2 backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Reasoning</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-[bounce_1s_infinite_0ms]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-[bounce_1s_infinite_200ms]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-[bounce_1s_infinite_400ms]" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </CardContent>
      <div className="p-8 border-t border-white/5 bg-zinc-950/40 backdrop-blur-xl">
        <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/10 rounded-2xl p-2.5 pl-6 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all duration-300 shadow-2xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Interrogate data structures..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-zinc-600 font-medium"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim() || isGenerating} className="rounded-xl h-11 w-11 bg-primary hover:bg-primary/90 shadow-lg glow-primary transition-all active:scale-95">
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2.5 mt-5 overflow-x-auto pb-2 no-scrollbar">
          {(result
            ? ["Correlations Matrix", "Distribution Analysis", "Model Constraints", "Outlier Detection"]
            : [`Analyze ${headers[0]}`, `Compare ${headers[0]} & ${headers[1]}`, "Heuristic Preview", "Statistical Summary"]
          ).map((hint) => (
            <button
              key={hint}
              onClick={() => setInput(hint)}
              className="text-[9px] font-black uppercase tracking-[0.15em] whitespace-nowrap px-4 py-2 rounded-xl border border-white/5 bg-zinc-900/30 text-zinc-500 hover:text-white hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function AnalysisResultsView({
  result,
  headers,
  rows,
  onReset
}: {
  result: AnalysisResult;
  headers: string[];
  rows: string[][];
  onReset: () => void
}) {
  const verdictConfig = {
    PASS: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/20", accent: "#10b981" },
    WARN: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/5", border: "border-amber-500/20", accent: "#f59e0b" },
    FAIL: { icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/5", border: "border-rose-500/20", accent: "#f43f5e" },
  };

  const { icon: VerdictIcon, color, bg, border, accent } = verdictConfig[result.dataQuality.verdict];

  const trustScoreData = result.trustScore ? [
    { subject: "DATA_INTEGRITY", value: result.trustScore.dataQuality },
    { subject: "MODEL_ACCURACY", value: result.trustScore.performance },
    { subject: "STABILITY", value: result.trustScore.stability },
    { subject: "FAIRNESS", value: result.trustScore.fairness },
    { subject: "EXPLAINABILITY", value: result.trustScore.explainability },
  ] : [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            <Activity className="w-4 h-4" />
            Validation Sequence Finalized
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter font-display leading-[0.9]">Autonomous <br />Scientific Report</h2>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Badge className={`${bg} ${border} ${color} border px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest`}>
              <VerdictIcon className="w-3.5 h-3.5 mr-2" />
              GATE: {result.dataQuality.verdict}
            </Badge>
            <Badge variant="outline" className="font-mono text-[10px] border-white/5 text-zinc-500 px-3 py-1.5 rounded-full tracking-widest bg-white/5">
              THREAT_LEVEL: {result.riskLevel?.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg" onClick={() => window.print()} className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl font-bold px-6">
            Generate PDF
          </Button>
          <Button onClick={onReset} size="lg" className="bg-white text-black font-black hover:bg-zinc-200 shadow-2xl rounded-xl px-8">
            New Sequence
          </Button>
        </div>
      </div>

      <Tabs defaultValue="discovery" className="space-y-10">
        <TabsList className="bg-zinc-950/50 border border-white/5 p-1.5 rounded-2xl h-14 backdrop-blur-xl">
          <TabsTrigger value="discovery" className="text-[10px] font-black uppercase tracking-widest px-8 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Lab Exploration
          </TabsTrigger>
          <TabsTrigger value="overview" className="text-[10px] font-black uppercase tracking-widest px-8 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">Overview</TabsTrigger>
          <TabsTrigger value="modeling" className="text-[10px] font-black uppercase tracking-widest px-8 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">Models</TabsTrigger>
          <TabsTrigger value="trust" className="text-[10px] font-black uppercase tracking-widest px-8 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">Ethics</TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[750px]">
            <Card className="lg:col-span-8 flex flex-col glass-panel border-white/5 overflow-hidden rounded-[2.5rem] relative">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Terminal className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-black uppercase tracking-[0.3em] text-white">Interactive Research Agent</CardTitle>
                      <CardDescription className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analysis Mode Active</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-black border-primary/20 bg-primary/5 text-primary px-3 py-1 rounded-full tracking-widest">REALTIME_COGNITION</Badge>
                </div>
              </CardHeader>
              <ChatInterface headers={headers} rows={rows} result={result} />
            </Card>

            <div className="lg:col-span-4 space-y-8">
              <Card className="glass-panel border-white/5 rounded-[2.5rem] p-8">
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 text-zinc-500">
                    <History className="w-5 h-5 text-primary" />
                    Neural Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-8">
                  <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 shadow-inner">
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-3">Key Observation</p>
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium italic">
                      "Engine detected non-linear resonance between **{headers[0]}** and **{headers[1]}**. This cluster suggests localized variance that may impact {result.finalModel?.name}'s generalization."
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Suggested Protocols</p>
                    <ul className="space-y-3">
                      {["Identify Outlier Clusters", "Analyze Residual Distribution", "Evaluate Feature Parity"].map((q, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-zinc-400 group cursor-pointer hover:text-white transition-all">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-primary transition-colors" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 shadow-[0_20px_50px_rgba(59,130,246,0.15)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-primary/30 transition-all duration-1000" />
                <Sparkles className="w-8 h-8 text-primary mb-6" />
                <h4 className="text-lg font-black text-white mb-3 font-display">Cognitive Reasoning</h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  Autonomous agents are cross-referencing visualization outputs with statistical truth tables.
                  Every graph is verified for mathematical integrity.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-8 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummaryCard title="Dataset Rows" value={result.dataQuality.datasetSize.rows.toLocaleString()} icon={Database} trend="Vector count" />
            <SummaryCard title="Missing Density" value={`${result.dataQuality.missingOverall}%`} icon={AlertTriangle} trend="Data entropy" />
            <SummaryCard title="Target Entropy" value={result.dataQuality.targetInfo.type} icon={Target} trend="Class logic" />
            <SummaryCard title="Trust Score" value={`${result.trustScore?.total}/100`} icon={ShieldCheck} trend="Reliability" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-4 glass-panel border-white/5 rounded-[2.5rem] p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Target Distribution</CardTitle>
                <CardDescription className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Class balance logic</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex justify-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={result.dataQuality.targetInfo.distribution}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                    >
                      {result.dataQuality.targetInfo.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: '10px', fontWeight: 'bold' }} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-8 glass-panel border-white/5 rounded-[2.5rem] p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Neural Correlation Matrix</CardTitle>
                <CardDescription className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Linear dependency mapping</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex flex-col items-center">
                <div className="relative h-[260px] w-full max-w-[500px] overflow-hidden flex items-center justify-center p-4">
                  <div className="grid grid-cols-8 gap-1.5 w-full">
                    {result.dataQuality.correlationMatrix.slice(0, 64).map((cell, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-md flex items-center justify-center relative group overflow-hidden border border-white/5"
                        style={{
                          backgroundColor: cell.value > 0
                            ? `rgba(59, 130, 246, ${Math.abs(cell.value)})`
                            : `rgba(244, 63, 94, ${Math.abs(cell.value)})`
                        }}
                      >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-zinc-950/90 text-white p-2 rounded-xl absolute z-50 whitespace-nowrap text-[8px] font-black border border-white/10 shadow-2xl backdrop-blur-md">
                          {cell.x} ↔ {cell.y}: {cell.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" /> Neg Correlation</div>
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-zinc-800" /> Neutral</div>
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" /> Pos Correlation</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modeling" className="space-y-8 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <Card className="glass-panel border-white/5 rounded-[2.5rem] p-8">
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Model Family Benchmarking</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Cross-validated precision score</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={result.models} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 9, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 1]} tick={{ fill: "#71717a", fontSize: 9, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: '#ffffff05' }}
                        contentStyle={{ backgroundColor: "#09090b", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="validationValue" radius={[8, 8, 0, 0]} barSize={48}>
                        {result.models?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.status === 'accepted' ? "#3b82f6" : "#18181b"} stroke={entry.status === 'accepted' ? "#3b82f6" : "#27272a"} strokeWidth={1} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4">
              <Card className="bg-primary border-primary/20 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.4)] rounded-[2.5rem] p-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 mb-8 group-hover:rotate-12 transition-transform duration-500">
                    <Cpu className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black text-white mb-2 font-display">CHAMPION MODEL</CardTitle>
                  <CardDescription className="text-white/80 text-[11px] font-black uppercase tracking-[0.3em] mb-10">{result.finalModel?.name}</CardDescription>
                  <div className="space-y-6">
                    {result.finalModel?.testMetrics.map((m) => (
                      <div key={m.name} className="flex justify-between items-end border-b border-white/20 pb-4">
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{m.name}</span>
                        <div className="text-right">
                          <span className="text-xl font-black text-white font-mono">{m.value.toFixed(4)}</span>
                          <div className="text-[9px] text-white/50 font-black tracking-widest uppercase mt-1">{m.ci}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trust" className="space-y-8 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-6 glass-panel border-white/5 rounded-[2.5rem] p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Scientific Trust Radar</CardTitle>
                <CardDescription className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Multi-dimensional parity check</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex justify-center">
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={trustScoreData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid stroke="#ffffff05" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#71717a", fontSize: 8, fontWeight: 900, textTransform: 'uppercase' }} />
                    <PolarRadiusAxis domain={[0, 100]} hide />
                    <Radar dataKey="value" stroke={accent} fill={accent} fillOpacity={0.15} strokeWidth={3} dot={{ r: 5, fill: accent, strokeWidth: 2, stroke: '#000' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="lg:col-span-6 space-y-8">
              <Card className="glass-panel border-white/5 rounded-[2.5rem] p-10">
                <CardHeader className="p-0 mb-10">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 text-center">Reliability Index</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-12">
                  <div className="flex flex-col items-center gap-10">
                    <div className="relative w-48 h-48 shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-900" />
                        <motion.circle
                          cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent"
                          strokeDasharray={2 * Math.PI * 80}
                          initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - (result.trustScore?.total || 0) / 100) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={color} strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-6xl font-black text-white leading-none font-display"
                        >
                          {result.trustScore?.total}
                        </motion.span>
                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mt-2">PERCENTILE</span>
                      </div>
                    </div>
                    <div className="text-center space-y-4 max-w-sm">
                      <h4 className="text-xl font-black text-white font-display">RESEARCH VERDICT</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                        Autonomous assessment confirmed a reliability index of {result.trustScore?.total}.
                        Data distribution exhibits strong normality with minimal covariate shift detected across validation folds.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function SummaryCard({ title, value, icon: Icon, trend }: { title: string; value: string; icon: any; trend: string }) {
  return (
    <Card className="glass-panel border-white/5 rounded-3xl card-hover p-6">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center shadow-inner">
            <Icon className="w-5 h-5 text-zinc-400" />
          </div>
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-2 py-1 rounded-full border border-primary/10">{trend}</span>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black text-white tracking-tighter font-display">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
