import React, { useState } from 'react'
import { Send, ShieldCheck, MapPin, Clock, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react'
import { MessageItem } from '../types'

interface RcsSmsViewProps {
  messages: MessageItem[]
  onSendMessage: (text: string) => void
  onSelectPharmacy: (pharmacyId: string) => void
  isLoading: boolean
}

export const RcsSmsView: React.FC<RcsSmsViewProps> = ({
  messages,
  onSendMessage,
  onSelectPharmacy,
  isLoading
}) => {
  const [inputText, setInputText] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    onSendMessage(inputText)
    setInputText('')
  }

  const rcsSmsMessages = messages.filter(m => m.channel === 'SMS' || m.channel === 'RCS')

  return (
    <div className="flex flex-col h-[640px] bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative font-sans">
      {/* RCS Top Header */}
      <div className="bg-slate-800/90 px-4 py-3 flex items-center justify-between border-b border-slate-700/60 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            +1
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-white">OmniCare Network</span>
              <ShieldCheck className="w-4 h-4 text-blue-400 fill-blue-400/20" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-blue-400 font-semibold">RCS Chat</span>
              <span>•</span>
              <span>GSMA UP 2.4 Verified</span>
            </div>
          </div>
        </div>
        <div className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
          AWS EUM RCS
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {rcsSmsMessages.map((msg) => {
          const isUser = msg.direction === 'INBOUND'
          const payload = msg.payload || {}
          const isCarousel = msg.message_type === 'CAROUSEL'
          const cards = payload.cards || []
          const quickReplies = payload.quick_replies || []

          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              {/* Standard text bubble */}
              {!isCarousel && (
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-slate-800 text-slate-200 rounded-bl-xs border border-slate-700/50'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className="mt-1 text-[10px] text-slate-400/80 text-right">
                    {msg.channel === 'SMS' ? 'SMS • Carrier Route' : 'RCS • Verified'}
                  </div>
                </div>
              )}

              {/* RCS Carousel Component */}
              {isCarousel && (
                <div className="w-full space-y-2 mt-1">
                  <div className="text-xs font-semibold text-slate-300 px-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {msg.content}
                  </div>

                  {/* Horizontal Scroll Carousel */}
                  <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar snap-x">
                    {cards.map((card: any, idx: number) => (
                      <div
                        key={idx}
                        className="min-w-[220px] max-w-[230px] rounded-xl bg-slate-800/90 border border-slate-700/80 overflow-hidden shadow-lg flex flex-col snap-start shrink-0"
                      >
                        <div className="h-24 overflow-hidden relative">
                          <img src={card.media_url} alt={card.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/90 text-slate-950">
                            IN STOCK
                          </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="font-bold text-xs text-white line-clamp-1">{card.title}</div>
                            <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{card.description}</div>
                          </div>

                          <button
                            onClick={() => onSelectPharmacy(card.postback)}
                            className="mt-3 w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-colors"
                          >
                            <span>1-Tap Select</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Action Chips */}
                  {quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {quickReplies.map((qr: any, qIdx: number) => (
                        <button
                          key={qIdx}
                          onClick={() => onSendMessage(qr.postback || qr.text)}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 transition-colors"
                        >
                          {qr.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            OmniCare agent preparing rich response...
          </div>
        )}
      </div>

      {/* Suggested Quick Replies Tray */}
      <div className="bg-slate-800/60 p-2 border-t border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => onSendMessage("PHARMACY")}
          className="px-2.5 py-1 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs shrink-0 font-medium"
        >
          📍 Find Pharmacies
        </button>
        <button
          onClick={() => onSendMessage("WHATSAPP")}
          className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs shrink-0 font-medium"
        >
          💬 Switch to WhatsApp
        </button>
        <button
          onClick={() => onSendMessage("How should I take my Metoprolol?")}
          className="px-2.5 py-1 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs shrink-0 font-medium"
        >
          ❓ Dosage Question
        </button>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="bg-slate-800 p-2.5 flex items-center gap-2 border-t border-slate-700/80">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type an SMS or RCS message..."
          className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-2.5 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
