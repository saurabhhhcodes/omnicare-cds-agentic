import React from 'react'
import { User, HeartPulse, Pill, AlertTriangle, ShieldCheck, Stethoscope, Clock, CheckCircle } from 'lucide-react'
import { SessionData } from '../types'

interface ClinicOpsViewProps {
  session: SessionData | null
}

export const ClinicOpsView: React.FC<ClinicOpsViewProps> = ({ session }) => {
  if (!session) return null
  const patient = session.patient

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{patient.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {patient.risk_level} RISK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {patient.condition} • Discharged: {patient.discharge_date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
            {patient.assigned_physician}
          </span>
        </div>
      </div>

      {/* Grid of Medical Records */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Active Medications */}
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
          <div className="font-bold text-slate-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
            <Pill className="w-3.5 h-3.5 text-amber-400" />
            Active Medications
          </div>
          <div className="space-y-1.5">
            {patient.medications.map((m, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{m.name}</div>
                  <div className="text-[10px] text-slate-400">{m.dosage}</div>
                </div>
                <span className="text-[9px] font-mono text-amber-400/80 bg-amber-400/10 px-1.5 py-0.5 rounded">
                  {m.rx_number}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Omnichannel Care State */}
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
          <div className="font-bold text-slate-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            CDS Engagement State
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400">Current Channel:</span>
              <span className="font-bold text-amber-400 font-mono">{session.active_channel}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400">Care Flow Stage:</span>
              <span className="font-semibold text-emerald-400">{session.stage}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400">Pickup Slot:</span>
              <span className="font-semibold text-white">{session.selected_pickup_slot || "Pending Selection"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Prescription Token:</span>
              <span className="font-mono text-blue-400 font-bold">{session.prescription_token || "Awaiting Auth"}</span>
            </div>
          </div>
        </div>

        {/* AI Multimodal Diagnostic Findings */}
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
          <div className="font-bold text-slate-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            AI Diagnostic Findings
          </div>
          {session.image_analysis_summary ? (
            <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
              <div className="font-bold text-emerald-300 text-[11px] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                {session.image_analysis_summary.detected_feature}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {session.image_analysis_summary.clinical_observation}
              </p>
              <div className="text-[10px] text-emerald-400 font-semibold pt-1 border-t border-emerald-500/20">
                Action: {session.image_analysis_summary.triage_recommendation}
              </div>
            </div>
          ) : (
            <div className="h-28 flex flex-col items-center justify-center text-slate-500 text-center px-2">
              <AlertTriangle className="w-6 h-6 mb-1 text-slate-600" />
              <span>No image uploaded yet. When the patient uploads a photo on WhatsApp, Bedrock Vision analysis appears here.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
