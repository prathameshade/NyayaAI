import React, { useEffect, useRef, useState } from "react";

/**
 * NyayaAI — Single-file React frontend
 * Compatible with Vite + React setups.
 *
 * Optional Backend Setup:
 *   Set VITE_API_BASE_URL in your .env file (e.g., http://localhost:8000)
 *   POSTs { query } to `${VITE_API_BASE_URL}/chat`
 */

const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || "").replace(/\/$/, "");

const SUGGESTIONS = [
  { icon: "⚖️", title: "Know your rights", question: "What are my fundamental rights under the Indian Constitution?" },
  { icon: "🛡️", title: "Online fraud", question: "What should I do if I am a victim of online payment fraud in India?" },
  { icon: "🏠", title: "Property & rent", question: "What should a tenant check before signing a rental agreement in India?" },
  { icon: "🛍️️", title: "Consumer rights", question: "What can I do if a seller refuses to replace a defective product?" },
];

const TOPICS = [
  ["Constitution", "Fundamental rights, duties, and constitutional protections", "⚖️"],
  ["Cybercrime", "Online fraud, account safety, and reporting options", "🛡️"],
  ["Consumer rights", "Defective products, refunds, and service complaints", "🛍️"],
  ["Property & tenancy", "Rent agreements, security deposits, and tenancy basics", "🏠"],
  ["Employment", "Workplace rights, employment contracts, and labor standards", "💼"],
  ["Family law", "General information on family-related legal processes", "👨‍👩‍👧"],
];

function Icon({ name, size = 20 }) {
  const paths = {
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    plus: <path d="M12 5v14M5 12h14" />,
    chat: <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a7.8 7.8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a7.8 7.8 0 0 1-1.7-1l-1.7.6-1.4-2.4L7.3 15a7.8 7.8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a7.8 7.8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a7.8 7.8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a7.8 7.8 0 0 1-.1 2Z" transform="translate(-1 -1) scale(1.08)" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" /></>,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.chat}
    </svg>
  );
}

function makeDemoAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes("fraud") || q.includes("cyber") || q.includes("payment")) {
    return {
      text: "If you believe you have experienced online payment fraud in India, act immediately. Contact your bank or payment provider through its official app/website, preserve transaction receipts, and report the event through official cybercrime channels. You can call India's national cybercrime helpline at 1930 as soon as possible. Never share OTPs, PINs, passwords, or remote-access authorization codes with callers.",
      sources: ["National Cyber Crime Reporting Portal (cybercrime.gov.in)", "RBI Helpline & Guidance Guidelines"],
    };
  }
  if (q.includes("constitution") || q.includes("fundamental right")) {
    return {
      text: "The Constitution of India outlines Fundamental Rights in Part III (Articles 12–35). Key protections include Equality Before Law (Art. 14), Protection of Speech and Freedom (Art. 19), Protection of Life and Personal Liberty (Art. 21), and Right to Constitutional Remedies (Art. 32). Applicability depends on context and state actions.",
      sources: ["Constitution of India — Part III (Articles 12–35)"],
    };
  }
  if (q.includes("tenant") || q.includes("rent") || q.includes("rental")) {
    return {
      text: "Before signing a residential rental agreement in India, check: contract duration, monthly rent & due dates, security deposit refund terms, lock-in period, notice period for vacating, and responsibility for repairs/maintenance. Ensure the agreement is duly executed and registered where mandated by state law.",
      sources: ["State Tenancy Acts", "Model Tenancy Act, 2021"],
    };
  }
  if (q.includes("consumer") || q.includes("defective") || q.includes("seller") || q.includes("refund")) {
    return {
      text: "Retain proof of purchase (invoice/bill), warranty cards, and communication logs. Issue a formal written complaint to the merchant specifying the defect and requested remedy (repair, replacement, or refund). If unresolved, you may file a grievance on the National Consumer Helpline portal or file a claim with the District Consumer Disputes Redressal Commission.",
      sources: ["Consumer Protection Act, 2019", "National Consumer Helpline (1915)"],
    };
  }
  return {
    text: "I can help clarify legal concepts and outline formal procedure options under Indian law. Legal outcomes depend heavily on facts, documentation, jurisdiction, and dates. Please detail your issue (without sharing confidential personal numbers or identifiers) to receive relevant statutory references.",
    sources: ["Relevant Indian Legislation", "Official Government Legal References"],
  };
}

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [language, setLanguage] = useState("en-IN");
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState("");
  const [history, setHistory] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      try { recognitionRef.current?.stop(); } catch (_) {}
    };
  }, []);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function startNewChat() {
    if (messages.length) {
      setHistory(prev => [
        {
          id: Date.now(),
          title: messages.find(m => m.role === "user")?.content || "Legal Query",
          messages,
        },
        ...prev,
      ].slice(0, 10));
    }
    setMessages([]);
    setInput("");
    setActivePage("home");
    setListening(false);
    setVoiceText("");
  }

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      notify("Voice input is not supported in this browser. Try Google Chrome or Microsoft Edge.");
      return;
    }
    if (listening) {
      try { recognitionRef.current?.stop(); } catch (_) {}
      setListening(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => { setListening(true); setVoiceText(""); };
      recognition.onresult = (event) => {
        let interim = "";
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
          else interim += event.results[i][0].transcript;
        }
        const transcript = (finalText || interim).trim();
        setVoiceText(transcript);
        if (finalText.trim()) setInput(prev => `${prev}${prev ? " " : ""}${finalText.trim()}`);
      };
      recognition.onerror = (event) => {
        setListening(false);
        if (event.error === "not-allowed") notify("Microphone access blocked. Please enable permissions in browser settings.");
        else if (event.error !== "no-speech" && event.error !== "aborted") notify("Speech input interrupted. Please try again.");
      };
      recognition.onend = () => setListening(false);
      recognition.start();
    } catch (_) {
      setListening(false);
      notify("Could not initialize microphone. Please check settings.");
    }
  }

  async function sendToBackend(question) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: question }),
    });
    if (!response.ok) throw new Error(`Server status ${response.status}`);
    const data = await response.json();
    return {
      text: data.answer || data.response || data.message || "No text answer returned from server.",
      sources: Array.isArray(data.sources)
        ? data.sources.map(s => typeof s === "string" ? s : s.title || s.name || JSON.stringify(s))
        : [],
    };
  }

  async function handleSend(textOverride) {
    const question = (textOverride ?? input).trim();
    if (!question || loading) return;

    const userMessage = { id: Date.now(), role: "user", content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setVoiceText("");
    setActivePage("chat");
    setLoading(true);

    try {
      const answer = API_BASE_URL ? await sendToBackend(question) : makeDemoAnswer(question);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: answer.text, sources: answer.sources || [] },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `Backend Connection Error: ${error.message}. Please verify server setup.`,
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      notify("Response copied to clipboard");
    } catch (_) {
      notify("Copy failed. Select text manually.");
    }
  }

  const navItems = [
    { id: "home", label: "Home", icon: "chat" },
    { id: "topics", label: "Explore Legal Topics", icon: "book" },
    { id: "history", label: "Recent Discussions", icon: "clock" },
  ];

  return (
    <div className={`nyaya-app ${dark ? "theme-dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        :root { font-family: 'DM Sans', sans-serif; color: #172033; background: #f7f8fc; }
        * { box-sizing: border-box; }
        body { margin: 0; }
        button, input, textarea, select { font: inherit; }
        button { cursor: pointer; }

        .nyaya-app { --bg:#f7f8fc; --panel:#fff; --text:#172033; --muted:#778198; --line:#e8ebf2; --soft:#f1f4fa; --accent:#3859d9; --accent2:#6c7ff0; min-height:100vh; display:flex; background:var(--bg); color:var(--text); }
        .nyaya-app.theme-dark { --bg:#101522; --panel:#171e2d; --text:#edf1ff; --muted:#9aa6c0; --line:#293247; --soft:#202a3d; --accent:#8194ff; --accent2:#a1adff; }

        .sidebar { width:258px; background:var(--panel); border-right:1px solid var(--line); padding:24px 15px; display:flex; flex-direction:column; flex-shrink:0; transition:transform .25s ease, width .25s ease; z-index:10; }
        .sidebar.collapsed { width:78px; padding:24px 10px; }
        .brand { display:flex; align-items:center; gap:11px; padding:0 9px 29px; }
        .brand-mark { width:42px; height:42px; border-radius:14px; display:grid; place-items:center; color:#fff; background:linear-gradient(145deg,#516cf0,#293cb0); box-shadow:0 7px 18px #4358d42d; flex-shrink:0; }
        .brand-name { font:800 20px Manrope,sans-serif; letter-spacing:-.8px; white-space:nowrap; }
        .brand-sub { color:var(--muted); font-size:10px; margin-top:2px; letter-spacing:.7px; white-space:nowrap; }

        .new-chat { width:100%; display:flex; align-items:center; justify-content:center; gap:9px; border:0; color:#fff; font-weight:700; padding:13px; border-radius:13px; background:linear-gradient(110deg,#4965e8,#6578ef); box-shadow:0 8px 20px #4965e82b; margin-bottom:27px; white-space:nowrap; }
        .nav-label { font-size:10px; color:var(--muted); letter-spacing:1.4px; font-weight:700; padding:0 12px 11px; white-space:nowrap; }
        .nav-list { display:grid; gap:6px; }
        .nav-item { display:flex; gap:12px; align-items:center; width:100%; border:0; border-radius:11px; padding:12px; text-align:left; color:var(--muted); background:transparent; white-space:nowrap; }
        .nav-item:hover, .nav-item.active { background:var(--soft); color:var(--accent); }
        .nav-item.active { font-weight:700; }

        .sidebar-bottom { margin-top:auto; }
        .privacy-card { border:1px solid var(--line); background:var(--bg); border-radius:14px; padding:14px; margin:15px 3px; }
        .privacy-icon { color:#3d9c76; display:flex; margin-bottom:8px; }
        .privacy-card strong { font-size:12px; display:block; margin-bottom:4px; }
        .privacy-card p { margin:0; color:var(--muted); font-size:11px; line-height:1.6; }
        .profile { display:flex; gap:10px; align-items:center; border-top:1px solid var(--line); padding:17px 8px 0; }
        .avatar { width:36px; height:36px; display:grid; place-items:center; flex-shrink:0; border-radius:12px; color:#435bd0; background:#e9edff; font-weight:800; }
        .profile-name { font-size:12px; font-weight:700; }
        .profile-sub { color:var(--muted); font-size:10px; margin-top:3px; }

        .main { flex:1; min-width:0; display:flex; flex-direction:column; }
        .topbar { height:75px; display:flex; align-items:center; justify-content:space-between; padding:0 34px; border-bottom:1px solid var(--line); background:var(--panel); }
        .top-left, .top-actions { display:flex; align-items:center; gap:15px; }
        .icon-btn { width:38px; height:38px; display:grid; place-items:center; border:1px solid var(--line); border-radius:11px; background:var(--panel); color:var(--muted); }
        .icon-btn:hover { color:var(--accent); border-color:#cbd2ff; }
        .breadcrumb { color:var(--muted); font-size:12px; }
        .breadcrumb b { color:var(--text); font-weight:700; }
        .status-pill { display:flex; align-items:center; gap:7px; color:#27865f; background:#e9f8f0; padding:7px 10px; border-radius:20px; font-size:11px; font-weight:700; }
        .status-dot { width:6px; height:6px; border-radius:50%; background:#32b77a; }
        .language-select { color:var(--muted); border:1px solid var(--line); background:var(--panel); border-radius:10px; padding:9px 10px; font-size:12px; outline:none; }

        .content { width:min(1060px,100%); margin:0 auto; padding:35px 32px 28px; flex:1; }
        .welcome { text-align:center; padding:10px 0 24px; }
        .eyebrow { display:inline-flex; gap:7px; align-items:center; border:1px solid #dce2ff; color:var(--accent); background:#eef1ff; border-radius:30px; padding:7px 12px; font-size:11px; font-weight:700; }
        .hero-title { font:800 clamp(30px,4vw,43px)/1.15 Manrope,sans-serif; letter-spacing:-1.8px; margin:18px 0 12px; }
        .gradient-text { color:var(--accent); }
        .hero-copy { max-width:540px; margin:0 auto; color:var(--muted); font-size:14px; line-height:1.75; }

        .ask-panel { background:var(--panel); border:1px solid var(--line); box-shadow:0 14px 40px #1d2c570a; border-radius:20px; padding:15px; max-width:820px; margin:0 auto; }
        .ask-top { display:flex; gap:12px; align-items:flex-start; }
        .ask-icon { display:grid; place-items:center; width:39px; height:39px; border-radius:12px; color:var(--accent); background:var(--soft); flex-shrink:0; }
        .ask-input { border:0; outline:none; resize:vertical; min-height:54px; max-height:180px; width:100%; color:var(--text); background:transparent; padding:8px 0; font-size:14px; line-height:1.6; }
        .ask-input::placeholder { color:#9ba4b8; }
        .ask-bottom { display:flex; align-items:center; justify-content:space-between; gap:12px; border-top:1px solid var(--line); padding-top:13px; margin-top:8px; }
        .ask-hint { color:var(--muted); font-size:11px; display:flex; align-items:center; gap:7px; }
        .ask-actions { display:flex; align-items:center; gap:9px; }
        .send-btn { display:flex; align-items:center; gap:8px; background:var(--accent); color:#fff; border:0; border-radius:11px; padding:10px 15px; font-size:12px; font-weight:700; }
        .send-btn:disabled { opacity:.45; cursor:not-allowed; }

        .mic-btn { position:relative; display:grid; place-items:center; width:45px; height:45px; border:1px solid #d9defb; color:var(--accent); border-radius:14px; background:#f0f2ff; transition:transform .2s, background .2s; }
        .mic-btn:hover { transform:translateY(-2px); background:#e7eaff; }
        .mic-btn.listening { color:#fff; border-color:#ed5367; background:#ef5368; animation:micBeat 1.4s ease-in-out infinite; }

        @keyframes micBeat { 0%,100% { box-shadow:0 0 0 0 #ef53683b; } 50% { box-shadow:0 0 0 8px #ef536800; } }

        .voice-section { max-width:820px; margin:22px auto 0; text-align:center; }
        .voice-title { color:var(--muted); font-size:11px; font-weight:700; letter-spacing:1.6px; margin-bottom:15px; }
        .voice-stage { position:relative; width:150px; height:150px; margin:0 auto; display:grid; place-items:center; }
        .big-mic { position:relative; z-index:1; width:85px; height:85px; border-radius:50%; display:grid; place-items:center; color:#fff; border:4px solid #fff; background:linear-gradient(145deg,#6479f5,#3b4fc7); box-shadow:0 10px 28px #4c60d34a; transition:transform .25s; }
        .big-mic:hover { transform:scale(1.05); }
        .big-mic.listening { background:linear-gradient(145deg,#ff7b8a,#dc3654); }
        .voice-caption { font-size:13px; font-weight:700; margin-top:8px; }
        .voice-transcript { max-width:540px; margin:12px auto 0; color:var(--accent); font-size:12px; min-height:18px; }

        .section-head { display:flex; justify-content:space-between; align-items:end; gap:12px; margin:35px 0 15px; }
        .section-head h2 { margin:0; font:800 17px Manrope,sans-serif; }
        .suggestion-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
        .suggestion-card { text-align:left; border:1px solid var(--line); border-radius:15px; background:var(--panel); padding:16px; min-height:138px; transition:transform .2s, border .2s; color:var(--text); }
        .suggestion-card:hover { transform:translateY(-3px); border-color:#c8d0ff; }
        .suggestion-icon { font-size:22px; margin-bottom:14px; }
        .suggestion-title { font-size:12px; font-weight:700; margin-bottom:7px; }
        .suggestion-question { color:var(--muted); font-size:11px; line-height:1.55; }

        .disclaimer { display:flex; align-items:flex-start; gap:10px; background:var(--soft); border-radius:12px; padding:13px 15px; color:var(--muted); font-size:11px; margin-top:27px; }
        .disclaimer svg { flex-shrink:0; color:var(--accent); margin-top:1px; }

        .chat-layout { max-width:850px; margin:0 auto; }
        .message-list { display:grid; gap:22px; padding-bottom:18px; }
        .message { display:flex; gap:12px; align-items:flex-start; }
        .message.user { flex-direction:row-reverse; }
        .message-avatar { width:35px; height:35px; border-radius:12px; flex-shrink:0; display:grid; place-items:center; background:#e9edff; color:#435bd0; }
        .message.user .message-avatar { background:#e3f4eb; color:#27865f; }
        .message-body { max-width:min(720px, calc(100% - 50px)); }
        .message.user .message-body { text-align:right; }
        .message-bubble { display:inline-block; text-align:left; background:var(--panel); border:1px solid var(--line); border-radius:4px 15px 15px 15px; padding:15px 17px; font-size:13px; line-height:1.8; white-space:pre-wrap; }
        .message.user .message-bubble { background:#edf0ff; color:#263a9d; border-color:#e0e5ff; border-radius:15px 4px 15px 15px; }

        .sources { margin-top:12px; border-top:1px solid var(--line); padding-top:11px; }
        .sources-title { color:var(--muted); font-size:10px; letter-spacing:1px; font-weight:800; margin-bottom:8px; }
        .source-chip { display:inline-flex; gap:6px; align-items:center; margin:0 6px 6px 0; padding:6px 9px; background:var(--soft); border:1px solid var(--line); border-radius:8px; font-size:10px; color:var(--text); }
        .message-tools { display:flex; gap:7px; margin-top:8px; }
        .tool-btn { display:flex; gap:5px; align-items:center; border:0; background:transparent; color:var(--muted); font-size:10px; padding:4px; }
        .tool-btn:hover { color:var(--accent); }

        .topic-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin-top:25px; }
        .topic-card { background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:20px; text-align:left; color:var(--text); }
        .topic-card:hover { transform:translateY(-3px); border-color:#c8d0ff; }

        .history-item { width:100%; display:flex; align-items:center; gap:12px; text-align:left; padding:15px; border:1px solid var(--line); background:var(--panel); border-radius:13px; color:var(--text); margin-bottom:10px; }

        .toast { position:fixed; z-index:30; bottom:25px; left:50%; transform:translateX(-50%); background:#172033; color:#fff; border-radius:12px; padding:12px 17px; font-size:12px; box-shadow:0 8px 30px #0002; }
        .modal-backdrop { position:fixed; inset:0; z-index:20; display:grid; place-items:center; padding:20px; background:#0d142866; }
        .modal { width:min(430px,100%); background:var(--panel); color:var(--text); border:1px solid var(--line); border-radius:20px; padding:24px; box-shadow:0 24px 80px #0003; }
        .modal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; }

        .setting-row { display:flex; justify-content:space-between; align-items:center; gap:20px; padding:15px 0; border-top:1px solid var(--line); font-size:13px; }
        .switch { border:0; width:43px; height:25px; padding:3px; border-radius:30px; background:#d6dbea; }
        .switch span { display:block; width:19px; height:19px; border-radius:50%; background:#fff; transition:transform .2s; }
        .switch.on { background:var(--accent); } .switch.on span { transform:translateX(18px); }

        @media(max-width:760px) {
          .sidebar { position:fixed; inset:0 auto 0 0; width:270px; transform:translateX(-110%); }
          .sidebar.mobile-open { transform:translateX(0); }
          .suggestion-grid { grid-template-columns:1fr 1fr; }
          .topic-grid { grid-template-columns:1fr; }
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"} ${sidebarOpen && window.innerWidth <= 760 ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Icon name="shield" size={23} /></div>
          {sidebarOpen && <div className="brand-copy"><div className="brand-name">NyayaAI</div><div className="brand-sub">LEGAL INTELLIGENCE</div></div>}
        </div>

        <button className="new-chat" onClick={startNewChat} title="Start new chat">
          <Icon name="plus" size={18} /> {sidebarOpen && <span>New conversation</span>}
        </button>

        {sidebarOpen && <div className="nav-label">WORKSPACE</div>}
        <nav className="nav-list">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => { setActivePage(item.id); if (window.innerWidth <= 760) setSidebarOpen(false); }}
            >
              <Icon name={item.icon} size={19} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {sidebarOpen && (
            <div className="privacy-card">
              <div className="privacy-icon"><Icon name="shield" size={19} /></div>
              <strong>Your privacy matters</strong>
              <p>Avoid sharing passwords, OTPs, identity numbers, or confidential documents.</p>
            </div>
          )}
          <button className="nav-item" onClick={() => setSettingsOpen(true)}>
            <Icon name="settings" size={19} />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <div className="profile">
            <div className="avatar">N</div>
            {sidebarOpen && <div><div className="profile-name">NyayaAI Assistant</div><div className="profile-sub">Legal information companion</div></div>}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <button className="icon-btn" aria-label="Toggle Navigation" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Icon name="menu" size={20} />
            </button>
            <div className="breadcrumb">
              Workspace / <b>{activePage === "home" ? "Home" : activePage === "chat" ? "Conversation" : activePage === "topics" ? "Topics" : "History"}</b>
            </div>
          </div>

          <div className="top-actions">
            <div className="status-pill"><span className="status-dot"></span> System Ready</div>
            <select className="language-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en-IN">English (IN)</option>
              <option value="hi-IN">Hindi (हिंदी)</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
              <option value="te-IN">Telugu (తెలుగు)</option>
            </select>
          </div>
        </header>

        <div className="content">
          {/* HOME PAGE */}
          {activePage === "home" && (
            <>
              <div className="welcome">
                <div className="eyebrow"><Icon name="shield" size={14} /> AI LEGAL INFORMATION ASSISTANT</div>
                <h1 className="hero-title">Clear legal guidance for <span className="gradient-text">every citizen</span></h1>
                <p className="hero-copy">Ask legal queries in plain language. Get simplified guidance citing official Indian acts and statutory frameworks.</p>
              </div>

              <div className="ask-panel">
                <div className="ask-top">
                  <div className="ask-icon"><Icon name="chat" size={20} /></div>
                  <textarea
                    ref={inputRef}
                    className="ask-input"
                    rows={2}
                    placeholder="Describe your legal query or situation (e.g., tenant rights, online payment fraud)..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  />
                </div>
                <div className="ask-bottom">
                  <div className="ask-hint"><Icon name="globe" size={14} /> Information based on Indian legal framework</div>
                  <div className="ask-actions">
                    <button className={`mic-btn ${listening ? "listening" : ""}`} title="Speak query" onClick={startVoiceInput}>
                      <Icon name="mic" size={19} />
                    </button>
                    <button className="send-btn" disabled={!input.trim() || loading} onClick={() => handleSend()}>
                      <span>Ask Nyaya</span> <Icon name="send" size={15} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="voice-section">
                <div className="voice-title">VOICE INTERACTION</div>
                <div className="voice-stage">
                  <button className={`big-mic ${listening ? "listening" : ""}`} onClick={startVoiceInput}>
                    <Icon name="mic" size={36} />
                  </button>
                </div>
                <div className="voice-caption">{listening ? "Listening to your voice..." : "Click to speak your question"}</div>
                {voiceText && <div className="voice-transcript">"{voiceText}"</div>}
              </div>

              <div className="section-head">
                <div>
                  <h2>Frequently Consulted Topics</h2>
                  <p>Select a quick reference card to start</p>
                </div>
              </div>

              <div className="suggestion-grid">
                {SUGGESTIONS.map((item, idx) => (
                  <button key={idx} className="suggestion-card" onClick={() => handleSend(item.question)}>
                    <div className="suggestion-icon">{item.icon}</div>
                    <div className="suggestion-title">{item.title}</div>
                    <div className="suggestion-question">{item.question}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* CHAT PAGE */}
          {activePage === "chat" && (
            <div className="chat-layout">
              <div className="message-list">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.role}`}>
                    <div className="message-avatar">{msg.role === "user" ? "U" : "N"}</div>
                    <div className="message-body">
                      <div className="message-bubble">{msg.content}</div>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="sources">
                          <div className="sources-title">RELEVANT LEGAL SOURCES</div>
                          {msg.sources.map((src, i) => (
                            <span key={i} className="source-chip"><Icon name="file" size={12} /> {src}</span>
                          ))}
                        </div>
                      )}
                      {msg.role === "assistant" && (
                        <div className="message-tools">
                          <button className="tool-btn" onClick={() => copyText(msg.content)}>
                            <Icon name="copy" size={13} /> Copy response
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="message assistant">
                    <div className="message-avatar">N</div>
                    <div className="message-body">
                      <div className="message-bubble">Analyzing legal framework...</div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="ask-panel" style={{ marginTop: "20px" }}>
                <div className="ask-top">
                  <textarea
                    ref={inputRef}
                    className="ask-input"
                    rows={2}
                    placeholder="Ask a follow-up question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  />
                </div>
                <div className="ask-bottom">
                  <button className={`mic-btn ${listening ? "listening" : ""}`} onClick={startVoiceInput}>
                    <Icon name="mic" size={18} />
                  </button>
                  <button className="send-btn" disabled={!input.trim() || loading} onClick={() => handleSend()}>
                    <span>Send</span> <Icon name="send" size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOPICS PAGE */}
          {activePage === "topics" && (
            <div>
              <h2>Explore Legal Subjects</h2>
              <div className="topic-grid">
                {TOPICS.map(([title, desc, emoji], i) => (
                  <div key={i} className="topic-card" onClick={() => handleSend(`Tell me about ${title} under Indian law`)}>
                    <div style={{ fontSize: "28px", marginBottom: "10px" }}>{emoji}</div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HISTORY PAGE */}
          {activePage === "history" && (
            <div>
              <h2>Recent Conversations</h2>
              {history.length === 0 ? (
                <p style={{ color: "var(--muted)", marginTop: "20px" }}>No previous conversations logged in this session.</p>
              ) : (
                history.map((item) => (
                  <button key={item.id} className="history-item" onClick={() => { setMessages(item.messages); setActivePage("chat"); }}>
                    <Icon name="chat" size={18} />
                    <div>
                      <strong>{item.title}</strong>
                      <small style={{ display: "block", color: "var(--muted)" }}>{item.messages.length} messages</small>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          <div className="disclaimer">
            <Icon name="shield" size={16} />
            <span>NyayaAI provides legal information for general guidance. It does not constitute formal legal representation or individual professional legal advice.</span>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Settings</h2>
              <button className="icon-btn" onClick={() => setSettingsOpen(false)}><Icon name="close" size={18} /></button>
            </div>
            <div className="setting-row">
              <div>
                <strong>Dark Theme</strong>
                <p>Toggle interface dark theme</p>
              </div>
              <button className={`switch ${dark ? "on" : ""}`} onClick={() => setDark(!dark)}><span /></button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}