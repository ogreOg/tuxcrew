import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

import { CursorDot } from '@/components/CursorDot';
import { FadeIn } from '@/components/FadeIn';
import { Navigation } from '@/components/Navigation';
import { Starfield } from '@/components/Starfield';
import { useLanguage } from '@/context/LanguageContext';

type PolicyKind = 'terms' | 'privacy';

const policies = {
  terms: {
    en: {
      eyebrow: 'Legal / Terms of Service',
      title: 'Terms of Service.',
      intro: 'These terms apply to your use of the Tonrax website and describe the general basis on which we provide our services. A signed proposal or service agreement takes precedence for the project it covers.',
      sections: [
        { title: '1. Using this website', body: ['You may browse this website for lawful purposes. Do not attempt to disrupt its operation, gain unauthorized access to systems, or use the site to transmit unlawful, harmful, or infringing material.'] },
        { title: '2. Services and project scope', body: ['Website descriptions and pricing are general information, not a binding offer or guarantee that a particular service is available. The deliverables, schedule, fees, responsibilities, and acceptance criteria for a project will be set out in a written proposal or service agreement.', 'Changes to an agreed scope may affect cost and delivery dates. We will confirm material changes with you before proceeding.'] },
        { title: '3. Fees and payment', body: ['Prices shown on the website are estimates or starting prices unless a written proposal says otherwise. Payment milestones, taxes, expenses, cancellation terms, and any refund entitlement are governed by the applicable written agreement and mandatory local law. No payment is processed through this website.'] },
        { title: '4. Your responsibilities', body: ['You are responsible for providing accurate project information, timely feedback, and the materials or permissions needed for the work. You confirm that you have the right to provide those materials and authorize their use for the agreed project. Delays in approvals or materials may affect the schedule.'] },
        { title: '5. Ownership and portfolio use', body: ['Ownership and licensing of project deliverables, source files, and third-party materials will be described in the applicable written agreement. Unless that agreement says otherwise, each party retains ownership of materials it owned before the project. We will not publicly identify your project or display confidential materials without your permission.'] },
        { title: '6. Third-party services', body: ['A project may depend on hosting providers, software, APIs, payment services, or other third parties. Their products are subject to their own terms and availability. We are not responsible for changes or outages outside our reasonable control, but project-specific support responsibilities can be agreed in writing.'] },
        { title: '7. Disclaimers and liability', body: ['This website is provided for general information and may be changed or unavailable from time to time. To the extent allowed by law, Tonrax excludes implied warranties for the website and is not liable for indirect or consequential loss arising from its use. Nothing in these terms limits liability where such a limit is prohibited by law. Any project-specific warranties or liability limits must appear in the applicable written agreement.'] },
        { title: '8. Changes to these terms', body: ['We may update these terms by publishing a revised version on this page. The “Last updated” date identifies the current version. Changes do not replace terms in a signed project agreement unless that agreement permits it.'] },
        { title: '9. Contact', body: ['Questions about these terms can be sent to hello@tonrax.com. The contracting service provider and applicable governing law should be identified in the written proposal or service agreement for your project.'] },
      ],
      updated: 'Last updated: October 28, 2026',
      back: 'Back to home',
    },
    ru: {
      eyebrow: 'Правовая информация / Условия использования',
      title: 'Условия использования.',
      intro: 'Эти условия регулируют использование сайта Tonrax и описывают общие принципы оказания услуг. Подписанное предложение или договор имеет преимущественную силу для соответствующего проекта.',
      sections: [
        { title: '1. Использование сайта', body: ['Вы можете просматривать сайт в законных целях. Запрещены попытки нарушить его работу, получить несанкционированный доступ к системам или передавать через сайт незаконные, вредоносные материалы либо материалы, нарушающие права третьих лиц.'] },
        { title: '2. Услуги и объём проекта', body: ['Описания услуг и цены на сайте носят информационный характер и не являются обязательным предложением или гарантией доступности конкретной услуги. Результаты, сроки, стоимость, обязанности сторон и критерии приёмки проекта определяются письменным предложением или договором.', 'Изменение согласованного объёма может повлиять на стоимость и сроки. Существенные изменения мы подтвердим с вами до начала работ.'] },
        { title: '3. Стоимость и оплата', body: ['Указанные на сайте цены являются ориентировочными или начальными, если письменное предложение не устанавливает иное. Этапы оплаты, налоги, расходы, условия отмены и возможный возврат средств определяются соответствующим письменным соглашением и обязательными нормами применимого законодательства. Оплата через этот сайт не производится.'] },
        { title: '4. Ваши обязанности', body: ['Вы отвечаете за точность предоставленной информации, своевременную обратную связь и материалы или разрешения, необходимые для работы. Вы подтверждаете, что вправе передавать эти материалы и разрешать их использование в рамках согласованного проекта. Задержки с материалами или согласованием могут повлиять на сроки.'] },
        { title: '5. Права на результаты и портфолио', body: ['Права и лицензии на результаты проекта, исходные файлы и материалы третьих лиц определяются соответствующим письменным соглашением. Если в нём не указано иное, каждая сторона сохраняет права на материалы, которыми владела до проекта. Мы не будем публично раскрывать ваш проект или конфиденциальные материалы без вашего разрешения.'] },
        { title: '6. Сторонние сервисы', body: ['Проект может зависеть от хостинга, программного обеспечения, API, платёжных и иных сторонних сервисов. Их использование регулируется собственными условиями поставщиков, а доступность может меняться. Мы не отвечаем за изменения или сбои вне нашего разумного контроля; объём поддержки по проекту можно согласовать письменно.'] },
        { title: '7. Отказ от гарантий и ответственность', body: ['Сайт предоставляется для общей информации и может периодически изменяться или быть недоступен. В пределах, допускаемых законом, Tonrax не предоставляет подразумеваемых гарантий в отношении сайта и не отвечает за косвенные или последующие убытки от его использования. Эти условия не ограничивают ответственность там, где такое ограничение запрещено законом. Гарантии и ограничения ответственности по проекту должны быть указаны в соответствующем письменном соглашении.'] },
        { title: '8. Изменения условий', body: ['Мы можем обновлять условия, публикуя новую версию на этой странице. Дата обновления указывает на текущую редакцию. Изменения не заменяют условия подписанного договора по проекту, если такой договор не предусматривает иное.'] },
        { title: '9. Контакты', body: ['Вопросы об этих условиях можно направить на hello@tonrax.com. Исполнитель по договору и применимое право должны быть указаны в письменном предложении или договоре по вашему проекту.'] },
      ],
      updated: 'Последнее обновление: 28 октября 2026 г.',
      back: 'На главную',
    },
  },
  privacy: {
    en: {
      eyebrow: 'Legal / Privacy Policy',
      title: 'Privacy Policy.',
      intro: 'This policy explains what information may be handled when you visit the Tonrax website or contact us, and how to ask questions about it. It reflects the website’s current features and should be read alongside any project agreement.',
      sections: [
        { title: '1. Information you provide', body: ['If you submit the contact form, the website sends your name, email address, optional phone number, subject, and message to our contact service. If you submit an application, it sends your name, email address, selected role, portfolio URL, message, and any files you attach (up to three PDF, DOC, DOCX, or ZIP files). The service validates submissions and, if accepted, emails them to our designated contact mailbox through our email provider. Please do not submit sensitive personal information.'] },
        { title: '2. Information stored in your browser', body: ['The site stores your language preference (“en” or “ru”) in your browser’s local storage so it can remember your selection on a later visit. The site’s shared sidebar component can also use a cookie to remember its open or closed state if that component is used. These preferences are not used by Tonrax to identify you.'] },
        { title: '3. Technical information', body: ['When you use the website, hosting and network providers may process technical data such as an IP address, browser and device details, requested pages, and request time in server or security logs. For contact-form abuse prevention, the contact service uses the visitor IP address for a temporary in-memory rate limit. The limit data is not persisted and is cleared when its time window expires or the service restarts.'] },
        { title: '4. How information is used', body: ['We use contact messages to respond to inquiries, prepare proposals, and discuss or deliver requested services. The hosting and email providers process information as needed to deliver, secure, and troubleshoot the website and email. We do not use the current website code to run advertising or analytics tracking.'] },
        { title: '5. Sharing and retention', body: ['Submissions are stored in a private SQLite outbox on our server before email delivery, then sent through our configured email provider (currently Purelymail) to our designated contact mailbox. If SMTP is temporarily unavailable or not yet configured, records remain queued on the server until delivery is enabled or an administrator reviews them. Access to the database is limited to authorized administrators. Successfully delivered records are automatically removed after 90 days by default. Messages that cannot be delivered after repeated attempts remain in a failed state for administrator review and are deleted when no longer needed. Backups and email provider copies may have separate retention schedules. The SQLite database is not encrypted by the application; access protection and encrypted server or backup storage should be provided by the hosting environment. We do not sell personal information. The rate limiter does not retain IP data beyond its in-memory time window.'] },
        { title: '6. Your choices and rights', body: ['You can change or clear the language preference through your browser’s site data settings. You can choose not to submit the contact form and contact us directly by email instead. Depending on where you live, you may have rights to access, correct, delete, or restrict the use of personal information. To make a request, email hello@tonrax.com.'] },
        { title: '7. Children and security', body: ['This website and our services are not directed to children. Please do not send sensitive personal information through the contact form. We use reasonable measures to protect information handled by us, but no internet transmission or storage method can be guaranteed completely secure.'] },
        { title: '8. International visitors and changes', body: ['Tonrax and the providers used to deliver this website may operate in different countries, so information may be processed outside your country, subject to applicable law. We may revise this policy as the website or our practices change; the date below indicates the current version.'] },
        { title: '9. Contact', body: ['For privacy questions or requests, email hello@tonrax.com.'] },
      ],
      updated: 'Last updated: October 28, 2026',
      back: 'Back to home',
    },
    ru: {
      eyebrow: 'Правовая информация / Политика конфиденциальности',
      title: 'Политика конфиденциальности.',
      intro: 'В этой политике объясняется, какие данные могут обрабатываться при посещении сайта Tonrax или обращении к нам, а также как задать вопросы об их использовании. Политика описывает текущие функции сайта и применяется вместе с договором по проекту.',
      sections: [
        { title: '1. Данные, которые вы предоставляете', body: ['При отправке контактной формы сайт передаёт имя, адрес электронной почты, необязательный телефон, тему и сообщение нашей службе обработки обращений. При отправке заявки на вакансию передаются имя, адрес электронной почты, выбранная роль, ссылка на портфолио, сообщение и приложенные файлы (до трёх файлов PDF, DOC, DOCX или ZIP). Служба проверяет данные и при успешной проверке отправляет их на указанный нами почтовый адрес через почтового провайдера. Не отправляйте конфиденциальные персональные данные.'] },
        { title: '2. Данные в браузере', body: ['Сайт сохраняет выбранный язык («en» или «ru») в локальном хранилище браузера, чтобы помнить выбор при следующем посещении. Общий компонент боковой панели также может использовать cookie для запоминания её состояния, если этот компонент используется. Tonrax не использует эти настройки для вашей идентификации.'] },
        { title: '3. Техническая информация', body: ['При использовании сайта хостинг-провайдеры и сетевые операторы могут обрабатывать технические данные, например IP-адрес, сведения о браузере и устройстве, запрошенные страницы и время запроса, в серверных журналах или журналах безопасности. Для защиты формы от злоупотреблений служба обработки обращений использует IP-адрес посетителя для временного ограничения частоты запросов в памяти процесса. Эти данные не сохраняются постоянно и удаляются после истечения окна ограничения или перезапуска службы.'] },
        { title: '4. Использование данных', body: ['Сообщения используются для ответа на запрос, подготовки предложения, обсуждения и оказания запрошенных услуг. Хостинг- и почтовые провайдеры обрабатывают информацию, необходимую для доставки, защиты и диагностики сайта и электронной почты. Текущий код сайта не использует рекламное или аналитическое отслеживание.'] },
        { title: '5. Передача и хранение', body: ['До отправки по электронной почте обращения и заявки сохраняются в закрытой базе SQLite на нашем сервере, после чего отправляются через настроенного почтового провайдера (в настоящее время Purelymail) на указанный нами адрес. Если SMTP временно недоступен или ещё не настроен, записи остаются в очереди до включения доставки или проверки администратором. Доступ к базе есть только у уполномоченных администраторов. Успешно доставленные записи по умолчанию автоматически удаляются через 90 дней. Сообщения, которые не удалось доставить после нескольких попыток, сохраняются со статусом ошибки для проверки администратором и удаляются, когда больше не нужны. Резервные копии и копии у почтового провайдера могут иметь отдельные сроки хранения. Приложение не шифрует SQLite-базу; защиту доступа и шифрование диска сервера или резервных копий должна обеспечивать среда хостинга. Мы не продаём персональные данные. Ограничитель частоты не хранит IP-адреса дольше своего временного окна.'] },
        { title: '6. Ваш выбор и права', body: ['Вы можете изменить или удалить языковую настройку в параметрах данных сайта вашего браузера. Вы можете не отправлять форму и написать нам напрямую по электронной почте. В зависимости от вашего местонахождения у вас могут быть права на доступ, исправление, удаление или ограничение использования персональных данных. Для запроса напишите на hello@tonrax.com.'] },
        { title: '7. Дети и безопасность', body: ['Сайт и услуги не предназначены для детей. Не отправляйте через форму конфиденциальные персональные данные. Мы принимаем разумные меры для защиты обрабатываемой нами информации, однако ни один способ передачи или хранения данных в интернете не гарантирует абсолютную безопасность.'] },
        { title: '8. Посетители из других стран и изменения', body: ['Tonrax и провайдеры, обеспечивающие работу сайта, могут находиться в разных странах. Поэтому данные могут обрабатываться за пределами вашей страны с учётом применимого законодательства. Мы можем обновлять политику при изменении сайта или наших практик; дата ниже обозначает текущую редакцию.'] },
        { title: '9. Контакты', body: ['По вопросам конфиденциальности и запросам напишите на hello@tonrax.com.'] },
      ],
      updated: 'Последнее обновление: 28 октября 2026 г.',
      back: 'На главную',
    },
  },
} as const;

function LegalPage({ kind }: { kind: PolicyKind }) {
  const { language } = useLanguage();
  const copy = policies[kind][language];

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      <Starfield />
      <CursorDot />
      <Navigation />
      <main className="relative z-10 pt-20">
        <section className="mx-auto max-w-5xl px-6 py-24 md:px-20 md:py-36">
          <FadeIn>
            <div className="mb-6 font-mono text-sm tracking-[0.3em] text-orange-400 uppercase">{copy.eyebrow}</div>
            <h1 className="text-5xl font-bold leading-tight md:text-7xl">{copy.title}</h1>
            <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-gray-300">{copy.intro}</p>
            <p className="mt-4 font-mono text-xs tracking-widest text-gray-500 uppercase">{copy.updated}</p>
          </FadeIn>

          <div className="mt-16 space-y-10 border-t border-white/10 pt-12">
            {copy.sections.map((section) => (
              <FadeIn key={section.title}>
                <section>
                  <h2 className="mb-4 text-2xl font-bold">{section.title}</h2>
                  <div className="space-y-4 font-serif leading-relaxed text-gray-400">
                    {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </section>
              </FadeIn>
            ))}
          </div>

          <Link href="/" className="mt-16 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-orange-300 uppercase transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {copy.back}
          </Link>
        </section>
      </main>
    </div>
  );
}

export function Terms() {
  return <LegalPage kind="terms" />;
}

export function Privacy() {
  return <LegalPage kind="privacy" />;
}