import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavView } from '../types/course';

interface TopBarProps {
  activeView: NavView;
  onNavigate: (view: NavView) => void;
  primaryCtaLabel: string;
  onPrimaryCta: () => void;
}

const NAV_ITEMS: { id: NavView; label: string }[] = [
  { id: 'plan', label: 'Course Plan' },
  { id: 'studio', label: 'Study Studio' },
  { id: 'exam', label: 'Drill Exam' },
  { id: 'formulas', label: 'Formula Vault' },
  { id: 'about', label: 'About' },
];

export function TopBar({
  activeView,
  onNavigate,
  primaryCtaLabel,
  onPrimaryCta,
}: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: NavView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('plan')}
          className="font-display text-xl font-semibold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 cursor-pointer hover:text-[#1D4ED8] transition-colors"
        >
          CalcAtlas
        </button>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  isActive
                    ? 'text-[#0F172A] font-semibold'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-[21px] h-[2px] transition-opacity duration-150 ${
                    isActive ? 'bg-[#1D4ED8] opacity-100' : 'bg-transparent opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onPrimaryCta}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {primaryCtaLabel}
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#1D4ED8] font-semibold'
                    : 'text-[#334155] hover:bg-[#F8FAFC]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onPrimaryCta();
              }}
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors cursor-pointer"
            >
              {primaryCtaLabel}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
