import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Code2,
  Cpu,
  Globe2,
  KeyRound,
  LockKeyhole,
  Network,
  Radio,
  Rocket,
  Server,
  ShieldCheck,
  Workflow,
  Zap,
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
    text: { en: 'Dedicated or virtual environments for personal projects and business workloads, sized and configured around your requirements.', ru: 'Выделенные и виртуальные среды для личных проектов и бизнес-нагрузок, подобранные и настроенные под ваши требования.' },
    tags: { en: ['VPS & dedicated', 'Backups', 'Hardening'], ru: ['VPS и выделенные', 'Резервные копии', 'Защита'] },
  },
  {
    icon: Globe2,
    id: 'NETWORK / 02',
    title: { en: 'Tor onion services', ru: 'Tor onion-сервисы' },
    text: { en: 'Deploy and maintain onion services for lawful publishing, community access, and privacy-conscious projects.', ru: 'Развёртывание и обслуживание onion-сервисов для законных публикаций, сообществ и проектов с заботой о приватности.' },
    tags: { en: ['Onion site', 'Managed setup', 'Monitoring'], ru: ['Onion-сайт', 'Настройка', 'Мониторинг'] },
  },
  {
    icon: Network,
    id: 'CHAIN / 03',
    title: { en: 'Self-hosted crypto nodes', ru: 'Собственные крипто-ноды' },
    text: { en: 'Run supported blockchain nodes to query public chain data and connect your own applications and services.', ru: 'Запуск нод поддерживаемых блокчейнов для доступа к публичным данным и подключения ваших приложений и сервисов.' },
    tags: { en: ['Node setup', 'Health checks', 'Recovery plan'], ru: ['Установка ноды', 'Проверка состояния', 'План восстановления'] },
  },
  {
    icon: KeyRound,
    id: 'ACCESS / 04',
    title: { en: 'Private VPN & proxies', ru: 'Частный VPN и прокси' },
    text: { en: 'Controlled remote access and proxy infrastructure for your devices, team resources, authorized integrations, and testing.', ru: 'Контролируемый удалённый доступ и прокси-инфраструктура для устройств, команды, разрешённых интеграций и тестирования.' },
    tags: { en: ['Access controls', 'Private deployment', 'Documentation'], ru: ['Контроль доступа', 'Частное развёртывание', 'Документация'] },
  },
  {
    icon: Bot,
    id: 'AUTOMATION / 05',
    title: { en: 'Apps, chatbots & automation', ru: 'Приложения, чат-боты и автоматизация' },
    text: { en: 'Custom business apps, support chatbots, and workflow automations that connect tools and reduce repetitive work.', ru: 'Бизнес-приложения, чат-боты поддержки и автоматизация процессов, которые связывают инструменты и сокращают рутинную работу.' },
    tags: { en: ['Custom apps', 'Chatbots', 'Workflow'], ru: ['Приложения', 'Чат-боты', 'Процессы'] },
  },
  {
    icon: Code2,
    id: 'ENGINEERING / 06',
    title: { en: 'Web & product engineering', ru: 'Веб-разработка и продукты' },
    text: { en: 'Fast, accessible websites and product interfaces built for real users, maintainable growth, and measurable outcomes.', ru: 'Быстрые и доступные сайты и интерфейсы продуктов для реальных пользователей и дальнейшего развития.' },
    tags: { en: ['React & TypeScript', 'API integration', 'Quality assurance'], ru: ['React и TypeScript', 'Интеграции API', 'Контроль качества'] },
  },
];

const launchSteps = [
  { id: 'T−04', title: { en: 'Discovery', ru: 'Исследование' }, text: { en: 'We map your goals, users, constraints, and operating environment before proposing a solution.', ru: 'Изучаем цели, пользователей, ограничения и среду эксплуатации до предложения решения.' } },
  { id: 'T−03', title: { en: 'Architecture & design', ru: 'Архитектура и дизайн' }, text: { en: 'We define the system boundaries, user experience, data flow, access model, and delivery plan.', ru: 'Определяем границы системы, пользовательский опыт, потоки данных, модель доступа и план реализации.' } },
  { id: 'T−02', title: { en: 'Engineering', ru: 'Разработка' }, text: { en: 'We build with maintainable code, sensible security defaults, and performance in mind.', ru: 'Разрабатываем с поддерживаемым кодом, разумными настройками безопасности и вниманием к производительности.' } },
  { id: 'T−01', title: { en: 'Verification', ru: 'Проверка' }, text: { en: 'We test the important paths, document operations, and resolve launch issues before handoff.', ru: 'Проверяем важные сценарии, документируем эксплуатацию и устраняем проблемы до передачи.' } },
  { id: 'GO', title: { en: 'Deployment & support', ru: 'Запуск и поддержка' }, text: { en: 'We deploy, hand over the controls, and can continue with agreed maintenance and improvements.', ru: 'Развёртываем систему, передаём управление и при необходимости продолжаем согласованную поддержку.' } },
];

const outcomes = [
  { id: '01', title: { en: 'Signal', ru: 'Сигнал' }, text: { en: 'A clear digital presence: brand, website, and experience shaped around the people you want to reach.', ru: 'Понятное цифровое присутствие: бренд, сайт и опыт для аудитории, к которой вы обращаетесь.' }, items: { en: ['Interface design', 'Web development', 'Accessible experience'], ru: ['Дизайн интерфейса', 'Веб-разработка', 'Доступность'] } },
  { id: '02', title: { en: 'Core', ru: 'Ядро' }, text: { en: 'The application layer underneath: integrations, data flows, internal tools, and business automation.', ru: 'Прикладной слой: интеграции, потоки данных, внутренние инструменты и автоматизация бизнеса.' }, items: { en: ['Applications & APIs', 'Chatbots & workflows', 'Testing & documentation'], ru: ['Приложения и API', 'Боты и процессы', 'Тестирование и документация'] } },
  { id: '03', title: { en: 'Orbit', ru: 'Орбита' }, text: { en: 'The operating environment: hosting, private services, backups, monitoring, and a support plan.', ru: 'Среда эксплуатации: хостинг, частные сервисы, резервные копии, мониторинг и план поддержки.' }, items: { en: ['Private infrastructure', 'Monitoring & backups', 'Ongoing support'], ru: ['Частная инфраструктура', 'Мониторинг и копии', 'Поддержка'] } },
];

export default function Home() {
  const { language } = useLanguage();
  const ru = language === 'ru';

  const copy = ru
    ? {
        eyebrow: 'TONRAX / ЦИФРОВАЯ ИНФРАСТРУКТУРА И ИНЖЕНЕРИЯ',
        title: 'Создайте систему',
        accent: 'на своих условиях.',
        description: 'От приватных серверов и собственных нод до бизнес-приложений и автоматизации. Проектируем и запускаем цифровые системы с ясными границами, профессиональным исполнением и контролем для вашей команды.',
        primaryCta: 'Исследовать возможности',
        secondaryCta: 'Обсудить проект',
        status: 'СИСТЕМЫ / ДОСТУПНЫ ПО ЗАПРОСУ',
        panelTitle: 'ЦЕНТР УПРАВЛЕНИЯ / ПРОЕКТ',
        panelStatus: 'ГОТОВ К ОБСУЖДЕНИЮ',
        panelLine1: 'Инфраструктура', panelValue1: 'Под задачу',
        panelLine2: 'Архитектура', panelValue2: 'Документирована',
        panelLine3: 'Передача', panelValue3: 'Под контролем клиента',
        panelNote: 'Без магии и обещаний невидимости. Инженерия, документация и продуманные решения.',
        introEyebrow: '00 / ЗАЧЕМ TONRAX',
        introTitle: 'Сложные системы. Понятный результат.',
        introP1: 'Интернет огромен, перегружен шаблонами и шумом. Чтобы ваш проект выделялся, нужны не просто красивые экраны — нужна надёжная техническая основа, согласованная с реальными задачами бизнеса.',
        introP2: 'Tonrax объединяет стратегию, интерфейсы, разработку и инфраструктуру. Мы создаём цифровые продукты, частные сервисы и связанные рабочие процессы — от первого наброска до эксплуатации.',
        capabilities: '01 / ЧТО МЫ СОЗДАЁМ',
        capabilitiesTitle: 'От интерфейса до собственной инфраструктуры.',
        infraEyebrow: '02 / ИНФРАСТРУКТУРА',
        infraTitle: 'Tonrax Private Systems.',
        infraText: 'Собственная техническая среда для проектов, которым важны контроль, гибкость и понятное обслуживание. Подбираем ресурсы и конфигурацию под практическую задачу — без необоснованных обещаний по скорости, доступности или анонимности.',
        infraPoints: ['Частные серверы и управляемый хостинг', 'Развёртывание onion-сервисов и собственных нод', 'Контроль доступа, обновления и план резервного копирования', 'Мониторинг и сопровождение по договорённости'],
        uptime: 'ПЛАНИРУЕМАЯ',
        uptimeSub: 'НАДЁЖНОСТЬ',
        processEyebrow: '03 / ПОСЛЕДОВАТЕЛЬНОСТЬ ЗАПУСКА',
        processTitle: 'Путь от идеи до запуска.',
        processAside: 'Каждая система начинается с ясной цели, а не с догадок.',
        processPrompt: 'Прокрутите для просмотра этапов',
        systemsEyebrow: '04 / ЦИФРОВЫЕ СИСТЕМЫ',
        systemsTitle: 'Всё необходимое для вашего следующего этапа.',
        systemsText: 'Собираем цифровую орбиту как единую систему. Выберите нужное направление — спроектируем и построим решение вокруг него.',
        outcomesEyebrow: '05 / РЕЗУЛЬТАТЫ',
        hiringEyebrow: '06 / УДАЛЁННАЯ КОМАНДА',
        hiringStatus: 'ОТКРЫТЫ К ЗНАКОМСТВУ',
        hiringTitle: 'Создавайте из любой точки.',
        hiringText: 'Мы ценим внимательных инженеров, дизайнеров и создателей, которые заботятся о деталях и умеют превращать сложные задачи в быстрый, красивый и надёжный цифровой опыт.',
        hiringCta: 'Посмотреть возможность',
        rolesTitle: 'Компетенции команды',
        rolesStatus: 'УДАЛЁННО / ГЛОБАЛЬНО',
        role1: 'Frontend-разработка', role2: 'Backend и API', role3: 'Инфраструктура и автоматизация',
        roleNote: 'Асинхронная работа по умолчанию. Время для глубокой работы и качественной инженерии.',
        trustEyebrow: 'ПРИНЦИПЫ РАБОТЫ',
        trust1: 'Согласованный объём и понятные этапы', trust2: 'Документация и аккуратная передача', trust3: 'Безопасные настройки и принцип наименьших привилегий', trust4: 'Честные ограничения и реалистичные обещания',
        privacyTitle: 'Приватность — практика, не обещание.',
        privacyText: 'VPN, прокси и Tor могут поддерживать приватность, но не гарантируют анонимность. Мы работаем над законными проектами, устанавливаем разумные правила использования и не помогаем скрывать противоправную деятельность.',
        finalTitle: 'Готовы к следующему этапу?',
        finalText: 'Расскажите о цели, ограничениях и сроках. Мы поможем определить архитектуру и практичный план запуска.',
        finalCta: 'Установить связь',
      }
    : {
        eyebrow: 'TONRAX / DIGITAL INFRASTRUCTURE & ENGINEERING',
        title: 'Build your system',
        accent: 'on your terms.',
        description: 'From private servers and self-hosted nodes to business applications and automation. We design and launch digital systems with clear boundaries, professional execution, and meaningful control for your team.',
        primaryCta: 'Explore capabilities',
        secondaryCta: 'Discuss a project',
        status: 'SYSTEMS / AVAILABLE BY REQUEST',
        panelTitle: 'OPERATIONS CENTER / PROJECT',
        panelStatus: 'READY TO SCOPE',
        panelLine1: 'Infrastructure', panelValue1: 'Fit to purpose',
        panelLine2: 'Architecture', panelValue2: 'Documented',
        panelLine3: 'Handoff', panelValue3: 'Client-controlled',
        panelNote: 'No magic. No invisibility claims. Just engineering, documentation, and considered decisions.',
        introEyebrow: '00 / WHY TONRAX',
        introTitle: 'Complex systems. Clear outcomes.',
        introP1: 'The internet is crowded with templates and noise. A project needs more than polished screens to stand out—it needs a dependable technical foundation aligned with real business goals.',
        introP2: 'Tonrax brings strategy, interfaces, engineering, and infrastructure together. We build digital products, private services, and connected workflows, from the first sketch through ongoing operations.',
        capabilities: '01 / WHAT WE BUILD',
        capabilitiesTitle: 'From the interface to your own infrastructure.',
        infraEyebrow: '02 / INFRASTRUCTURE',
        infraTitle: 'Tonrax Private Systems.',
        infraText: 'A technical environment for projects that need control, flexibility, and understandable operations. We match resources and configuration to the practical brief—without unsupported promises about speed, availability, or anonymity.',
        infraPoints: ['Private servers and managed hosting', 'Onion service and self-hosted node deployment', 'Access control, updates, and backup planning', 'Monitoring and support by agreement'],
        uptime: 'PURPOSE',
        uptimeSub: 'ENGINEERED',
        processEyebrow: '03 / LAUNCH SEQUENCE',
        processTitle: 'A clear route from idea to launch.',
        processAside: 'Every system starts with a clear objective—not guesswork.',
        processPrompt: 'Scroll to inspect the sequence',
        systemsEyebrow: '04 / DIGITAL SYSTEMS',
        systemsTitle: 'Everything your next stage needs.',
        systemsText: 'We engineer your digital orbit as one connected system. Choose an entry point and we will design and build around it.',
        outcomesEyebrow: '05 / OUTCOMES',
        hiringEyebrow: '06 / REMOTE CREW',
        hiringStatus: 'OPEN TO MEETING',
        hiringTitle: 'Build from anywhere.',
        hiringText: 'We value thoughtful engineers, designers, and builders who care about details and turn complex problems into fast, beautiful, dependable digital experiences.',
        hiringCta: 'Explore opportunities',
        rolesTitle: 'Team capabilities',
        rolesStatus: 'REMOTE / GLOBAL',
        role1: 'Frontend engineering', role2: 'Backend & APIs', role3: 'Infrastructure & automation',
        roleNote: 'Async by default. Protected time for deep work and thoughtful engineering.',
        trustEyebrow: 'HOW WE WORK',
        trust1: 'Agreed scope and clear milestones', trust2: 'Documentation and careful handoff', trust3: 'Secure defaults and least-privilege access', trust4: 'Honest boundaries and realistic claims',
        privacyTitle: 'Privacy is a practice, not a promise.',
        privacyText: 'VPNs, proxies, and Tor can support privacy, but they do not guarantee anonymity. We work on lawful projects, set reasonable acceptable-use rules, and do not help conceal unlawful activity.',
        finalTitle: 'Ready for your next stage?',
        finalText: 'Tell us your goals, constraints, and timeline. We will help define an architecture and a practical deployment plan.',
        finalCta: 'Establish contact',
      };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070708] text-[#f1eeee] selection:bg-red-500/30">
      <Starfield />
      <CursorDot />
      <Navigation />
      <main className="relative z-10">
        <section className="relative flex min-h-[92vh] items-center border-b border-red-500/15 px-6 pb-24 pt-32 md:px-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_42%,rgba(153,27,27,0.2),transparent_48%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(248,113,113,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(248,113,113,0.25)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <FadeIn>
              <div className="mb-7 inline-flex items-center gap-3 border border-red-400/25 bg-black/60 px-4 py-2 font-mono text-[9px] tracking-[0.18em] text-red-300 uppercase sm:text-[10px]"><span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]" />{copy.eyebrow}</div>
              <h1 className="max-w-5xl text-6xl font-bold leading-[0.88] tracking-[-0.065em] md:text-8xl lg:text-[7.4rem]">{copy.title}<br /><span className="bg-gradient-to-r from-red-200 via-red-500 to-rose-800 bg-clip-text text-transparent">{copy.accent}</span></h1>
              <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-gray-300 md:text-xl">{copy.description}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#systems" className="inline-flex items-center gap-3 bg-red-600 px-6 py-4 font-mono text-[10px] font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-red-500">{copy.primaryCta}<ArrowDown className="h-4 w-4" /></a>
                <a href="/contact#contact-form" className="inline-flex items-center gap-3 border border-white/15 bg-black/40 px-6 py-4 font-mono text-[10px] tracking-[0.14em] text-white uppercase transition-colors hover:border-red-400/60 hover:text-red-200">{copy.secondaryCta}<ArrowRight className="h-4 w-4" /></a>
              </div>
              <div className="mt-8 flex items-center gap-3 font-mono text-[9px] tracking-[0.16em] text-gray-500 uppercase"><span className="h-px w-8 bg-red-500" />{copy.status}</div>
            </FadeIn>

            <FadeIn delay={0.16}>
              <div className="relative border border-red-500/25 bg-[#0b090a]/95 shadow-[0_0_90px_rgba(153,27,27,0.13)]">
                <div className="flex items-center justify-between border-b border-red-500/15 px-5 py-4 font-mono text-[9px] tracking-[0.13em] text-gray-500 sm:text-[10px]"><span>{copy.panelTitle}</span><span className="text-red-300">● {copy.panelStatus}</span></div>
                <div className="relative overflow-hidden p-5 md:p-7">
                  <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(248,113,113,0.8)_1px,transparent_1px)] [background-size:22px_22px]" />
                  <div className="relative mb-7 flex aspect-[1.35/1] items-center justify-center overflow-hidden border border-white/[0.07] bg-black/40">
                    <div className="absolute inset-x-8 top-1/2 h-px bg-red-500/20" /><div className="absolute inset-y-8 left-1/2 w-px bg-red-500/20" />
                    <div className="absolute h-44 w-44 rounded-full border border-red-400/15" /><div className="absolute h-32 w-32 rounded-full border border-red-400/25" /><div className="absolute h-20 w-20 rounded-full border border-red-500/40 shadow-[0_0_35px_rgba(220,38,38,0.15)]" />
                    <div className="absolute h-2 w-2 rounded-full bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.9)]" />
                    <div className="absolute left-[22%] top-[28%] h-1.5 w-1.5 rounded-full bg-red-300" /><div className="absolute right-[20%] top-[38%] h-1.5 w-1.5 rounded-full bg-rose-500" /><div className="absolute bottom-[24%] left-[34%] h-1.5 w-1.5 rounded-full bg-red-400" /><div className="absolute bottom-[30%] right-[28%] h-1.5 w-1.5 rounded-full bg-orange-300" />
                    <div className="absolute left-[22%] top-[28%] h-px w-[30%] rotate-[25deg] origin-left bg-gradient-to-r from-red-400/70 to-transparent" /><div className="absolute right-[21%] top-[40%] h-px w-[27%] -rotate-[44deg] origin-right bg-gradient-to-l from-red-400/70 to-transparent" /><div className="absolute bottom-[26%] left-[35%] h-px w-[34%] -rotate-[18deg] origin-left bg-gradient-to-r from-red-400/70 to-transparent" />
                    <div className="absolute left-3 top-3 font-mono text-[8px] tracking-widest text-red-300/70">NETWORK MAP / 01</div><div className="absolute bottom-3 right-3 font-mono text-[8px] tracking-widest text-gray-600">VISUALIZATION</div>
                  </div>
                  <div className="space-y-3 font-mono text-[9px] sm:text-[10px]">{[{ label: copy.panelLine1, value: copy.panelValue1 }, { label: copy.panelLine2, value: copy.panelValue2 }, { label: copy.panelLine3, value: copy.panelValue3 }].map((item, i) => <div key={item.label} className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-3"><span className="text-gray-500"><span className="mr-3 text-red-400">0{i + 1}</span>{item.label}</span><span className="text-right text-gray-200">{item.value}</span></div>)}</div>
                  <div className="mt-5 border-l-2 border-red-500/60 bg-red-950/20 px-4 py-3 font-mono text-[9px] leading-relaxed text-gray-400 sm:text-[10px]">{copy.panelNote}</div>
                </div>
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.4 }} className="h-px origin-left bg-gradient-to-r from-red-500/80 via-red-800/50 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-20 md:py-32">
          <div className="grid items-start gap-12 md:grid-cols-2"><FadeIn><div className="mb-5 font-mono text-[10px] tracking-[0.22em] text-red-400 uppercase">{copy.introEyebrow}</div><h2 className="text-4xl font-bold tracking-tight md:text-6xl">{copy.introTitle}</h2></FadeIn><FadeIn delay={0.12}><div className="space-y-5 font-serif text-lg leading-relaxed text-gray-400"><p>{copy.introP1}</p><p>{copy.introP2}</p></div></FadeIn></div>
        </section>

        <section id="capabilities" className="border-y border-red-500/10 bg-black/40 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-20"><FadeIn><div className="mb-4 font-mono text-[10px] tracking-[0.22em] text-red-400 uppercase">{copy.capabilities}</div><h2 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">{copy.capabilitiesTitle}</h2></FadeIn>
            <div className="mt-12 grid gap-5 md:grid-cols-3">{[
              { icon: Globe2, title: ru ? 'Интерфейс и опыт' : 'Interface & experience', text: ru ? 'Дизайн-системы и интерфейсы, которые помогают пользователям быстро понять продукт и действовать.' : 'Design systems and interfaces that help people understand your product and take action.' },
              { icon: Code2, title: ru ? 'Веб-инжиниринг' : 'Web engineering', text: ru ? 'Быстрые, доступные сайты и приложения на современных технологиях с интеграциями и тестированием.' : 'Fast, accessible websites and apps built with modern technology, integrations, and testing.' },
              { icon: Workflow, title: ru ? 'Цифровая стратегия' : 'Digital strategy', text: ru ? 'Архитектура продукта, пользовательские сценарии и оптимизация процессов — с фокусом на результат.' : 'Product architecture, user journeys, and process optimization focused on practical outcomes.' },
            ].map(({ icon: Icon, title, text }, i) => <FadeIn key={title} delay={i * 0.08}><article className="group relative h-full overflow-hidden border border-white/10 bg-[#0a090a] p-7 transition-colors hover:border-red-500/30 md:p-8"><div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-red-700/10 blur-3xl transition-colors group-hover:bg-red-600/20" /><Icon className="relative mb-7 h-7 w-7 text-red-400" /><h3 className="relative mb-3 text-2xl font-bold">{title}</h3><p className="relative font-serif leading-relaxed text-gray-400">{text}</p></article></FadeIn>)}</div>
          </div>
        </section>

        <section id="hosting" className="relative overflow-hidden px-6 py-24 md:px-20 md:py-36">
          <div className="pointer-events-none absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-red-900/15 blur-[120px]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2"><FadeIn><div className="mb-5 font-mono text-[10px] tracking-[0.22em] text-red-400 uppercase">{copy.infraEyebrow}</div><h2 className="text-5xl font-bold tracking-tight md:text-7xl">{copy.infraTitle}</h2><p className="mt-7 font-serif text-lg leading-relaxed text-gray-400">{copy.infraText}</p><ul className="mt-8 space-y-4">{copy.infraPoints.map((point) => <li key={point} className="flex items-start gap-3 font-mono text-[10px] tracking-[0.08em] text-gray-300 uppercase"><Check className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />{point}</li>)}</ul><a href="/services" className="mt-9 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-red-300 uppercase hover:text-white">{ru ? 'Изучить все сервисы' : 'Explore all services'}<ArrowRight className="h-4 w-4" /></a></FadeIn>
            <FadeIn delay={0.15}><div className="relative mx-auto flex aspect-square w-full max-w-[31rem] items-center justify-center border border-red-500/20 bg-black/30"><div className="absolute inset-5 border border-red-500/10" /><div className="absolute inset-[18%] rotate-45 border border-red-500/20" /><div className="absolute inset-[28%] rounded-full border border-red-500/30" /><div className="absolute inset-[39%] rounded-full border border-rose-400/40 shadow-[0_0_60px_rgba(220,38,38,0.14)]" /><div className="absolute h-3 w-3 rounded-full bg-red-400 shadow-[0_0_25px_rgba(248,113,113,0.9)]" /><div className="absolute left-[14%] top-[18%] flex items-center gap-2 border border-red-500/20 bg-[#090809] px-3 py-2 font-mono text-[8px] tracking-widest text-red-200"><Server className="h-3 w-3" />SERVER</div><div className="absolute right-[8%] top-[36%] flex items-center gap-2 border border-red-500/20 bg-[#090809] px-3 py-2 font-mono text-[8px] tracking-widest text-red-200"><Globe2 className="h-3 w-3" />ONION</div><div className="absolute bottom-[20%] left-[10%] flex items-center gap-2 border border-red-500/20 bg-[#090809] px-3 py-2 font-mono text-[8px] tracking-widest text-red-200"><Network className="h-3 w-3" />NODE</div><div className="absolute bottom-[12%] right-[12%] flex items-center gap-2 border border-red-500/20 bg-[#090809] px-3 py-2 font-mono text-[8px] tracking-widest text-red-200"><LockKeyhole className="h-3 w-3" />ACCESS</div><div className="absolute left-4 top-4 font-mono text-[8px] tracking-[0.16em] text-gray-600">SYSTEM TOPOLOGY / CUSTOM</div><div className="absolute bottom-4 right-4 font-mono text-[8px] tracking-[0.16em] text-gray-600">{copy.uptime} <span className="text-red-400">{copy.uptimeSub}</span></div></div></FadeIn>
          </div>
        </section>

        <section ref={undefined} className="border-y border-red-500/10 bg-black/45 py-24 backdrop-blur-md md:py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-20"><FadeIn><div className="mb-4 font-mono text-[10px] tracking-[0.22em] text-red-400 uppercase">{copy.processEyebrow}</div><h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">{copy.processTitle}</h2></FadeIn>
            <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_0.38fr]"><div className="relative"><div className="absolute bottom-5 left-[1.05rem] top-5 w-px bg-gradient-to-b from-red-500/80 via-red-500/30 to-transparent" /><div className="space-y-3">{launchSteps.map((step, i) => <FadeIn key={step.id} delay={i * 0.07}><article className="group relative flex gap-6 border border-white/[0.07] bg-[#090809]/80 p-5 transition-colors hover:border-red-500/30 md:p-6"><div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border border-red-500/40 bg-[#10090a] font-mono text-[9px] text-red-300 shadow-[0_0_16px_rgba(220,38,38,0.1)]">{step.id}</div><div><h3 className="mb-2 text-xl font-bold">{step.title[language]}</h3><p className="max-w-2xl font-serif leading-relaxed text-gray-400">{step.text[language]}</p></div><ChevronRight className="ml-auto hidden h-4 w-4 shrink-0 text-red-500/50 transition-transform group-hover:translate-x-1 sm:block" /></article></FadeIn>)}</div></div>
              <FadeIn delay={0.2}><aside className="h-fit border border-red-500/20 bg-red-950/10 p-6 md:sticky md:top-28"><div className="mb-5 flex items-center gap-3 font-mono text-[9px] tracking-[0.16em] text-red-300 uppercase"><Radio className="h-4 w-4" />{ru ? 'ТРАЕКТОРИЯ / 03' : 'TRAJECTORY / 03'}</div><p className="font-serif text-2xl leading-relaxed text-gray-200">{copy.processAside}</p><div className="mt-7 h-px bg-gradient-to-r from-red-500/60 to-transparent" /><div className="mt-5 flex items-center gap-3 font-mono text-[8px] tracking-[0.14em] text-gray-500 uppercase"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />{copy.processPrompt}</div></aside></FadeIn>
            </div>
          </div>
        </section>

        <section id="systems" className="mx-auto max-w-7xl px-6 py-24 md:px-20 md:py-32"><FadeIn><div className="mb-4 font-mono text-[10px] tracking-[0.22em] text-red-400 uppercase">{copy.systemsEyebrow}</div><h2 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">{copy.systemsTitle}</h2><p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-gray-400">{copy.systemsText}</p></FadeIn>
          <div className="mt-12 grid gap-px border border-red-500/20 bg-red-500/15 md:grid-cols-2 lg:grid-cols-3">{systems.map(({ icon: Icon, id, title, text, tags }, i) => <FadeIn key={id} delay={i * 0.045}><article className="group relative flex h-full flex-col overflow-hidden bg-[#090809] p-6 transition-colors hover:bg-[#11090a] md:p-7"><div className="mb-9 flex items-center justify-between"><span className="font-mono text-[9px] tracking-[0.18em] text-gray-600">{id}</span><Icon className="h-6 w-6 text-red-400 transition-transform group-hover:scale-110" /></div><h3 className="mb-3 text-2xl font-bold">{title[language]}</h3><p className="flex-1 font-serif leading-relaxed text-gray-400">{text[language]}</p><ul className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">{tags[language].map((tag) => <li key={tag} className="border border-white/10 px-2 py-1 font-mono text-[8px] tracking-[0.1em] text-gray-500 uppercase">{tag}</li>)}</ul></article></FadeIn>)}</div>
        </section>

        <section id="work" className="border-y border-red-500/10 bg-black/40 py-24 md:py-32"><div className="mx-auto max-w-7xl px-6 md:px-20"><FadeIn><div className="mb-4 font-mono text-[10px] tracking-[0.22em] text-red-400 uppercase">{copy.outcomesEyebrow}</div></FadeIn><div className="mb-12 grid gap-8 md:grid-cols-3">{outcomes.map((item, i) => <FadeIn key={item.id} delay={i * 0.08}><article className="group relative flex h-full min-h-[370px] flex-col overflow-hidden border border-white/10 bg-[#090809] p-7 transition-colors hover:border-red-500/35 md:p-8"><div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-red-500/10 transition-transform duration-700 group-hover:scale-125" /><div className="relative mb-14 flex items-center justify-between"><span className="font-mono text-[9px] tracking-[0.18em] text-gray-600">STAGE / {item.id}</span><span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" /></div><h3 className="relative mb-4 text-4xl font-bold transition-colors group-hover:text-red-300">{item.title[language]}</h3><p className="relative mb-7 font-serif leading-relaxed text-gray-400">{item.text[language]}</p><ul className="relative mt-auto space-y-2 border-t border-white/10 pt-5">{item.items[language].map((detail) => <li key={detail} className="flex items-center gap-3 font-mono text-[9px] tracking-[0.1em] text-gray-500 uppercase"><span className="h-1 w-1 rounded-full bg-red-400" />{detail}</li>)}</ul></article></FadeIn>)}</div></div></section>

        <section id="careers" className="relative overflow-hidden px-6 py-24 md:px-20 md:py-36"><div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-red-500/[0.06]" /><div className="pointer-events-none absolute left-1/2 top-1/2 h-[35rem] w-[35rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/[0.06]" /><div className="relative mx-auto max-w-7xl"><FadeIn><div className="mb-5 font-mono text-[10px] tracking-[0.22em] text-red-400 uppercase">{copy.hiringEyebrow}</div></FadeIn><div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]"><FadeIn delay={0.08}><div><div className="mb-7 flex items-center gap-3"><span className="h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-[0_0_14px_rgba(248,113,113,0.8)]" /><span className="font-mono text-[9px] tracking-[0.17em] text-red-200 uppercase">{copy.hiringStatus}</span></div><h2 className="text-5xl font-bold tracking-tight md:text-7xl">{copy.hiringTitle}</h2><p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-gray-400">{copy.hiringText}</p><a href="/apply" className="mt-9 inline-flex items-center gap-3 border-b border-red-400/50 pb-3 font-mono text-[10px] tracking-[0.16em] text-red-200 uppercase transition-colors hover:border-red-300 hover:text-white">{copy.hiringCta}<ArrowRight className="h-4 w-4" /></a></div></FadeIn><FadeIn delay={0.2}><div className="border border-white/10 bg-[#090809]/90 p-6 md:p-8"><div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5"><span className="font-mono text-[9px] tracking-[0.17em] text-gray-400 uppercase">{copy.rolesTitle}</span><span className="font-mono text-[8px] tracking-widest text-red-300 uppercase">{copy.rolesStatus}</span></div><div className="space-y-5">{[copy.role1, copy.role2, copy.role3].map((role, i) => <div key={role} className="flex items-center justify-between gap-4"><div><div className="mb-1 font-mono text-[8px] tracking-[0.14em] text-gray-600 uppercase">CAPABILITY / 0{i + 1}</div><div className="text-lg font-semibold text-gray-200">{role}</div></div><Code2 className="h-4 w-4 text-red-400/70" /></div>)}</div><div className="mt-7 border-t border-white/10 pt-5 font-serif text-sm leading-relaxed text-gray-500">{copy.roleNote}</div></div></FadeIn></div></div></section>

        <section className="border-y border-red-500/10 bg-[#0a0809] px-6 py-14 md:px-20"><div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4"><FadeIn><div className="font-mono text-[9px] tracking-[0.16em] text-red-400 uppercase">{copy.trustEyebrow}</div></FadeIn>{[copy.trust1, copy.trust2, copy.trust3, copy.trust4].map((item) => <FadeIn key={item}><div className="flex items-start gap-3 font-mono text-[9px] leading-relaxed tracking-[0.08em] text-gray-400 uppercase"><ShieldCheck className="h-4 w-4 shrink-0 text-red-400" />{item}</div></FadeIn>)}</div></section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-20 md:py-20"><FadeIn><div className="flex flex-col gap-5 border border-red-500/20 bg-red-950/10 p-6 md:flex-row md:items-start md:p-8"><LockKeyhole className="h-6 w-6 shrink-0 text-red-400" /><div><h2 className="mb-2 text-xl font-bold">{copy.privacyTitle}</h2><p className="max-w-4xl font-serif leading-relaxed text-gray-400">{copy.privacyText}</p></div></div></FadeIn></section>

        <section className="relative overflow-hidden border-t border-red-500/15 bg-[#100809] px-6 py-24 text-center md:px-20 md:py-32"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(153,27,27,0.2),transparent_55%)]" /><FadeIn><div className="relative mx-auto max-w-3xl"><div className="mb-6 flex justify-center"><Zap className="h-7 w-7 text-red-400" /></div><h2 className="text-4xl font-bold tracking-tight md:text-6xl">{copy.finalTitle}</h2><p className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-relaxed text-gray-400">{copy.finalText}</p><a href="/contact#contact-form" className="mt-9 inline-flex items-center gap-3 bg-red-600 px-7 py-4 font-mono text-[10px] font-bold tracking-[0.15em] text-white uppercase transition-colors hover:bg-red-500">{copy.finalCta}<ArrowRight className="h-4 w-4" /></a></div></FadeIn></section>
      </main>
    </div>
  );
}
