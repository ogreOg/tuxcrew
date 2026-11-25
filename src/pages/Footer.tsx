import React from 'react';
import { SiMonero, SiBitcoin, SiEthereum, SiVisa, SiMastercard } from 'react-icons/si';
import { Link } from 'wouter';

import { useLanguage } from '@/context/LanguageContext';

interface FooterProps {
  copy?: {
    footer?: string;
  };
}

export const Footer: React.FC<FooterProps> = ({ copy }) => {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-white/10 py-12 px-6 md:px-20 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 bg-black/80 backdrop-blur-lg">
      {/* Copyright / Info */}
      <div className="font-mono text-xs tracking-widest text-gray-500 uppercase">
        {copy?.footer || '© 2026 All Rights Reserved.'}
      </div>

      {/* Payment Options */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 font-mono text-xs tracking-widest uppercase text-gray-500">
        <span className="text-gray-400">Payments:</span>
        <div className="flex items-center gap-3 text-gray-500">
          <a href="#" title="Monero" className="hover:text-orange-400 transition-colors">
            <SiMonero className="w-4 h-4" />
          </a>
          <span className="text-gray-700">|</span>
          <a href="#" title="Bitcoin" className="hover:text-orange-400 transition-colors">
            <SiBitcoin className="w-4 h-4" />
          </a>
          <span className="text-gray-700">|</span>
          <a href="#" title="Ethereum" className="hover:text-orange-400 transition-colors">
            <SiEthereum className="w-4 h-4" />
          </a>
          <span className="text-gray-700">|</span>
          <a href="#" title="Visa" className="hover:text-orange-400 transition-colors">
            <SiVisa className="w-5 h-5" />
          </a>
          <span className="text-gray-700">|</span>
          <a href="#" title="Mastercard" className="hover:text-orange-400 transition-colors">
            <SiMastercard className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex gap-6 font-mono text-xs tracking-widest uppercase text-gray-500">
        <a href="https://www.instagram.com/root.notfound" className="hover:text-orange-400 transition-colors">Instagram</a>
      </div>

      <nav aria-label={language === 'ru' ? 'Правовая информация' : 'Legal'} className="flex gap-5 font-mono text-xs tracking-widest uppercase text-gray-500">
        <Link href="/terms" className="transition-colors hover:text-orange-400">{language === 'ru' ? 'Условия' : 'Terms'}</Link>
        <Link href="/privacy" className="transition-colors hover:text-orange-400">{language === 'ru' ? 'Конфиденциальность' : 'Privacy'}</Link>
      </nav>
    </footer>
  );
};

