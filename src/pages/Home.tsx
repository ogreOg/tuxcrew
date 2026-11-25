import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Bot, Globe2, KeyRound, LockKeyhole, Network, Server, ShieldCheck, Terminal, Workflow } from 'lucide-react';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { useLanguage } from '@/context/LanguageContext';

const systems = [
  { icon: Server, id: 'INFRA / 01', title: { en: 'Private servers', ru: 'Частные серверы' }, text: { en: 'Dedicated environments for personal projects and business workloads, configured and maintained around your requirements.', ru: 'Выделенные среды для личных проектов и бизнес-нагрузок, настроенные под ваши требования.' } },
  { icon: Globe2, id: 'NETWORK / 02', title: { en: 'Onion services', ru: 'Onion-сервисы' }, text: { en: 'Deploy and maintain Tor onion services for lawful publishing, community access, and privacy-conscious projects.', ru: 'Развёртывание и обслуживание Tor onion-сервисов для законных публикаций, сообществ и проектов с заботой о приватности.' } },
  { icon: Network, id: 'CHAIN / 03', title: { en: 'Crypto nodes', ru: 'Крипто-ноды' }, text: { en: 'Self-host supported blockchain nodes to query public chain data and connect your own applications.', ru: 'Самостоятельный хостинг нод поддерживаемых блокчейнов для доступа к публичным данным и интеграции с приложениями.' } },
  { icon: KeyRound, id: 'ACCESS / 04', title: { en: 'Private VPN', ru: 'Персональный VPN' }, text: { en: 'A controlled VPN endpoint for secure remote access to your devices, team resources, or private network.', ru: 'Контролируемая VPN-точка для защищённого доступа к вашим устройствам, ресурсам команды или частной сети.' } },
  { icon: LockKeyhole, id: 'ROUTING / 05', title: { en: 'Private proxies', ru: 'Частные прокси' }, text: { en: 'Managed proxy infrastructure for authorized integrations, QA, and traffic management—with access controls.', ru: 'Управляемая прокси-инфраструктура для разрешённых интеграций, тестирования и управления трафиком.' } },
  { icon: Bot, id: 'AUTOMATION / 06', title: { en: 'Apps, bots & automation', ru: 'Приложения, боты и автоматизация' }, text: { en: 'Custom business apps, support chatbots, and workflow automations that connect your tools and reduce repetitive work.', ru: 'Бизнес-приложения, чат-боты поддержки и автоматизация процессов, которые связывают инструменты и сокращают рутину.' } },
];

export default function Home() {
  const { language } = useLanguage();
  const ru = language === 'ru';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050806] text-[#e8f3eb] selection:bg-emerald-400/30">
      <Starfield />
      <CursorDot />
      <Navigation />
      <main className="relative z-10">
        <section className="relative flex min-h-[92vh] items-center border-b border-emerald-300/10 px-6 pb-20 pt-32 md:px-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_42%,rgba(16,185,129,0.12),transparent_48%)]" />
          <div className="mx-auto grid w-full max-w-7xl items-end gap-14 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="relative">
              <FadeIn>
                <div className="mb-8 inline-flex items-center gap-3 border border-emerald-300/20 bg-black/50 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-emerald-300 uppercase">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{ru ? 'ИНФРАСТРУКТУРА / ПРИВАТНОСТЬ / РАЗРАБОТКА' : 'INFRASTRUCTURE / PRIVACY / ENGINEERING'}
                </div>
                <h1 className="max-w-5xl text-6xl font-bold leading-[0.88] tracking-[-0.07em] md:text-8xl lg:text-[8.5rem]">
                  {ru ? 'Твоя сеть.' : 'Your network.'}<br />
                  <span className="text-emerald-300">{ru ? 'Твои правила.' : 'Your rules.'}</span>
                </h1>
                <p className="mt-9 max-w-2xl font-serif text-lg leading-relaxed text-gray-400 md:text-xl">
                  {ru ? 'Частная инфраструктура и цифровые инструменты, спроектированные вокруг ваших задач. От серверов и собственных нод до приложений и автоматизации бизнеса.' : 'Private infrastructure and digital tools built around your needs. From servers and self-hosted nodes to custom applications and business automation.'}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href="/services" className="inline-flex items-center gap-3 bg-emerald-300 px-6 py-4 font-mono text-xs font-bold tracking-[0.15em] text-black uppercase transition-colors hover:bg-white">{ru ? 'Изучить услуги' : 'Explore services'} <ArrowRight className="h-4 w-4" /></a>
                  <a href="/contact#contact-form" className="inline-flex items-center gap-3 border border-white/15 px-6 py-4 font-mono text-xs tracking-[0.15em] text-white uppercase transition-colors hover:border-emerald-300/60 hover:text-emerald-200">{ru ? 'Обсудить проект' : 'Discuss a project'}</a>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.2}>
              <div className="border border-emerald-300/20 bg-[#07100b]/90 p-5 font-mono text-xs shadow-[0_0_80px_rgba(16,185,129,0.08)] md:p-7">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4 text-gray-500"><span>TONRAX://CONTROL</span><span className="text-emerald-300">● {ru ? 'ПО ЗАПРОСУ' : 'BUILT TO ORDER'}</span></div>
                <div className="space-y-3 text-gray-400"><div><span className="text-emerald-300">01</span> &nbsp;{ru ? 'Инфраструктура' : 'Infrastructure'} <span className="float-right text-white">{ru ? 'Частная' : 'Private'}</span></div><div><span className="text-emerald-300">02</span> &nbsp;{ru ? 'Управление' : 'Control'} <span className="float-right text-white">{ru ? 'Ваше' : 'Yours'}</span></div><div><span className="text-emerald-300">03</span> &nbsp;{ru ? 'Развёртывание' : 'Deployment'} <span className="float-right text-white">{ru ? 'С сопровождением' : 'Managed'}</span></div></div>
                <div className="mt-7 border-t border-white/10 pt-5 text-[10px] leading-relaxed text-gray-500">{ru ? '> Нет магии. Нет обещаний невидимости. Только инженерия, документация и понятные границы.' : '> No magic. No invisibility claims. Just engineering, documentation, and clear boundaries.'}</div>
                <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.5, delay: 0.6 }} className="mt-5 h-px bg-emerald-300/50" />
              </div>
            </FadeIn>
          </div>
          <a href="#systems" aria-label={ru ? 'Прокрутить к услугам' : 'Scroll to services'} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-emerald-300/70"><ArrowDown className="h-5 w-5 animate-bounce" /></a>
        </section>

        <section id="systems" className="mx-auto max-w-7xl px-6 py-24 md:px-20 md:py-36">
          <FadeIn><div className="mb-4 font-mono text-xs tracking-[0.25em] text-emerald-300 uppercase">{ru ? '01 / СИСТЕМЫ' : '01 / SYSTEMS'}</div><h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">{ru ? 'Инструменты для цифровой независимости.' : 'Tools for digital independence.'}</h2><p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-gray-400">{ru ? 'Выберите нужный слой. Мы поможем спроектировать, развернуть и поддерживать его.' : 'Choose the layer you need. We can design, deploy, and maintain it with you.'}</p></FadeIn>
          <div className="mt-14 grid gap-px border border-emerald-300/15 bg-emerald-300/15 md:grid-cols-2 lg:grid-cols-3">
            {systems.map(({ icon: Icon, id, title, text }, i) => <FadeIn key={id} delay={i * 0.06}><article className="group h-full bg-[#070b08] p-7 transition-colors hover:bg-[#0b160f] md:p-8"><div className="mb-12 flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.2em] text-gray-600">{id}</span><Icon className="h-6 w-6 text-emerald-300 transition-transform group-hover:scale-110" /></div><h3 className="mb-4 text-2xl font-bold">{title[language]}</h3><p className="font-serif leading-relaxed text-gray-400">{text[language]}</p></article></FadeIn>)}
          </div>
        </section>

        <section className="border-y border-emerald-300/10 bg-black/40 px-6 py-24 md:px-20 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center"><FadeIn><div className="font-mono text-xs tracking-[0.25em] text-emerald-300 uppercase">02 / ENGINEERING PRINCIPLES</div><h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">{ru ? 'Приватность — практика, не обещание.' : 'Privacy is a practice, not a promise.'}</h2></FadeIn><FadeIn delay={0.15}><div className="space-y-5 font-serif text-lg leading-relaxed text-gray-400"><p>{ru ? 'Мы проектируем с минимизацией данных, контролем доступа и документацией. Вы понимаете, что развёрнуто, где находятся границы и кто отвечает за обслуживание.' : 'We design for data minimization, access control, and documentation. You know what is deployed, where the boundaries are, and who maintains it.'}</p><p className="border-l-2 border-emerald-300/50 pl-5 text-sm text-gray-500">{ru ? 'Tor, VPN и прокси могут поддерживать приватность, но не гарантируют анонимность и не отменяют применимые законы или правила использования.' : 'Tor, VPNs, and proxies can support privacy, but they do not guarantee anonymity or remove applicable laws or acceptable-use rules.'}</p></div></FadeIn></div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-20 md:py-36"><div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr]"><FadeIn><div className="font-mono text-xs tracking-[0.25em] text-emerald-300 uppercase">03 / DELIVERY</div><h2 className="mt-6 text-4xl font-bold md:text-5xl">{ru ? 'От задачи до запуска.' : 'From brief to deployment.'}</h2></FadeIn><div className="grid gap-4 sm:grid-cols-2">{[{ icon: Terminal, n: '01', en: 'Scope & architecture', ru: 'Задача и архитектура' }, { icon: ShieldCheck, n: '02', en: 'Security-minded setup', ru: 'Настройка с учётом безопасности' }, { icon: Workflow, n: '03', en: 'Build & verify', ru: 'Разработка и проверка' }, { icon: Bot, n: '04', en: 'Handoff & support', ru: 'Передача и поддержка' }].map(({ icon: Icon, n, en, ru: label }) => <FadeIn key={n}><div className="flex gap-4 border border-white/10 bg-white/[0.02] p-5"><Icon className="h-5 w-5 shrink-0 text-emerald-300" /><div><div className="font-mono text-[10px] text-gray-600">{n} / STEP</div><div className="mt-2 font-semibold">{language === 'ru' ? label : en}</div></div></div></FadeIn>)}</div></div></section>

        <section className="border-t border-emerald-300/10 bg-[#07100b] px-6 py-24 text-center md:px-20 md:py-32"><FadeIn><div className="mx-auto max-w-3xl"><div className="mb-6 flex justify-center"><LockKeyhole className="h-7 w-7 text-emerald-300" /></div><h2 className="text-4xl font-bold md:text-6xl">{ru ? 'Готовы собрать свою систему?' : 'Ready to build your system?'}</h2><p className="mx-auto mt-6 max-w-xl font-serif text-lg text-gray-400">{ru ? 'Опишите задачу — обсудим подходящие сервисы, ограничения и план запуска.' : 'Tell us what you need—we’ll discuss suitable services, boundaries, and a deployment plan.'}</p><a href="/contact#contact-form" className="mt-9 inline-flex items-center gap-3 bg-emerald-300 px-7 py-4 font-mono text-xs font-bold tracking-[0.15em] text-black uppercase hover:bg-white">{ru ? 'Связаться' : 'Get in touch'} <ArrowRight className="h-4 w-4" /></a></div></FadeIn></section>
      </main>
    </div>
  );
}
