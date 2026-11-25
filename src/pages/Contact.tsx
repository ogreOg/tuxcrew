import { ArrowRight, Mail, MapPin, Phone, Rocket } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { language } = useLanguage();
  const [submissionState, setSubmissionState] = useState<'sending' | 'success' | 'validation' | 'rate-limit' | 'failure' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '',
  });

  useEffect(() => {
    if (window.location.hash === '#contact-form') {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const copy =
    language === 'ru'
      ? {
          eyebrow: 'Связаться / Контакты',
          title1: 'Установить',
          title2: 'контакт.',
          subtitle: 'Готовы вывести своё цифровое присутствие на новый уровень? Давайте обсудим вашу идею. Наша инженерная команда ответит в течение 24 часов.',
          reach: '01 / Как с нами связаться',
          email: 'Почта',
          phone: 'Телефон',
          remote: 'Удалённо',
          global: 'Глобальная команда',
          formTitle: '02 / Отправьте сообщение',
          formHeading: 'Передайте свой сигнал.',
          name: 'Полное имя',
          emailLabel: 'Электронная почта',
          phoneLabel: 'Номер телефона (необязательно)',
          subject: 'Тема',
          message: 'Сообщение',
          submit: 'Передать сигнал',
          sending: 'Отправка...',
          faq: '03 / Частые вопросы',
          faqHeading: 'Вопросы и ответы.',
          footer: '© Tonrax... Все системы в рабочем состоянии.',
          success: 'Сообщение надёжно сохранено. Мы свяжемся с вами после обработки.',
          validationError: 'Проверьте введённые данные и попробуйте ещё раз.',
          rateLimitError: 'Слишком много попыток. Пожалуйста, подождите и повторите попытку.',
          submissionError: 'Не удалось отправить сообщение. Попробуйте позже или напишите нам на hello@tonrax.com.',
          ready: 'Готовы к запуск��?',
          readyText: 'Независимо от того, запускаете ли вы новый проект или улучшаете существующий, мы здесь, чтобы помочь вам достичь орбиты.',
        }
      : {
          eyebrow: 'Get in Touch / Contact',
          title1: 'Establish',
          title2: 'Contact.',
          subtitle: 'Ready to elevate your digital presence to orbital heights? Let\'s discuss your vision. Our engineering team will respond within 24 hours.',
          reach: '01 / Ways to Reach Us',
          email: 'Email',
          phone: 'Phone',
          remote: 'Remote',
          global: 'Global Team',
          formTitle: '02 / Send Your Message',
          formHeading: 'Transmit Your Signal.',
          name: 'Full Name',
          emailLabel: 'Email Address',
          phoneLabel: 'Phone Number (Optional)',
          subject: 'Subject',
          message: 'Message',
          submit: 'Transmit Signal',
          sending: 'Sending...',
          faq: '03 / Common Questions',
          faqHeading: 'Contact FAQ.',
          success: 'Your message is safely saved. We\'ll be in touch after it is processed.',
          validationError: 'Please check your details and try again.',
          rateLimitError: 'Too many attempts. Please wait a while and try again.',
          submissionError: 'We could not send your message. Please try again later or email hello@tonrax.com.',
          ready: 'Ready to launch?',
          readyText: 'Whether you\'re starting a new project or looking to improve an existing one, we\'re here to help you reach orbit.',
        };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submissionState !== 'sending') setSubmissionState(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submissionState === 'sending') return;

    setSubmissionState('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 429) {
        setSubmissionState('rate-limit');
        return;
      }
      if (response.status === 400 || response.status === 413 || response.status === 415) {
        setSubmissionState('validation');
        return;
      }
      if (response.status !== 202) {
        setSubmissionState('failure');
        return;
      }

      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || !('status' in result) || result.status !== 'queued') {
        setSubmissionState('failure');
        return;
      }

      setSubmissionState('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
    } catch {
      setSubmissionState('failure');
    }
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
              <div className="mb-16 font-mono text-sm tracking-widest text-orange-400 uppercase">{copy.reach}</div>
            </FadeIn>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: <Mail className="h-8 w-8" />, title: copy.email, value: 'hello@tonrax.com', desc: language === 'ru' ? 'Отправьте нам ваш запрос, и мы быстро ответим.' : 'Send us your inquiry and we\'ll get back to you promptly.' },
                { icon: <Phone className="h-8 w-8" />, title: copy.phone, value: '+7 (988) 532-1121', desc: language === 'ru' ? 'Доступно по понедельникам-пятницам с 9:00 до 18:00 EST.' : 'Available Monday-Friday, 8 AM - 2 PM EST.' },
                { icon: <MapPin className="h-8 w-8" />, title: copy.remote, value: copy.global, desc: language === 'ru' ? 'Мы распределены по всему миру. Давайте синхронизируемся, когда это удобно для вас.' : 'We\'re distributed worldwide. Let\'s sync when it works for you.' },
              ].map((contact, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="group relative overflow-hidden border border-white/10 bg-black/80 p-8 transition-colors hover:bg-white/[0.04] md:p-10">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-500/10 blur-3xl transition-all duration-700 group-hover:bg-blue-400/20" />
                    <div className="relative z-10">
                      <div className="mb-6 text-orange-400 transition-transform duration-300 group-hover:scale-110">{contact.icon}</div>
                      <h3 className="mb-2 text-2xl font-bold">{contact.title}</h3>
                      <p className="mb-4 font-mono text-sm tracking-widest text-orange-300">{contact.value}</p>
                      <p className="font-serif text-gray-400 leading-relaxed">{contact.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="contact-form" className="mx-auto max-w-4xl px-6 py-32 md:px-20 md:py-48">
          <FadeIn>
            <div className="mb-16">
              <div className="mb-6 font-mono text-sm tracking-widest text-orange-400 uppercase">{copy.formTitle}</div>
              <h2 className="text-5xl font-bold tracking-tight md:text-7xl">{copy.formHeading}</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-8 border border-white/10 bg-black/40 p-8 backdrop-blur-md md:p-12">
              {submissionState && submissionState !== 'sending' && (
                <div aria-live="polite" role={submissionState === 'success' ? 'status' : 'alert'} className={`mb-8 flex items-center gap-4 rounded border p-4 ${submissionState === 'success' ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-orange-400/50 bg-orange-400/10'}`}>
                  <div className={`h-3 w-3 flex-shrink-0 rounded-full ${submissionState === 'success' ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                  <p className={`font-mono text-sm tracking-widest uppercase ${submissionState === 'success' ? 'text-emerald-300' : 'text-orange-200'}`}>
                    {submissionState === 'success' ? copy.success : submissionState === 'validation' ? copy.validationError : submissionState === 'rate-limit' ? copy.rateLimitError : copy.submissionError}
                  </p>
                </div>
              )}

              <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-mono text-xs tracking-widest text-gray-400 uppercase">{copy.name}</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={submissionState === 'sending'} className="w-full border border-white/10 bg-white/5 px-4 py-3 font-sans text-white outline-none transition-colors focus:border-blue-500" placeholder={language === 'ru' ? 'Ваше имя' : 'Your name'} />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-xs tracking-widest text-gray-400 uppercase">{copy.emailLabel}</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={submissionState === 'sending'} className="w-full border border-white/10 bg-white/5 px-4 py-3 font-sans text-white outline-none transition-colors focus:border-blue-500" placeholder="your@email.com" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-mono text-xs tracking-widest text-gray-400 uppercase">{copy.phoneLabel}</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={submissionState === 'sending'} className="w-full border border-white/10 bg-white/5 px-4 py-3 font-sans text-white outline-none transition-colors focus:border-blue-500" placeholder={language === 'ru' ? '+1 (555) 123-4567' : '+1 (555) 123-4567'} />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-xs tracking-widest text-gray-400 uppercase">{copy.subject}</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} required disabled={submissionState === 'sending'} className="w-full border border-white/10 bg-white/5 px-4 py-3 font-sans text-white outline-none transition-colors focus:border-blue-500" placeholder={language === 'ru' ? 'Запрос по проекту' : 'Project inquiry'} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs tracking-widest text-gray-400 uppercase">{copy.message}</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={6} disabled={submissionState === 'sending'} className="w-full resize-none border border-white/10 bg-white/5 px-4 py-3 font-sans text-white outline-none transition-colors focus:border-blue-500" placeholder={language === 'ru' ? 'Расскажите о проекте, сроках и целях...' : 'Tell us about your project, timeline, and goals...'} />
              </div>

              <button type="submit" disabled={submissionState === 'sending'} className="group relative w-full overflow-hidden border border-white bg-white px-6 py-4 font-mono text-sm tracking-widest text-black transition-all duration-300 hover:text-white disabled:cursor-wait disabled:opacity-70">
                <span className="relative z-10 flex items-center justify-center gap-2">{submissionState === 'sending' ? copy.sending : copy.submit} {submissionState !== 'sending' && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}</span>
                <div className="absolute inset-0 bg-orange-600 translate-y-[100%] transition-transform duration-300 group-hover:translate-y-0" />
              </button>
            </form>
          </FadeIn>
        </section>

        <section className="border-t border-white/5 bg-black/50 py-32 backdrop-blur-md md:py-40">
          <div className="mx-auto max-w-4xl px-6 md:px-20">
            <FadeIn>
              <div className="mb-16 font-mono text-sm tracking-widest text-orange-400 uppercase">{copy.faq}</div>
              <h2 className="text-5xl font-bold tracking-tight md:text-7xl mb-16">{copy.faqHeading}</h2>
            </FadeIn>

            <div className="space-y-8">
              {[
                { q: language === 'ru' ? 'Как быстро вы отвечаете?' : 'How quickly will you respond?', a: language === 'ru' ? 'Обычно мы отвечаем на все запросы в течение 24 часов. Для срочных вопросов укажите это в сообщении, и мы дадим приоритет.' : 'We typically respond to all inquiries within 24 hours. For urgent matters, mention it in your message and we\'ll prioritize accordingly.' },
                { q: language === 'ru' ? 'Вы предлагаете бесплатные консультации?' : 'Do you offer free consultations?', a: language === 'ru' ? 'Да. Мы проводим бесплатную первичную консультацию, чтобы обсудить проект, цели и понять, подходим ли мы друг другу.' : 'Yes. We offer a free initial consultation to discuss your project, goals, and see if we\'re a good fit for your needs.' },
                { q: language === 'ru' ? 'Какие данные лучше указать?' : 'What information should I include?', a: language === 'ru' ? 'Поделитесь сведениями о масштабе проекта, сроках, бюджете (если есть), а также задачах и целях.' : 'Share details about your project scope, timeline, budget (if available), and any specific challenges or goals you\'re facing.' },
                { q: language === 'ru' ? 'Мы можем встретиться лично?' : 'Can we meet in person?', a: language === 'ru' ? 'Мы работает удалённо по всему миру. Все встречи проводим онлайн, но можем учитывать ваш часовой пояс.' : 'We\'re a remote-first team distributed globally. We conduct all meetings via video call, but we can work around your timezone.' },
                { q: language === 'ru' ? 'Вы подписываете NDA?' : 'Do you sign NDAs?', a: language === 'ru' ? 'Конечно. Мы готовы подписывать NDA и соглашения о конфиденциальности.' : 'Absolutely. We\'re comfortable signing NDAs and confidentiality agreements to protect your project details.' },
                { q: language === 'ru' ? 'Что, если у меня короткий вопрос?' : 'What if I just have a quick question?', a: language === 'ru' ? 'Можете написать нам на почту. Если вопрос требует более глубокой дискуссии, мы назначим звонок.' : 'Feel free to reach out via email with your question. If it requires a deeper discussion, we\'ll schedule a call.' },
              ].map((item, i) => (
                <FadeIn key={i} delay={0.05 * i}>
                  <div className="border-l-2 border-orange-400/30 pl-6">
                    <h3 className="mb-3 text-xl font-bold">{item.q}</h3>
                    <p className="font-serif leading-relaxed text-gray-400">{item.a}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>


      </main>
    </div>
  );
}

