import React from 'react'
import { Activity, MessageSquare, Send, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react'

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
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Badges */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                OmniCare <span className="text-amber-400 font-mono text-sm px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">CDS AGENTIC</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AWS CDS LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Omnichannel Care with EUM (SMS & RCS), WhatsApp Social & Amazon SES
            </p>
          </div>
        </div>

        {/* Channel Badges */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
            <span className="text-blue-400 font-semibold">EUM SMS</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
            <span className="text-cyan-400 font-semibold">EUM RCS (UP 2.4)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
            <span className="text-emerald-400 font-semibold">WhatsApp Meta $10k Track</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
            <span className="text-amber-400 font-semibold">Amazon SES</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-950/60 border border-purple-500/30 text-purple-300">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span className="text-purple-300 font-semibold">Bedrock AgentCore</span>
          </div>
        </div>

        {/* Scenario Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => onSelectScenario('HEART_FAILURE_TITRATION')}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeScenario === 'HEART_FAILURE_TITRATION'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Scenario A: Heart Failure
          </button>
          
          <button
            onClick={() => onSelectScenario('CELLULITIS_RASH')}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeScenario === 'CELLULITIS_RASH'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Scenario B: WhatsApp Vision
          </button>

          <button
            onClick={onReset}
            disabled={isLoading}
            title="Reset Scenario"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  )
}
