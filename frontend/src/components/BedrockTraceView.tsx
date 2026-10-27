import React, { useState } from 'react'
import { Sparkles, Terminal, ChevronDown, ChevronRight, Clock, ArrowRightLeft, Cpu } from 'lucide-react'
import { AgentTraceItem } from '../types'

interface BedrockTraceViewProps {
  traces: AgentTraceItem[]
}

export const BedrockTraceView: React.FC<BedrockTraceViewProps> = ({ traces }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  const getAgentColor = (name: string) => {
    switch (name) {
      case 'VisionTriageAgent':
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
      case 'PharmacyRoutingAgent':
        return 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
      case 'OmnichannelDispatcher':
        return 'border-amber-500/30 text-amber-400 bg-amber-500/10'
      default:
        return 'border-purple-500/30 text-purple-400 bg-purple-500/10'
    }
  }

  return (
    <div className="flex flex-col h-[640px] bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative font-sans">
      {/* Header */}
      <div className="bg-slate-800/90 px-4 py-3 flex items-center justify-between border-b border-slate-700/60 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">Bedrock AgentCore Trace</span>
              <span className="bg-purple-500/10 text-purple-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-500/20">
                Claude 3.5 Sonnet
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Autonomous Multi-Agent Cognitive Loop & Cross-Channel Context Graph
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
          <Cpu className="w-4 h-4" />
          <span>{traces.length} Step Cycles</span>
        </div>
      </div>

      {/* Trace Timeline Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/70 font-mono text-xs">
        {traces.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
            <Terminal className="w-12 h-12 stroke-1 text-slate-600" />
            <p className="text-xs text-center max-w-xs">
              No reasoning steps executed yet. Send an inbound message or trigger a scenario to watch Amazon Bedrock AgentCore orchestrate tools and channel handoffs.
            </p>
          </div>
        ) : (
          traces.map((trace, idx) => {
            const isExpanded = expandedId === trace.id
            const agentBadge = getAgentColor(trace.agent_name)

            return (
              <div
                key={trace.id}
                className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-2 hover:border-slate-700 transition-colors shadow-sm"
              >
                {/* Top Bar: Agent Badge + Latency + Step */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">#{idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${agentBadge}`}>
                      {trace.agent_name}
                    </span>
                    <span className="text-slate-400 text-[11px]">[{trace.state_node}]</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    {trace.channel_handover && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3" />
                        {trace.channel_handover}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {trace.latency_ms} ms
                    </span>
                  </div>
                </div>

                {/* Thought Narrative */}
                <div className="text-slate-300 font-sans text-xs leading-relaxed bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-purple-400 font-semibold font-mono text-[11px]">Thought: </span>
                  {trace.thought}
                </div>

                {/* Tool Call & Inspector */}
                {trace.tool_name && (
                  <div>
                    <button
                      onClick={() => toggleExpand(trace.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-800/70 hover:bg-slate-800 text-[11px] text-slate-300 transition-colors border border-slate-700/50"
                    >
                      <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <Terminal className="w-3.5 h-3.5 text-amber-400" />
                        tool: {trace.tool_name}()
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        {isExpanded ? 'Hide Payload' : 'Inspect I/O'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-2.5 rounded-lg bg-black/60 border border-slate-800 space-y-2 text-[11px]">
                        <div>
                          <div className="text-slate-400 font-bold text-[10px] uppercase">Input Parameters:</div>
                          <pre className="text-emerald-400 overflow-x-auto p-1.5 rounded bg-slate-950 text-[10px]">
                            {JSON.stringify(trace.tool_input, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <div className="text-slate-400 font-bold text-[10px] uppercase">Execution Observation:</div>
                          <pre className="text-cyan-300 overflow-x-auto p-1.5 rounded bg-slate-950 text-[10px]">
                            {JSON.stringify(trace.tool_output, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
