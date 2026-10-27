import React, { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { WhatsAppView } from './components/WhatsAppView'
import { RcsSmsView } from './components/RcsSmsView'
import { EmailInboxView } from './components/EmailInboxView'
import { BedrockTraceView } from './components/BedrockTraceView'
import { ClinicOpsView } from './components/ClinicOpsView'
import { AnalyticsView } from './components/AnalyticsView'
import { SessionData, MessageItem, AgentTraceItem, TelemetryData } from './types'
import { MessageSquare, Smartphone, Mail, Sparkles, Activity } from 'lucide-react'

export function App() {
  const [activeScenario, setActiveScenario] = useState('HEART_FAILURE_TITRATION')
  const [activeDeviceTab, setActiveDeviceTab] = useState<'WHATSAPP' | 'RCS_SMS' | 'EMAIL'>('WHATSAPP')
  const [session, setSession] = useState<SessionData | null>(null)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [traces, setTraces] = useState<AgentTraceItem[]>([])
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null)
  const [isWsConnected, setIsWsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch Session Data
  const fetchSessionData = useCallback(async (sessionId: string) => {
    try {
      const [sRes, mRes, tRes, telRes] = await Promise.all([
        fetch(`/api/sessions/${sessionId}`),
        fetch(`/api/messages?session_id=${sessionId}`),
        fetch(`/api/traces?session_id=${sessionId}`),
        fetch('/api/telemetry')
      ])

      if (sRes.ok) setSession(await sRes.json())
      if (mRes.ok) setMessages(await mRes.json())
      if (tRes.ok) setTraces(await tRes.json())
      if (telRes.ok) setTelemetry(await telRes.json())
    } catch (err) {
      console.error('Error fetching session data:', err)
    }
  }, [])

  // Start Scenario
  const handleStartScenario = async (scenarioType: string) => {
    setIsLoading(true)
    setActiveScenario(scenarioType)
    try {
      const res = await fetch('/api/sessions/start-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_type: scenarioType })
      })
      if (res.ok) {
        const data = await res.json()
        await fetchSessionData(data.session_id)
        if (scenarioType === 'CELLULITIS_RASH') {
          setActiveDeviceTab('WHATSAPP')
        } else {
          setActiveDeviceTab('WHATSAPP') // Start on WhatsApp for visual showcase
        }
      }
    } catch (err) {
      console.error('Failed to start scenario:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial Load
  useEffect(() => {
    handleStartScenario('HEART_FAILURE_TITRATION')
  }, [])

  // WebSocket for Live Push
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    let ws: WebSocket | null = null

    try {
      ws = new WebSocket(wsUrl)
      ws.onopen = () => setIsWsConnected(true)
      ws.onclose = () => setIsWsConnected(false)
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.session_id) {
            fetchSessionData(data.session_id)
          }
        } catch {
          // Ignore parse errors
        }
      }
    } catch (err) {
      console.error('WebSocket connection error:', err)
    }

    return () => {
      if (ws) ws.close()
    }
  }, [fetchSessionData])

  // Inbound message dispatch
  const handleSendMessage = async (text: string, mediaUrl?: string) => {
    if (!session) return
    setIsLoading(true)

    // Optimistic UI append
    const tempMsg: MessageItem = {
      id: `temp-${Date.now()}`,
      channel: activeDeviceTab === 'WHATSAPP' ? 'WHATSAPP' : 'RCS',
      direction: 'INBOUND',
      message_type: mediaUrl ? 'IMAGE' : 'TEXT',
      content: text,
      payload: { media_url: mediaUrl },
      delivery_status: 'SENT',
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      const res = await fetch('/api/messages/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          channel: activeDeviceTab === 'WHATSAPP' ? 'WHATSAPP' : 'RCS',
          content: text,
          media_url: mediaUrl
        })
      })

      if (res.ok) {
        const result = await res.json()
        await fetchSessionData(session.id)
        
        // Auto-switch tabs to reflect omnichannel actions
        if (result.stage === 'PRESCRIPTION_DISPATCHED') {
          setActiveDeviceTab('EMAIL')
        } else if (result.stage === 'RCS_CAROUSEL_SENT' || result.active_channel === 'RCS') {
          setActiveDeviceTab('RCS_SMS')
        }
      }
    } catch (err) {
      console.error('Error sending inbound message:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Pharmacy Selection in RCS Carousel
  const handleSelectPharmacy = (postback: string) => {
    handleSendMessage(postback)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        activeScenario={activeScenario}
        onSelectScenario={handleStartScenario}
        onReset={() => handleStartScenario(activeScenario)}
        isWsConnected={isWsConnected}
        isLoading={isLoading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Device Switcher Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveDeviceTab('WHATSAPP')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeDeviceTab === 'WHATSAPP'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp (Meta Social)</span>
              <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded-full text-emerald-300 border border-emerald-500/30">Verified WABA</span>
            </button>

            <button
              onClick={() => setActiveDeviceTab('RCS_SMS')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeDeviceTab === 'RCS_SMS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4 text-blue-300" />
              <span>RCS & SMS (EUM)</span>
              <span className="text-[10px] bg-blue-950 px-2 py-0.5 rounded-full text-blue-300 border border-blue-500/30">GSMA UP 2.4</span>
            </button>

            <button
              onClick={() => setActiveDeviceTab('EMAIL')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeDeviceTab === 'EMAIL'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-1 ring-amber-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span>Amazon SES Inbox</span>
              <span className="text-[10px] bg-amber-950 px-2 py-0.5 rounded-full text-amber-300 border border-amber-500/30">DKIM Pass</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active Channel State: <strong className="text-white font-mono">{session?.active_channel || 'INIT'}</strong></span>
          </div>
        </div>

        {/* Dual Column Layout: Left Simulator, Right Bedrock Trace & Clinic Ops */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Device Simulator (5 cols) */}
          <div className="lg:col-span-5">
            {activeDeviceTab === 'WHATSAPP' && (
              <WhatsAppView
                messages={messages}
                onSendMessage={handleSendMessage}
                patientName={session?.patient?.name || 'Patient'}
                isLoading={isLoading}
              />
            )}

            {activeDeviceTab === 'RCS_SMS' && (
              <RcsSmsView
                messages={messages}
                onSendMessage={handleSendMessage}
                onSelectPharmacy={handleSelectPharmacy}
                isLoading={isLoading}
              />
            )}

            {activeDeviceTab === 'EMAIL' && (
              <EmailInboxView
                messages={messages}
                patientEmail={session?.patient?.email || 'patient@example.com'}
              />
            )}
          </div>

          {/* Right Column: Bedrock AgentCore Trace (7 cols) */}
          <div className="lg:col-span-7">
            <BedrockTraceView traces={traces} />
          </div>
        </div>

        {/* Bottom Section: Clinic Ops & AWS CDS Analytics */}
        <div className="grid grid-cols-1 gap-6">
          <ClinicOpsView session={session} />
          <AnalyticsView telemetry={telemetry} />
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-4 px-6 text-center text-xs text-slate-400">
        OmniCare CDS™ Enterprise Platform • Architecture: AWS End User Messaging (SMS & RCS) • Meta WhatsApp Cloud API • Amazon SES • Amazon Bedrock AgentCore • FHIR R4 Compliant
      </footer>
    </div>
  )
}
export default App
