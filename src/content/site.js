// Core site copy for ScreenSide. Shared by the frontend (fallback) and the Worker (seed).
export const site = {
  name: 'ScreenSide',
  tagline: 'Your online safety starts here.',
  heroBadge: 'Free to use · Made for school students',
  heroTitle: 'Welcome to ScreenSide',
  heroText:
    'The internet connects us, helps us learn and gives us a place to express ourselves. But sometimes, people use it to hurt others. ScreenSide helps you understand cyberbullying, recognise harmful online behaviour and learn how to stay safe online.',
  featuresTitle: 'What you can do here',
  featuresText: 'Five simple things to help you learn, practise and get help. No account needed.',
  awarenessTitle: "Being safe online is everyone's responsibility.",
  awarenessText:
    'You do not need to be an expert to help. Not joining in, checking on a friend and telling a trusted adult are small actions that make a real difference.',
  safetyReminder: "Being safe online is everyone's responsibility.",
  helpBannerTitle: 'If something is happening right now',
  helpBannerText:
    'If you or someone else is in danger, tell a trusted adult straight away. Call 112 for the national emergency helpline or 100 for the police.',
  helpIntro:
    'Real people and official services that can help. Tap a number to call, or open a link to report something online.',
  helpNote:
    'About anonymous reporting: the official portal cybercrime.gov.in has a "Report Anonymously" option, but it is meant for reporting online sexual abuse or explicit content about women and children. For other cybercrimes you make a named complaint and can track it. We did not add NCAI.org because we could not verify it as an official service, and we will not claim a complaint is anonymous unless the service really is.',
  privacySummary:
    'ScreenSide does not ask for your name, email or phone number, and it does not save your chat in a database.',
  footerNote:
    'ScreenSide is an awareness project for students. It gives general guidance and does not replace a trusted adult, a school counsellor or professional help.',
  footerLinksTitle: 'Explore',
  adminHint: 'Site owner? Manage content',
}

export const features = [
  {
    id: 'learn',
    icon: 'book',
    title: 'Learn',
    text: 'Understand cyberbullying in six short lessons, with examples and a quick knowledge check.',
    to: '/learn',
    cta: 'Start learning',
  },
  {
    id: 'safety',
    icon: 'shield',
    title: 'Safety Tips',
    text: 'Simple habits that keep your accounts, photos and personal information safer.',
    to: '/safety',
    cta: 'See the tips',
  },
  {
    id: 'quest',
    icon: 'gamepad',
    title: 'CyberQuest',
    text: 'Test your knowledge with realistic online scenarios and find out what you would do.',
    to: '/cyberquest',
    cta: 'Play CyberQuest',
  },
  {
    id: 'chat',
    icon: 'chat',
    title: 'AI Chatbot',
    text: 'Ask a question or explain an online problem, and get calm, practical guidance.',
    to: '/chat',
    cta: 'Open the guide',
  },
  {
    id: 'help',
    icon: 'lifebuoy',
    title: 'Help Centre',
    text: 'Trusted helplines, the official reporting portal and support services in one place.',
    to: '/help',
    cta: 'Find help',
  },
]

export const privacyPoints = [
  {
    icon: 'message',
    title: 'Your chat is not saved by us',
    text: 'Messages live in this browser tab only. Reloading or closing the page starts a completely fresh chat. ScreenSide does not store conversations in its database.',
  },
  {
    icon: 'user',
    title: 'No personal details needed',
    text: 'You never need to give your name, school, address or phone number to use ScreenSide. Please do not type them into the chat either.',
  },
  {
    icon: 'server',
    title: 'What our server sees',
    text: 'Your message text is sent to our server so it can reply. If AI replies are switched on by the site owner, that text is sent to the AI provider to write the response. We keep a one-way counter to prevent abuse, not a copy of your chat.',
  },
  {
    icon: 'browser',
    title: 'Saved in your browser',
    text: 'Lesson progress and your safety checklist are stored in your own browser so they are there next time. They never leave your device and are not visible to other students.',
  },
  {
    icon: 'alert',
    title: 'It is not a private hotline',
    text: 'This is general guidance, not counselling or an emergency service. It is not anonymous, so do not share private details. A trusted adult can help you with the next step.',
  },
]
