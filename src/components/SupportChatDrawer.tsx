import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  ExternalLink,
  Headphones
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

const TELEGRAM_SUPPORT_URL = 'https://t.me/winvestsupportcentre';

export const SupportChatDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTelegramTooltip, setShowTelegramTooltip] = useState(true);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Hello! Welcome to Winvest (Wealth Invest Corp). I am your 24/7 AI Investment Concierge. How can I assist you today? You can also reach our live support team directly on Telegram: @winvestsupportcentre',
      time: 'Just now',
    },
  ]);

  const quickPrompts = [
    'How do I deposit Bitcoin?',
    'When can I withdraw my profit?',
    'Telegram Support Link',
    'What is the 3-tier affiliate rate?',
    'Where is Wealth Invest Corp located?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate responsive smart reply
    setTimeout(() => {
      let reply = 'Our institutional trading algorithms execute round-the-clock across top exchanges to deliver a fixed 3.00% daily yield for 60 calendar days (180% total return). Withdrawals are processed 24/7 with zero platform fees.';
      
      const lower = text.toLowerCase();
      if (lower.includes('telegram') || lower.includes('support') || lower.includes('human') || lower.includes('agent') || lower.includes('help')) {
        reply = 'You can reach our official 24/7 Live Telegram Support team anytime at: https://t.me/winvestsupportcentre (Username: @winvestsupportcentre). Our representatives are available 24/7 for instant assistance.';
      } else if (lower.includes('deposit') || lower.includes('invest') || lower.includes('bitcoin') || lower.includes('btc')) {
        reply = 'Deposits can be made in Bitcoin (BTC), Ethereum (ETH), or USDT starting from just $10 USD. Once confirmed, your 60-day 3.00% daily cycle activates automatically and your official Share Certificate is generated.';
      } else if (lower.includes('withdraw') || lower.includes('payout') || lower.includes('fee')) {
        reply = 'You can withdraw daily earnings 24 hours a day, 7 days a week. The minimum withdrawal is $1.00 USD with zero platform fees. Payouts typically execute within minutes directly to your Bitcoin wallet.';
      } else if (lower.includes('affiliate') || lower.includes('referral') || lower.includes('commission')) {
        reply = 'Winvest offers an instant 3-Tier partner commission model: 5.0% for direct referrals (Level 1), 2.0% for Level 2, and 1.0% for Level 3. Commissions are paid out immediately on every deposit.';
      } else if (lower.includes('location') || lower.includes('where') || lower.includes('registered') || lower.includes('address')) {
        reply = 'Wealth Invest Corp is registered in New York (DOS Entity ID #7291842) with global headquarters located at One Vanderbilt Avenue, 45th Floor, New York, NY 10017.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Controls Stack at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        
        {/* Telegram Popup & Floating Button (Above Support Button) */}
        <div className="relative flex items-center group">
          {/* Telegram Popup Bubble */}
          {showTelegramTooltip && (
            <div className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#0b172a] text-white border border-[#229ED9]/50 shadow-xl shadow-[#229ED9]/20 rounded-2xl px-3.5 py-2 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-right-3 duration-300">
              <span className="w-2 h-2 rounded-full bg-[#229ED9] animate-ping shrink-0" />
              <a
                href={TELEGRAM_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-[#229ED9] flex items-center gap-1.5 transition-colors"
              >
                <span>Live Telegram Support: <strong className="text-[#229ED9]">@winvestsupportcentre</strong></span>
                <ExternalLink className="w-3 h-3 text-[#229ED9]" />
              </a>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTelegramTooltip(false);
                }}
                className="text-slate-400 hover:text-white ml-1 p-0.5"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Telegram Floating Button */}
          <a
            href={TELEGRAM_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#0088cc] to-[#29b6f6] hover:scale-105 transition-all shadow-xl shadow-[#0088cc]/40 flex items-center justify-center text-white relative group"
            aria-label="Telegram Live Support"
            title="Official Telegram Support: @winvestsupportcentre"
          >
            {/* Telegram Icon */}
            <svg
              className="w-7 h-7 fill-white translate-x-[-1px] translate-y-[1px]"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12c0-6.63-5.37-12-12-12zm5.89 7.82l-2.02 9.53c-.15.68-.56.85-1.12.53l-3.08-2.27-1.49 1.43c-.16.16-.3.3-.61.3l.22-3.14 5.72-5.17c.25-.22-.05-.34-.39-.12L9.06 13.3l-3.04-.95c-.66-.21-.68-.66.14-.98l11.9-4.59c.55-.2 1.03.13.83 1.04z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-[#05070e] animate-pulse" />
          </a>
        </div>

        {/* Live Support AI Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 hover:scale-105 transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center text-slate-950 p-3 relative group"
          aria-label="Open 24/7 AI Support"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 fill-slate-950" />}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#05070e] animate-pulse"></span>
        </button>
      </div>

      {/* Live AI Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] bg-[#090f23] rounded-3xl border-2 border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#050814] p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">Winvest AI Concierge</h4>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">24/7 Institutional Support</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Telegram Official Banner inside Drawer */}
          <div className="bg-[#0088cc]/15 border-b border-[#0088cc]/30 px-3.5 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-cyan-200">
              <Headphones className="w-3.5 h-3.5 text-[#29b6f6] shrink-0" />
              <span className="text-[11px]">Official Live Support: <strong>@winvestsupportcentre</strong></span>
            </div>
            <a
              href={TELEGRAM_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-lg bg-[#0088cc] hover:bg-[#0099e6] text-white text-[10px] font-bold flex items-center gap-1 transition-colors shrink-0"
            >
              <span>Telegram</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-[#050814] text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.text.includes(TELEGRAM_SUPPORT_URL) ? (
                    <div>
                      <p>{msg.text.split(TELEGRAM_SUPPORT_URL)[0]}</p>
                      <a
                        href={TELEGRAM_SUPPORT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-lg bg-[#0088cc]/20 border border-[#0088cc]/40 text-cyan-300 font-bold hover:underline text-[11px]"
                      >
                        <span>Open Telegram @winvestsupportcentre</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <p className="mt-1">{msg.text.split(TELEGRAM_SUPPORT_URL)[1]}</p>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-[#060a18] border-t border-slate-800/80 flex gap-1.5 overflow-x-auto text-[10px] font-mono scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-[#050814] border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a question or request Telegram support..."
                className="flex-1 px-3.5 py-2.5 bg-[#090f23] border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl transition-colors shrink-0 font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};

