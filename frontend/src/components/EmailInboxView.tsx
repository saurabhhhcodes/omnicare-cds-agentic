import React from 'react'
import { Mail, CheckCircle2, ShieldCheck, Download, Calendar, QrCode } from 'lucide-react'
import { MessageItem } from '../types'

interface EmailInboxViewProps {
  messages: MessageItem[]
  patientEmail: string
}

export const EmailInboxView: React.FC<EmailInboxViewProps> = ({ messages, patientEmail }) => {
  const emailMessages = messages.filter(m => m.channel === 'SES_EMAIL')

  return (
    <div className="flex flex-col h-[640px] bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative font-sans">
      {/* Email Client Header */}
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">Patient Inbox ({patientEmail})</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Amazon SES Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Authenticated SPF / DKIM 2048-bit • Encrypted Delivery via Amazon SES
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {emailMessages.length} Delivered
        </div>
      </div>

      {/* Email Body Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/60">
        {emailMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
            <Mail className="w-12 h-12 stroke-1 text-slate-600" />
            <p className="text-xs text-center max-w-xs">
              No clinical emails dispatched yet. Once the patient selects a pharmacy on RCS or WhatsApp, Amazon SES generates an authenticated prescription pass here.
            </p>
          </div>
        ) : (
          emailMessages.map((msg) => {
            const payload = msg.payload || {}
            return (
              <div key={msg.id} className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl">
                {/* Email Subject Bar */}
                <div className="bg-slate-850 p-4 border-b border-slate-800 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white">{payload.subject || "Clinical Summary & Pickup Pass"}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        From: <span className="text-amber-400 font-semibold">{payload.sender || "clinical-care@omnicare.health"}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      ✓ DKIM: Valid
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      ✓ SPF: Amazon SES
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                      Token: {payload.qr_token || "RX-CONFIRMED"}
                    </span>
                  </div>
                </div>

                {/* Rendered HTML Preview */}
                <div className="p-4 bg-slate-100 text-slate-900 rounded-b-xl max-h-[460px] overflow-y-auto">
                  {payload.html_content ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: payload.html_content }} 
                      className="text-xs leading-relaxed"
                    />
                  ) : (
                    <div className="text-xs text-slate-700">{msg.content}</div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
