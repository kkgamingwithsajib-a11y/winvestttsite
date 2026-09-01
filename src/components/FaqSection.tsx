import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Sparkles,
  MessageCircleQuestion
} from 'lucide-react';
import { FAQ_DATA } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General' },
    { id: 'investment', label: '3% Daily Plan' },
    { id: 'withdrawals', label: 'Withdrawals & Funding' },
    { id: 'affiliate', label: 'Affiliate Program' },
    { id: 'security', label: 'Security & Custody' },
  ];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative bg-[#070b19] border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base & Transparency</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Frequently Asked <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Everything you need to know about the Winvest platform, the 60-day investment pool, daily withdrawals, and shareholder certification.
          </p>
        </div>

        {/* Search and Category Filters */}
        <div className="space-y-4 mb-10">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. daily return, minimum withdrawal, certificate)..."
              className="w-full pl-11 pr-4 py-3 bg-[#090f23] border border-slate-700 focus:border-emerald-400 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-[#090f23] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all ${
                    isOpen 
                      ? 'bg-[#090f23] border-emerald-500/40 shadow-lg' 
                      : 'bg-[#090f23]/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-base font-bold text-white tracking-tight">
                      {faq.question}
                    </span>
                    <div className={`p-1.5 rounded-lg transition-transform ${
                      isOpen ? 'bg-emerald-500/20 text-emerald-400 rotate-180' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-[#090f23] rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No matching questions found for "{searchQuery}". Try another keyword or category.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
