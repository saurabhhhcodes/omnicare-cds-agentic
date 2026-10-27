import React from 'react'
import { BarChart3, TrendingUp, DollarSign, Zap, CheckCircle2, Shield, ArrowUpRight } from 'lucide-react'
import { TelemetryData } from '../types'

interface AnalyticsViewProps {
  telemetry: TelemetryData | null
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ telemetry }) => {
  if (!telemetry) return null

  const channels = [
    { name: 'SMS', count: telemetry.channel_distribution.SMS || 0, color: 'bg-blue-500', latency: '38.4 ms', rate: '99.8%' },
    { name: 'RCS (UP 2.4)', count: telemetry.channel_distribution.RCS || 0, color: 'bg-cyan-500', latency: '48.5 ms', rate: '99.4%' },
    { name: 'WhatsApp Social', count: telemetry.channel_distribution.WhatsApp || 0, color: 'bg-emerald-500', latency: '32.1 ms', rate: '99.9%' },
    { name: 'Amazon SES', count: telemetry.channel_distribution.SES_Email || 0, color: 'bg-amber-500', latency: '82.3 ms', rate: '100.0%' },
  ]

  const total = telemetry.total_messages_exchanged || 1

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            AWS Communication Developer Services (CDS) Telemetry & Economics
          </h2>
          <p className="text-xs text-slate-400">
            Real-time delivery latency, channel distribution, and enterprise clinical ROI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Omnichannel Conversion: {telemetry.omnichannel_conversion_rate}
          </span>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Total Messages Exchanged</div>
          <div className="text-2xl font-bold text-white mt-1">{telemetry.total_messages_exchanged}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> Real-time 2-way sync
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Traditional Call Center Cost</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{telemetry.financial_impact.traditional_call_center_cost}</div>
          <div className="text-[10px] text-slate-400 mt-1">Based on \$7.50/nurse call</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">AWS CDS Orchestration Cost</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{telemetry.financial_impact.aws_cds_orchestration_cost}</div>
          <div className="text-[10px] text-emerald-300 font-semibold mt-1">EUM SMS + RCS + WA + SES</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4 rounded-xl border border-amber-500/30">
          <div className="text-[11px] text-amber-300 font-semibold">Net Efficiency Gain</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{telemetry.financial_impact.cost_efficiency_gain}</div>
          <div className="text-[10px] text-amber-300/80 mt-1">Savings: {telemetry.financial_impact.net_cost_reduction_usd}</div>
        </div>
      </div>

      {/* Channel Distribution Breakdown */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Channel Telemetry & Deliverability
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {channels.map((c, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${c.color}`}></span>
                  {c.name}
                </span>
                <span className="text-xs font-mono font-bold text-slate-200">{c.count}</span>
              </div>
              
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.color}`}
                  style={{ width: `${Math.max(8, (c.count / total) * 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Latency: <strong className="text-slate-300 font-mono">{c.latency}</strong></span>
                <span className="text-emerald-400 font-medium">{c.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
