import { ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react';
import { Link } from 'wouter';
import { ChangeEvent, FormEvent, useState } from 'react';

import { CursorDot } from '@/components/CursorDot';
import { useLanguage } from '@/context/LanguageContext';
import { Starfield } from '@/components/Starfield';

const roles = ['Frontend engineer', 'Backend engineer', 'Platform engineer'];
const MAX_UPLOAD_FILES = 3;
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set(['pdf', 'doc', 'docx', 'zip']);

export default function Applicant() {
  const { language, toggleLanguage } = useLanguage();
  const [uploadError, setUploadError] = useState('');
  const [submissionState, setSubmissionState] = useState<'sending' | 'success' | 'validation' | 'rate-limit' | 'failure' | null>(null);

  const copy =
    language === 'ru'
      ? {
          title: 'Выберите свою следующую орбиту.',
          subtitle: 'Расскажите, что вы строите, как думаете и где ваши сильные стороны. Мы работаем удалённо, асинхронно, и с большим вниманием к деталям.',
          remote: 'Удалённая команда / набор открыт',
          points: ['Глобальная удалённая команда', 'Асинхронный формат по умолчанию', 'Глубокая работа защищена'],
          formTitle: 'Анкета соискателя',
          formHeading: 'Отправьте свой сигнал.',
          fullName: 'Полное имя',
          email: 'Электронная почта',
          role: 'Роль / орбита',
          select: 'Выберите позицию',
          portfolio: 'Портфолио / ссылка на сигнал',
          message: 'Краткое сообщение',
          upload: 'Загрузите до 3 файлов',
          uploadHint: 'PDF, DOC, DOCX или ZIP · до 10 МБ каждый',
          pending: 'Анкета и файлы будут сохранены для обработки.',
          submit: 'Отправить заявку',
          sending: 'Отправка...',
          successEyebrow: 'Заявка отправлена',
          return: 'Вернуться на орбиту',
          successTitle: 'Ваши координаты готовы.',
          successText: 'Ваша заявка и файлы надёжно сохранены. Мы свяжемся с вами после обработки.',
          backHome: 'Вернуться домой',
          uploadError: 'Пожалуйста, выберите до 3 файлов PDF, DOC, DOCX или ZIP, каждый не более 10 МБ.',
          validationError: 'Проверьте данные заявки и выбранные файлы.',
          rateLimitError: 'Слишком много попыток. Пожалуйста, подождите и повторите отправку позже.',
          submissionError: 'Не удалось отправить заявку. Попробуйте позже.',
        }
      : {
          title: 'Choose your next orbit.',
          subtitle: 'Tell us what you build, how you think, and where your signal is strongest. We work remotely, asynchronously, and with a lot of care.',
          remote: 'Remote crew / intake open',
          points: ['Global remote team', 'Async by default', 'Deep work protected'],
          formTitle: 'Applicant dossier',
          formHeading: 'Send your signal.',
          fullName: 'Full name',
          email: 'Email',
          role: 'Role / orbit',
          select: 'Select a position',
          portfolio: 'Portfolio / signal link',
          message: 'Short transmission',
          upload: 'Upload up to 3 files',
          uploadHint: 'PDF, DOC, DOCX, or ZIP · 10 MB each',
          pending: 'Your application and selected files will be saved for processing.',
          submit: 'Submit application',
          sending: 'Sending...',
          successEyebrow: 'Application submitted',
          return: 'Return to orbit',
          successTitle: 'Your coordinates are ready.',
          successText: 'Your application and files are safely saved. We will be in touch after processing.',
          backHome: 'Return to home',
          uploadError: 'Please choose up to 3 files in PDF, DOC, DOCX, or ZIP format, each no larger than 10 MB.',
          validationError: 'Please check your application details and selected files.',
          rateLimitError: 'Too many attempts. Please wait a while before submitting again.',
          submissionError: 'We could not submit your application. Please try again later.',
        };

  const validateFiles = (files: FileList | null) => {
    const list = Array.from(files ?? []);

    if (!list.length) {
      setUploadError('');
      return true;
    }

    if (list.length > MAX_UPLOAD_FILES) {
      setUploadError(copy.uploadError);
      return false;
    }

    for (const file of list) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !ALLOWED_UPLOAD_TYPES.has(extension)) {
        setUploadError(copy.uploadError);
        return false;
      }

      if (file.size > MAX_UPLOAD_SIZE_BYTES) {
        setUploadError(copy.uploadError);
        return false;
      }
    }

    setUploadError('');
    return true;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    validateFiles(event.target.files);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionState === 'sending') return;

    const form = event.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
    if (!validateFiles(fileInput?.files ?? null)) {
      setSubmissionState('validation');
      return;
    }

    setSubmissionState('sending');
    try {
      const response = await fetch('/api/application', {
        method: 'POST',
        body: new FormData(form),
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

      form.reset();
      setUploadError('');
      setSubmissionState('success');
    } catch {
      setSubmissionState('failure');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020203] text-white">
      <Starfield />
      <CursorDot />
      <div className="absolute inset-0 opacity-50" aria-hidden="true">
        <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full border border-white/[0.05]" />
        <div className="absolute left-1/2 top-[-12rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full border border-blue-300/[0.08]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-7 md:px-12 md:py-10">
        <Link href="/" className="font-mono text-xs tracking-[0.3em] uppercase text-white hover:text-blue-300 transition-colors">
          Tonrax
        </Link>

        <div className="flex items-center gap-3">
          <button type="button" onClick={toggleLanguage} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-1 font-mono text-[9px] tracking-[0.2em] uppercase text-white transition-colors hover:bg-white/5" aria-label="Toggle language">
            <span className={language === 'en' ? 'text-orange-300' : 'text-white/80'}>EN</span>
            <span className="text-white/40">/</span>
            <span className={language === 'ru' ? 'text-orange-300' : 'text-white/80'}>RU</span>
          </button>
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> {copy.return}
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12 md:px-12 md:pt-20">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <section className="lg:sticky lg:top-12 lg:self-start">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)]" />
              <span className="font-mono text-xs tracking-[0.22em] text-emerald-300 uppercase">{copy.remote}</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">{copy.title}</h1>
            <p className="mt-8 max-w-md font-serif text-xl leading-relaxed text-gray-400">{copy.subtitle}</p>
            <div className="mt-12 space-y-5 border-t border-white/10 pt-7 font-mono text-[10px] tracking-[0.16em] text-gray-500 uppercase">
              {copy.points.map((point) => (
                <div key={point} className="flex items-center gap-3"><Check className="h-3.5 w-3.5 text-blue-300" /> {point}</div>
              ))}
            </div>
          </section>

          <section className="border border-white/10 bg-white/[0.025] p-6 backdrop-blur-md md:p-10">
            {submissionState === 'success' ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/40 text-emerald-300">
                  <Check className="h-7 w-7" />
                </div>
                <p className="font-mono text-xs tracking-[0.22em] text-emerald-300 uppercase">{copy.successEyebrow}</p>
                <h2 className="mt-5 text-4xl font-bold">{copy.successTitle}</h2>
                <p className="mt-5 max-w-md font-serif text-lg leading-relaxed text-gray-400">{copy.successText}</p>
                <Link href="/" className="mt-9 inline-flex items-center gap-3 font-mono text-xs tracking-[0.18em] uppercase text-white hover:text-blue-300 transition-colors">
                  {copy.backHome} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit} onChange={() => { if (submissionState !== 'sending') setSubmissionState(null); }}>
                <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                  <label htmlFor="application-website">Website</label>
                  <input id="application-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                {submissionState && submissionState !== 'sending' && (
                  <p role="alert" className="border border-orange-400/40 bg-orange-400/10 p-4 font-mono text-xs leading-relaxed tracking-widest text-orange-200 uppercase">
                    {submissionState === 'validation' ? copy.validationError : submissionState === 'rate-limit' ? copy.rateLimitError : copy.submissionError}
                  </p>
                )}
                {submissionState === 'sending' && (
                  <p role="status" className="border border-blue-300/30 bg-blue-300/5 p-4 font-mono text-xs tracking-widest text-blue-200 uppercase">{copy.sending}</p>
                )}
                <div className="border-b border-white/10 pb-6">
                  <p className="font-mono text-xs tracking-[0.2em] text-orange-400 uppercase">{copy.formTitle}</p>
                  <h2 className="mt-3 text-3xl font-bold">{copy.formHeading}</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-gray-500 uppercase">{copy.fullName}</span>
                    <input required name="name" disabled={submissionState === 'sending'} className="w-full border border-white/10 bg-black/40 px-4 py-3 font-sans text-white outline-none transition-colors focus:border-blue-300" placeholder="Jane Doe" />
                  </label>
                  <label className="space-y-2">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-gray-500 uppercase">{copy.email}</span>
                    <input required type="email" name="email" disabled={submissionState === 'sending'} className="w-full border border-white/10 bg-black/40 px-4 py-3 font-sans text-white outline-none transition-colors focus:border-blue-300" placeholder="you@example.com" />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-gray-500 uppercase">{copy.role}</span>
                  <select required name="role" defaultValue="" disabled={submissionState === 'sending'} className="w-full appearance-none border border-white/10 bg-black/40 px-4 py-3 font-sans text-white outline-none transition-colors focus:border-blue-300">
                    <option value="" disabled>{copy.select}</option>
                    {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-gray-500 uppercase">{copy.portfolio}</span>
                  <input required type="url" name="portfolio" disabled={submissionState === 'sending'} className="w-full border border-white/10 bg-black/40 px-4 py-3 font-sans text-white outline-none transition-colors focus:border-blue-300" placeholder="https://" />
                </label>

                <label className="block space-y-2">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-gray-500 uppercase">{copy.message}</span>
                  <textarea required name="message" rows={5} disabled={submissionState === 'sending'} className="w-full resize-none border border-white/10 bg-black/40 px-4 py-3 font-sans text-white outline-none transition-colors focus:border-blue-300" placeholder="Tell us about your project and why you fit." />
                </label>

                <div>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-gray-500 uppercase">{copy.upload}</span>
                  <label className="mt-2 flex cursor-pointer flex-col items-center justify-center border border-dashed border-white/20 bg-black/30 px-6 py-9 text-center transition-colors hover:border-blue-300/50">
                    <Upload className="mb-3 h-5 w-5 text-blue-300" />
                    <span className="font-mono text-xs tracking-[0.15em] text-white uppercase">{copy.upload}</span>
                    <span className="mt-2 font-serif text-sm text-gray-500">{copy.uploadHint}</span>
                    <input type="file" name="attachments" multiple disabled={submissionState === 'sending'} accept=".pdf,.doc,.docx,.zip" className="sr-only" onChange={handleFileChange} />
                  </label>
                  {uploadError ? (
                    <p className="mt-3 font-mono text-[10px] tracking-[0.14em] text-red-300 uppercase">{uploadError}</p>
                  ) : null}
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="mb-5 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-gray-600 uppercase">{copy.pending}</p>
                  <button type="submit" disabled={submissionState === 'sending'} className="group flex w-full items-center justify-center gap-3 bg-white px-5 py-4 font-mono text-xs tracking-[0.18em] text-black uppercase transition-colors hover:bg-orange-200 disabled:cursor-wait disabled:opacity-70">
                    {submissionState === 'sending' ? copy.sending : copy.submit} {submissionState !== 'sending' && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
