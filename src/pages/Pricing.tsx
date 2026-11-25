import { Check, ArrowRight, Zap, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { useLanguage } from '@/context/LanguageContext';

const pricingPlans = [
  {
    name: { en: 'Signal', ru: 'Сигнал' },
    code: { en: 'TIER / 01', ru: 'УРОВЕНЬ / 01' },
    pricePrefix: { en: '', ru: '' },
    price: '$159',
    period: { en: 'Project', ru: 'Проект' },
    description: {
      en: 'A clear, high-converting digital presence that gives your idea a signal worth following.',
      ru: 'Чёткое, высокоэффективное цифровое присутствие, которое делает вашу идею заметной и востребованной.',
    },
    features: {
      en: [
        'Domain & Server excluded',
        'Custom design & branding',
        'Responsive frontend build',
        'Performance optimization',
        '5 revision rounds',
        'Mobile-friendly interface',
        'SEO foundation setup',
        'Deployment assistance',
      ],
      ru: [
        'Домен и сервер не включены',
        'Индивидуальный дизайн и брендинг',
        'Адаптивная frontend-разработка',
        'Оптимизация производительности',
        '5 раундов правок',
        'Мобильный интерфейс',
        'Базовая SEO-настройка',
        'Помощь с запуском',
      ],
    },
    cta: { en: 'Start Your Signal', ru: 'Запустить сигнал' },
    featured: false,
    color: 'blue',
  },
  {
    name: { en: 'Core', ru: 'Ядро' },
    code: { en: 'TIER / 02', ru: 'УРОВЕНЬ / 02' },
    pricePrefix: { en: '', ru: '' },
    price: '$459',
    period: { en: 'Project', ru: 'Проект' },
    description: {
      en: 'The technical engine beneath the surface — fast, resilient, and ready for your next thousand users.',
      ru: 'Технический двигатель под поверхностью — быстрый, устойчивый и готовый к следующей тысяче пользователей.',
    },
    features: {
      en: [
        'Domain & Server excluded',
        'Everything in Signal',
        'Full-stack development',
        'Database architecture',
        'API integration',
        'Admin dashboard',
        'User authentication',
        '3 months technical support',
        'Advanced analytics',
        'Performance monitoring',
      ],
      ru: [
        'Домен и сервер не включены',
        'Всё из пакета Signal',
        'Full-stack разработка',
        'Архитектура базы данных',
        'Интеграция API',
        'Админ-панель',
        'Аутентификация пользователей',
        '3 месяца техподдержки',
        'Расширенная аналитика',
        'Мониторинг производительности',
      ],
    },
    cta: { en: 'Build Your Core', ru: 'Создать ядро' },
    featured: true,
    color: 'orange',
  },
  {
    name: { en: 'Orbit', ru: 'Орбита' },
    code: { en: 'TIER / 03', ru: 'УРОВЕНЬ / 03' },
    pricePrefix: { en: 'Up to ', ru: 'До ' },
    price: '$859',
    period: { en: 'Project', ru: 'Проект' },
    description: {
      en: 'A hosting environment that keeps your site in motion, protected and available wherever your audience lands.',
      ru: 'Среда хостинга, которая держит сайт в движении, защищённом и доступном везде, где находится аудитория.',
    },
    features: {
      en: [
        'Domain & Server excluded',
        'Everything in Core',
        'Enterprise hosting setup',
        'Global CDN deployment',
        'DDoS protection',
        '24/7 monitoring',
        '6 months dedicated support',
        'Scalability planning',
        'Security audits',
        'Custom infrastructure',
        'Training & handoff',
      ],
      ru: [
        'Домен и сервер не включены',
        'Всё из пакета Core',
        'Корпоративный хостинг',
        'Глобальное CDN-развёртывание',
        'Защита от DDoS',
        'Мониторинг 24/7',
        '6 месяцев приоритетной поддержки',
        'План масштабирования',
        'Аудит безопасности',
        'Кастомная инфраструктура',
        'Обучение и передача',
      ],
    },
    cta: { en: 'Reach Orbit', ru: 'Выйти на орбиту' },
    featured: false,
    color: 'purple',
  },
];

const addons = [
  {
    name: { en: 'Additional Revision Round', ru: 'Дополнительный раунд правок' },
    price: '$49',
    description: { en: 'Extra design or code review cycle', ru: 'Дополнительный цикл проверки дизайна или кода' },
  },
  {
    name: { en: 'Extended Support (1 Month)', ru: 'Расширенная поддержка (1 месяц)' },
    price: '$99',
    description: { en: 'Post-launch maintenance & minor fixes', ru: 'Обслуживание после запуска и мелкие правки' },
  },
  {
    name: { en: 'Performance & Speed Audit', ru: 'Аудит производительности и скорости' },
    price: '$149',
    description: { en: 'Full Core Web Vitals & SEO analysis', ru: 'Полный анализ Core Web Vitals и SEO' },
  },
  {
    name: { en: 'Security Hardening & SSL Setup', ru: 'Усиление безопасности и настройка SSL' },
    price: '$199',
    description: { en: 'Vulnerability audit & security header configuration', ru: 'Аудит уязвимостей и настройка заголовков безопасности' },
  },
  {
    name: { en: 'Custom Feature Development', ru: 'Кастомная разработка функций' },
    price: '$45/hour',
    description: { en: 'Additional custom feature requests', ru: 'Разработка дополнительных функций по запросу' },
  },
  {
    name: { en: 'Team Training & Handover Call', ru: 'Обучение команды и передаточный звонок' },
    price: '$129',
    description: { en: '1-on-1 walkthrough & administration docs', ru: 'Индивидуальный разбор и документация по администрированию' },
  },
];

export default function Pricing() {
  const { language } = useLanguage();
  const t = {
    en: {
      hero: 'Pricing & Plans',
      title: 'Invest in Your',
      accent: 'Digital Orbit.',
      subtitle: 'From early-stage signal to enterprise orbit. Transparent pricing, no hidden fees. Custom packages available for unique requirements.',
      mostPopular: 'Most Popular',
      boost: 'Boost Your Orbit',
      extras: 'Add-ons & Extras.',
      faq: 'Common Questions',
      faqTitle: 'Pricing FAQ.',
      cta: 'Schedule Consultation',
      footer: '© Tonrax... All systems operational.',
      questions: [
        { q: 'Do you offer custom pricing?', a: 'Yes. These are our standard offerings. For enterprise projects or unique requirements, we build custom proposals. Contact us with your scope.' },
        { q: 'What\'s included in support?', a: 'Included support covers deployment, training, and bug fixes. Extended support adds ongoing maintenance, monitoring, and feature requests.' },
        { q: 'Can I upgrade mid-project?', a: 'Absolutely. If you start with Signal and want to add Core features, we adjust the scope and timeline accordingly.' },
        { q: 'Do you offer retainers?', a: 'Yes. For post-launch maintenance, ongoing feature development, or managed hosting, we offer monthly retainer agreements.' },
        { q: 'What payment terms do you offer?', a: 'Typically 50% upfront to kick off, 50% on delivery. Custom payment plans available for larger projects.' },
        { q: 'How long does each tier take?', a: 'Signal: 4-6 weeks. Core: 8-12 weeks. Orbit: 12-16 weeks. Timelines scale with complexity and revisions.' },
      ],
    },
    ru: {
      hero: 'Цены и тарифы',
      title: 'Инвестируйте в свою',
      accent: 'цифровую орбиту.',
      subtitle: 'От раннего сигнала до корпоративной орбиты. Прозрачные цены, без скрытых комиссий. Существуют кастомные пакеты под уникальные задачи.',
      mostPopular: 'Самый популярный',
      boost: 'Ускорьте свою орбиту',
      extras: 'Дополнения и опции.',
      faq: 'Частые вопросы',
      faqTitle: 'Вопросы о ценах.',
      cta: 'Запланировать консультацию',
      footer: '© Tonrax... Все системы в рабочем состоянии.',
      questions: [
        { q: 'Вы предлагаете кастомные цены?', a: 'Да. Это наши стандартные пакеты. Для крупных проектов и уникальных задач мы готовим индивидуальные предложения.' },
        { q: 'Что входит в поддержку?', a: 'Поддержка включает развёртывание, обучение, исправление ошибок. Расширенная поддержка добавляет регулярное обслуживание, мониторинг и запросы на новые функции.' },
        { q: 'Можно ли увеличить объём проекта по ходу?', a: 'Да. Если вы начинаете с пакета Signal и хотите добавить возможности Core, мы подстроим масштаб и сроки.' },
        { q: 'Вы предлагаете абонентское обслуживание?', a: 'Да. Для поддержки после запуска, развития функций и управляемого хостинга доступны ежемесячные ретейнеры.' },
        { q: 'Какие условия оплаты?', a: 'Обычно 50% upfront для запуска и 50% при сдаче. Для больших проектов доступны индивидуальные схемы.' },
        { q: 'Сколько времени занимает каждый уровень?', a: 'Signal: 4–6 недель. Core: 8–12 недель. Orbit: 12–16 недель. Сроки зависят от сложности и правок.' },
      ],
    },
  };

  const current = t[language];

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      <Starfield />
      <CursorDot />
      <Navigation />

      <main className="relative z-10 pt-20">
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-20 md:py-48">
  <FadeIn>
    <div className="mb-6 font-mono text-sm tracking-[0.3em] text-orange-400 uppercase">
      {current.hero}
    </div>
    <h1 className="max-w-5xl text-6xl font-bold leading-[0.88] tracking-tighter md:text-9xl">
      {current.title}<br />
      <span className="bg-gradient-to-r from-white via-gray-300 to-gray-600 bg-clip-text text-transparent">
        {current.accent}
      </span>
    </h1>
    <p className="mt-10 max-w-2xl font-serif text-xl leading-relaxed text-gray-400 md:text-2xl">
      {current.subtitle}
    </p>
  </FadeIn>
</section>

        <section className="mx-auto max-w-7xl px-6 py-32 md:px-20">
          <div className="grid items-center gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <motion.div whileHover={{ y: plan.featured ? -8 : 0 }} className={`group relative overflow-hidden border transition-all duration-300 ${plan.featured ? 'border-orange-500/50 bg-black/80 shadow-[0_0_50px_rgba(255,150,0,0.2)] md:scale-105' : 'border-white/10 bg-black/40 hover:border-white/20'} p-8 md:p-10`}>
                  <div className={`absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-50 ${plan.color === 'orange' ? 'bg-orange-500' : plan.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                  <div className="relative z-10">
                    {plan.featured && (
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/50 bg-orange-400/10 px-3 py-1">
                        <Zap className="h-3 w-3 text-orange-400" />
                        <span className="font-mono text-xs tracking-widest text-orange-200 uppercase">{current.mostPopular}</span>
                      </div>
                    )}

                    <div className="mb-4 font-mono text-xs tracking-[0.25em] text-gray-500 uppercase">{plan.code[language]}</div>
                    <h3 className="mb-2 text-4xl font-bold">{plan.name[language]}</h3>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        {plan.pricePrefix[language] && (
                          <span className="mr-1 text-xl font-medium text-gray-400">{plan.pricePrefix[language]}</span>
                        )}
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="ml-1 font-mono text-xs tracking-widest text-gray-500 uppercase">{plan.period[language]}</span>
                      </div>
                    </div>
                    <p className="mb-8 min-h-[60px] font-serif text-sm leading-relaxed text-gray-400">{plan.description[language]}</p>
                    <Link href="/contact#contact-form" className={`mb-8 block w-full border px-4 py-4 text-center font-mono text-sm tracking-widest uppercase transition-all duration-300 ${plan.featured ? 'border-orange-500 bg-orange-600 text-white hover:bg-orange-700' : 'border-white/20 bg-white/5 text-white hover:bg-white/10'}`}>
                      <span className="flex items-center justify-center gap-2">{plan.cta[language]} <ArrowRight className="h-4 w-4" /></span>
                    </Link>
                    <div className="space-y-4">
                      {plan.features[language].map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className={`mt-1 h-4 w-4 flex-shrink-0 ${plan.featured ? 'text-orange-400' : 'text-blue-400'}`} />
                          <span className={`font-serif text-sm ${idx === 0 ? 'font-semibold text-orange-400' : 'text-gray-300'}`}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="border-t border-white/5 bg-black/50 py-32 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 md:px-20">
            <FadeIn>
              <div className="mb-16 font-mono text-sm tracking-widest text-orange-400 uppercase">{current.boost}</div>
              <h2 className="mb-16 text-5xl font-bold tracking-tight md:text-7xl">{current.extras}</h2>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {addons.map((addon, i) => (
                <FadeIn key={i} delay={0.05 * i}>
                  <div className="group cursor-default border border-white/10 bg-black/40 p-6 transition-colors hover:bg-white/[0.05]">
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="text-lg font-bold transition-colors group-hover:text-orange-400">{addon.name[language]}</h3>
                      <span className="font-mono text-sm font-bold text-orange-400">{addon.price}</span>
                    </div>
                    <p className="font-serif text-sm text-gray-400">{addon.description[language]}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-32 md:px-20 md:py-48">
          <FadeIn>
            <div className="mb-16 font-mono text-sm tracking-widest text-orange-400 uppercase">{current.faq}</div>
            <h2 className="mb-16 text-5xl font-bold tracking-tight md:text-7xl">{current.faqTitle}</h2>
          </FadeIn>
          <div className="grid max-w-4xl gap-12 md:grid-cols-2">
            {current.questions.map((item, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div className="border-l-2 border-orange-400/30 pl-6">
                  <h3 className="mb-3 text-xl font-bold">{item.q}</h3>
                  <p className="font-serif leading-relaxed text-gray-400">{item.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="relative flex min-h-[60vh] items-center px-6 py-32 md:px-20 md:py-48">
          <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
            <FadeIn>
              <div className="mb-6 flex justify-center">
                <Rocket className="h-8 w-8 text-orange-400" />
              </div>
              <h2 className="mb-8 text-5xl font-bold tracking-tight text-orange-200 md:text-8xl">
                {language === 'ru' ? 'Готовы к запуску?' : 'Ready to Launch?'}
              </h2>
              <p className="mx-auto mb-12 max-w-2xl font-serif text-xl text-gray-400">
                {language === 'ru'
                  ? 'Давайте обсудим, какой тариф подходит вашему проекту. Наша команда отвечает в течение 24 часов.'
                  : "Let's discuss which tier fits your mission. Our team responds within 24 hours."}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 font-mono text-sm tracking-widest uppercase transition-colors duration-300 hover:bg-orange-300 hover:text-black"
              >
                {current.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}

