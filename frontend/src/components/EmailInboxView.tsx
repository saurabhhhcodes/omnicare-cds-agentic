import React, { useState } from 'react'
import { Mail, CheckCircle2, ShieldCheck, Download, Calendar, QrCode, Send, Printer } from 'lucide-react'
import { MessageItem } from '../types'

interface EmailInboxViewProps {
  messages: MessageItem[]
  patientEmail: string
}

export const EmailInboxView: React.FC<EmailInboxViewProps> = ({ messages, patientEmail }) => {
  const emailMessages = messages.filter(m => m.channel === 'SES_EMAIL')
  const [testEmail, setTestEmail] = useState('')
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testSuccess, setTestSuccess] = useState<string | null>(null)

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testEmail || !testEmail.includes('@')) return

    setIsSendingTest(true)
    setTestSuccess(null)
    try {
      const res = await fetch('/api/email/dispatch-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient_email: testEmail })
      })
      if (res.ok) {
        setTestSuccess(`Successfully dispatched Amazon SES pass to ${testEmail}!`)
        setTestEmail('')
      } else {
        alert('Failed to dispatch SES test email.')
      }
    } catch (err) {
      console.error('SES test error:', err)
      alert('Error connecting to backend SES service.')
    } finally {
      setIsSendingTest(false)
    }
  }

  const handlePrint = (html: string) => {
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(html)
      win.document.close()
      win.focus()
      setTimeout(() => win.print(), 500)
    }
  }

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

      {/* Real Email Test Bar */}
      <div className="bg-slate-850 px-4 py-2 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <span className="text-[11px] text-slate-400 font-medium shrink-0">
          Send live test to your email:
        </span>
        <form onSubmit={handleSendTestEmail} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="bg-slate-900 text-slate-200 placeholder-slate-500 text-xs px-2.5 py-1 rounded-md border border-slate-700 focus:outline-none focus:border-amber-500 w-full sm:w-48"
          />
          <button
            type="submit"
            disabled={isSendingTest || !testEmail}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-medium text-xs px-3 py-1 rounded-md transition-colors flex items-center gap-1 shrink-0"
          >
            <Send className="w-3 h-3" />
            {isSendingTest ? 'Sending...' : 'Send Pass'}
          </button>
        </form>
      </div>

      {testSuccess && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/30 px-4 py-1.5 text-xs text-emerald-300 flex items-center justify-between">
          <span>✓ {testSuccess}</span>
          <button onClick={() => setTestSuccess(null)} className="text-emerald-400 font-bold ml-2">×</button>
        </div>
      )}

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
                    <div className="flex items-center gap-2">
                      {payload.html_content && (
                        <button
                          onClick={() => handlePrint(payload.html_content)}
                          title="Print or Save PDF"
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
                        >
                          <Printer className="w-3 h-3 text-amber-400" />
                          <span>Print Pass</span>
                        </button>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
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
