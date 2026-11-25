import { useState } from 'react';
import { useLocation } from 'wouter';
import { Menu, X, DollarSign, Mail , Wrench } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import cosmicLogo from '@/pages/logo/logo.png';

export function Navigation() {
  const [location] = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  const labels = {
    en: {
      services: 'Services',
      pricing: 'Pricing',
      contact: 'Contact',
    },
    ru: {
      services: 'Услуги',
      pricing: 'Цены',
      contact: 'Контакты',
    },
  };

  const navLinks = [
    { href: '/services', label: labels[language].services, Icon: Wrench },
    { href: '/pricing', label: labels[language].pricing, Icon: DollarSign },
    { href: '/contact', label: labels[language].contact, Icon: Mail },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <a href="/" className="flex shrink-0 items-center transition-all hover:opacity-80">
          <img src={cosmicLogo} alt="Tonrax" className="h-10 w-auto sm:h-14" />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 sm:gap-6 md:flex">
          <div className="flex items-center gap-5 sm:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-mono text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                  isActive(link.href) ? 'text-orange-300' : 'text-white hover:text-orange-300'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-1 font-mono text-[9px] tracking-[0.2em] uppercase text-white transition-colors hover:bg-white/5"
            aria-label="Toggle language"
          >
            <span className={language === 'en' ? 'text-orange-300' : 'text-white/80'}>EN</span>
            <span className="text-white/40">/</span>
            <span className={language === 'ru' ? 'text-orange-300' : 'text-white/80'}>RU</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-1 font-mono text-[9px] tracking-[0.2em] uppercase text-white transition-colors hover:bg-white/5"
            aria-label="Toggle language"
          >
            <span className={language === 'en' ? 'text-orange-300' : 'text-white/80'}>EN</span>
            <span className="text-white/40">/</span>
            <span className={language === 'ru' ? 'text-orange-300' : 'text-white/80'}>RU</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/40 p-2 text-white transition-colors hover:border-white/20"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-white/5 bg-black/80 backdrop-blur md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => {
              const Icon = link.Icon as any;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className={`rounded px-3 py-2 font-mono text-sm tracking-[0.15em] uppercase transition-colors duration-300 ${
                    isActive(link.href)
                      ? 'bg-orange-300/10 text-orange-300'
                      : 'text-white hover:bg-white/5 hover:text-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`${isActive(link.href) ? 'h-4 w-4 text-orange-300' : 'h-4 w-4 text-white/80'}`} />
                    <span>{link.label}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
