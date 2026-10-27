import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { WhatsAppView } from './components/WhatsAppView'
import { RcsSmsView } from './components/RcsSmsView'
import { EmailInboxView } from './components/EmailInboxView'
import { BedrockTraceView } from './components/BedrockTraceView'
import { ClinicOpsView } from './components/ClinicOpsView'
import { AnalyticsView } from './components/AnalyticsView'
import { MessageItem, SessionData, AgentTraceItem, TelemetryData } from './types'
import { MessageSquare, Smartphone, Mail, Sparkles, Activity } from 'lucide-react'

export const App: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<string>('HEART_FAILURE_TITRATION')
  const [activeDeviceTab, setActiveDeviceTab] = useState<'WHATSAPP' | 'RCS_SMS' | 'EMAIL'>('WHATSAPP')
  const [session, setSession] = useState<SessionData | null>(null)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [traces, setTraces] = useState<AgentTraceItem[]>([])
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false)

  // Initialize or Switch Scenario
  const handleStartScenario = async (scenarioType: string) => {
    setIsLoading(true)
    setActiveScenario(scenarioType)
    try {
      const res = await fetch(`/api/scenarios/start?scenario_type=${scenarioType}`, {
        method: 'POST'
      })
      const data = await res.json()
      if (data.session) {
        setSession(data.session)
        setMessages(data.session.messages || [])
        setTraces(data.session.agent_traces || [])
        // Set initial device view
        if (data.session.active_channel === 'WHATSAPP') {
          setActiveDeviceTab('WHATSAPP')
        } else if (data.session.active_channel === 'RCS' || data.session.active_channel === 'SMS') {
          setActiveDeviceTab('RCS_SMS')
        }
      }
      fetchTelemetry()
    } catch (err) {
      console.error('Failed to start scenario:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch Telemetry Summary
  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/telemetry/summary')
      const data = await res.json()
      setTelemetry(data)
    } catch (err) {
      console.error('Failed to fetch telemetry:', err)
    }
  }

  // Send message on active channel
  const handleSendMessage = async (text: string, mediaUrl?: string) => {
    if (!session) return
    setIsLoading(true)

    let channel = 'WHATSAPP'
    if (activeDeviceTab === 'RCS_SMS') {
      channel = session.active_channel === 'SMS' ? 'SMS' : 'RCS'
    } else if (activeDeviceTab === 'EMAIL') {
      channel = 'SES_EMAIL'
    }

    try {
      const res = await fetch('/api/messages/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          channel: channel,
          content: text,
          media_url: mediaUrl
        })
      })
      const data = await res.json()
      // If channel hopped, auto-switch tab for seamless viewer experience
      if (data.active_channel === 'RCS' || data.active_channel === 'SMS') {
        setActiveDeviceTab('RCS_SMS')
      } else if (data.stage === 'PRESCRIPTION_DISPATCHED') {
        setActiveDeviceTab('EMAIL')
      }
      refreshSession()
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle 1-Tap Pharmacy Selection in RCS
  const handleSelectPharmacy = async (pharmacyId: string) => {
    if (!session) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/pharmacy/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          pharmacy_id: pharmacyId
        })
      })
      const data = await res.json()
      // Seamlessly switch to Email Inbox to view the generated pass
      setActiveDeviceTab('EMAIL')
      refreshSession()
    } catch (err) {
      console.error('Error selecting pharmacy:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh Session & Messages
  const refreshSession = async () => {
    if (!session) return
    try {
      const res = await fetch(`/api/sessions/${session.id}`)
      const data = await res.json()
      setSession(data)
      setMessages(data.messages || [])
      setTraces(data.agent_traces || [])
      fetchTelemetry()
    } catch (err) {
      console.error('Error refreshing session:', err)
    }
  }

  // WebSocket Connection
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
          const payload = JSON.parse(event.data)
          if (payload.event === 'MESSAGE_RECEIVED' || payload.event === 'AGENT_TRACE_ADDED' || payload.event === 'SESSION_UPDATED') {
            refreshSession()
          }
        } catch (e) {}
      }
    } catch (e) {
      console.warn('WebSocket connection error:', e)
    }

    return () => {
      if (ws) ws.close()
    }
  }, [session?.id])

  // Initial mount
  useEffect(() => {
    handleStartScenario('HEART_FAILURE_TITRATION')
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header
        activeScenario={activeScenario}
        onSelectScenario={handleStartScenario}
        onReset={() => handleStartScenario(activeScenario)}
        isWsConnected={isWsConnected}
        isLoading={isLoading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Device Switcher Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveDeviceTab('WHATSAPP')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeDeviceTab === 'WHATSAPP'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Messenger</span>
              <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded-full text-emerald-300 border border-emerald-500/30 font-medium">Meta Verified WABA</span>
            </button>

            <button
              onClick={() => setActiveDeviceTab('RCS_SMS')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeDeviceTab === 'RCS_SMS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4 text-blue-300" />
              <span>RCS & SMS Chat</span>
              <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded-full text-blue-300 border border-blue-500/30 font-medium">GSMA UP 2.4</span>
            </button>

            <button
              onClick={() => setActiveDeviceTab('EMAIL')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeDeviceTab === 'EMAIL'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-1 ring-amber-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span>Amazon SES Inbox</span>
              <span className="text-[10px] bg-amber-950/80 px-2 py-0.5 rounded-full text-amber-300 border border-amber-500/30 font-medium">DKIM Verified</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Channel State: <strong className="text-white font-mono">{session?.active_channel || 'INIT'}</strong></span>
          </div>
        </div>

        {/* Dual Column Layout: Left Simulator, Right Bedrock Trace */}
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

      <footer className="border-t border-slate-800/80 bg-slate-900/90 py-4 px-6 text-center text-xs text-slate-400">
        <p className="font-medium">
          OmniCare CDS™ Enterprise Platform • Architecture: AWS End User Messaging (SMS & RCS) • Meta WhatsApp Cloud API • Amazon SES • Amazon Bedrock AgentCore • HL7 / FHIR R4 Ready
        </p>
      </footer>
    </div>
  )
}
export default App
