import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Code2,
  Globe2,
  KeyRound,
  LockKeyhole,
  Network,
  Server,
  ShieldCheck,
  Terminal,
  Workflow,
} from 'lucide-react';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { useLanguage } from '@/context/LanguageContext';

const systems = [
  {
    icon: Server,
    id: 'INFRA / 01',
    title: { en: 'Private servers', ru: 'Частные серверы' },
    text: { en: 'Dedicated environments for personal projects and business workloads, configured and maintained around your requirements.', ru: 'Выделенные среды для личных проектов и бизнес-нагрузок, настроенные и обслуживаемые под ваши требования.' },
    tags: { en: ['VPS & dedicated', 'Backups', 'Hardening'], ru: ['VPS и выделенные', 'Резервные копии', 'Защита'] },
  },
  {
    icon: Globe2,
    id: 'NETWORK / 02',
    title: { en: 'Onion services', ru: 'Onion-сервисы' },
    text: { en: 'Deploy and maintain Tor onion services for lawful publishing, community access, and privacy-conscious projects.', ru: 'Развёртывание и обслуживание Tor onion-сервисов для законных публикаций, сообществ и проектов с заботой о приватности.' },
    tags: { en: ['Onion site', 'Managed setup', 'Monitoring'], ru: ['Onion-сайт', 'Настройка', 'Мониторинг'] },
  },
  {
    icon: Network,
    id: 'CHAIN / 03',
    title: { en: 'Blockchain nodes', ru: 'Блокчейн-ноды' },
    text: { en: 'Self-host nodes for supported networks to query public chain data and connect your own applications.', ru: 'Самостоятельный хостинг нод поддерживаемых сетей для доступа к публичным данным и интеграции с вашими приложениями.' },
    tags: { en: ['Node setup', 'Health checks', 'Recovery plan'], ru: ['Установка ноды', 'Проверка состояния', 'План восстановления'] },
  },
  {
    icon: KeyRound,
    id: 'ACCESS / 04',
    title: { en: 'Private VPN', ru: 'Персональный VPN' },
    text: { en: 'Secure remote access to your own devices, team resources, or private network—with clear access controls.', ru: 'Защищённый удалённый доступ к устройствам, ресурсам команды или частной сети с понятным контролем доступа.' },
    tags: { en: ['Remote access', 'Device controls', 'Key lifecycle'], ru: ['Удалённый доступ', 'Контроль устройств', 'Ключи доступа'] },
  },
  {
    icon: LockKeyhole,
    id: 'ROUTING / 05',
    title: { en: 'Proxy infrastructure', ru: 'Прокси-инфраструктура' },
    text: { en: 'Private proxy deployments for authorized integrations, QA, and traffic management, with authentication and usage safeguards.', ru: 'Частные прокси для разрешённых интеграций, тестирования и управления трафиком с аутентификацией и ограничениями использования.' },
    tags: { en: ['Authenticated', 'Private', 'Documented'], ru: ['Авторизация', 'Приватность', 'Документация'] },
  },
  {
    icon: Bot,
    id: 'AUTOMATION / 06',
    title: { en: 'Apps, bots & automation', ru: 'Приложения, боты и автоматизация' },
    text: { en: 'Custom business apps, support chatbots, and workflow automations that connect your tools and reduce repetitive work.', ru: 'Бизнес-приложения, чат-боты поддержки и автоматизация, которые связывают инструменты и сокращают рутинную работу.' },
    tags: { en: ['Custom apps', 'Chatbots', 'Workflow'], ru: ['Приложения', 'Чат-боты', 'Процессы'] },
  },
];

const steps = [
  { id: '01', icon: Terminal, en: 'Scope the mission', ru: 'Определяем задачу', detailEn: 'Requirements, constraints, and a clear statement of work.', detailRu: 'Требования, ограничения и понятный план работ.' },
  { id: '02', icon: ShieldCheck, en: 'Design the system', ru: 'Проектируем систему', detailEn: 'Architecture, access model, data handling, and operational boundaries.', detailRu: 'Архитектура, доступ, обработка данных и границы эксплуатации.' },
  { id: '03', icon: Code2, en: 'Build & verify', ru: 'Разрабатываем и проверяем', detailEn: 'Implementation, testing, documentation, and a deliberate handoff.', detailRu: 'Реализация, тестирование, документация и передача.' },
  { id: '04', icon: Workflow, en: 'Operate & improve', ru: 'Поддерживаем и развиваем', detailEn: 'Optional maintenance, monitoring, and planned improvements.', detailRu: 'Дополнительное обслуживание, мониторинг и плановые улучшения.' },
];

export default function Home() {
  const { language } = useLanguage();
  const ru = language === 'ru';

  const copy = ru
    ? {
        eyebrow: 'Частная инфраструктура / Инженерия / Автоматизация',
        titleA: 'Собственная',
        titleB: 'цифровая территория.',
        intro: 'Серверы, приватные сети, собственные ноды и программные инструменты — спроектированные для ваших личных и бизнес-задач. Без шаблонных обещаний. С понятной архитектурой и контролем.',
        explore: 'Исследовать системы',
        consult: 'Обсудить проект',
        console: 'КОНСОЛЬ / СТАТУС ПРОЕКТА',
        status: 'ПО ЗАПРОСУ',
        scope: 'Объём работ',
        defined: 'Согласован заранее',
        access: 'Контроль доступа',
        documented: 'Документирован',
        delivery: 'Передача проекта',
        included: 'В каждом запуске',
        note: '> Приватность — инженерная практика. Не обещание невидимости.',
        systemsEyebrow: '01 / ИНФРАСТРУКТУРНЫЙ СТЕК',
        systemsTitle: 'Ваши инструменты. Ваша архитектура.',
        systemsIntro: 'От узлов сети до процессов бизнеса — собираем только то, что нужно вашей задаче.',
        principlesEyebrow: '02 / ПОДХОД',
        principlesTitle: 'Профессиональная инженерия. Без театра.',
        principlesText: 'Мы начинаем с задачи, а не с модного стека. Согласуем границы, выберем разумную архитектуру, задокументируем решения и передадим вам контроль над результатом.',
        p1: 'Безопасные настройки и минимизация данных',
        p2: 'Понятные обязанности и стоимость инфраструктуры',
        p3: 'Документация, проверка и аккуратная передача',
        p4: 'Поддержка и сопровождение по согласованию',
        processEyebrow: '03 / ПУТЬ ПРОЕКТА',
        processTitle: 'От брифа до работающей системы.',
        processIntro: 'Никакого чёрного ящика: вы понимаете, что создаётся, как это работает и что происходит после запуска.',
        useEyebrow: '04 / ДЛЯ ЛЮДЕЙ И КОМАНД',
        useTitle: 'Технологии должны решать реальные задачи.',
        useText: 'Поддерживаем команды, которым нужен больший контроль над инфраструктурой, внутренними инструментами и цифровыми процессами.',
        useCases: ['Собственные сервисы и инфраструктура для разработки', 'Приватная связь между устройствами и командами', 'Доступ к публичным блокчейн-данным для приложений', 'Автоматизация поддержки, операций и повторяющихся процессов'],
        privacyTitle: 'Приватность — не магия.',
        privacyText: 'VPN, прокси и Tor могут поддерживать приватность, но не гарантируют анонимность. Мы работаем для законных проектов, соблюдаем согласованные правила использования и не помогаем скрывать противоправную деятельность.',
        ctaTitle: 'Есть задача посложнее?',
        ctaText: 'Расскажите о требованиях, ограничениях и сроках. Мы ответим с уточняющими вопросами и практичным планом.',
        cta: 'Связаться с командой',
      }
    : {
        eyebrow: 'Private infrastructure / Engineering / Automation',
        titleA: 'Build your',
        titleB: 'own digital ground.',
        intro: 'Servers, private networks, self-hosted nodes, and software tools designed for your personal or business needs. No template promises. Just considered architecture and control.',
        explore: 'Explore the stack',
        consult: 'Discuss a project',
        console: 'PROJECT CONSOLE / STATUS',
        status: 'SCOPED TO YOU',
        scope: 'Project scope',
        defined: 'Agreed up front',
        access: 'Access control',
        documented: 'Documented',
        delivery: 'Project handoff',
        included: 'Every engagement',
        note: '> Privacy is an engineering practice—not a promise of invisibility.',
        systemsEyebrow: '01 / INFRASTRUCTURE STACK',
        systemsTitle: 'Your tools. Your architecture.',
        systemsIntro: 'From network services to business workflows, we build only what your mission needs.',
        principlesEyebrow: '02 / OUR APPROACH',
        principlesTitle: 'Professional engineering. No theater.',
        principlesText: 'We start with the problem, not a fashionable stack. We agree on boundaries, choose a sensible architecture, document decisions, and hand control of the result back to you.',
        p1: 'Secure defaults and data minimization',
        p2: 'Clear responsibilities and infrastructure costs',
        p3: 'Documentation, verification, and careful handoff',
        p4: 'Optional support and ongoing maintenance',
        processEyebrow: '03 / DELIVERY PATH',
        processTitle: 'From brief to live system.',
        processIntro: 'No black box: you understand what is being built, how it works, and what happens after launch.',
        useEyebrow: '04 / FOR PEOPLE & TEAMS',
        useTitle: 'Technology should solve real problems.',
        useText: 'We support teams that need more control over infrastructure, internal tools, and digital operations.',
        useCases: ['Self-managed services and development infrastructure', 'Private connectivity between devices and teams', 'Access to public blockchain data for applications', 'Automation for support, operations, and repetitive work'],
        privacyTitle: 'Privacy isn’t magic.',
        privacyText: 'VPNs, proxies, and Tor can support privacy, but they do not guarantee anonymity. We work with lawful projects, follow agreed acceptable-use rules, and do not help conceal unlawful activity.',
        ctaTitle: 'A more complex mission?',
        ctaText: 'Share your requirements, constraints, and timeline. We’ll respond with questions and a practical plan.',
        cta: 'Talk to our team',
      };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050806] text-[#e8f3eb] selection:bg-emerald-400/30">
      <Starfield />
      <CursorDot />
      <Navigation />
      <main className="relative z-10">
        <section className="relative flex min-h-[88vh] items-center border-b border-emerald-300/10 px-6 pb-24 pt-32 md:px-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_42%,rgba(16,185,129,0.12),transparent_48%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(52,211,153,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.2)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
            <FadeIn>
              <div className="mb-8 inline-flex items-center gap-3 border border-emerald-300/20 bg-black/60 px-4 py-2 font-mono text-[9px] tracking-[0.18em] text-emerald-300 uppercase sm:text-[10px]"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{copy.eyebrow}</div>
              <h1 className="max-w-5xl text-6xl font-bold leading-[0.88] tracking-[-0.07em] md:text-8xl lg:text-[7.5rem]">{copy.titleA}<br /><span className="text-emerald-300">{copy.titleB}</span></h1>
              <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-gray-400 md:text-xl">{copy.intro}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#systems" className="inline-flex items-center gap-3 bg-emerald-300 px-6 py-4 font-mono text-[10px] font-bold tracking-[0.14em] text-black uppercase transition-colors hover:bg-white">{copy.explore}<ArrowDown className="h-4 w-4" /></a>
                <a href="/contact#contact-form" className="inline-flex items-center gap-3 border border-white/15 bg-black/30 px-6 py-4 font-mono text-[10px] tracking-[0.14em] text-white uppercase transition-colors hover:border-emerald-300/50 hover:text-emerald-200">{copy.consult}<ArrowRight className="h-4 w-4" /></a>
              </div>
            </FadeIn>
            <FadeIn delay={0.16}>
              <div className="relative border border-emerald-300/20 bg-[#060b08]/95 p-5 shadow-[0_0_80px_rgba(16,185,129,0.08)] md:p-7">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[9px] tracking-[0.14em] text-gray-500 sm:text-[10px]"><span>{copy.console}</span><span className="text-emerald-300">● {copy.status}</span></div>
                <div className="space-y-4 font-mono text-xs">
                  {[{ label: copy.scope, value: copy.defined }, { label: copy.access, value: copy.documented }, { label: copy.delivery, value: copy.included }].map((row, i) => <div key={row.label} className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-3"><span className="text-gray-500"><span className="mr-3 text-emerald-300">0{i + 1}</span>{row.label}</span><span className="text-right text-gray-200">{row.value}</span></div>)}
                </div>
                <div className="mt-6 flex items-center gap-3 border border-emerald-300/10 bg-emerald-300/[0.04] p-4 font-mono text-[9px] leading-relaxed text-gray-400 sm:text-[10px]"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />{copy.note}</div>
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.4 }} className="mt-5 h-px origin-left bg-gradient-to-r from-emerald-300/70 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="systems" className="mx-auto max-w-7xl px-6 py-24 md:px-20 md:py-32">
          <FadeIn><div className="mb-4 font-mono text-[10px] tracking-[0.22em] text-emerald-300 uppercase">{copy.systemsEyebrow}</div><h2 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">{copy.systemsTitle}</h2><p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-gray-400">{copy.systemsIntro}</p></FadeIn>
          <div className="mt-12 grid gap-px border border-emerald-300/15 bg-emerald-300/15 md:grid-cols-2 lg:grid-cols-3">
            {systems.map(({ icon: Icon, id, title, text, tags }, i) => <FadeIn key={id} delay={i * 0.05}><article className="group h-full bg-[#070b08] p-6 transition-colors hover:bg-[#0b160f] md:p-8"><div className="mb-10 flex items-center justify-between"><span className="font-mono text-[9px] tracking-[0.2em] text-gray-600">{id}</span><Icon className="h-6 w-6 text-emerald-300 transition-transform duration-300 group-hover:scale-110" /></div><h3 className="mb-3 text-2xl font-bold">{title[language]}</h3><p className="min-h-[84px] font-serif leading-relaxed text-gray-400">{text[language]}</p><ul className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">{tags[language].map((tag) => <li key={tag} className="border border-white/10 px-2 py-1 font-mono text-[8px] tracking-[0.1em] text-gray-500 uppercase">{tag}</li>)}</ul><a href="/services" className="mt-6 inline-flex items-center gap-1 font-mono text-[9px] tracking-[0.12em] text-emerald-300 uppercase opacity-80 transition-opacity hover:opacity-100">{ru ? 'Подробнее' : 'Explore service'}<ChevronRight className="h-3 w-3" /></a></article></FadeIn>)}
          </div>
        </section>

        <section className="border-y border-emerald-300/10 bg-black/40 px-6 py-20 md:px-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center"><FadeIn><div className="font-mono text-[10px] tracking-[0.22em] text-emerald-300 uppercase">{copy.principlesEyebrow}</div><h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">{copy.principlesTitle}</h2><p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-gray-400">{copy.principlesText}</p></FadeIn><FadeIn delay={0.12}><div className="grid gap-3 sm:grid-cols-2">{[copy.p1, copy.p2, copy.p3, copy.p4].map((item) => <div key={item} className="flex min-h-24 items-start gap-3 border border-white/10 bg-white/[0.02] p-4"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /><span className="font-mono text-[10px] leading-relaxed tracking-[0.08em] text-gray-300 uppercase">{item}</span></div>)}</div></FadeIn></div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><FadeIn><div className="font-mono text-[10px] tracking-[0.22em] text-emerald-300 uppercase">{copy.processEyebrow}</div><h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">{copy.processTitle}</h2><p className="mt-5 font-serif leading-relaxed text-gray-400">{copy.processIntro}</p></FadeIn><div className="border-l border-emerald-300/20">{steps.map(({ id, icon: Icon, en, ru: labelRu, detailEn, detailRu }, i) => <FadeIn key={id} delay={i * 0.07}><div className="group border-b border-white/10 p-5 pl-6 transition-colors hover:bg-white/[0.025] md:p-7"><div className="flex items-start gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center border border-emerald-300/20 bg-emerald-300/[0.04]"><Icon className="h-4 w-4 text-emerald-300" /></div><div><div className="mb-2 font-mono text-[9px] tracking-[0.16em] text-emerald-300">STEP / {id}</div><h3 className="text-xl font-bold">{ru ? labelRu : en}</h3><p className="mt-2 font-serif text-sm leading-relaxed text-gray-400">{ru ? detailRu : detailEn}</p></div></div></div></FadeIn>)}</div></div>
        </section>

        <section className="border-y border-emerald-300/10 bg-[#070b08] px-6 py-20 md:px-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center"><FadeIn><div className="font-mono text-[10px] tracking-[0.22em] text-emerald-300 uppercase">{copy.useEyebrow}</div><h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">{copy.useTitle}</h2><p className="mt-5 font-serif text-lg leading-relaxed text-gray-400">{copy.useText}</p></FadeIn><FadeIn delay={0.12}><ul className="space-y-3">{copy.useCases.map((item, i) => <li key={item} className="flex items-start gap-4 border-b border-white/10 py-4"><span className="font-mono text-[10px] text-emerald-300">0{i + 1}</span><span className="font-serif text-gray-300">{item}</span></li>)}</ul></FadeIn></div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-20 md:py-20"><FadeIn><div className="flex flex-col gap-5 border border-emerald-300/20 bg-emerald-300/[0.035] p-6 md:flex-row md:items-start md:p-8"><LockKeyhole className="h-6 w-6 shrink-0 text-emerald-300" /><div><h2 className="mb-2 text-xl font-bold">{copy.privacyTitle}</h2><p className="max-w-4xl font-serif leading-relaxed text-gray-400">{copy.privacyText}</p></div></div></FadeIn></section>

        <section className="relative overflow-hidden border-t border-emerald-300/10 bg-[#07100b] px-6 py-24 text-center md:px-20 md:py-32"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(16,185,129,0.12),transparent_55%)]" /><FadeIn><div className="relative mx-auto max-w-3xl"><div className="mb-5 flex justify-center"><Workflow className="h-7 w-7 text-emerald-300" /></div><h2 className="text-4xl font-bold tracking-tight md:text-6xl">{copy.ctaTitle}</h2><p className="mx-auto mt-5 max-w-xl font-serif text-lg leading-relaxed text-gray-400">{copy.ctaText}</p><a href="/contact#contact-form" className="mt-8 inline-flex items-center gap-3 bg-emerald-300 px-7 py-4 font-mono text-[10px] font-bold tracking-[0.15em] text-black uppercase transition-colors hover:bg-white">{copy.cta}<ArrowRight className="h-4 w-4" /></a></div></FadeIn></section>
      </main>
    </div>
  );
}
