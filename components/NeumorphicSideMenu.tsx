'use client';

import React, { useState } from 'react';
import './NeumorphicSideMenu.css';

export interface NeumorphicSideMenuProps {
  activeSection: 'dashboard' | 'farmers' | 'supply' | 'payments' | 'assistant' | 'reports';
  setActiveSection: (section: 'dashboard' | 'farmers' | 'supply' | 'payments' | 'assistant' | 'reports') => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onQueryMCP?: (query: string) => void;
  selectedVillage?: string;
  setSelectedVillage?: (village: string) => void;
  farmerCount?: number;
}

export default function NeumorphicSideMenu({
  activeSection,
  setActiveSection,
  collapsed,
  setCollapsed,
  onQueryMCP,
  selectedVillage = 'All',
  setSelectedVillage,
  farmerCount = 10,
}: NeumorphicSideMenuProps) {
  // Tree expanded states for Cane Growers
  const [farmersExpanded, setFarmersExpanded] = useState(true);
  const [activeGrowerCategory, setActiveGrowerCategory] = useState<'all' | 'active' | 'high_yield'>('active');
  const [activeZone, setActiveZone] = useState<string>('Shirdi Temple Belt');

  // Sparkle Icon (4-pointed star)
  const SparkleIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );

  // Home Pentagon House Icon
  const HomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  // Messages Envelope Chat Icon
  const MessagesIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );

  // Integrations [+] Icon (Sugarcane Supply / Weighbridge)
  const IntegrationsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="4" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );

  // Finance Card Icon (Payments & Dues)
  const FinanceIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="3" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );

  // Cane Growers Box / Package Icon
  const GrowersIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );

  // Folder Icon
  const FolderIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );

  // Contacts / Mill Ledger Icon
  const ContactsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="4" />
      <circle cx="12" cy="10" r="3"/>
      <path d="M7 17a5 5 0 0 1 10 0" />
    </svg>
  );

  // Explore / Audit Reports Icon
  const ExploreIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 11-1.5 8a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 11" />
      <path d="M4 11h16" />
      <path d="M12 4v4" />
      <path d="M8 8h8" />
    </svg>
  );

  // Code Icon (< />)
  const CodeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );

  // Pin Icon
  const PinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.89A2 2 0 0 1 15 10.77V7a3 3 0 0 0-6 0v3.77a2 2 0 0 1-1.11 1.79l-1.78.89A2 2 0 0 0 5 15.24Z" />
    </svg>
  );

  // Chevron Right Notch Icon
  const NotchIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  // --------------------------------------------------------------------------
  // RENDER COLLAPSED PILL RAIL
  // --------------------------------------------------------------------------
  if (collapsed) {
    return (
      <aside className="side-menu-outer" aria-label="Collapsed Navigation Rail">
        <div className="side-menu-rail">
          {/* Top 4-point Sparkle */}
          <button
            className="rail-sparkle-btn"
            onClick={() => setCollapsed(false)}
            title="Expand Full Menu (Sanjivani Operations)"
          >
            <SparkleIcon size={20} />
          </button>

          {/* Icon Stack */}
          <div className="rail-icon-stack">
            {/* 1. Dashboard */}
            <button
              className={`rail-icon-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
              title="Overview Dashboard"
            >
              <HomeIcon />
            </button>

            {/* 2. AI Assistant (with pink notification dot) */}
            <button
              className={`rail-icon-btn ${activeSection === 'assistant' ? 'active' : ''}`}
              onClick={() => setActiveSection('assistant')}
              title="Sanjivani AI Assistant (GPT-6)"
            >
              <MessagesIcon />
              <span className="rail-ping-dot" />
            </button>

            {/* 3. Sugarcane Supply */}
            <button
              className={`rail-icon-btn ${activeSection === 'supply' ? 'active' : ''}`}
              onClick={() => setActiveSection('supply')}
              title="Sugarcane Weighbridge & Supply"
            >
              <IntegrationsIcon />
            </button>

            {/* 4. Payments & Dues */}
            <button
              className={`rail-icon-btn ${activeSection === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveSection('payments')}
              title="Grower Payments & Pending Dues"
            >
              <FinanceIcon />
            </button>

            {/* 5. Growers Directory */}
            <button
              className={`rail-icon-btn ${activeSection === 'farmers' ? 'active' : ''}`}
              onClick={() => setActiveSection('farmers')}
              title="Registered Cane Growers"
            >
              <GrowersIcon />
            </button>

            {/* Thin Slider Track with center dot */}
            <div className="rail-slider-track">
              <span className="rail-slider-dot" />
            </div>

            {/* 6. Mill Crushing Ledger */}
            <button
              className={`rail-icon-btn ${activeSection === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveSection('reports')}
              title="Operational & Audit Reports"
            >
              <ContactsIcon />
            </button>

            {/* 7. Explore */}
            <button
              className="rail-icon-btn"
              onClick={() => setCollapsed(false)}
              title="Expand Context Pane & Circle Zones"
            >
              <ExploreIcon />
            </button>
          </div>

          {/* Notch Tab on Right Edge */}
          <button
            className="rail-expand-notch"
            onClick={() => setCollapsed(false)}
            title="Expand Full Menu"
          >
            <NotchIcon />
          </button>
        </div>
      </aside>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER EXPANDED DUAL-PANE CARD
  // --------------------------------------------------------------------------
  return (
    <aside className="side-menu-outer" aria-label="Expanded Navigation Menu">
      <div className="side-menu-expanded-card">
        {/* ==================================================================
            COLUMN 1: MAIN OPERATIONS MENU
            ================================================================== */}
        <div className="menu-col-main">
          {/* Header: Sparkle + Operations Title + Collapse Button */}
          <div className="menu-main-header">
            <div className="menu-header-brand">
              <SparkleIcon size={20} />
              <span>Sanjivani Operations</span>
            </div>
            <button
              className="menu-collapse-btn"
              onClick={() => setCollapsed(true)}
              title="Collapse into Pill Rail"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>

          {/* Operational Nav List */}
          <div className="menu-nav-list">
            {/* 1. Dashboard */}
            <button
              className={`menu-nav-item ${activeSection === 'dashboard' ? 'active-dark' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <div className="menu-item-left">
                <span className="menu-item-icon">
                  <HomeIcon />
                </span>
                <span>Dashboard</span>
              </div>
            </button>

            {/* 2. AI Assistant */}
            <button
              className={`menu-nav-item ${activeSection === 'assistant' ? 'active-dark' : ''}`}
              onClick={() => setActiveSection('assistant')}
            >
              <div className="menu-item-left">
                <span className="menu-item-icon">
                  <MessagesIcon />
                </span>
                <span>AI Assistant</span>
              </div>
              <span className="menu-badge-pill">GPT-6</span>
            </button>

            {/* 3. Sugarcane Supply */}
            <button
              className={`menu-nav-item ${activeSection === 'supply' ? 'active-dark' : ''}`}
              onClick={() => setActiveSection('supply')}
            >
              <div className="menu-item-left">
                <span className="menu-item-icon">
                  <IntegrationsIcon />
                </span>
                <span>Sugarcane Supply</span>
              </div>
              <span className="menu-expand-plus">+</span>
            </button>

            {/* 4. Payments & Dues */}
            <button
              className={`menu-nav-item ${activeSection === 'payments' ? 'active-dark' : ''}`}
              onClick={() => setActiveSection('payments')}
            >
              <div className="menu-item-left">
                <span className="menu-item-icon">
                  <FinanceIcon />
                </span>
                <span>Payments &amp; Dues</span>
              </div>
            </button>

            {/* 5. Cane Growers (Active Dark Capsule Item) */}
            <button
              className={`menu-nav-item ${activeSection === 'farmers' ? 'active-dark' : ''}`}
              onClick={() => {
                setActiveSection('farmers');
                setFarmersExpanded(!farmersExpanded);
              }}
            >
              <div className="menu-item-left">
                <span className="menu-item-icon">
                  <GrowersIcon />
                </span>
                <span>Cane Growers</span>
              </div>
              <span className="menu-expand-dash">{farmersExpanded ? '—' : '+'}</span>
            </button>

            {/* Tree Branch under Cane Growers */}
            {farmersExpanded && (
              <div className="menu-tree-container">
                {/* Tree Item 1: All Registered Growers */}
                <button
                  className={`menu-tree-item ${activeGrowerCategory === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('farmers');
                    setActiveGrowerCategory('all');
                    if (setSelectedVillage) setSelectedVillage('All');
                  }}
                >
                  <FolderIcon />
                  <span>All Registered ({farmerCount})</span>
                </button>

                {/* Tree Item 2: Active Cane Suppliers (Active White Pill with Shadow) */}
                <button
                  className={`menu-tree-item ${activeGrowerCategory === 'active' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('farmers');
                    setActiveGrowerCategory('active');
                    if (setSelectedVillage) setSelectedVillage('All');
                  }}
                >
                  <FolderIcon />
                  <span>Active Suppliers</span>
                </button>

                {/* Tree Item 3: High-Tonnage Suppliers (>150T) */}
                <button
                  className={`menu-tree-item ${activeGrowerCategory === 'high_yield' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('farmers');
                    setActiveGrowerCategory('high_yield');
                    if (setSelectedVillage) setSelectedVillage('Kopargaon');
                  }}
                >
                  <FolderIcon />
                  <span>High Yield (&gt;150T)</span>
                </button>
              </div>
            )}

            {/* 6. Mill Crushing Ledger */}
            <button
              className={`menu-nav-item ${activeSection === 'reports' ? 'active-dark' : ''}`}
              onClick={() => setActiveSection('reports')}
            >
              <div className="menu-item-left">
                <span className="menu-item-icon">
                  <ContactsIcon />
                </span>
                <span>Audit &amp; Vouchers</span>
              </div>
            </button>

            {/* 7. Factory Overview / Explore */}
            <button
              className="menu-nav-item"
              onClick={() => {
                setActiveSection('dashboard');
              }}
            >
              <div className="menu-item-left">
                <span className="menu-item-icon">
                  <ExploreIcon />
                </span>
                <span>Mill Telemetry</span>
              </div>
              <span className="menu-expand-plus">+</span>
            </button>
          </div>

          {/* User profile footer */}
          <div className="menu-footer-user">
            <div className="user-compact-chip" onClick={() => setActiveSection('dashboard')}>
              <div className="user-avatar-dot">KS</div>
              <span className="user-name-label">K. B. Somaiya</span>
            </div>
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>Chief Cane Officer</span>
          </div>
        </div>

        {/* ==================================================================
            COLUMN 2: CONTEXT FLYOUT SUB-PANE (FACTORY REGIONS & MCP SHORTCUTS)
            ================================================================== */}
        <div className="menu-col-sub">
          {/* Top Category: Crushing Season Archive & Priority Cultivators */}
          <button
            className="sub-pane-item"
            onClick={() => setActiveSection('reports')}
          >
            <FolderIcon />
            <span>Season 2025-26 Archive</span>
          </button>

          <button
            className="sub-pane-item"
            onClick={() => {
              setActiveSection('farmers');
              if (setSelectedVillage) setSelectedVillage('All');
            }}
          >
            <FolderIcon />
            <span>Priority Cultivators</span>
          </button>

          <div className="sub-pane-divider" />

          {/* Section: Quick MCP Queries (3) with Pin Icon */}
          <div className="sub-pane-header">
            <span>Quick Queries (3)</span>
            <span className="sub-header-icon" title="Pinned MCP Shortcuts">
              <PinIcon />
            </span>
          </div>

          <button
            className="sub-pane-item"
            onClick={() => {
              setActiveSection('assistant');
              onQueryMCP?.('Which farmers from Kopargaon village have pending payments for Sanjivani Sugar Factory?');
            }}
          >
            <CodeIcon />
            <span>Kopargaon Dues</span>
          </button>

          <button
            className="sub-pane-item"
            onClick={() => {
              setActiveSection('assistant');
              onQueryMCP?.('Give me a complete sugarcane supply breakdown for all farmers who supplied more than 150 tons.');
            }}
          >
            <CodeIcon />
            <span>Suppliers &gt;150T</span>
          </button>

          <button
            className="sub-pane-item"
            onClick={() => {
              setActiveSection('assistant');
              onQueryMCP?.('What is the overall factory balance sheet: total sugarcane tons received, total amount paid, and total pending in INR?');
            }}
          >
            <CodeIcon />
            <span>Balance Sheet</span>
          </button>

          <div className="sub-pane-divider" />

          {/* Section: Circle Zones (5) with Folder Icon */}
          <div className="sub-pane-header">
            <span>Circle Zones (5)</span>
            <span className="sub-header-icon" title="Procurement Circle Zones">
              <FolderIcon />
            </span>
          </div>

          <button
            className={`sub-pane-item ${activeZone === 'Kopargaon Central' ? 'active' : ''}`}
            onClick={() => {
              setActiveZone('Kopargaon Central');
              setActiveSection('farmers');
              if (setSelectedVillage) setSelectedVillage('Kopargaon');
            }}
          >
            <FolderIcon />
            <span>Kopargaon Central</span>
          </button>

          {/* Active Folder Item: Shirdi Temple Belt (White Pill with Soft Shadow) */}
          <button
            className={`sub-pane-item ${activeZone === 'Shirdi Temple Belt' ? 'active' : ''}`}
            onClick={() => {
              setActiveZone('Shirdi Temple Belt');
              setActiveSection('farmers');
              if (setSelectedVillage) setSelectedVillage('Shirdi');
            }}
          >
            <FolderIcon />
            <span>Shirdi Temple Belt</span>
          </button>

          <button
            className={`sub-pane-item ${activeZone === 'Rahata Valley' ? 'active' : ''}`}
            onClick={() => {
              setActiveZone('Rahata Valley');
              setActiveSection('farmers');
              if (setSelectedVillage) setSelectedVillage('Rahata');
            }}
          >
            <FolderIcon />
            <span>Rahata Valley</span>
          </button>

          <button
            className={`sub-pane-item ${activeZone === 'Puntamba Belt' ? 'active' : ''}`}
            onClick={() => {
              setActiveZone('Puntamba Belt');
              setActiveSection('farmers');
              if (setSelectedVillage) setSelectedVillage('Puntamba');
            }}
          >
            <FolderIcon />
            <span>Puntamba Belt</span>
          </button>

          <button
            className={`sub-pane-item ${activeZone === 'Yeola Extension' ? 'active' : ''}`}
            onClick={() => {
              setActiveZone('Yeola Extension');
              setActiveSection('farmers');
              if (setSelectedVillage) setSelectedVillage('Yeola');
            }}
          >
            <FolderIcon />
            <span>Yeola Extension</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
