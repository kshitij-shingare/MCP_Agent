"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  LayoutDashboard,
  Users,
  Scale,
  Receipt,
  Sparkles,
  FileText,
  Search,
  PanelLeft,
  Eye,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Printer,
  Download,
  IndianRupee,
  Send,
  Mic,
  Plus,
  RefreshCw,
  X,
  Truck,
  TrendingUp,
  SlidersHorizontal,
  Phone,
  Landmark,
  Layers,
  ArrowUpRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Dynamically import CrystalizedBall component from React Bits
const CrystalizedBall = dynamic(() => import("@/components/CrystalizedBall"), {
  ssr: false,
  loading: () => (
    <div style={{ width: 220, height: 220, margin: "0 auto", borderRadius: "50%", background: "#f8fafc", border: "1px dashed #cbd5e1" }} />
  ),
});

// Dynamically import TechText component from React Bits
const TechText = dynamic(() => import("@/components/TechText"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 42, fontWeight: 700, color: "#cbd5e1", letterSpacing: "0.05em" }}>SANJIVANI</span>
    </div>
  ),
});

// Dynamically import MaskedHeading component from React Bits
const MaskedHeading = dynamic(() => import("@/components/MaskedHeading"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 44, fontWeight: 800, color: "#cbd5e1", letterSpacing: "-0.02em" }}>SUGARCANE HARVEST</span>
    </div>
  ),
});

// Dynamically import ParticleText component from React Bits
const ParticleText = dynamic(() => import("@/components/ParticleText"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: 135, display: "flex", alignItems: "center", justifyContent: "center", background: "#09090f" }}>
      <span style={{ fontSize: 36, fontWeight: 800, color: "#cbd5e1", letterSpacing: "0.04em" }}>FACTORY LEDGER</span>
    </div>
  ),
});

// Dynamically import FoldText component from React Bits
const FoldText = dynamic(() => import("@/components/FoldText"), {
  ssr: false,
  loading: () => <span style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>CRUSHING SEASON 2026-27</span>,
});

// Dynamically import ScrollExpand component from React Bits
const ScrollExpand = dynamic(() => import("@/components/ScrollExpand"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: 460, background: "#0f172a", borderRadius: 16 }} />,
});

// Dynamically import SwarmCursor component from React Bits
const SwarmCursor = dynamic(() => import("@/components/SwarmCursor"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%" }} />,
});

// Dynamically import ElectricBorder component from React Bits
const ElectricBorder = dynamic(() => import("@/components/ElectricBorder"), {
  ssr: false,
});

// Dynamically import LaserFlow component from React Bits
const LaserFlow = dynamic(() => import("@/components/LaserFlow"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%" }} />,
});

// Dynamically import Strands component from React Bits
const Strands = dynamic(() => import("@/components/Strands"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: 180, background: "#090d16", borderRadius: 14 }} />,
});

// Dynamically import ImageTrail component from React Bits
const ImageTrail = dynamic(() => import("@/components/ImageTrail"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: 260 }} />,
});

// Dynamically import StarBorder component from React Bits
const StarBorder = dynamic(() => import("@/components/StarBorder"), {
  ssr: false,
});

import NeumorphicSideMenu from "@/components/NeumorphicSideMenu";

interface Delivery {
  slipNo: string;
  date: string;
  netTons: number;
  vehicleNo: string;
  variety: string;
  brix: number;
  status: string;
}

interface Payment {
  voucherNo: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

interface Farmer {
  _id?: string;
  farmerId: string;
  name: string;
  village: string;
  suppliesTons: number;
  paymentPending: number;
  amountPaid: number;
  phone?: string;
  caneVariety?: string;
  plotAcres?: number;
  bankAccount?: string;
  lastDeliveryDate?: string;
  deliveries?: Delivery[];
  payments?: Payment[];
}

interface FactorySummary {
  factory: string;
  totalFarmers: number;
  totalSugarcaneSuppliedTons: number;
  totalAmountPaidINR: number;
  totalPaymentPendingINR: number;
  villageStats: Record<string, { tons: number; farmers: number; pending: number }>;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolsUsed?: Array<{ tool: string; args: any; output: any }>;
}

type NavSection = "dashboard" | "farmers" | "supply" | "payments" | "assistant" | "reports";

const CANE_INSPECTION_IMAGES = [
  "/sugarcane_hero.jpg",
  "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80"
];

export default function SanjivaniSugarApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");
  const [sidebarSearch, setSidebarSearch] = useState("");

  // Data states
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [summary, setSummary] = useState<FactorySummary | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Filters
  const [farmerSearch, setFarmerSearch] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("All");
  const [pendingOnly, setPendingOnly] = useState(false);

  // Selected Farmer for Dossier Drawer
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  // AI Assistant Chat & Crystal Ball State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  type BallPreset = "plasma" | "aurora" | "nebula" | "ember" | "frost" | "solar";
  const [ballPreset, setBallPreset] = useState<BallPreset>("plasma");
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);

  // MaskedHeading Component State
  const [maskedReveal, setMaskedReveal] = useState<"rise" | "wipe" | "fade">("wipe");
  const [maskedText, setMaskedText] = useState("SUGARCANE HARVEST");

  // ParticleText Component State
  const [particleWord, setParticleWord] = useState("FACTORY LEDGER");

  // Strands Glass Sphere State
  const [glassFlowActive, setGlassFlowActive] = useState(false);

  // Swarm Cursor State in AI Assistant
  const [swarmActive, setSwarmActive] = useState(true);

  // LaserFlow Surface Card Reference
  const laserCardRef = useRef<HTMLDivElement>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeSection === "assistant" && messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatLoading, activeSection]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [sumRes, farmRes] = await Promise.all([
        fetch("/api/summary"),
        fetch("/api/farmers")
      ]);
      const sumJson = await sumRes.json();
      const farmJson = await farmRes.json();
      if (sumJson.success) setSummary(sumJson.data);
      if (farmJson.success) setFarmers(farmJson.data);
    } catch (e) {
      console.error("Error loading factory data:", e);
    } finally {
      setLoadingData(false);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleChatSubmit = async (queryText?: string) => {
    const query = (queryText || input).trim();
    if (!query || chatLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      const json = await res.json();

      if (json.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: json.answer,
          toolsUsed: json.toolsUsed,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `Error: ${json.error || "Unable to query factory database"}`,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Network Connection Error: ${err.message}`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Export real CSV
  const handleExportCSV = () => {
    const headers = [
      "Farmer ID",
      "Grower Name",
      "Village",
      "Cane Variety",
      "Plot Acres",
      "Phone",
      "Total Tons Supplied",
      "Amount Paid (INR)",
      "Payment Pending (INR)",
      "Payment Status",
      "Bank Account"
    ];

    const rows = farmers.map((f) => [
      `"${f.farmerId || ''}"`,
      `"${f.name}"`,
      `"${f.village}"`,
      `"${f.caneVariety || 'Co 86032'}"`,
      f.plotAcres || 0,
      `"${f.phone || ''}"`,
      f.suppliesTons,
      f.amountPaid,
      f.paymentPending,
      `"${f.paymentPending === 0 ? 'Settled' : 'Pending Due'}"`,
      `"${f.bankAccount || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sanjivani_grower_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered farmers
  const filteredFarmers = farmers.filter((f) => {
    const matchesSearch =
      !farmerSearch ||
      f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.village.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      (f.farmerId && f.farmerId.toLowerCase().includes(farmerSearch.toLowerCase()));
    const matchesVillage =
      selectedVillage === "All" ||
      f.village.toLowerCase() === selectedVillage.toLowerCase();
    const matchesPending = !pendingOnly || f.paymentPending > 0;
    return matchesSearch && matchesVillage && matchesPending;
  });

  // Top pending dues farmers
  const topPendingFarmers = [...farmers]
    .sort((a, b) => b.paymentPending - a.paymentPending)
    .filter((f) => f.paymentPending > 0);

  // All deliveries across farmers
  const allDeliveries = farmers.flatMap((f) =>
    (f.deliveries || []).map((d) => ({
      ...d,
      farmerId: f.farmerId,
      farmerName: f.name,
      village: f.village,
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // All payment vouchers
  const allPayments = farmers.flatMap((f) =>
    (f.payments || []).map((p) => ({
      ...p,
      farmerId: f.farmerId,
      farmerName: f.name,
      village: f.village,
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="factory-app-window">
      {/* --------------------------------------------------------------------
          SIDE MENU: DUAL-PANE NEUMORPHIC FLOATING NAVIGATION
          -------------------------------------------------------------------- */}
      <NeumorphicSideMenu
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={!sidebarOpen}
        setCollapsed={(collapsed) => setSidebarOpen(!collapsed)}
        onQueryMCP={(prompt) => {
          setActiveSection("assistant");
          handleChatSubmit(prompt);
        }}
        selectedVillage={selectedVillage}
        setSelectedVillage={setSelectedVillage}
        farmerCount={farmers.length}
      />

      {/* --------------------------------------------------------------------
          MAIN CONTENT WORKSPACE
          -------------------------------------------------------------------- */}
      <main className="factory-main-canvas">
        {/* Top Header */}
        <header className="factory-top-header">
          <div className="header-left-cluster">
            {!sidebarOpen && (
              <button
                className="icon-btn"
                onClick={() => setSidebarOpen(true)}
                title="Expand navigation"
              >
                <PanelLeft size={18} />
              </button>
            )}
            <h1 className="header-page-title">
              {activeSection === "dashboard" && "Overview Dashboard"}
              {activeSection === "farmers" && "Registered Sugarcane Growers"}
              {activeSection === "supply" && "Sugarcane Weighbridge & Supply Log"}
              {activeSection === "payments" && "Grower Payments & Pending Dues"}
              {activeSection === "assistant" && "Sanjivani Sugar AI Assistant"}
              {activeSection === "reports" && "Operational & Audit Reports"}
            </h1>
            <span className="header-badge-tag">
              <CheckCircle2 size={12} />
              <span>MongoDB Atlas Connected</span>
            </span>
          </div>

          <div className="header-right-actions">
            <button className="btn-secondary" onClick={handleExportCSV} title="Export CSV for Excel">
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <StarBorder
              as="button"
              color="#10b981"
              trailColor="#34d399"
              glow={0.7}
              radius={8}
              sparkle={true}
              duration={3.5}
              style={{
                background: "linear-gradient(135deg, #107c41, #0b5c30)",
                color: "#ffffff",
                padding: "7px 14px",
                fontSize: "12.5px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(16, 124, 65, 0.25)"
              }}
              onClick={() => {
                setActiveSection("assistant");
                setInput("Provide a quick status summary of today's cane crushing and pending payments.");
              }}
            >
              <Sparkles size={14} />
              <span>Ask AI Assistant</span>
            </StarBorder>
          </div>
        </header>

        {/* ------------------------------------------------------------------
            SECTION 1: OVERVIEW DASHBOARD (Priority 1)
            ------------------------------------------------------------------ */}
        {activeSection === "dashboard" && (
          <div className="view-content-wrapper">
            {/* TechText Brand Banner */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "12px 20px 8px",
                marginBottom: "20px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "#107c41", textTransform: "uppercase" }}>
                    Factory Operational Control & Weighbridge Ledger
                  </span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>•</span>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Kopargaon, Maharashtra (Est. 1963)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>3,500 TCD Crushing</span>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#107c41", display: "inline-block" }} />
                </div>
              </div>

              <div style={{ width: "100%", height: "105px", position: "relative" }}>
                <TechText
                  text="SANJIVANI"
                  fontWeight={700}
                  fontSize={82}
                  color="#0f172a"
                  accentColor="#107c41"
                  reveal="letter"
                  dashLength={4}
                  dashGap={2}
                  specks={15}
                />
              </div>
            </div>

            {/* Top 4 Summary Cards */}
            <div className="kpi-cards-grid">
              <div className="kpi-stat-card">
                <div className="kpi-top-row">
                  <span className="kpi-title">Total Registered Farmers</span>
                  <div className="kpi-icon-pill" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>
                    <Users size={16} />
                  </div>
                </div>
                <div className="kpi-value-display">
                  {summary ? summary.totalFarmers : farmers.length}
                </div>
                <span className="kpi-footer-note">Growers across 7 Taluka villages</span>
              </div>

              <div className="kpi-stat-card">
                <div className="kpi-top-row">
                  <span className="kpi-title">Total Cane Supplied</span>
                  <div className="kpi-icon-pill" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
                    <Scale size={16} />
                  </div>
                </div>
                <div className="kpi-value-display">
                  {summary ? `${summary.totalSugarcaneSuppliedTons.toLocaleString()} T` : "1,720 T"}
                </div>
                <span className="kpi-footer-note">Gross certified weighbridge intake</span>
              </div>

              <div className="kpi-stat-card">
                <div className="kpi-top-row">
                  <span className="kpi-title">Total Payments Made</span>
                  <div className="kpi-icon-pill" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
                    <IndianRupee size={16} />
                  </div>
                </div>
                <div className="kpi-value-display" style={{ color: "#15803d" }}>
                  {summary ? formatINR(summary.totalAmountPaidINR) : "₹46,35,000"}
                </div>
                <span className="kpi-footer-note">Disbursed directly via RTGS/NEFT</span>
              </div>

              <div className="kpi-stat-card">
                <div className="kpi-top-row">
                  <span className="kpi-title">Total Pending Payments</span>
                  <div className="kpi-icon-pill" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>
                    <AlertCircle size={16} />
                  </div>
                </div>
                <div className="kpi-value-display" style={{ color: "#dc2626" }}>
                  {summary ? formatINR(summary.totalPaymentPendingINR) : "₹4,75,000"}
                </div>
                <span className="kpi-footer-note">Scheduled for next batch clearance</span>
              </div>
            </div>

            {/* FoldText Dynamic Season Wordmark */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", marginTop: "24px", padding: "0 2px" }}>
              <div>
                <FoldText
                  text="CRUSHING SEASON 2026-27"
                  splitBy="char"
                  hinge="top"
                  fontSize={22}
                  fontWeight={800}
                  color="#0f172a"
                  trigger="mount"
                  duration={0.65}
                />
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  Live Mill Yard Cogeneration, Intake Capacity & Extraction Metrics
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", background: "#e8f5e9", color: "#0b5c30", padding: "4px 10px", borderRadius: "20px", fontWeight: 600, border: "1px solid #c8e6c9" }}>
                  Turbine Online • Shift A
                </span>
              </div>
            </div>

            {/* LaserFlow Automated Mill Yard & Cogeneration Telemetry */}
            <div
              style={{
                position: "relative",
                height: "210px",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                background: "#080c14",
                marginBottom: "20px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
              }}
            >
              <LaserFlow
                surfaceRef={laserCardRef}
                beamPosition={0.5}
                color="#10b981"
                intensity={1.7}
                flare={1.4}
                spread={1.4}
                spill={0.9}
                fog={0.25}
                dust={1.5}
                mouseInteraction={true}
              />
              <div
                ref={laserCardRef}
                style={{
                  position: "absolute",
                  left: "12%",
                  right: "12%",
                  top: "42%",
                  bottom: "-16px",
                  borderRadius: "14px",
                  background: "rgba(15, 23, 42, 0.94)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(52, 211, 153, 0.35)",
                  padding: "16px 24px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  color: "#ffffff"
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Crusher Speed</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#34d399", marginTop: "2px" }}>52.4 RPM</div>
                  <div style={{ fontSize: "10.5px", color: "#64748b" }}>Roll 1-4 Hydraulic Sync</div>
                </div>
                <div style={{ width: "1px", height: "36px", background: "rgba(255, 255, 255, 0.1)" }} />
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Cogen Power</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#60a5fa", marginTop: "2px" }}>8.4 MW Export</div>
                  <div style={{ fontSize: "10.5px", color: "#64748b" }}>MSEDCL Grid Connected</div>
                </div>
                <div style={{ width: "1px", height: "36px", background: "rgba(255, 255, 255, 0.1)" }} />
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Boiler Steam</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#fbbf24", marginTop: "2px" }}>115 PSI • 420°C</div>
                  <div style={{ fontSize: "10.5px", color: "#64748b" }}>100% Bagasse Feed</div>
                </div>
              </div>
            </div>

            {/* Crushing Operations & Sucrose Quality Stats Banner */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "24px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
              }}
            >
              <div>
                <span className="detail-label">Crushing Capacity</span>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginTop: "3px" }}>
                  3,500 TCD (Tons Cane / Day)
                </div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Turbine Cogeneration Active</span>
              </div>
              <div>
                <span className="detail-label">Avg. Sucrose Recovery Rate</span>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#107c41", marginTop: "3px" }}>
                  11.24% Recovery
                </div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Grade: S-30 & M-30 Sugar</span>
              </div>
              <div>
                <span className="detail-label">Crushing Season</span>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginTop: "3px" }}>
                  2025 – 2026 Season
                </div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Kopargaon Factory Gate</span>
              </div>
              <div>
                <span className="detail-label">Byproduct Yield</span>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#0284c7", marginTop: "3px" }}>
                  Bagasse 30% • Molasses 4.2%
                </div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Distillery Ethanol Feedstock</span>
              </div>
            </div>

            {/* Priority 1: List of Farmers with the Highest Pending Dues */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
                    Highest Pending Dues Ranking (Priority Clearance)
                  </h2>
                  <p style={{ fontSize: "12.5px", color: "#64748b" }}>
                    Growers with outstanding cane payment balances requiring settlement approval
                  </p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => setActiveSection("payments")}
                >
                  <span>View All Payments</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="data-table-container">
                <table className="operational-table">
                  <thead>
                    <tr>
                      <th>Grower ID</th>
                      <th>Grower Name</th>
                      <th>Village</th>
                      <th>Supplied (Tons)</th>
                      <th>Amount Paid</th>
                      <th>Pending Due (INR)</th>
                      <th>Priority</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPendingFarmers.map((f, i) => (
                      <tr key={f.farmerId || i}>
                        <td><span className="farmer-id-badge">{f.farmerId}</span></td>
                        <td style={{ fontWeight: 600 }}>{f.name}</td>
                        <td>{f.village}</td>
                        <td>{f.suppliesTons} T</td>
                        <td style={{ color: "#15803d", fontWeight: 500 }}>{formatINR(f.amountPaid)}</td>
                        <td style={{ color: "#dc2626", fontWeight: 700 }}>{formatINR(f.paymentPending)}</td>
                        <td>
                          <span
                            className="status-tag"
                            style={{
                              backgroundColor: f.paymentPending >= 75000 ? "#fee2e2" : "#fef3c7",
                              color: f.paymentPending >= 75000 ? "#b91c1c" : "#b45309",
                            }}
                          >
                            {f.paymentPending >= 75000 ? "High Dues" : "Standard"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-secondary"
                            style={{ padding: "4px 8px", fontSize: "11.5px" }}
                            onClick={() => setSelectedFarmer(f)}
                          >
                            <Eye size={12} />
                            <span>Dossier</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Village Intake Breakdown */}
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", marginBottom: "12px" }}>
                Village Cane Supply Distribution
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                }}
              >
                {summary &&
                  Object.entries(summary.villageStats).map(([village, stats]) => (
                    <div
                      key={village}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "14px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>{village}</span>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>{stats.farmers} Growers</span>
                      </div>
                      <div style={{ fontSize: "18px", fontWeight: 700, color: "#107c41", marginTop: "6px" }}>
                        {stats.tons} Tons
                      </div>
                      <div style={{ fontSize: "11.5px", color: stats.pending > 0 ? "#dc2626" : "#64748b", marginTop: "4px" }}>
                        Pending: {formatINR(stats.pending)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SECTION 2: FARMERS (Priority 1)
            ------------------------------------------------------------------ */}
        {activeSection === "farmers" && (
          <div className="view-content-wrapper">
            <div className="filter-toolbar-row">
              <div className="filter-search-box">
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search farmer ID, name, or village..."
                  value={farmerSearch}
                  onChange={(e) => setFarmerSearch(e.target.value)}
                />
              </div>

              <select
                className="filter-dropdown"
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
              >
                <option value="All">All Villages</option>
                <option value="Kopargaon">Kopargaon</option>
                <option value="Shirdi">Shirdi</option>
                <option value="Rahata">Rahata</option>
                <option value="Loni">Loni</option>
                <option value="Puntamba">Puntamba</option>
                <option value="Kolhar">Kolhar</option>
                <option value="Sangamner">Sangamner</option>
              </select>

              <label className="filter-checkbox-item">
                <input
                  type="checkbox"
                  checked={pendingOnly}
                  onChange={(e) => setPendingOnly(e.target.checked)}
                />
                <span>Pending Balances Only</span>
              </label>
            </div>

            {/* Searchable Farmers Table */}
            <div className="data-table-container">
              <table className="operational-table">
                <thead>
                  <tr>
                    <th>Farmer ID</th>
                    <th>Farmer Name</th>
                    <th>Village</th>
                    <th>Variety</th>
                    <th>Tons Supplied</th>
                    <th>Amount Paid</th>
                    <th>Pending Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFarmers.map((f, i) => (
                    <tr key={f.farmerId || i}>
                      <td><span className="farmer-id-badge">{f.farmerId}</span></td>
                      <td style={{ fontWeight: 600 }}>{f.name}</td>
                      <td>{f.village}</td>
                      <td style={{ fontSize: "12px", color: "#64748b" }}>{f.caneVariety || "Co 86032"}</td>
                      <td style={{ fontWeight: 600 }}>{f.suppliesTons} T</td>
                      <td style={{ color: "#15803d", fontWeight: 500 }}>{formatINR(f.amountPaid)}</td>
                      <td style={{ color: f.paymentPending > 0 ? "#dc2626" : "#475569", fontWeight: 600 }}>
                        {formatINR(f.paymentPending)}
                      </td>
                      <td>
                        <span className={`status-tag ${f.paymentPending === 0 ? "settled" : "pending"}`}>
                          {f.paymentPending === 0 ? "Settled" : "Pending Due"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ padding: "4px 10px", fontSize: "12px" }}
                          onClick={() => setSelectedFarmer(f)}
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredFarmers.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                        No grower records match the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SECTION 3: SUGARCANE SUPPLY
            ------------------------------------------------------------------ */}
        {activeSection === "supply" && (
          <div className="view-content-wrapper">
            {/* MaskedHeading Sugarcane Hero Banner */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px 20px 10px",
                marginBottom: "20px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "#107c41", textTransform: "uppercase" }}>
                    Sugarcane Harvest & Weighbridge Procurement
                  </span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>•</span>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Co 86032 • CoM 0265 • Co 92005 Varieties</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px" }}
                    onClick={() => setMaskedText(maskedText === "SUGARCANE HARVEST" ? "SANJIVANI 1963" : "SUGARCANE HARVEST")}
                    title="Switch heading text"
                  >
                    Text: {maskedText === "SUGARCANE HARVEST" ? "HARVEST" : "1963"}
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px" }}
                    onClick={() => setMaskedReveal(maskedReveal === "wipe" ? "rise" : maskedReveal === "rise" ? "fade" : "wipe")}
                    title="Switch entrance reveal animation"
                  >
                    Reveal: {maskedReveal.toUpperCase()}
                  </button>
                </div>
              </div>

              <div style={{ width: "100%", height: "110px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "4px" }}>
                <MaskedHeading
                  text={maskedText}
                  tag="h1"
                  mediaType="image"
                  src="/sugarcane_hero.jpg"
                  fillScale={1.3}
                  parallax={32}
                  drift={16}
                  reveal={maskedReveal}
                  trigger="view"
                  duration={1.2}
                  align="center"
                  weight={800}
                  textScale={0.068}
                />
              </div>
            </div>

            {/* Supply KPI Summary */}
            <div className="kpi-cards-grid">
              <div className="kpi-stat-card">
                <span className="kpi-title">Gross Crushed Cane</span>
                <div className="kpi-value-display">
                  {summary ? `${summary.totalSugarcaneSuppliedTons} Tons` : "1,720 T"}
                </div>
                <span className="kpi-footer-note">Season 2025-2026 intake</span>
              </div>
              <div className="kpi-stat-card">
                <span className="kpi-title">Weighbridge Slips</span>
                <div className="kpi-value-display">
                  {allDeliveries.length} Slips
                </div>
                <span className="kpi-footer-note">Certified gross-tare weighments</span>
              </div>
              <div className="kpi-stat-card">
                <span className="kpi-title">Avg Delivery Payload</span>
                <div className="kpi-value-display">
                  59.3 Tons / Trip
                </div>
                <span className="kpi-footer-note">Tractor trailer & truck logistics</span>
              </div>
              <div className="kpi-stat-card">
                <span className="kpi-title">Avg Sucrose Brix</span>
                <div className="kpi-value-display" style={{ color: "#107c41" }}>
                  20.1° Brix
                </div>
                <span className="kpi-footer-note">High purity cane lot</span>
              </div>
            </div>

            {/* ScrollExpand Panoramic Plantation & Weighbridge Inspection Card */}
            <div style={{ height: "420px", marginBottom: "22px", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0", background: "#0b0f19" }}>
              <ScrollExpand
                src="/sugarcane_hero.jpg"
                alt="Sanjivani Sugarcane Plantation"
                title="Field to Factory Gate"
                scrollHint="Scroll inside card to expand plantation view"
                mediaZoom={1.32}
                startWidth={44}
                startHeight={60}
                startRadius={20}
              >
                <div style={{ color: "#ffffff", textAlign: "center", maxWidth: "620px" }}>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>
                    Automated Weighbridge Intake & Field Sensor Grid
                  </h2>
                  <p style={{ fontSize: "0.92rem", color: "#e2e8f0", lineHeight: 1.5, marginBottom: "1rem", textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
                    Co-86032 & CoM-0265 certified high sucrose crops delivered within 24 hours of harvest across Kopargaon and Sangamner sectors.
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(16, 185, 129, 0.3)", border: "1px solid rgba(16, 185, 129, 0.6)", padding: "5px 12px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 }}>
                      21.4° Brix Quality
                    </span>
                    <span style={{ background: "rgba(59, 130, 246, 0.3)", border: "1px solid rgba(59, 130, 246, 0.6)", padding: "5px 12px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 }}>
                      11.24% Sucrose Recovery
                    </span>
                    <span style={{ background: "rgba(245, 158, 11, 0.3)", border: "1px solid rgba(245, 158, 11, 0.6)", padding: "5px 12px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 }}>
                      Automated Tare Check
                    </span>
                  </div>
                </div>
              </ScrollExpand>
            </div>

            {/* ImageTrail Field Inspection Gallery Strip */}
            <div
              style={{
                position: "relative",
                height: "170px",
                background: "#f8fafc",
                border: "1px dashed #cbd5e1",
                borderRadius: "14px",
                marginBottom: "24px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none"
              }}
            >
              <div style={{ position: "absolute", zIndex: 1, pointerEvents: "none", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", color: "#107c41", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <Eye size={14} />
                  <span>Harvest Crop Inspection Gallery</span>
                </div>
                <p style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                  Move your cursor across this area to review field photography & certified cane batches
                </p>
              </div>
              <ImageTrail items={CANE_INSPECTION_IMAGES} variant={1} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
                Weighbridge Delivery Slips & Transaction History
              </h2>
            </div>

            {/* Delivery History Table */}
            <div className="data-table-container">
              <table className="operational-table">
                <thead>
                  <tr>
                    <th>Slip No.</th>
                    <th>Delivery Date</th>
                    <th>Grower</th>
                    <th>Village</th>
                    <th>Vehicle Details</th>
                    <th>Cane Variety</th>
                    <th>Net Tons</th>
                    <th>Brix %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allDeliveries.map((d, idx) => (
                    <tr key={idx}>
                      <td><span className="farmer-id-badge">{d.slipNo}</span></td>
                      <td>{d.date}</td>
                      <td style={{ fontWeight: 600 }}>{d.farmerName}</td>
                      <td>{d.village}</td>
                      <td>{d.vehicleNo}</td>
                      <td>{d.variety}</td>
                      <td style={{ fontWeight: 700, color: "#107c41" }}>{d.netTons} T</td>
                      <td>{d.brix}°</td>
                      <td>
                        <span className="status-tag settled">
                          <CheckCircle2 size={11} />
                          <span>{d.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SECTION 4: PAYMENTS AND PENDING DUES
            ------------------------------------------------------------------ */}
        {activeSection === "payments" && (
          <div className="view-content-wrapper">
            {/* ElectricBorder Priority Disbursal Alert */}
            <div style={{ marginBottom: "20px" }}>
              <ElectricBorder
                color="#059669"
                glowColor="#10b981"
                thickness={1.6}
                chaos={0.5}
                spread={0.5}
                borderRadius={14}
                speed={1.1}
                interactive={true}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
                    borderRadius: "14px",
                    padding: "16px 22px",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 4px 20px rgba(6, 78, 59, 0.2)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(16, 185, 129, 0.25)", border: "1px solid rgba(52, 211, 153, 0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <AlertCircle size={22} color="#6ee7b7" />
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "#6ee7b7", textTransform: "uppercase" }}>
                        Immediate Clearance Required • Highest Single Balance
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 700, marginTop: "2px" }}>
                        Rupesh Patil (Kopargaon) — ₹1,40,000 Pending
                      </div>
                      <div style={{ fontSize: "12px", color: "#a7f3d0", marginTop: "2px" }}>
                        Supplied 280 Tons • Co-86032 Grade • Bank: ADCCB Kopargaon Br. A/C 48291048291
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <StarBorder
                      as="button"
                      color="#6ee7b7"
                      trailColor="#a7f3d0"
                      glow={0.7}
                      radius={10}
                      sparkle={true}
                      style={{
                        background: "#10b981",
                        color: "#064e3b",
                        fontWeight: 700,
                        fontSize: "12px",
                        padding: "8px 16px",
                        border: "none",
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        const target = farmers.find(f => f.farmerId === "F-1002") || farmers[0];
                        if (target) setSelectedFarmer(target);
                      }}
                    >
                      <span>Approve Disbursement</span>
                    </StarBorder>
                  </div>
                </div>
              </ElectricBorder>
            </div>

            {/* Strands Financial Cash Flow & Treasury Current */}
            <div
              style={{
                background: "#090d16",
                borderRadius: "16px",
                border: "1px solid #1e293b",
                padding: "16px 20px 12px",
                marginBottom: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", color: "#6ee7b7", textTransform: "uppercase" }}>
                    Factory Liquidity Ribbon • Treasury Cash Flow
                  </span>
                  <span style={{ fontSize: "11px", color: "#475569" }}>•</span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Real-time banking rail throughput</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "12px", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155" }}
                    onClick={() => setGlassFlowActive(!glassFlowActive)}
                  >
                    Glass Lens: {glassFlowActive ? "ON" : "OFF"}
                  </button>
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>Active Rail</span>
                </div>
              </div>

              <div style={{ width: "100%", height: "180px", position: "relative" }}>
                <Strands
                  colors={["#10b981", "#059669", "#f59e0b", "#0284c7"]}
                  count={4}
                  speed={0.55}
                  amplitude={1.1}
                  waviness={1.2}
                  thickness={0.8}
                  glow={2.5}
                  spread={1.2}
                  intensity={0.65}
                  saturation={1.4}
                  scale={1.4}
                  glass={glassFlowActive}
                  refraction={1.2}
                  dispersion={1.1}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "11px", color: "#64748b", borderTop: "1px solid #1e293b", paddingTop: "8px" }}>
                <span>Scheduled RTGS Batch: 16:30 IST</span>
                <span style={{ color: "#34d399", fontWeight: 600 }}>Direct Benefit Transfer (DBT) Online</span>
                <span>Clearing Bank: ADCCB Kopargaon</span>
              </div>
            </div>
            <div className="kpi-cards-grid">
              <div className="kpi-stat-card">
                <span className="kpi-title">Total Outstanding Dues</span>
                <div className="kpi-value-display" style={{ color: "#dc2626" }}>
                  {summary ? formatINR(summary.totalPaymentPendingINR) : "₹4,75,000"}
                </div>
                <span className="kpi-footer-note">Pending cane grower disbursements</span>
              </div>
              <div className="kpi-stat-card">
                <span className="kpi-title">Total Payments Settled</span>
                <div className="kpi-value-display" style={{ color: "#15803d" }}>
                  {summary ? formatINR(summary.totalAmountPaidINR) : "₹46,35,000"}
                </div>
                <span className="kpi-footer-note">90.7% of total procurement paid</span>
              </div>
              <div className="kpi-stat-card">
                <span className="kpi-title">Payment Rail</span>
                <div className="kpi-value-display" style={{ fontSize: "18px" }}>
                  ADCCB & Direct DBT
                </div>
                <span className="kpi-footer-note">District Central Co-op Bank</span>
              </div>
              <div className="kpi-stat-card">
                <span className="kpi-title">Pending Beneficiaries</span>
                <div className="kpi-value-display">
                  {topPendingFarmers.length} Farmers
                </div>
                <span className="kpi-footer-note">Out of {farmers.length} total growers</span>
              </div>
            </div>

            {/* Outstanding Balances Breakdown */}
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "12px" }}>
                Highest Outstanding Balances by Grower
              </h2>
              <div className="data-table-container">
                <table className="operational-table">
                  <thead>
                    <tr>
                      <th>Grower ID</th>
                      <th>Grower Name</th>
                      <th>Village</th>
                      <th>Registered Bank Account</th>
                      <th>Amount Paid</th>
                      <th>Pending Due (INR)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmers
                      .sort((a, b) => b.paymentPending - a.paymentPending)
                      .map((f, idx) => (
                        <tr key={idx}>
                          <td><span className="farmer-id-badge">{f.farmerId}</span></td>
                          <td style={{ fontWeight: 600 }}>{f.name}</td>
                          <td>{f.village}</td>
                          <td style={{ fontSize: "12px", color: "#64748b" }}>{f.bankAccount}</td>
                          <td style={{ color: "#15803d", fontWeight: 500 }}>{formatINR(f.amountPaid)}</td>
                          <td style={{ color: f.paymentPending > 0 ? "#dc2626" : "#475569", fontWeight: 700 }}>
                            {formatINR(f.paymentPending)}
                          </td>
                          <td>
                            <span className={`status-tag ${f.paymentPending === 0 ? "settled" : "pending"}`}>
                              {f.paymentPending === 0 ? "Fully Paid" : "Pending Settlement"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Payment Vouchers */}
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "12px" }}>
                Disbursement Vouchers & Bank Transaction Log
              </h2>
              <div className="data-table-container">
                <table className="operational-table">
                  <thead>
                    <tr>
                      <th>Voucher No.</th>
                      <th>Payment Date</th>
                      <th>Grower Name</th>
                      <th>Village</th>
                      <th>Amount (INR)</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPayments.map((p, idx) => (
                      <tr key={idx}>
                        <td><span className="farmer-id-badge">{p.voucherNo}</span></td>
                        <td>{p.date}</td>
                        <td style={{ fontWeight: 600 }}>{p.farmerName}</td>
                        <td>{p.village}</td>
                        <td style={{ fontWeight: 700, color: "#15803d" }}>{formatINR(p.amount)}</td>
                        <td>{p.method}</td>
                        <td>
                          <span className="status-tag settled">
                            <CheckCircle2 size={11} />
                            <span>{p.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SECTION 5: AI ASSISTANT (Dedicated Sanjivani Sugar AI with Crystal Ball)
            ------------------------------------------------------------------ */}
        {activeSection === "assistant" && (
          <div className="ai-assistant-wrapper">
            {messages.length === 0 ? (
              <div className="crystal-ball-hero-wrapper">
                {/* Crystalized Ball Component with SwarmCursor Particle Dynamics */}
                <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
                  <SwarmCursor
                    enabled={swarmActive}
                    count={450}
                    size={2.4}
                    color="#10b981"
                    accentColor="#059669"
                    spread={90}
                    swirl={0.65}
                    clickEffect="burst"
                    lightMode={true}
                    targets="a, button, textarea, .hero-prompt-card, .preset-pill"
                  >
                    <div className="crystal-ball-container">
                      <CrystalizedBall
                        preset={ballPreset}
                        theme="light"
                        size={0.72}
                        interactive={true}
                        hoverStrength={0.8}
                      />
                    </div>
                  </SwarmCursor>
                </div>

                {/* Crystal Ball Presets Switcher & Swarm Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <div className="ball-preset-bar" style={{ margin: 0 }}>
                    {(["plasma", "aurora", "nebula", "ember", "frost", "solar"] as const).map((p) => (
                      <button
                        key={p}
                        className={`preset-pill ${ballPreset === p ? "active" : ""}`}
                        onClick={() => setBallPreset(p)}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "14px", height: "30px" }}
                    onClick={() => setSwarmActive(!swarmActive)}
                    title="Toggle WebGL2 Swarm Cursor Particles"
                  >
                    Swarm: {swarmActive ? "ON" : "OFF"}
                  </button>
                </div>

                {/* Hero Greeting */}
                <h1 className="hero-greeting">Hi, how can I help you?</h1>

                {/* Hero Input Card */}
                <div className="hero-input-card">
                  <textarea
                    className="hero-textarea"
                    placeholder="Message Copilot or ask about sugarcane intake, farmer dues..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit();
                      }
                    }}
                    rows={2}
                  />
                  <div className="hero-input-toolbar">
                    <button
                      type="button"
                      className="hero-btn-circle"
                      onClick={() => setInput("Show total sugarcane supplied and pending payments for Kopargaon and Shirdi.")}
                      title="Add context or prompt"
                    >
                      <Plus size={18} />
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        type="button"
                        className="hero-btn-circle"
                        onClick={() => handleChatSubmit("Summarize current crushing status and farmer pending payments.")}
                        title="Voice query"
                      >
                        <Mic size={18} />
                      </button>
                      <button
                        type="button"
                        className={`hero-btn-send ${input.trim() ? "active" : ""}`}
                        disabled={!input.trim() || chatLoading}
                        onClick={() => handleChatSubmit()}
                        title="Send message"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Suggestion Cards */}
                <div className="hero-cards-row">
                  <div
                    className="hero-prompt-card"
                    onClick={() =>
                      handleChatSubmit(
                        "Identify the primary benefits and crushing yield in End of Quarter Numbers for Sanjivani Factory."
                      )
                    }
                  >
                    <div>
                      <div className="hero-card-icon-badge" style={{ backgroundColor: "#e8f5e9", color: "#107c41" }}>
                        <FileText size={15} />
                      </div>
                      <div className="hero-card-title">Identify the primary benefits in End of Quarter Numbers...</div>
                    </div>
                    <div className="hero-card-sub">You updated this</div>
                  </div>

                  <div
                    className="hero-prompt-card"
                    onClick={() =>
                      handleChatSubmit(
                        "What's new from Daisy Phillips and recent supplier updates for Sanjivani Sugar?"
                      )
                    }
                  >
                    <div>
                      <div className="hero-card-icon-badge" style={{ backgroundColor: "#f3e8ff", color: "#7e22ce" }}>
                        DP
                      </div>
                      <div className="hero-card-title">What's new from Daisy Phillips?</div>
                    </div>
                    <div className="hero-card-sub">Your close connection</div>
                  </div>

                  <div
                    className="hero-prompt-card"
                    onClick={() =>
                      handleChatSubmit(
                        "List action items for me from the weighbridge and procurement feature review."
                      )
                    }
                  >
                    <div>
                      <div className="hero-card-icon-badge" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>
                        <Calendar size={15} />
                      </div>
                      <div className="hero-card-title">List actions items for me from Feature review</div>
                    </div>
                    <div className="hero-card-sub">Upcoming today at 9:35 PM</div>
                  </div>
                </div>

                {/* See More Toggle */}
                <div className="see-more-row">
                  <button
                    type="button"
                    className="see-more-btn"
                    onClick={() => setShowMoreSuggestions(!showMoreSuggestions)}
                  >
                    <span>{showMoreSuggestions ? "See less" : "See more"}</span>
                    {showMoreSuggestions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Additional Factory Operational Suggestion Cards */}
                {showMoreSuggestions && (
                  <div className="hero-cards-row" style={{ marginTop: "4px" }}>
                    <div
                      className="hero-prompt-card"
                      onClick={() =>
                        handleChatSubmit(
                          "Which farmers from Kopargaon village have pending payments for Sanjivani Sugar Factory, and what is the total pending amount?"
                        )
                      }
                    >
                      <div>
                        <div className="hero-card-icon-badge" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>
                          <AlertCircle size={15} />
                        </div>
                        <div className="hero-card-title">Kopargaon Village Pending Dues</div>
                      </div>
                      <div className="hero-card-sub">Audit outstanding grower balances</div>
                    </div>

                    <div
                      className="hero-prompt-card"
                      onClick={() =>
                        handleChatSubmit(
                          "Give me a complete sugarcane supply breakdown for all farmers who supplied more than 150 tons."
                        )
                      }
                    >
                      <div>
                        <div className="hero-card-icon-badge" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>
                          <Truck size={15} />
                        </div>
                        <div className="hero-card-title">Suppliers Exceeding 150T</div>
                      </div>
                      <div className="hero-card-sub">High-volume deliveries & intake</div>
                    </div>

                    <div
                      className="hero-prompt-card"
                      onClick={() =>
                        handleChatSubmit(
                          "What is the overall factory summary of total sugarcane tons, total amount paid, and total pending in INR?"
                        )
                      }
                    >
                      <div>
                        <div className="hero-card-icon-badge" style={{ backgroundColor: "#e8f5e9", color: "#107c41" }}>
                          <IndianRupee size={15} />
                        </div>
                        <div className="hero-card-title">Factory Balance Sheet</div>
                      </div>
                      <div className="hero-card-sub">Overall gross tons & dues in INR</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Active conversation thread */
              <div className="chat-thread-container">
                {messages.map((m) => (
                  <div key={m.id} className={`chat-msg-row ${m.role}`}>
                    <div className={`chat-avatar ${m.role}`}>
                      {m.role === "user" ? "CCDO" : "AI"}
                    </div>
                    <div className="chat-bubble">
                      {m.toolsUsed && m.toolsUsed.length > 0 && (
                        <div style={{ marginBottom: "8px" }}>
                          {m.toolsUsed.map((t, idx) => (
                            <span
                              key={idx}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                backgroundColor: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                color: "#64748b",
                                marginRight: "6px",
                              }}
                            >
                              <CheckCircle2 size={12} color="#15803d" />
                              <span>MCP Tool: <strong>{t.tool}</strong></span>
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="chat-msg-row assistant">
                    <div className="chat-avatar assistant">AI</div>
                    <div className="chat-bubble" style={{ color: "#64748b", fontSize: "12.5px" }}>
                      Querying live MongoDB Atlas sugarcane ledger...
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />

                {/* Floating chat composer */}
                <div style={{ position: "fixed", bottom: "16px", left: sidebarOpen ? "280px" : "30px", right: "30px", zIndex: 30 }}>
                  <div className="chat-composer-card" style={{ maxWidth: 800 }}>
                    <textarea
                      className="chat-textarea"
                      placeholder="Ask follow-up query..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSubmit();
                        }
                      }}
                      rows={1}
                    />
                    <div className="chat-composer-toolbar">
                      <button
                        className="btn-secondary"
                        style={{ fontSize: "11px", padding: "2px 8px" }}
                        onClick={() => setMessages([])}
                      >
                        Reset Conversation
                      </button>
                      <button
                        className="composer-submit-btn"
                        disabled={!input.trim() || chatLoading}
                        onClick={() => handleChatSubmit()}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------
            SECTION 6: REPORTS (CSV Export & Audits)
            ------------------------------------------------------------------ */}
        {activeSection === "reports" && (
          <div className="view-content-wrapper">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>
                  Procurement & Cane Accounting Reports
                </h2>
                <p style={{ fontSize: "13px", color: "#64748b" }}>
                  Official ledger summaries, village aggregation, and downloadable CSV statements for Sanjivani Factory
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn-secondary" onClick={() => window.print()}>
                  <Printer size={14} />
                  <span>Print Report</span>
                </button>
                <button className="btn-primary" onClick={handleExportCSV}>
                  <Download size={14} />
                  <span>Download Full CSV</span>
                </button>
              </div>
            </div>

            {/* ParticleText Kinetic Ledger Banner */}
            <div
              style={{
                background: "#09090f",
                border: "1px solid #1e293b",
                borderRadius: "14px",
                padding: "16px 20px 10px",
                marginBottom: "22px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px", zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "#10b981", textTransform: "uppercase" }}>
                    Kinetic Particle Ledger • Sanjivani BI
                  </span>
                  <span style={{ fontSize: "11px", color: "#475569" }}>•</span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Hover cursor to repel & scatter particles</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "#1e293b", color: "#f8fafc", border: "1px solid #334155" }}
                    onClick={() => setParticleWord(particleWord === "FACTORY LEDGER" ? "SANJIVANI 1963" : "FACTORY LEDGER")}
                    title="Switch particle text"
                  >
                    Text: {particleWord === "FACTORY LEDGER" ? "LEDGER" : "1963"}
                  </button>
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>Kinetic Physics</span>
                </div>
              </div>

              <div style={{ width: "100%", height: "130px", position: "relative" }}>
                <ParticleText
                  text={particleWord}
                  particleSize={2}
                  density={3.5}
                  color="#ffffff"
                  highlightColor="#10b981"
                  scatter={160}
                  gatherDuration={1400}
                  stagger={360}
                  pointerRepel={45}
                  repelRadius={120}
                  idleDrift={0.6}
                  trigger="hover"
                  fontSize="clamp(2.4rem, 6vw, 4.2rem)"
                  fontWeight={800}
                  glow={true}
                />
              </div>
            </div>

            {/* Report Highlights */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
                <span className="kpi-title">Season Crushing Summary</span>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", margin: "8px 0" }}>
                  1,720.00 MT
                </div>
                <p style={{ fontSize: "12px", color: "#64748b" }}>
                  Total net cane crushed at factory gate weighbridge across 10 supplier holdings.
                </p>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
                <span className="kpi-title">Gross Valuation</span>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#107c41", margin: "8px 0" }}>
                  {summary ? formatINR(summary.totalAmountPaidINR + summary.totalPaymentPendingINR) : "₹51,10,000"}
                </div>
                <p style={{ fontSize: "12px", color: "#64748b" }}>
                  Calculated based on FRP (Fair & Remunerative Price) standard for 11.24% recovery.
                </p>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
                <span className="kpi-title">Pending Liability</span>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#dc2626", margin: "8px 0" }}>
                  {summary ? formatINR(summary.totalPaymentPendingINR) : "₹4,75,000"}
                </div>
                <p style={{ fontSize: "12px", color: "#64748b" }}>
                  Total outstanding farmer payable balance due across 7 active supplier villages.
                </p>
              </div>
            </div>

            {/* Village Ledger Summary Table */}
            <div className="data-table-container">
              <table className="operational-table">
                <thead>
                  <tr>
                    <th>Village Jurisdiction</th>
                    <th>Grower Accounts</th>
                    <th>Total Cane (MT)</th>
                    <th>Tonnage Share %</th>
                    <th>Total Pending Dues</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summary &&
                    Object.entries(summary.villageStats).map(([vName, vData]) => {
                      const share = ((vData.tons / summary.totalSugarcaneSuppliedTons) * 100).toFixed(1);
                      return (
                        <tr key={vName}>
                          <td style={{ fontWeight: 700 }}>{vName}</td>
                          <td>{vData.farmers} Growers</td>
                          <td style={{ fontWeight: 600 }}>{vData.tons} MT</td>
                          <td>{share}%</td>
                          <td style={{ color: vData.pending > 0 ? "#dc2626" : "#15803d", fontWeight: 700 }}>
                            {formatINR(vData.pending)}
                          </td>
                          <td>
                            <span className={`status-tag ${vData.pending === 0 ? "settled" : "pending"}`}>
                              {vData.pending === 0 ? "Settled" : "Dues Pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* --------------------------------------------------------------------
          FARMER DETAILS DRAWER / MODAL
          -------------------------------------------------------------------- */}
      {selectedFarmer && (
        <div className="drawer-backdrop" onClick={() => setSelectedFarmer(null)}>
          <div className="farmer-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="drawer-header">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="farmer-id-badge">{selectedFarmer.farmerId}</span>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>{selectedFarmer.name}</h2>
                </div>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Village: {selectedFarmer.village} • Registered Grower Dossier
                </span>
              </div>
              <button className="icon-btn" onClick={() => setSelectedFarmer(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="drawer-content-scroll">
              {/* Financial & Land Profile with ElectricBorder */}
              <div style={{ marginBottom: "16px" }}>
                <ElectricBorder
                  color={selectedFarmer.paymentPending > 0 ? "#ef4444" : "#10b981"}
                  glowColor={selectedFarmer.paymentPending > 0 ? "#f87171" : "#34d399"}
                  thickness={1.5}
                  chaos={0.4}
                  spread={0.5}
                  borderRadius={12}
                  interactive={true}
                >
                  <div className="profile-card-box" style={{ margin: 0 }}>
                    <span className="kpi-title">Agronomic & Financial Summary</span>
                    <div className="detail-key-val-grid">
                      <div>
                        <span className="detail-label">Plot Holding</span>
                        <div className="detail-value">{selectedFarmer.plotAcres} Acres</div>
                      </div>
                      <div>
                        <span className="detail-label">Cane Variety</span>
                        <div className="detail-value">{selectedFarmer.caneVariety}</div>
                      </div>
                      <div>
                        <span className="detail-label">Contact Phone</span>
                        <div className="detail-value">{selectedFarmer.phone}</div>
                      </div>
                      <div>
                        <span className="detail-label">Total Supplied</span>
                        <div className="detail-value" style={{ color: "#107c41" }}>{selectedFarmer.suppliesTons} Tons</div>
                      </div>
                      <div>
                        <span className="detail-label">Amount Paid</span>
                        <div className="detail-value" style={{ color: "#15803d" }}>{formatINR(selectedFarmer.amountPaid)}</div>
                      </div>
                      <div>
                        <span className="detail-label">Pending Due</span>
                        <div className="detail-value" style={{ color: selectedFarmer.paymentPending > 0 ? "#dc2626" : "#475569" }}>
                          {formatINR(selectedFarmer.paymentPending)}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "6px", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}>
                      <span className="detail-label">Registered Bank Account</span>
                      <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#334155", marginTop: "2px" }}>
                        {selectedFarmer.bankAccount}
                      </div>
                    </div>
                  </div>
                </ElectricBorder>
              </div>

              {/* Delivery History */}
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>
                  Weighbridge Delivery Slips
                </h3>
                <div className="data-table-container">
                  <table className="operational-table">
                    <thead>
                      <tr>
                        <th>Slip</th>
                        <th>Date</th>
                        <th>Net (T)</th>
                        <th>Brix</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedFarmer.deliveries || []).map((d, idx) => (
                        <tr key={idx}>
                          <td><span className="farmer-id-badge">{d.slipNo}</span></td>
                          <td>{d.date}</td>
                          <td style={{ fontWeight: 600 }}>{d.netTons} T</td>
                          <td>{d.brix}°</td>
                          <td>
                            <span className="status-tag settled">{d.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Vouchers */}
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>
                  Disbursement Vouchers
                </h3>
                <div className="data-table-container">
                  <table className="operational-table">
                    <thead>
                      <tr>
                        <th>Voucher</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedFarmer.payments || []).map((p, idx) => (
                        <tr key={idx}>
                          <td><span className="farmer-id-badge">{p.voucherNo}</span></td>
                          <td>{p.date}</td>
                          <td style={{ fontWeight: 600, color: "#15803d" }}>{formatINR(p.amount)}</td>
                          <td>{p.method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <StarBorder
                  as="button"
                  color="#10b981"
                  trailColor="#34d399"
                  glow={0.65}
                  radius={8}
                  sparkle={true}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #107c41, #0b5c30)",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "13px",
                    padding: "9px 16px",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    const name = selectedFarmer.name;
                    setSelectedFarmer(null);
                    setActiveSection("assistant");
                    handleChatSubmit(`Show full cane supply and payment report for ${name}.`);
                  }}
                >
                  <Sparkles size={14} />
                  <span>Query Grower via AI</span>
                </StarBorder>
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedFarmer(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
