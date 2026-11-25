import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Code, Cpu, Globe, Rocket, Shield, Zap } from 'lucide-react';
import { SiMonero, SiBitcoin, SiEthereum, SiVisa, SiMastercard } from 'react-icons/si';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { language } = useLanguage();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, 100]);
  const sequenceRef = useRef<HTMLElement>(null);
  const { scrollYProgress: sequenceProgress } = useScroll({
    target: sequenceRef,
    offset: ['start 75%', 'end 25%'],
  });
  const asteroidY = useTransform(sequenceProgress, [0, 1], ['0%', '100%']);

  const copy =
    language === 'ru'
      ? {
          eyebrow: 'Разработка сайтов и хостинг',
          title: 'Создайте свой бизнес',
          highlight: 'с нами.',
          description: 'Полный цикл услуг — от дизайна до запуска. Мы создаём быстрые и качественные сайты, а также обеспечиваем надёжный хостинг, чтобы вы могли сосредоточиться на росте бизнеса.',
          cta: 'Начать',
          introTitle: 'Вне горизонта событий.',
          introP1: 'Интернет огромен, в основном пуст и очень шумный. Чтобы выделиться, нужен не шаблон, а настоящая гравитация.',
          introP2: 'Tonrax работает на стыке высокой инженерии и впечатляющего дизайна. Мы создаём цифровые пространства, которые привлекают внимание и приводят клиентов.',
          capabilities: '01 / Возможности',
          uiTitle: 'Дизайн интерфейсов',
          uiText: 'Визуальные системы и интерфейсы, которые ощущаются естественно и работают для пользователей.',
          frontendTitle: 'Frontend-инжиниринг',
          frontendText: 'Высокопроизводительные сайты на современных фреймворках. Быстро, доступно и масштабируемо.',
          strategyTitle: 'Цифровая стратегия',
          strategyText: 'Планирование оптимальной траектории продукта: архитектура, пользовательские сценарии и рост конверсии.',
          infra: '02 / Инфраструктура',
          hostingTitle: 'Tonrax Hosting.',
          hostingText: 'Как самый мощный чёрный объект во Вселенной, наша инфраструктура непреодолима: низкая задержка, защита и бесконечная масштабируемость.',
          sequence: '03 / Последовательность запуска',
          work: '04 / Орбитальные системы',
          allYouNeed: 'Всё, что нужно вашему запуску.',
          allYouNeedText: 'Полная цифровая орбита, выстроенная как одна система. Выберите точку входа — мы построим инфраструктуру вокруг неё.',
          crew: '05 / Удалённая команда',
          crewLead: 'Нанимаем удалённо',
          crewTitle: 'Стройте из любой орбиты.',
          crewText: 'Мы ищем вниматель��ых удалённых специалистов, которые заботятся о деталях и умеют превращать пустое пространство в быстрый, красивый и надёжный продукт.',
          sendCoordinates: 'Отправить координаты',
          transmit: 'Передать сигнал',
          contactTitle: 'Установить связь.',
          contactText: 'Готовы вывести своё цифровое присутствие на новый уровень? Отправьте координаты, и наша команда ответит в течение 24 часов.',
          footer: '© Tonrax... Все системы в рабочем состоянии.',
        }
      : {
          eyebrow: 'Web Development & Hosting Solutions',
          title: 'Build Your Business',
          highlight: 'With Us.',
          description: 'Complete web services from design to deployment. We build stunning, high-performance websites and provide reliable hosting so you can focus on your business.',
          cta: 'Get Started',
          introTitle: 'Beyond the Event Horizon.',
          introP1: 'The internet is vast, mostly empty, and incredibly noisy. Standing out requires more than a template. It requires gravitational pull.',
          introP2: 'Tonrax operates at the intersection of high-performance engineering and breathtaking design. We build living observatories that capture attention and convert it into momentum.',
          capabilities: '01 / Capabilities',
          uiTitle: 'Interface Design',
          uiText: 'Pixel-perfect visual design systems and user interfaces that feel native to the human touch.',
          frontendTitle: 'Frontend Engineering',
          frontendText: 'High-performance Websites built with modern frameworks. Smooth, accessible, and infinitely scalable.',
          strategyTitle: 'Digital Strategy',
          strategyText: 'Plotting the optimal trajectory for your product. Architecture, user flow, and conversion optimization.',
          infra: '02 / Infrastructure',
          hostingTitle: 'Tonrax Hosting.',
          hostingText: 'Like the most massive Blackhole in the known universe, our infrastructure is inescapable. Zero-latency edge delivery, impenetrable security, and infinite scalability.',
          sequence: '03 / Launch Sequence',
          work: '04 / Orbital Systems',
          allYouNeed: 'Everything your launch needs.',
          allYouNeedText: 'A complete digital orbit, engineered as one connected system. Choose your entry point and we will build the infrastructure around it.',
          crew: '05 / Remote Crew',
          crewLead: 'Hiring remotely',
          crewTitle: 'Build from any orbit.',
          crewText: 'We are looking for thoughtful remote builders who care about the details — people who can turn a void space into a fast, beautiful, dependable digital experience.',
          sendCoordinates: 'Send your coordinates',
          transmit: 'Transmit Signal',
          contactTitle: 'Establish Contact.',
          contactText: 'Ready to elevate your digital presence to orbital heights? Transmit your coordinates and our engineering team will respond within 24 hours.',
          footer: '© Tonrax... All systems operational.',
        };

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      <Starfield />
      <CursorDot />
      <Navigation />

      <main className="relative z-10">
        <section className="h-[100dvh] flex flex-col justify-center items-center text-center px-4 relative">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-5xl mx-auto mt-20">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
              <div className="font-mono text-orange-400 text-sm md:text-base tracking-[0.3em] uppercase mb-6">
                {copy.eyebrow}
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-8">
                {copy.title}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600">{copy.highlight}</span>
              </h1>
              <p className="text-lg md:text-1xl font-serif text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                {copy.description}
              </p>
              <a href="/contact" className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 rounded-full text-sm font-mono uppercase tracking-widest hover:bg-orange-300 hover:text-black transition-colors duration-300">
                {copy.cta} <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="font-mono text-[10px] tracking-widest text-gray-500 uppercase" />
            <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
          </motion.div>
        </section>

        <section className="py-32 md:py-48 px-6 md:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{copy.introTitle}</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="font-serif text-xl md:text-2xl text-gray-400 leading-relaxed space-y-6">
                <p>{copy.introP1}</p>
                <p>{copy.introP2}</p>
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="services" className="py-32 border-t border-white/5 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <FadeIn>
              <div className="font-mono text-orange-400 text-sm tracking-widest uppercase mb-16">{copy.capabilities}</div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: <Globe className="w-8 h-8" />, title: copy.uiTitle, desc: copy.uiText },
                { icon: <Code className="w-8 h-8" />, title: copy.frontendTitle, desc: copy.frontendText },
                { icon: <Rocket className="w-8 h-8" />, title: copy.strategyTitle, desc: copy.strategyText },
              ].map((svc, i) => (
                <FadeIn key={i} delay={0.2 * i} className="group cursor-default">
                  <div className="border border-white/10 p-8 h-full bg-white/[0.02] hover:bg-white/[0.05] transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all duration-700" />
                    <div className="text-gray-500 mb-6 group-hover:text-orange-400 transition-colors">{svc.icon}</div>
                    <h3 className="text-2xl font-bold mb-4">{svc.title}</h3>
                    <p className="font-serif text-gray-400 leading-relaxed">{svc.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="hosting" className="py-32 md:py-48 px-6 md:px-20 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <FadeIn>
                <div className="font-mono text-orange-400 text-sm tracking-widest uppercase mb-6">{copy.infra}</div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">{copy.hostingTitle}</h2>
                <p className="font-serif text-xl text-gray-400 leading-relaxed mb-10">{copy.hostingText}</p>
                <ul className="space-y-4 font-mono text-sm tracking-wide text-gray-300">
                  <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-orange-400" />{language === 'ru' ? 'Глобальная edge-сеть' : 'Global Edge Network'}</li>
                  <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-orange-400" />{language === 'ru' ? 'Защита от DDoS уровня enterprise' : 'Enterprise-grade DDoS Mitigation'}</li>
                  <li className="flex items-center gap-3"><Cpu className="w-4 h-4 text-orange-400" />{language === 'ru' ? 'Выделенные вычислительные ресурсы' : 'Dedicated Compute Resources'}</li>
                </ul>
              </FadeIn>
            </div>

            <FadeIn delay={0.3} className="relative">
              <div className="aspect-square border border-white/10 rounded-full flex items-center justify-center relative bg-black/50 backdrop-blur-md">
                <div className="absolute inset-0 border border-orange-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 border border-blue-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="w-32 h-32 bg-black rounded-full shadow-[0_0_50px_rgba(255,150,0,0.5)] flex items-center justify-center text-center">
                  <span className="font-mono text-xs tracking-widest text-orange-400">99.999%<br />UPTIME</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section ref={sequenceRef} className="py-32 border-t border-white/5 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <FadeIn>
              <div className="font-mono text-orange-400 text-sm tracking-widest uppercase mb-16 text-left">{copy.sequence}</div>
            </FadeIn>

            <div className="grid md:grid-cols-[minmax(0,1fr)_0.6fr] gap-20 items-start">
              <div className="launch-sequence-track relative pl-14 md:pl-20">
                <div className="launch-sequence-line" aria-hidden="true">
                  <motion.div className="launch-sequence-line-progress" style={{ scaleY: sequenceProgress }} />
                  <motion.div className="launch-asteroid" style={{ top: asteroidY }} aria-hidden="true"><span /></motion.div>
                </div>
                <div className="space-y-12">
                  {[
                    { num: language === 'ru' ? 'T-MINUS 04' : 'T-MINUS 04', title: language === 'ru' ? 'Поиск' : 'Discovery', desc: language === 'ru' ? 'Сопоставляем координаты. Определяем параметры миссии, аудиторию и требования к структуре вашего цифрового присутствия.' : 'Mapping the coordinates. We define the mission parameters, target audience, and structural requirements of your digital presence.' },
                    { num: 'T-MINUS 03', title: language === 'ru' ? 'Дизайн' : 'Design', desc: language === 'ru' ? 'Создаём корпус. Устанавливаем визуальное направление, UX-архитектуру и атмосферные элементы.' : 'Constructing the hull. Visual direction, UX architecture, and atmospheric elements are established and refined.' },
                    { num: 'T-MINUS 02', title: language === 'ru' ? 'Инжиниринг' : 'Engineering', desc: language === 'ru' ? 'Разжигаем ядро. Создаём frontend и backend-системы, обеспечивая максимальную скорость и плавность.' : 'Igniting the core. We build the frontend and backend systems, ensuring peak performance and fluid motion.' },
                    { num: 'T-MINUS 01', title: language === 'ru' ? 'Тестирование' : 'Testing', desc: language === 'ru' ? 'Предполётная проверка. Строгий QA на всех устройствах, браузерах и сетевых условиях.' : 'Pre-flight checks. Rigorous quality assurance across all devices, browsers, and network conditions.' },
                    { num: language === 'ru' ? 'СТАРТ' : 'LIFTOFF', title: language === 'ru' ? 'Развёртывание' : 'Deployment', desc: language === 'ru' ? 'Входим в орбиту. Сайт выходит в сеть на edge-серверах и доступен по всему миру без простоя.' : 'Entering orbit. Your site goes live on our edge network, instantly accessible worldwide with zero downtime.' },
                  ].map((step, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div className="pb-12 border-b border-white/10">
                        <div className="font-mono text-sm tracking-widest text-orange-200 mb-4">{step.num}</div>
                        <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                        <p className="font-serif text-gray-400 leading-relaxed max-w-2xl">{step.desc}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
              <FadeIn delay={0.25} className="hidden md:block pt-10">
                <div className="launch-sequence-aside">
                  <span className="font-mono text-xs tracking-[0.25em] text-orange-200 uppercase">{language === 'ru' ? 'Траектория / 03' : 'Trajectory / 03'}</span>
                  <p className="font-serif text-2xl text-white/80 leading-relaxed mt-6">{language === 'ru' ? 'Каждая орбита начинается с чёткой траектории.' : 'Every orbit begins with a clear direction.'}</p>
                  <div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-orange-200">
                    <span className="w-2 h-2 rounded-full bg-orange/400 animate-pulse" />
                    {language === 'ru' ? 'Прокрутите для запуска' : 'Scroll to propel'}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <section id="work" className="py-32 md:py-48 px-6 md:px-20 max-w-7xl mx-auto">
          <FadeIn>
            <div className="font-mono text-orange-400 text-sm tracking-widest uppercase mb-16">{copy.work}</div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-3xl mb-20">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{copy.allYouNeed}</h2>
              <p className="font-serif text-xl text-gray-400 leading-relaxed">{copy.allYouNeedText}</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 text-orange-200 gap-px bg-white/10 border border-white/10">
            {[
              { title: language === 'ru' ? 'Сигнал' : 'Signal', code: language === 'ru' ? 'ЭТАП / 01' : 'STAGE / 01', desc: language === 'ru' ? 'Чёткое, высокоэффективное цифровое присутствие, которое даёт вашему проекту заметный сигнал.' : 'A clear, high-converting digital presence that gives your idea a signal worth following.', details: language === 'ru' ? ['Стратегия и позиционирование', 'Дизайн интерфейса', 'Коммуникации и рост'] : ['Strategy & positioning', 'Interface design', 'Messaging & growth'] },
              { title: language === 'ru' ? 'Ядро' : 'Core', code: language === 'ru' ? 'ЭТАП / 02' : 'STAGE / 02', desc: language === 'ru' ? 'Технический двигатель под поверхностью — быстрый, устойчивый и готовый к тысячам пользователей.' : 'The technical engine beneath the surface — fast, resilient, and ready for your next thousand users.', details: language === 'ru' ? ['Frontend-инжиниринг', 'API системы', 'Профилирование производительности'] : ['Frontend engineering', 'API systems', 'Performance tuning'] },
              { title: language === 'ru' ? 'Орбита' : 'Orbit', code: language === 'ru' ? 'ЭТАП / 03' : 'STAGE / 03', desc: language === 'ru' ? 'Среда хостинга, которая удерживает ваш сайт в движении, защищённом и доступном везде, где находится аудитория.' : 'A hosting environment that keeps your site in motion, protected and available wherever your audience lands.', details: language === 'ru' ? ['Edge-развёртывание', 'Мониторинг', 'Масштабирование и безопасность'] : ['Edge deployment', 'Monitoring', 'Scaling & security'] },
            ].map((system, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.1}>
                <div className="group relative h-full min-h-[390px] p-8 md:p-10 bg-black/70 hover:bg-white/[0.04] transition-colors overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full border border-white/10 group-hover:scale-125 group-hover:border-orange-400/30 transition-all duration-700" />
                  <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full border border-white/10 group-hover:rotate-45 transition-transform duration-700" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-20">
                      <span className="font-mono text-xs tracking-[0.25em] text-gray-500">{system.code}</span>
                      <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(96,165,250,0.8)] group-hover:bg-white transition-colors" />
                    </div>
                    <h3 className="text-4xl font-bold mb-5 group-hover:text-orange-400 transition-colors">{system.title}</h3>
                    <p className="font-serif text-lg text-gray-400 leading-relaxed mb-8">{system.desc}</p>
                    <ul className="mt-auto space-y-3 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500">
                      {system.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-3">
                          <span className="w-1 h-1 bg-white/60 rounded-full" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="careers" className="py-32 md:py-44 px-6 md:px-20 border-t border-white/5 bg-black/40 relative overflow-hidden">
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.04]" aria-hidden="true" />
          <div className="absolute top-1/2 left-1/2 w-[42rem] h-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" aria-hidden="true" />
          <div className="max-w-7xl mx-auto relative z-10">
            <FadeIn>
              <div className="font-mono text-orange-400 text-sm tracking-widest uppercase mb-16">{copy.crew}</div>
            </FadeIn>

            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-28 items-center">
              <FadeIn delay={0.1}>
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)] animate-pulse" />
                    <span className="font-mono text-xs tracking-[0.22em] text-orange-200 uppercase">{copy.crewLead}</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-7">{copy.crewTitle}</h2>
                  <p className="font-serif text-xl text-gray-400 leading-relaxed max-w-xl">{copy.crewText}</p>
                  <a href="/apply" className="inline-flex items-center gap-4 text-orange-200 mt-10 font-mono text-xs tracking-[0.2em] uppercase border-b border-white/40 pb-3 hover:border-white transition-colors duration-300">
                    {copy.sendCoordinates} <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </FadeIn>

              <FadeIn delay={0.25}>
                <div className="border border-white/10 bg-black/70 backdrop-blur-sm p-7 md:p-9 font-mono">
                  <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6">
                    <span className="text-xs tracking-[0.2em] text-gray-500 uppercase">{language === 'ru' ? 'Открытые позиции' : 'Open positions'}</span>
                    <span className="text-[10px] tracking-widest text-emerald-300 uppercase">{language === 'ru' ? 'Удалённо / глобально' : 'Remote / global'}</span>
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: language === 'ru' ? 'Frontend-инженер' : 'Frontend engineer', value: '03 seat', detail: language === 'ru' ? 'открыта' : 'open' },
                      { label: language === 'ru' ? 'Backend-инженер' : 'Backend engineer', value: '03 seat', detail: language === 'ru' ? 'открыта' : 'open' },
                      { label: language === 'ru' ? 'Platform-инженер' : 'Platform engineer', value: language === 'ru' ? 'Талант-пул' : 'Talent pool', detail: language === 'ru' ? 'будущая орбита' : 'future orbit' },
                    ].map((role) => (
                      <div key={role.label} className="flex items-end justify-between gap-4">
                        <div>
                          <div className="text-[10px] tracking-[0.16em] text-gray-500 uppercase mb-2">{role.label}</div>
                          <div className="text-xl text-orange-200 tracking-wide">{role.value}</div>
                        </div>
                        <span className="text-[10px] tracking-widest text-gray-600 uppercase">{role.detail}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-9 pt-6 border-t border-white/10">
                    <div className="flex items-start gap-4 text-[10px] tracking-[0.14em] text-gray-500 uppercase leading-relaxed">
                      <span className="mt-1 w-2 h-2 shrink-0 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                      <span>{language === 'ru' ? 'Асинхронно по умолчанию. Время на глубокую работу защищено. Подходят разные часовые пояса.' : 'Async by default. Deep work protected. Different time zones welcome.'}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
        {/*
        <section id="contact" className="py-32 md:py-48 px-6 md:px-20 min-h-screen flex items-center relative">
          <div className="max-w-4xl mx-auto w-full text-center relative z-10">
            <FadeIn>
              <h2 className="text-5xl text-orange-200 md:text-8xl font-bold tracking-tight mb-8">{copy.contactTitle}</h2>
              <p className="font-serif text-xl text-gray-400 mb-12 max-w-2xl mx-auto">{copy.contactText}</p>

              <form className="space-y-6 max-w-xl mx-auto text-left" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-xs tracking-widest text-gray-400 uppercase">{language === 'ru' ? 'Обращение' : 'Designation'}</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-sans" placeholder={language === 'ru' ? 'Ваше имя' : 'Your name'} />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-xs tracking-widest text-gray-400 uppercase">{language === 'ru' ? 'Комм-ссылка' : 'Comm Link'}</label>
                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-sans" placeholder={language === 'ru' ? 'your@email.com' : 'your@email.com'} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-xs tracking-widest text-gray-400 uppercase">{language === 'ru' ? 'Параметры миссии' : 'Mission Parameters'}</label>
                  <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-sans resize-none" placeholder={language === 'ru' ? 'Расскажите о вашем проекте...' : 'Tell us about your project...'} />
                </div>
                <button className="w-full bg-white text-black font-mono uppercase tracking-widest text-sm py-4 group overflow-hidden relative border border-white">
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">{copy.transmit}</span>
                  <div className="absolute inset-0 bg-orange-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </form>
            </FadeIn>
          </div>
        </section> */}

       <section className="border-t border-white/5 bg-black/50 py-32 backdrop-blur-md md:py-40">
  <div className="mx-auto max-w-7xl px-6 md:px-20 text-center">
    <FadeIn>
      <div className="mb-6 flex justify-center">
        <Rocket className="h-8 w-8 text-orange-400" />
      </div>
      <h2 className="text-5xl font-bold tracking-tight text-orange-200 md:text-8xl mb-8">
        {language === 'ru' ? 'Готовы к запуску?' : 'Ready to Launch?'}
      </h2>
      <p className="mx-auto max-w-2xl font-serif text-xl leading-relaxed text-gray-400 mb-12">
        {language === 'ru' 
          ? 'Давайте обсудим, как мы можем помочь вашему проекту. Наша команда отвечает в течение 24 часов.' 
          : "Let's discuss how we can bring your mission to life. Our team responds within 24 hours."}
      </p>
      <a
        href="/contact"
        className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 rounded-full text-sm font-mono uppercase tracking-widest hover:bg-orange-300 hover:text-black transition-colors duration-300"
      >
        {language === 'ru' ? 'Запланировать консультацию' : 'Schedule Consultation'} <ArrowRight className="w-4 h-4" />
      </a>
    </FadeIn>
  </div>
</section>

      </main>
    </div>
  );
}
