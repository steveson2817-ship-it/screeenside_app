// Help Centre: only verified numbers and official links.
export const help = [
  {
    id: 'emergency',
    icon: 'siren',
    title: 'National Emergency Helpline',
    value: '112',
    description:
      'Call if someone is in immediate danger right now, or if a crime is happening and you need urgent help. It is free and works across India.',
    actionType: 'phone',
    actionLabel: 'Call 112',
    href: 'tel:112',
    urgent: true,
  },
  {
    id: 'police',
    icon: 'shield-alert',
    title: 'Police',
    value: '100',
    description:
      'Call the police if you or someone else is being threatened or harmed and it is urgent. If you can, tell a trusted adult first so you are not dealing with it alone.',
    actionType: 'phone',
    actionLabel: 'Call 100',
    href: 'tel:100',
    urgent: true,
  },
  {
    id: 'financial-fraud',
    icon: 'phone-call',
    title: 'National Cyber Financial Fraud Helpline',
    value: '1930',
    description:
      'For online money fraud and cyber financial scams — fake payment requests, UPI scams, task or job scams. Call as soon as possible, because fast reporting gives a better chance of stopping the money.',
    actionType: 'phone',
    actionLabel: 'Call 1930',
    href: 'tel:1930',
    urgent: false,
  },
  {
    id: 'cybercrime-portal',
    icon: 'globe',
    title: 'Report Cybercrime Online',
    value: 'cybercrime.gov.in',
    description:
      'The official Government of India portal (Ministry of Home Affairs / I4C). Use it to report cybercrime online — including social media bullying, threats, hacking, and financial or non-financial cybercrime. You can also track a complaint you file.',
    actionType: 'link',
    actionLabel: 'Open cybercrime.gov.in',
    href: 'https://www.cybercrime.gov.in',
    urgent: false,
  },
  {
    id: 'tn-cyber-crime',
    icon: 'instagram',
    title: 'Tamil Nadu Cyber Crime Police',
    value: '@tncybercrimeoff',
    description:
      'Want to learn more about cyberbullying, cyber safety and online awareness from the Tamil Nadu Cyber Crime Police? Follow their Instagram page for real awareness posts and scam alerts.',
    actionType: 'link',
    actionLabel: 'Follow TN Cyber Crime on Instagram',
    href: 'https://www.instagram.com/tncybercrimeoff/',
    urgent: false,
  },
  {
    id: 'trusted-adult',
    icon: 'users',
    title: 'A trusted adult',
    value: 'Someone you trust',
    description:
      'A parent, guardian, teacher or school counsellor is often the fastest help. You do not have to prove anything first — telling someone is allowed even if you are unsure.',
    actionType: 'none',
    actionLabel: '',
    href: '',
    urgent: false,
  },
]

export const helpSteps = [
  'Save the evidence: screenshot the messages and note the date.',
  'Do not reply or retaliate — you do not owe them a reaction.',
  'Block the account and report it on the platform.',
  'Tell a trusted adult the same day.',
  'For threats, blackmail or private images, report to the police or on cybercrime.gov.in.',
]

export const emergencyNote =
  'If someone is in immediate danger, call 112 now and tell an adult nearby. ScreenSide cannot contact anyone for you.'
