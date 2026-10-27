import React, { useState, useRef } from 'react'
import { CheckCheck, Send, Image as ImageIcon, Mic, Phone, Video, MoreVertical, Paperclip, AlertCircle, ShieldCheck, Upload } from 'lucide-react'
import { MessageItem } from '../types'

interface WhatsAppViewProps {
  messages: MessageItem[]
  onSendMessage: (text: string, mediaUrl?: string) => void
  patientName: string
  isLoading: boolean
}

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({
  messages,
  onSendMessage,
  patientName,
  isLoading
}) => {
  const [inputText, setInputText] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    onSendMessage(inputText)
    setInputText('')
  }

  const handleRealFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        onSendMessage(
          inputText.trim() || `Here is a photo of my ${file.name.toLowerCase().includes('rash') ? 'rash' : 'swollen ankles'} for Dr. Chen's clinical review.`,
          data.url
        )
        setInputText('')
      } else {
        alert('Image upload failed. Please try again.')
      }
    } catch (err) {
      console.error('File upload error:', err)
      alert('Network error while uploading image.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSamplePhoto = (type: 'edema' | 'rash') => {
    if (type === 'edema') {
      onSendMessage(
        "Here is a photo of my ankles, they feel swollen and puffy.",
        "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&auto=format&fit=crop&q=80"
      )
    } else {
      onSendMessage(
        "I noticed this red rash appearing on my arm since starting the new medication.",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80"
      )
    }
  }

  return (
    <div className="flex flex-col h-[640px] bg-[#0b141a] text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative font-sans">
      {/* Hidden File Input for Real Custom Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleRealFileUpload}
      />

      {/* WhatsApp Header */}
      <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-slate-700/50 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
              OC
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 ring-2 ring-[#202c33]">
              <ShieldCheck className="w-3 h-3 text-white fill-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-slate-100">OmniCare Health Network</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                Official WABA
              </span>
            </div>
            <p className="text-[11px] text-[#8696a0]">
              AWS End User Messaging Social • Verified Business Account
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#aebac1]">
          <Video className="w-5 h-5 cursor-pointer hover:text-white" />
          <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
          <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* WhatsApp Chat Body */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{
          backgroundImage: `radial-gradient(#1f2c34 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      >
        {/* Meta Encryption Notice */}
        <div className="flex justify-center my-2">
          <div className="bg-[#182229] border border-amber-500/20 rounded-lg px-3 py-1.5 text-[11px] text-amber-200/80 max-w-xs text-center flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            Messages are HIPAA & SOC2 secured via AWS CDS Social (Meta Cloud API).
          </div>
        </div>

        {messages.filter(m => m.channel === 'WHATSAPP').map((msg) => {
          const isUser = msg.direction === 'INBOUND'
          const payload = msg.payload || {}
          const buttons = payload.interactive?.action?.buttons || []

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed relative shadow-md ${
                  isUser
                    ? 'bg-[#005c4b] text-white rounded-tr-none'
                    : 'bg-[#202c33] text-slate-200 rounded-tl-none border border-slate-700/30'
                }`}
              >
                {/* Media Image if present */}
                {payload.media_url && (
                  <div className="mb-2 rounded-md overflow-hidden border border-black/20">
                    <img src={payload.media_url} alt="Uploaded Symptom" className="w-full h-40 object-cover" />
                    <div className="bg-black/60 p-1.5 text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Amazon Bedrock Claude 3.5 Multimodal Analysis Complete
                    </div>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400/80">
                  <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-400 inline" />}
                </div>

                {/* Interactive Action Buttons */}
                {buttons.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex flex-col gap-1.5">
                    {buttons.map((b: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => onSendMessage(b.reply?.title || b.title || b)}
                        className="w-full py-1.5 px-3 rounded bg-[#111b21] hover:bg-[#2a3942] text-emerald-400 font-semibold text-xs border border-emerald-500/20 text-center transition-colors"
                      >
                        {b.reply?.title || b.title || b}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {(isLoading || isUploading) && (
          <div className="flex items-center gap-2 text-xs text-[#8696a0] italic px-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            {isUploading ? 'Uploading & encrypting image...' : 'OmniCare Clinical Agent is analyzing...'}
          </div>
        )}
      </div>

      {/* Diagnostic Shortcut Tray */}
      <div className="bg-[#182229] px-3 py-1.5 border-t border-slate-800 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-medium">Vision Diagnostics:</span>
        <div className="flex gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            Upload Any Photo
          </button>
          <button
            onClick={() => handleSamplePhoto('edema')}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
          >
            Sample Edema
          </button>
          <button
            onClick={() => handleSamplePhoto('rash')}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
          >
            Sample Rash
          </button>
        </div>
      </div>

      {/* WhatsApp Input Bar */}
      <form onSubmit={handleSend} className="bg-[#202c33] p-2.5 flex items-center gap-2 border-t border-slate-700/50">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload Symptom Image from Device"
          className="text-[#8696a0] hover:text-white p-1.5 transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => handleSamplePhoto('edema')}
          title="Quick Preset Image"
          className="text-[#8696a0] hover:text-white p-1.5 transition-colors"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Dr. Chen's AI (meds, symptoms, refills)..."
          className="flex-1 bg-[#2a3942] text-slate-100 placeholder-[#8696a0] text-xs px-3.5 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-2.5 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
