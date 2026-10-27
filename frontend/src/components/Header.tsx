import React, { useState, useEffect } from 'react'
import { MessageSquare, Sparkles, RefreshCw, HeartPulse, CheckCircle2, Settings as SettingsIcon, Cloud, ShieldCheck, X } from 'lucide-react'

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
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [awsConfig, setAwsConfig] = useState<any>({
    aws_region: 'us-east-1',
    aws_cds_mode: 'HYBRID_SIMULATION',
    bedrock_model_id: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    ses_sender_email: 'clinical-care@omnicare.health',
    has_credentials: false,
    services: {}
  })
  const [accessKey, setAccessKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const fetchAwsConfig = async () => {
    try {
      const res = await fetch('/api/config/aws')
      if (res.ok) {
        setAwsConfig(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch AWS config:', err)
    }
  }

  useEffect(() => {
    fetchAwsConfig()
  }, [])

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const res = await fetch('/api/config/aws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aws_region: awsConfig.aws_region,
          aws_cds_mode: awsConfig.aws_cds_mode,
          bedrock_model_id: awsConfig.bedrock_model_id,
          ses_sender_email: awsConfig.ses_sender_email,
          aws_access_key_id: accessKey || undefined,
          aws_secret_access_key: secretKey || undefined
        })
      })
      if (res.ok) {
        setSaveSuccess(true)
        fetchAwsConfig()
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Failed to update config:', err)
      alert('Error updating AWS configuration.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-xl sticky top-0 z-50 px-4 lg:px-8 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20 transition-transform group-hover:scale-105">
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
              <button
                onClick={() => setShowConfigModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                title="Configure AWS CDS & Bedrock Mode"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{awsConfig.aws_cds_mode === 'LIVE' ? 'AWS LIVE CONNECTED' : 'AWS CDS ACTIVE'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Autonomous Omnichannel Care Navigation • EUM (SMS & RCS) • Meta WhatsApp • Amazon SES • Bedrock AgentCore
            </p>
          </div>
        </div>

        {/* Channel Badges */}
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

        {/* Clinical Scenario Selector & Config Toggle */}
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
            onClick={() => setShowConfigModal(true)}
            title="AWS CDS & Cloud Configuration"
            className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
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

      {/* AWS Cloud Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">AWS Communication Developer Services (CDS)</h2>
                <p className="text-xs text-slate-400">Enterprise Omnichannel Runtime & Bedrock AgentCore Settings</p>
              </div>
            </div>

            {/* Active Service Status Grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono">AWS EUM SMS</div>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  ONLINE (10DLC High-Throughput)
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono">AWS EUM RCS</div>
                <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  GSMA UP 2.4 Verified
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono">AWS EUM WhatsApp</div>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Meta Cloud API WABA
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Amazon SES</div>
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  SPF/DKIM 2048-bit Signed
                </div>
              </div>
              <div className="col-span-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Amazon Bedrock AgentCore</div>
                <div className="text-xs font-semibold text-purple-400 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  {awsConfig.bedrock_model_id}
                </div>
              </div>
            </div>

            {/* Config Form */}
            <form onSubmit={handleSaveConfig} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Execution Mode</label>
                  <select
                    value={awsConfig.aws_cds_mode}
                    onChange={(e) => setAwsConfig({ ...awsConfig, aws_cds_mode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-cyan-500"
                  >
                    <option value="HYBRID_SIMULATION">Hybrid Clinical Simulation (Default)</option>
                    <option value="LIVE">Live AWS Cloud Connected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">AWS Region</label>
                  <input
                    type="text"
                    value={awsConfig.aws_region}
                    onChange={(e) => setAwsConfig({ ...awsConfig, aws_region: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Bedrock Foundation Model ID</label>
                <input
                  type="text"
                  value={awsConfig.bedrock_model_id}
                  onChange={(e) => setAwsConfig({ ...awsConfig, bedrock_model_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Amazon SES Verified Sender Email</label>
                <input
                  type="email"
                  value={awsConfig.ses_sender_email}
                  onChange={(e) => setAwsConfig({ ...awsConfig, ses_sender_email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="border-t border-slate-800 pt-3">
                <span className="text-[11px] text-slate-500 block mb-2">
                  Optional: Provide AWS credentials for live Bedrock & SES calls (stored in local memory only):
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="AWS Access Key ID"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-cyan-500 font-mono"
                  />
                  <input
                    type="password"
                    placeholder="AWS Secret Access Key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {saveSuccess && (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-medium">
                  ✓ AWS Configuration Saved Successfully!
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
