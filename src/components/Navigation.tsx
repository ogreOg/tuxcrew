import { useState } from 'react';
import { useLocation } from 'wouter';
import { Menu, X, DollarSign, Mail, Wrench } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import cosmicLogo from '@/pages/logo/logo.png';

export function Navigation() {
  const [location] = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isActive = (path: string) => path === '/' ? location === '/' : location.startsWith(path);
  const labels = language === 'ru' ? { services: 'Системы', pricing: 'Форматы', contact: 'Связь' } : { services: 'Systems', pricing: 'Engagement', contact: 'Contact' };
  const navLinks = [
    { href: '/services', label: labels.services, Icon: Wrench },
    { href: '/pricing', label: labels.pricing, Icon: DollarSign },
    { href: '/contact', label: labels.contact, Icon: Mail },
  ];
  const closeMenu = () => setMobileMenuOpen(false);
  const languageButton = <button type="button" onClick={toggleLanguage} className="inline-flex items-center gap-2 rounded border border-emerald-300/20 bg-black/60 px-3 py-2 font-mono text-[9px] tracking-[0.2em] uppercase text-white transition-colors hover:border-emerald-300/50" aria-label="Toggle language"><span className={language === 'en' ? 'text-emerald-300' : 'text-white/60'}>EN</span><span className="text-white/30">/</span><span className={language === 'ru' ? 'text-emerald-300' : 'text-white/60'}>RU</span></button>;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-emerald-300/10 bg-[#050806]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <a href="/" onClick={closeMenu} className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80"><img src={cosmicLogo} alt="Tonrax" className="h-9 w-auto sm:h-11" /><span className="hidden border-l border-emerald-300/20 pl-3 font-mono text-[9px] tracking-[0.18em] text-emerald-200 uppercase sm:block">Private systems</span></a>
        <div className="hidden items-center gap-7 md:flex">{navLinks.map((link) => <a key={link.href} href={link.href} className={`font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${isActive(link.href) ? 'text-emerald-300' : 'text-gray-300 hover:text-emerald-200'}`}>{link.label}</a>)}{languageButton}</div>
        <div className="flex items-center gap-3 md:hidden">{languageButton}<button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center border border-emerald-300/20 bg-black/60 p-2 text-white hover:border-emerald-300/50" aria-label="Toggle menu">{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
      </div>
      {mobileMenuOpen && <div className="border-t border-emerald-300/10 bg-[#050806]/95 backdrop-blur-xl md:hidden"><div className="flex flex-col gap-1 px-4 py-3">{navLinks.map(({ href, label, Icon }) => <a key={href} href={href} onClick={closeMenu} className={`flex items-center gap-3 px-3 py-3 font-mono text-xs tracking-[0.15em] uppercase ${isActive(href) ? 'bg-emerald-300/10 text-emerald-300' : 'text-white hover:bg-white/5 hover:text-emerald-200'}`}><Icon className="h-4 w-4" />{label}</a>)}</div></div>}
    </nav>
  );
}
