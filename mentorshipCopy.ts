import type { UiLocale } from './constants';

export interface MentorshipCopy {
  back: string;
  badge1: string;
  badge2: string;
  title: string;
  heroSub: string;
  heroBody: string;
  asideTitle: string;
  asideLines: [string, string, string];
  sectionTitle: string;
  features: { title: string; desc: string }[];
  resultTitle: string;
  resultLead: string;
  resultItems: string[];
  resultHighlight: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  ctaNote: string;
}

export const MENTORSHIP_COPY: Record<UiLocale, MentorshipCopy> = {
  en: {
    back: 'BACK TO TERMINAL',
    badge1: 'One-on-one',
    badge2: 'Trading training',
    title: 'Mentorship',
    heroSub: 'Sessions one-on-one, adapted to your level of knowledge.',
    heroBody:
      'Mentorship is a way to learn trading as effectively and safely as possible for your capital: you get full support from day one to your first results, a clear learning structure, and an individual approach.',
    asideTitle: 'At a glance',
    asideLines: ['Dialogues', 'Homework', 'Individual approach'],
    sectionTitle: 'Why mentorship?',
    features: [
      { title: 'Personal program', desc: 'Individual approach — from the basics to your own system.' },
      { title: 'Full support', desc: 'Full mentor support — from the start to your first results.' },
      { title: 'Online conferences 1-on-1', desc: 'Conferences on Discord and Google Meet.' },
      { title: 'Flexible format', desc: 'Voice or video; length and frequency by agreement.' },
    ],
    resultTitle: 'What you get in the end',
    resultLead: 'After full training, you leave not with theory, but with a practical base for independent trading:',
    resultItems: [
      'Market understanding at an earning level',
      'A fully formed trading system',
      'Capital management skills',
      'A structured trading routine',
      'Skills for working with prop firms',
    ],
    resultHighlight: 'And most importantly, you build your own unique approach to trading.',
    ctaEyebrow: 'Next step',
    ctaTitle: 'Start on Telegram',
    ctaBody: 'Send your experience level and time zone — we’ll suggest a format before any commitment.',
    ctaButton: 'Discuss on Telegram',
    ctaNote: 'No spam · private chat',
  },
  ru: {
    back: 'НАЗАД К ТЕРМИНАЛУ',
    badge1: 'Один на один',
    badge2: 'Обучение трейдингу',
    title: 'Менторство',
    heroSub: 'Занятия 1 на 1 и адаптация к вашему уровню знаний',
    heroBody:
      'Менторшип — это не групповой курс, где ты теряешься среди десятков студентов. Здесь ты в приоритете: каждое занятие, каждый разбор, каждая обратная связь — только про тебя. Ты получишь сопровождение на всём пути от нулевых знаний до первого стабильного результата, индивидуальную программу под твой уровень.',
    asideTitle: 'Кратко',
    asideLines: ['Диалоги', 'Домашка', 'Индивидуальный подход'],
    sectionTitle: 'Почему менторшип?',
    features: [
      { title: 'Персональная программа', desc: 'Индивидуальный подход — от базы до вашей личной системы.' },
      { title: 'Полное сопровождение', desc: 'Полное сопровождение ментором, от начала до ваших первых результатов.' },
      { title: 'Онлайн конференции 1/1', desc: 'Конференции в Discord и Google Meet.' },
      { title: 'Гибкий формат', desc: 'Голос или видео; длительность и частота по договорённости.' },
    ],
    resultTitle: 'Что вы получите на выходе',
    resultLead: 'После полного обучения вы выйдете не с теорией, а с практической базой для самостоятельной торговли:',
    resultItems: [
      'Понимание рынка на уровне заработка',
      'Полностью сформированную торговую систему',
      'Навыки по управлению капиталом',
      'Сформированную торговую рутину',
      'Навыки работы с проп-компаниями',
    ],
    resultHighlight: 'И самое главное - вы сформируете ваш личный, уникальный подход к трейдингу.',
    ctaEyebrow: 'Следующий шаг',
    ctaTitle: 'Начать в Telegram',
    ctaBody: 'Напишите уровень опыта и часовой пояс — предложим формат до любых обязательств.',
    ctaButton: 'Обсудить в Telegram',
    ctaNote: 'Без спама · личная переписка',
  },
};
