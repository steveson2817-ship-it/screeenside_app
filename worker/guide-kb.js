// Knowledge and wording for the built-in guidance engine.
// The engine composes a fresh reply from these pieces instead of returning fixed blocks,
// and it avoids repeating wording that already appeared in the conversation.

export const OPENERS = {
  empathy: [
    'That sounds really stressful.',
    'I’m sorry that is happening to you.',
    'Thanks for telling me — that is a lot to deal with.',
    'That is not okay, and I’m glad you said something.',
    'I can see why that is bothering you.',
  ],
  neutral: [
    'Good question.',
    'Happy to explain.',
    'Here is the short version.',
    'Let’s break that down.',
    'Sure — this is worth knowing.',
  ],
  alert: [
    'Please take this seriously.',
    'This is important, so read this one carefully.',
    'I want to be straight with you about this.',
  ],
  reassure: [
    'First, this is not your fault.',
    'You have not done anything wrong here.',
    'Nothing about this means something is wrong with you.',
    'You are allowed to ask for help with this.',
  ],
  practical: [
    'Here is what usually works.',
    'A simple plan helps here.',
    'These steps tend to make a difference.',
  ],
}

export const DEFINITIONS = {
  cyberbullying: {
    label: 'Cyberbullying',
    aliases: ['cyberbullying', 'cyber bullying', 'online bullying'],
    text: 'Cyberbullying is using phones, chats, games or social media to hurt, threaten, embarrass or harass someone. It is usually repeated, but even one serious thing — like a threat or sharing private information — counts. The Learn section walks through it with examples.',
  },
  doxxing: {
    label: 'Doxxing',
    aliases: ['doxxing', 'doxxed', 'doxing', 'doxed'],
    text: 'Doxxing means posting someone’s private details — address, phone number, school, photos — online without their permission. It is a form of bullying and can be reported to the platform and the police. If it is happening to you, screenshot it, report it, and tell an adult.',
  },
  phishing: {
    label: 'Phishing',
    aliases: ['phishing', 'phish'],
    text: 'Phishing is a fake message or link that pretends to be a real company, game or friend so it can steal your login details. The classic sign is urgency — “your account will be deleted” — plus a link asking you to log in. Never log in through a link you were sent; open the app yourself instead.',
  },
  malware: {
    label: 'Malware',
    aliases: ['malware', 'virus', 'spyware'],
    text: 'Malware is software that harms your device or steals information, and it often arrives through downloads, cracked games or odd links. If a device starts acting strangely after you installed something, tell an adult and run a scan rather than trying to fix it alone.',
  },
  hacking: {
    label: 'Hacking',
    aliases: ['hacking', 'hacked'],
    text: 'Hacking means someone getting into an account or device they do not own. If it happens to you, change your password from a device you trust, turn on two-step verification, log out of other devices, and tell an adult.',
  },
  catfishing: {
    label: 'Catfishing',
    aliases: ['catfish', 'catfishing'],
    text: 'Catfishing is when someone creates a fake online identity to trick people — often to get attention, money or photos. Signs include refusing video calls, a brand-new profile, and rushing you to trust them.',
  },
  grooming: {
    label: 'Grooming',
    aliases: ['grooming', 'groomed'],
    text: 'Grooming is when an adult builds a fake friendship with a young person online to gain their trust, often before asking for photos or a meeting. It is never the young person’s fault. Stop replying, do not meet them, and tell a trusted adult straight away.',
  },
  sextortion: {
    label: 'Sextortion',
    aliases: ['sextortion', 'sextorted'],
    text: 'Sextortion is blackmail using private images or chats — someone threatens to share them unless you send more, pay, or do something. Do not pay or send anything else. Save the messages, tell an adult immediately, and report it on cybercrime.gov.in or by calling 1930.',
  },
  deepfake: {
    label: 'Deepfake',
    aliases: ['deepfake', 'deep fake'],
    text: 'A deepfake is a fake video or image made with AI so someone appears to say or do something they never did. They are used to embarrass or blackmail people. Do not forward one — report it, and if it is of you, tell an adult and report it to the platform.',
  },
  spam: {
    label: 'Spam',
    aliases: ['spam', 'spam messages'],
    text: 'Spam is unwanted bulk messages — adverts, fake prizes, “you have won” links. The safest response is to report it and delete it without clicking. Never reply to spam, because that confirms your account is active.',
  },
  'two-step-verification': {
    label: 'Two-step verification',
    aliases: ['two step verification', 'two-factor', '2fa', 'two step'],
    text: 'Two-step verification (2FA) asks for a second proof when you sign in — usually a code on your phone — so a stolen password is not enough on its own. Turn it on for your main accounts; it is one of the strongest protections you can add.',
  },
  'digital-footprint': {
    label: 'Digital footprint',
    aliases: ['digital footprint', 'online footprint'],
    text: 'Your digital footprint is everything you leave behind online: posts, comments, photos, likes, and things others post about you. It can be copied and screenshot, so treat anything public as permanent. You can still clean up: delete old posts, check tags, and ask people to remove things.',
  },
  vpn: {
    label: 'VPN',
    aliases: ['vpn'],
    text: 'A VPN hides your internet traffic from the network you are using — useful on public Wi-Fi. It is not a magic shield: it does not make bullying stop, and free VPNs can collect your data, so ask an adult before installing one.',
  },
  algorithm: {
    label: 'Algorithm',
    aliases: ['algorithm', 'for you page', 'fyp'],
    text: 'An algorithm is the set of rules an app uses to decide what to show you. It learns from what you watch and linger on, which is why upsetting content can keep appearing. “Not interested” and unfollowing are the clearest signals you can give it.',
  },
  consent: {
    label: 'Consent',
    aliases: ['consent'],
    text: 'Consent means someone clearly agreeing to something — like having their photo posted or their message shared. Without a yes, it is not okay. This is why forwarding a private chat is wrong even if the person “would not mind”.',
  },
}

export const PLATFORM_STEPS = {
  instagram: {
    name: 'Instagram',
    steps: [
      'Open the profile, message or comment.',
      'Tap the three dots (or press and hold the message).',
      'Choose Report, then pick bullying, harassment or impersonation.',
      'Use Block from the same menu if you do not want contact.',
    ],
  },
  whatsapp: {
    name: 'WhatsApp',
    steps: [
      'Open the chat and tap the contact or group name.',
      'Scroll to the bottom of that info page.',
      'Choose Report and Block (for a group, choose Report group).',
    ],
  },
  snapchat: {
    name: 'Snapchat',
    steps: [
      'Press and hold the message or open the profile.',
      'Tap the menu and choose Report.',
      'Pick the reason, then block from the profile if needed.',
    ],
  },
  tiktok: {
    name: 'TikTok',
    steps: [
      'Open the video, comment or profile.',
      'Tap the share arrow or three dots.',
      'Choose Report and select the reason.',
    ],
  },
  discord: {
    name: 'Discord',
    steps: [
      'Right-click or long-press the message (or open the profile).',
      'Choose Report, or open the profile to Block.',
      'For a whole server, report it from the server menu.',
    ],
  },
  youtube: {
    name: 'YouTube',
    steps: [
      'Tap the three dots beside the comment or video.',
      'Choose Report and pick the reason.',
      'Block the channel from its profile page if it keeps happening.',
    ],
  },
  game: {
    name: 'the game',
    steps: [
      'Open the player’s profile from the lobby or match screen.',
      'Use Report player (usually under the profile or scoreboard).',
      'Mute or block them in the same menu so they cannot message you.',
    ],
  },
}
