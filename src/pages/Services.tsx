import {
  ArrowRight,
  Bot,
  Check,
  Code2,
  Globe2,
  KeyRound,
  LockKeyhole,
  Network,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { useLanguage } from '@/context/LanguageContext';

const services = [
  {
    number: 'SERVICE / 01',
    icon: <Sparkles className="h-8 w-8" />,
    title: { en: 'Interface Design', ru: 'Дизайн интерфейсов' },
    description: {
      en: 'Distinctive digital experiences designed around your brand, your audience, and the action you want visitors to take.',
      ru: 'Уникальный цифровой опыт, созданный под ваш бренд, аудиторию и нужное действие посетителя.',
    },
    features: {
      en: ['Brand direction & visual systems', 'Wireframes and UX flows', 'Responsive UI design', 'Interactive prototypes'],
      ru: ['Направление бренда и визуальные системы', 'Прототипы и пользовательские сценарии', 'Адаптивный UI-дизайн', 'Интерактивные прототипы'],
    },
  },
  {
    number: 'SERVICE / 02',
    icon: <Code2 className="h-8 w-8" />,
    title: { en: 'Web Development', ru: 'Веб-разработка' },
    description: {
      en: 'Fast, accessible websites and applications built with modern technology and room to grow with your business.',
      ru: 'Быстрые и доступные сайты и приложения на современных технологиях, готовые расти вместе с вашим бизнесом.',
    },
    features: {
      en: ['React and TypeScript development', 'CMS and API integrations', 'Accessible, responsive builds', 'Testing and quality assurance'],
      ru: ['Разработка на React и TypeScript', 'Интеграции с CMS и API', 'Доступность и адаптивность', 'Тестирование и контроль качества'],
    },
  },
  {
    number: 'SERVICE / 03',
    icon: <ShieldCheck className="h-8 w-8" />,
    title: { en: 'Privacy-Focused Hosting', ru: 'Хостинг с акцентом на приватность' },
    description: {
      en: 'Managed hosting with sensible data-minimization, hardened configurations, and clear operational practices. Privacy is a design goal—not a promise of invisibility or immunity from the law.',
      ru: 'Управляемый хостинг с минимизацией данных, усиленными настройками и понятными правилами эксплуатации. Приватность — принцип проектирования, а не обещание невидимости или неподсудности.',
    },
    features: {
      en: ['Managed deployments and updates', 'TLS, backups & access controls', 'Monitoring and incident guidance', 'Clear retention and usage policies'],
      ru: ['Управляемое развёртывание и обновления', 'TLS, резервные копии и контроль доступа', 'Мониторинг и помощь при инцидентах', 'Понятные правила хранения и использования'],
    },
  },
  {
    number: 'SERVICE / 04',
    icon: <Server className="h-8 w-8" />,
    title: { en: 'Private Servers', ru: 'Частные серверы' },
    description: {
      en: 'Dedicated or virtual server environments for personal projects and business workloads, configured for your needs and maintained with security in mind.',
      ru: 'Выделенные и виртуальные серверы для личных проектов и бизнес-нагрузок, настроенные под ваши задачи и обслуживаемые с учётом безопасности.',
    },
    features: {
      en: ['Server sizing and deployment', 'Least-privilege access setup', 'Patch and backup planning', 'Documentation and handoff'],
      ru: ['Подбор ресурсов и развёртывание', 'Настройка доступа по принципу минимума привилегий', 'План обновлений и резервного копирования', 'Документация и передача'],
    },
  },
  {
    number: 'SERVICE / 05',
    icon: <Globe2 className="h-8 w-8" />,
    title: { en: 'Tor Onion Services', ru: 'Сервисы Tor onion' },
    description: {
      en: 'Set up and maintain a Tor onion service for lawful publishing, community access, or a private project—with secure administration and realistic privacy expectations.',
      ru: 'Настроим и обслуживаем сервис Tor onion для законной публикации, доступа сообщества или частного проекта — с безопасным администрированием и реалистичными ожиданиями от приватности.',
    },
    features: {
      en: ['Onion service deployment', 'Hardened host configuration', 'Service availability checks', 'Operational documentation'],
      ru: ['Развёртывание onion-сервиса', 'Усиленная конфигурация сервера', 'Проверка доступности', 'Документация по эксплуатации'],
    },
  },
  {
    number: 'SERVICE / 06',
    icon: <Network className="h-8 w-8" />,
    title: { en: 'Self-Hosted Crypto Nodes', ru: 'Собственные крипто-ноды' },
    description: {
      en: 'Run a node for supported blockchain networks to query public chain data and support your own applications. Node hosting does not provide custody, investment advice, or guaranteed returns.',
      ru: 'Запустите ноду поддерживаемой блокчейн-сети для работы с публичными данными и своими приложениями. Хостинг ноды не включает хранение активов, инвестиционные советы или гарантии доходности.',
    },
    features: {
      en: ['Requirements and network selection', 'Node installation and configuration', 'Health and disk monitoring', 'Upgrade and recovery planning'],
      ru: ['Подбор сети и требований', 'Установка и настройка ноды', 'Мониторинг состояния и диска', 'План обновления и восстановления'],
    },
  },
  {
    number: 'SERVICE / 07',
    icon: <KeyRound className="h-8 w-8" />,
    title: { en: 'Private VPN', ru: 'Персональный VPN' },
    description: {
      en: 'A VPN endpoint for secure remote access to your own devices, team resources, or private network. A VPN protects a connection; it does not make users anonymous.',
      ru: 'VPN-точка для защищённого удалённого доступа к вашим устройствам, ресурсам команды или частной сети. VPN защищает соединение, но не делает пользователя анонимным.',
    },
    features: {
      en: ['Private server deployment', 'Device and user access setup', 'Key rotation guidance', 'Connection health monitoring'],
      ru: ['Развёртывание на частном сервере', 'Настройка доступа устройств и пользователей', 'Рекомендации по ротации ключей', 'Мониторинг соединения'],
    },
  },
  {
    number: 'SERVICE / 08',
    icon: <LockKeyhole className="h-8 w-8" />,
    title: { en: 'Managed Proxies', ru: 'Управляемые прокси' },
    description: {
      en: 'Private proxy infrastructure for authorized business integrations, QA, and traffic management, with access controls and acceptable-use safeguards.',
      ru: 'Частная прокси-инфраструктура для разрешённых бизнес-интеграций, тестирования и управления трафиком — с контролем доступа и правилами допустимого использования.',
    },
    features: {
      en: ['Private deployment options', 'Authentication and access limits', 'Reliability monitoring', 'Usage policy and documentation'],
      ru: ['Варианты частного развёртывания', 'Аутентификация и ограничения доступа', 'Мониторинг надёжности', 'Правила использования и документация'],
    },
  },
  {
    number: 'SERVICE / 09',
    icon: <Bot className="h-8 w-8" />,
    title: { en: 'Business Apps & Automation', ru: 'Бизнес-приложения и автоматизация' },
    description: {
      en: 'Purpose-built applications, chatbots, and workflow automations that reduce repetitive work and connect the tools your business already uses.',
      ru: 'Разрабатываем приложения, чат-боты и автоматизацию процессов, которые сокращают рутинную работу и связывают привычные инструменты вашего бизнеса.',
    },
    features: {
      en: ['Internal tools and customer portals', 'Chatbots for support and FAQs', 'Workflow and API integrations', 'Human review and failure safeguards'],
      ru: ['Внутренние инструменты и клиентские порталы', 'Чат-боты для поддержки и FAQ', 'Интеграции процессов и API', 'Контроль человеком и защита от ошибок'],
    },
  },
  {
    number: 'SERVICE / 10',
    icon: <Wrench className="h-8 w-8" />,
    title: { en: 'Growth & Support', ru: 'Развитие и поддержка' },
    description: {
      en: 'A long-term technical partner for maintenance, performance improvements, infrastructure updates, and the next stage of your digital journey.',
      ru: 'Долгосрочный технический партнёр для обслуживания, повышения производительности, обновления инфраструктуры и следующего этапа развития.',
    },
    features: {
      en: ['Ongoing maintenance', 'Performance improvements', 'Feature development', 'Technical guidance'],
      ru: ['Регулярное обслуживание', 'Повышение производительности', 'Разработка функций', 'Технические консультации'],
    },
  },
];

const process = [
  {
    step: '01',
    title: { en: 'Discover', ru: 'Изучение' },
    text: {
      en: 'We learn about your goals, users, environment, and operational requirements before recommending a service.',
      ru: 'Сначала мы изучаем ваши цели, пользователей, среду и эксплуатационные требования, а затем предлагаем решение.',
    },
  },
  {
    step: '02',
    title: { en: 'Design', ru: 'Проектирование' },
    text: {
      en: 'We agree on the architecture, data handling, access model, scope, and support expectations.',
      ru: 'Согласуем архитектуру, обработку данных, модель доступа, объём работ и формат поддержки.',
    },
  },
  {
    step: '03',
    title: { en: 'Build', ru: 'Разработка' },
    text: {
      en: 'We implement, configure, and test the solution with secure defaults and practical documentation.',
      ru: 'Реализуем, настраиваем и тестируем решение с безопасными параметрами по умолчанию и понятной документацией.',
    },
  },
  {
    step: '04',
    title: { en: 'Operate', ru: 'Эксплуатация' },
    text: {
      en: 'We hand over the controls and can continue with monitoring, maintenance, and planned improvements.',
      ru: 'Передаём вам управление и при необходимости продолжаем мониторинг, обслуживание и плановые улучшения.',
    },
  },
];

export default function Services() {
  const { language } = useLanguage();
  const copy =
    language === 'ru'
      ? {
          eyebrow: 'Что мы делаем / Услуги',
          title1: 'Цифровые системы.',
          title2: 'Под вашим контролем.',
          subtitle: 'Tonrax объединяет разработку, частную инфраструктуру и автоматизацию бизнеса. Решения проектируются под ваши задачи, с прозрачными ограничениями и ответственным использованием.',
          capabilities: '01 / Основные возможности',
          privacyLabel: 'Приватность без ложных обещаний',
          privacyText: 'Мы помогаем создавать и обслуживать законные частные системы. Ни хостинг, ни VPN, прокси или Tor не гарантируют анонимность и не освобождают от законов и правил. Для каждой услуги действуют проверка допустимого использования и разумные меры безопасности.',
          process: '02 / Наш процесс',
          path: 'От задачи',
          toLaunch: 'к надёжной системе.',
          processText: 'Понятный путь от обсуждения требований до запуска и передачи вам контроля.',
          ready: 'Обсудим вашу задачу?',
          readyText: 'Расскажите, что хотите создать или разместить. Мы поможем определить подходящий объём работ, сроки и требования.',
          cta: 'Запросить консультацию',
        }
      : {
          eyebrow: 'What we do / Services',
          title1: 'Digital systems.',
          title2: 'On your terms.',
          subtitle: 'Tonrax brings engineering, private infrastructure, and business automation together. Solutions are shaped around your needs, with clear limits and responsible use in mind.',
          capabilities: '01 / Core Capabilities',
          privacyLabel: 'Privacy without false promises',
          privacyText: 'We build and maintain lawful private systems. Hosting, VPNs, proxies, and Tor cannot guarantee anonymity or exemption from laws and rules. Services are subject to acceptable-use review and practical security safeguards.',
          process: '02 / Our Process',
          path: 'From brief',
          toLaunch: 'to dependable systems.',
          processText: 'A clear path from understanding your requirements to launch and handoff.',
          ready: 'Have a mission in mind?',
          readyText: 'Tell us what you want to build or host. We will help define a suitable scope, timeline, and requirements.',
          cta: 'Talk to our team',
        };

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      <Starfield />
      <CursorDot />
      <Navigation />

      <main className="relative z-10 pt-20">
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-20 md:py-48">
          <FadeIn>
            <div className="mb-6 font-mono text-sm tracking-[0.3em] text-orange-400 uppercase">{copy.eyebrow}</div>
            <h1 className="max-w-5xl text-6xl font-bold leading-[0.88] tracking-tighter md:text-8xl lg:text-9xl">
              {copy.title1}<br />
              <span className="bg-gradient-to-r from-white via-gray-300 to-gray-600 bg-clip-text text-transparent">{copy.title2}</span>
            </h1>
            <p className="mt-10 max-w-3xl font-serif text-xl leading-relaxed text-gray-400 md:text-2xl">{copy.subtitle}</p>
          </FadeIn>
        </section>

        <section className="border-t border-white/5 bg-black/50 py-24 backdrop-blur-md md:py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-20">
            <FadeIn>
              <div className="mb-12 font-mono text-sm tracking-widest text-orange-400 uppercase">{copy.capabilities}</div>
            </FadeIn>
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
              {services.map((service, index) => (
                <FadeIn key={service.number} delay={index * 0.04}>
                  <article className="group relative h-full overflow-hidden bg-black/80 p-8 transition-colors hover:bg-white/[0.04] md:p-10">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-500/10 blur-3xl transition-all duration-700 group-hover:bg-blue-400/20" />
                    <div className="relative z-10">
                      <div className="mb-8 flex items-center justify-between">
                        <span className="font-mono text-xs tracking-[0.25em] text-gray-500">{service.number}</span>
                        <div className="text-orange-400 transition-transform duration-300 group-hover:rotate-12">{service.icon}</div>
                      </div>
                      <h2 className="mb-5 text-3xl font-bold md:text-4xl">{service.title[language]}</h2>
                      <p className="mb-8 max-w-lg font-serif text-lg leading-relaxed text-gray-400">{service.description[language]}</p>
                      <ul className="space-y-3 font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500">
                        {service.features[language].map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-300" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-20 md:py-32">
          <FadeIn>
            <div className="border border-orange-400/20 bg-orange-400/[0.04] p-8 md:p-10">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
                <LockKeyhole aria-hidden="true" className="h-7 w-7 shrink-0 text-orange-300" />
                <div>
                  <h2 className="mb-3 text-2xl font-bold text-orange-100">{copy.privacyLabel}</h2>
                  <p className="max-w-4xl font-serif leading-relaxed text-gray-400">{copy.privacyText}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        <section className="border-t border-white/5 bg-black/50 py-24 backdrop-blur-md md:py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-20">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
              <FadeIn>
                <div>
                  <div className="mb-8 font-mono text-sm tracking-widest text-orange-400 uppercase">{copy.process}</div>
                  <h2 className="text-5xl font-bold tracking-tight md:text-7xl">{copy.path}<br />{copy.toLaunch}</h2>
                  <p className="mt-8 max-w-md font-serif text-xl leading-relaxed text-gray-400">{copy.processText}</p>
                </div>
              </FadeIn>
              <div className="border-l border-white/10">
                {process.map((item, index) => (
                  <FadeIn key={item.step} delay={index * 0.08}>
                    <div className="group border-b border-white/10 p-7 pl-8 transition-colors hover:bg-white/[0.03] md:p-9 md:pl-12">
                      <div className="mb-4 flex items-center gap-5">
                        <span className="font-mono text-xs tracking-widest text-orange-300">{item.step}</span>
                        <h3 className="text-2xl font-bold">{item.title[language]}</h3>
                      </div>
                      <p className="max-w-xl font-serif leading-relaxed text-gray-400">{item.text[language]}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-black/50 py-28 backdrop-blur-md md:py-40">
          <div className="mx-auto max-w-7xl px-6 text-center md:px-20">
            <FadeIn>
              <div className="mb-6 flex justify-center"><Rocket aria-hidden="true" className="h-8 w-8 text-orange-400" /></div>
              <h2 className="mb-8 text-5xl font-bold tracking-tight text-orange-200 md:text-7xl">{copy.ready}</h2>
              <p className="mx-auto mb-12 max-w-2xl font-serif text-xl leading-relaxed text-gray-400">{copy.readyText}</p>
              <a
                href="/contact#contact-form"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 font-mono text-sm uppercase tracking-widest transition-colors duration-300 hover:bg-orange-300 hover:text-black"
              >
                {copy.cta} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}
