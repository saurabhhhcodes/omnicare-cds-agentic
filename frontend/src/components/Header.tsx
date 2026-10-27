import React from 'react'
import { MessageSquare, Sparkles, RefreshCw, HeartPulse, CheckCircle2 } from 'lucide-react'

interface HeaderProps {
  activeScenario: string
  onSelectScenario: (scenario: string) => void
  onReset: () => void
  isWsConnected: boolean
  isLoading: boolean
}

export const Header: React.FC<HeaderProps> = ({
  activeScenario,
  onSelectScenario,
  onReset,
  isWsConnected,
  isLoading
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-xl sticky top-0 z-50 px-4 lg:px-8 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20 transition-transform group-hover:scale-105">
              {/* Elegant SVG Cross & Pulse Medical Icon */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.28" className="text-cyan-200 stroke-cyan-200" strokeWidth="2" />
              </svg>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" title="System Operational"></span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center">
                OmniCare<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">CDS</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                ENTERPRISE CLINICAL
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AWS CDS LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Autonomous Omnichannel Care Navigation • EUM (SMS & RCS) • Meta WhatsApp • Amazon SES • Bedrock AgentCore
            </p>
          </div>
        </div>

        {/* Channel Badges (Clean, Professional Enterprise Labels) */}
        <div className="hidden xl:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700/80 text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="text-blue-300 font-semibold">AWS EUM SMS</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700/80 text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-cyan-300 font-semibold">GSMA RCS (UP 2.4)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-300 font-semibold">WhatsApp Cloud API</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700/80 text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-amber-300 font-semibold">Amazon SES</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-950/40 border border-purple-500/30 text-purple-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 font-semibold">Bedrock AgentCore</span>
          </div>
        </div>

        {/* Clinical Scenario Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => onSelectScenario('HEART_FAILURE_TITRATION')}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeScenario === 'HEART_FAILURE_TITRATION'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-white/20 font-bold'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-300" />
            CHF Titration (Elena, 64)
          </button>
          
          <button
            onClick={() => onSelectScenario('CELLULITIS_RASH')}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeScenario === 'CELLULITIS_RASH'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-white/20 font-bold'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
            Cellulitis Triage (Marcus, 42)
          </button>

          <button
            onClick={onReset}
            disabled={isLoading}
            title="Reset Scenario State"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  )
}
