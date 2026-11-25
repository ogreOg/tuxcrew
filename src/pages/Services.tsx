import { ArrowRight, Check, Code2, Globe2, LockKeyhole, Rocket, Server, Sparkles, Wrench } from 'lucide-react';

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
      ru: 'Уникальный цифровой опыт, созданный под вашу марку, аудиторию и целевое действие посетителя.',
    },
    features: {
      en: ['Brand direction & visual systems', 'Wireframes and UX flows', 'Responsive UI design', 'Interactive prototypes'],
      ru: ['Направление бренда и визуальные системы', 'Wireframes и пользовательские сценарии', 'Адаптивный UI-дизайн', 'Интерактивные прототипы'],
    },
  },
  {
    number: 'SERVICE / 02',
    icon: <Code2 className="h-8 w-8" />,
    title: { en: 'Web Development', ru: 'Веб-разработка' },
    description: {
      en: 'Fast, accessible websites and applications built with modern technology and a foundation that can grow with your business.',
      ru: 'Быстрые и доступные сайты и приложения на современной технологии, которые растут вместе с вашим бизнесом.',
    },
    features: {
      en: ['React and TypeScript development', 'CMS and API integrations', 'Accessible, responsive builds', 'Testing and quality assurance'],
      ru: ['Разработка на React и TypeScript', 'Интеграции с CMS и API', 'Доступные адаптивные сборки', 'Тестирование и контроль качества'],
    },
  },
  {
    number: 'SERVICE / 03',
    icon: <Server className="h-8 w-8" />,
    title: { en: 'Managed Hosting', ru: 'Управляемый хостинг' },
    description: {
      en: 'Reliable infrastructure that keeps your website available, secure, and quick wherever your audience is connecting from.',
      ru: 'Надёжная инфраструктура, которая держит ваш сайт доступным, безопасным и быстрым в любой точке мира.',
    },
    features: {
      en: ['Global edge delivery', 'SSL and security configuration', 'Backups and uptime monitoring', 'Deployment and scaling support'],
      ru: ['Глобальная edge-доставка', 'SSL и настройка безопасности', 'Резервные копии и мониторинг uptime', 'Поддержка запуска и масштабирования'],
    },
  },
  {
    number: 'SERVICE / 04',
    icon: <Wrench className="h-8 w-8" />,
    title: { en: 'Growth & Support', ru: 'Рост и поддержка' },
    description: {
      en: 'A long-term technical partner for improvements, maintenance, and the next stage of your digital journey.',
      ru: 'Долгосрочный технический партнёр для улучшений, поддержки и следующего этапа вашего цифрового пути.',
    },
    features: {
      en: ['Ongoing maintenance', 'Performance improvements', 'Feature development', 'Technical guidance'],
      ru: ['Постоянное обслуживание', 'Улучшения производительности', 'Развитие функций', 'Техническое сопровождение'],
    },
  },
];

const process = [
  { step: '01', title: { en: 'Discover', ru: 'Изучение' }, text: { en: 'We learn about your goals, audience, competitors, and the opportunity in front of you.', ru: 'Мы изучаем ваши цели, аудиторию, конкурентов и возможности, которые у вас перед глазами.' } },
  { step: '02', title: { en: 'Shape', ru: 'Формирование' }, text: { en: 'We turn the strategy into a clear structure, visual direction, and focused user experience.', ru: 'Преобразуем стратегию в понятную структуру, визуальное направление и целевой пользовательский опыт.' } },
  { step: '03', title: { en: 'Build', ru: 'Разработка' }, text: { en: 'We engineer the experience with clean code, thoughtful motion, and performance in mind.', ru: 'Инженерим опыт на чистом коде, с продуманной анимацией и вниманием к производительности.' } },
  { step: '04', title: { en: 'Launch', ru: 'Запуск' }, text: { en: 'We test, deploy, and stay close after launch so your new digital presence keeps moving forward.', ru: 'Проводим тестирование, запуск и остаёмся рядом после релиза, чтобы ваша цифровая среда продолжала развиваться.' } },
];

const expertise = [
  { icon: <Globe2 className="h-6 w-6" />, label: { en: 'React & Next.js', ru: 'React & Next.js' }, desc: { en: 'Modern frontend frameworks', ru: 'Современные frontend-фреймворки' } },
  { icon: <Code2 className="h-6 w-6" />, label: { en: 'TypeScript', ru: 'TypeScript' }, desc: { en: 'Type-safe development', ru: 'Типобезопасная разработка' } },
  { icon: <Server className="h-6 w-6" />, label: { en: 'Node.js Backend', ru: 'Node.js Backend' }, desc: { en: 'Scalable server solutions', ru: 'Масштабируемые серверные решения' } },
  { icon: <LockKeyhole className="h-6 w-6" />, label: { en: 'Security', ru: 'Безопасность' }, desc: { en: 'Enterprise-grade protection', ru: 'Защита уровня enterprise' } },
];

export default function Services() {
  const { language } = useLanguage();
  const copy =
    language === 'ru'
      ? {
          eyebrow: 'Что мы делаем / Услуги',
          title1: 'Создаём следующий',
          title2: 'этап вашего развития.',
          subtitle: 'Tonrax объединяет стратегию, дизайн, разработку и инфраструктуру, чтобы создавать цифровой опыт с реальным импульсом роста.',
          capabilities: '01 / Основные возможности',
          tech: '02 / Технический стек',
          built: 'Создано на',
          modern: 'современных инструментах.',
          techText: 'Мы используем самые надёжные и масштабируемые технологии. Каждый инструмент выбирается под пользователей, а не под личные предпочтения.',
          process: '03 / Наш процесс',
          path: 'Прозрачный путь',
          toLaunch: 'к запуску.',
          processText: 'Никаких чёрных ящиков и лишних слоёв. Только чёткий процесс, который превращает хорошую идею в надёжный продукт.',
          why: '04 / Почему Tonrax',
          ready: 'Готовы к запуску?',
          readyText: 'Давайте обсудим, какие услуги подходят вашему видению. Запланируйте консультацию, и мы поможем определить путь к успеху.',
          cta: 'Запланировать консультацию',
        }
      : {
          eyebrow: 'What we do / Services',
          title1: 'Build the next',
          title2: 'version of you.',
          subtitle: 'Tonrax brings strategy, design, engineering, and infrastructure together to create digital experiences with real momentum.',
          capabilities: '01 / Core Capabilities',
          tech: '02 / Technical Stack',
          built: 'Built with',
          modern: 'modern tools.',
          techText: 'We use the most reliable, scalable technologies available. Every tool is chosen to serve your users, not our preferences.',
          process: '03 / Our Process',
          path: 'A clear path',
          toLaunch: 'to launch.',
          processText: 'No black boxes. No unnecessary layers. Just a focused process that turns a good idea into a dependable digital experience.',
          why: '04 / Why Tonrax',
          ready: 'Ready to launch your mission?',
          cta: 'Schedule Consultation',
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
            <h1 className="max-w-5xl text-6xl font-bold leading-[0.88] tracking-tighter md:text-9xl">
              {copy.title1}<br />
              <span className="bg-gradient-to-r from-white via-gray-300 to-gray-600 bg-clip-text text-transparent">{copy.title2}</span>
            </h1>
            <p className="mt-10 max-w-2xl font-serif text-xl leading-relaxed text-gray-400 md:text-2xl">{copy.subtitle}</p>
          </FadeIn>
        </section>

        <section className="border-t border-white/5 bg-black/50 py-32 backdrop-blur-md md:py-40">
          <div className="mx-auto max-w-7xl px-6 md:px-20">
            <FadeIn>
              <div className="mb-16 font-mono text-sm tracking-widest text-orange-400 uppercase">{copy.capabilities}</div>
            </FadeIn>
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
              {services.map((service, index) => (
                <FadeIn key={service.title[language]} delay={index * 0.08}>
                  <article className="group relative h-full overflow-hidden bg-black/80 p-8 transition-colors hover:bg-white/[0.04] md:p-10">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-500/10 blur-3xl transition-all duration-700 group-hover:bg-blue-400/20" />
                    <div className="relative z-10">
                      <div className="mb-10 flex items-center justify-between">
                        <span className="font-mono text-xs tracking-[0.25em] text-gray-500">{service.number}</span>
                        <div className="text-orange-400 transition-transform duration-300 group-hover:rotate-12">{service.icon}</div>
                      </div>
                      <h2 className="mb-5 text-3xl font-bold md:text-4xl">{service.title[language]}</h2>
                      <p className="mb-8 max-w-lg font-serif text-lg leading-relaxed text-gray-400">{service.description[language]}</p>
                      <ul className="space-y-3 font-mono text-[10px] tracking-[0.14em] text-gray-500 uppercase">
                        {service.features[language].map((feature) => (
                          <li key={feature} className="flex items-center gap-3">
                            <Check className="h-3.5 w-3.5 text-orange-300" />{feature}
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

        <section className="mx-auto max-w-7xl px-6 py-32 md:px-20 md:py-48">
          <FadeIn>
            <div className="mb-16 font-mono text-sm tracking-widest text-orange-400 uppercase">{copy.tech}</div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <FadeIn delay={0.1}>
              <div>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
                  {copy.built}<br />{copy.modern}
                </h2>
                <p className="font-serif text-xl text-gray-400 leading-relaxed mb-8">{copy.techText}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-6">
                {expertise.map((item, i) => (
                  <div key={i} className="border border-white/10 p-6 hover:bg-white/[0.03] transition-colors group cursor-default">
                    <div className="text-orange-400 mb-4 group-hover:text-white transition-colors">{item.icon}</div>
                    <h3 className="font-bold mb-2">{item.label[language]}</h3>
                    <p className="font-serif text-sm text-gray-500">{item.desc[language]}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="border-t border-white/5 bg-black/50 py-32 backdrop-blur-md md:py-40">
          <div className="mx-auto max-w-7xl px-6 md:px-20">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
              <FadeIn>
                <div>
                  <div className="mb-8 font-mono text-sm tracking-widest text-orange-400 uppercase">{copy.process}</div>
                  <h2 className="text-5xl font-bold tracking-tight md:text-7xl">{copy.path}<br />{copy.toLaunch}</h2>
                  <p className="mt-8 max-w-md font-serif text-xl leading-relaxed text-gray-400">{copy.processText}</p>
                </div>
              </FadeIn>
              <div className="space-y-0 border-l border-white/10">
                {process.map((item, index) => (
                  <FadeIn key={item.step} delay={index * 0.1}>
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

        <section className="mx-auto max-w-7xl px-6 py-32 md:px-20 md:py-48">
          <FadeIn>
            <div className="mb-16 font-mono text-sm tracking-widest text-orange-400 uppercase">{copy.why}</div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: { en: 'High-Performance', ru: 'Высокая производительность' }, text: { en: 'Every line of code is optimized. Your site will be fast, resilient, and ready to scale.', ru: 'Каждая строка кода оптимизирована. Ваш сайт будет быстрым, надёжным и готовым к масштабированию.' } },
              { title: { en: 'Fully Responsive', ru: 'Полная адаптивность' }, text: { en: 'Pixel-perfect on every device. We test thoroughly across browsers and screen sizes.', ru: 'Идеально на любом устройстве. Мы тщательно проверяем работу в браузерах и на разных размерах экрана.' } },
              { title: { en: 'Security First', ru: 'Безопасность прежде всего' }, text: { en: 'Enterprise-grade protection built in. DDoS mitigation, SSL, and regular audits included.', ru: 'Встроена защита уровня enterprise: DDoS, SSL и регулярные аудиты.' } },
              { title: { en: 'SEO Optimized', ru: 'SEO-оптимизация' }, text: { en: 'Structured for search engines. Great performance, clean markup, and proper metadata.', ru: 'Оптимизировано под поисковые системы: хорошая производительность, чистая разметка и корректные метаданные.' } },
              { title: { en: 'Accessible Design', ru: 'Доступный дизайн' }, text: { en: 'WCAG compliant interfaces. Everyone can use your site, regardless of ability.', ru: 'Интерфейсы соответствуют WCAG. Каждый сможет пользоваться сайтом независимо от способностей.' } },
              { title: { en: 'Long-term Support', ru: 'Долгосрочная поддержка' }, text: { en: 'We don\'t disappear after launch. Ongoing maintenance and improvements available.', ru: 'Мы не исчезаем после запуска. Доступно постоянное обслуживание и улучшения.' } },
            ].map((item, i) => (
              <FadeIn key={i} delay={0.05 * i}>
                <div className="border border-white/10 p-8 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                  <h3 className="text-2xl font-bold mb-4 text-orange-200">{item.title[language]}</h3>
                  <p className="font-serif text-gray-400 leading-relaxed">{item.text[language]}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="border-t border-white/5 bg-black/50 py-32 backdrop-blur-md md:py-40">
        <div className="mx-auto max-w-7xl px-6 md:px-20 text-center">
          <FadeIn>
      <div className="mb-6 flex justify-center">
        <Rocket className="h-8 w-8 text-orange-400" />
      </div>
      <h2 className="text-5xl font-bold tracking-tight text-orange-200 md:text-8xl mb-8">
        {copy.ready}
      </h2>
      <p className="mx-auto max-w-2xl font-serif text-xl leading-relaxed text-gray-400 mb-12">
        {copy.readyText}
      </p>

      {/* Copy of the CTA Button from Pricing Page */}
      <a
        href="/contact"
        className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 rounded-full text-sm font-mono uppercase tracking-widest hover:bg-orange-300 hover:text-black transition-colors duration-300"
      >
        {copy.cta} <ArrowRight className="w-4 h-4" />
      </a>
    </FadeIn>
  </div>
</section>


      </main>
    </div>
  );
}
