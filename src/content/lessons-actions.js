// Lessons 4-6: spotting it, preventing it, and what to do.
export const lessonsActions = [
  {
    id: 'identify-cyberbullying',
    number: 4,
    icon: 'search',
    title: 'How to Identify Cyberbullying',
    subtitle: 'Spotting the signs',
    summary:
      'Harmful behaviour online usually leaves a pattern. Learning the signals helps you notice when something is not okay — for you or a friend.',
    points: [
      {
        heading: 'Patterns, not one-offs',
        text: 'Repeated insulting comments, threats, or “jokes” that are always aimed at the same person.',
      },
      {
        heading: 'Accounts that should not exist',
        text: 'A fake profile using someone’s name or photos, or a new account that only exists to mock one person.',
      },
      {
        heading: 'Stories spreading',
        text: 'Rumours about a student appearing in chats, comments and posts, even after they asked people to stop.',
      },
      {
        heading: 'Private things becoming public',
        text: 'Screenshots, photos or personal details shared without permission.',
      },
      {
        heading: 'Changes in behaviour',
        text: 'Someone becoming uncomfortable using their phone, withdrawing from friends, or seeming worried, jumpy or quiet.',
      },
    ],
    examples: [
      'A group chat where one person is the punchline every day.',
      'An account with no followers that only sends cruel messages.',
      'A rumour repeated by classmates who say “it’s just a joke”.',
      'A friend who suddenly turns their phone face down when you sit down.',
    ],
    takeaway:
      'These signs are clues, not proof. Someone might be quiet for many reasons, so the best next step is to check in kindly instead of deciding for them.',
    quiz: {
      question:
        'Your friend suddenly stops using their phone and goes quiet in the group chat. What does that tell you?',
      options: [
        'They are definitely being cyberbullied.',
        'Nothing — it is not your business.',
        'It is a sign worth checking in about, though not proof on its own.',
      ],
      answerIndex: 2,
      explanation:
        'One change on its own does not prove anything. But noticing it and asking kindly is exactly what a good friend does. If they do share a problem, you can help them find an adult.',
    },
  },
  {
    id: 'prevent-cyberbullying',
    number: 5,
    icon: 'shield',
    title: 'How to Prevent Cyberbullying',
    subtitle: 'Small habits, big difference',
    summary:
      'Prevention is mostly about small everyday choices: what we post, what we forward and how we treat people behind a screen.',
    points: [
      {
        heading: 'Think before posting',
        text: 'Ask: would I say this to the person’s face? Would I be okay if this was about me?',
      },
      {
        heading: 'Respect other people’s privacy',
        text: 'Do not share someone’s photos, messages or personal details without their permission — even as a joke.',
      },
      {
        heading: 'Avoid sharing hurtful content',
        text: 'Forwarding a mean post or meme spreads the harm. Not sharing is a real way of taking a stand.',
      },
      {
        heading: 'Keep personal information private',
        text: 'Your address, phone number, school and timetable are not for public posts.',
      },
      {
        heading: 'Use privacy settings',
        text: 'Set your accounts so only people you know can see your posts and message you.',
      },
      {
        heading: 'Treat people respectfully online',
        text: 'Typing behind a screen does not make words less real to the person reading them.',
      },
      {
        heading: 'Do not join in',
        text: 'If a group turns on someone, staying silent can feel like joining in. Do not add to it, and support the person afterwards.',
      },
    ],
    examples: [
      'Asking before you post a photo that includes a friend.',
      'Deleting a mean meme instead of forwarding it.',
      'Saying “that’s not funny” in a group chat.',
      'Checking your privacy settings after an app update.',
    ],
    takeaway:
      'You cannot control what other people do, but your own choices still matter — and they often make it easier for others to do the right thing too.',
    quiz: {
      question:
        'A friend sends you an embarrassing video of a classmate and asks you to forward it. What is the best response?',
      options: [
        'Forward it to one person only.',
        'Delete it and tell your friend you are not comfortable sharing it.',
        'Post it in the class group so everyone can decide.',
      ],
      answerIndex: 1,
      explanation:
        '“Only one person” still spreads it — that is how things go viral. Deleting it and saying you are not comfortable is a clear, simple way to stop the harm without a big argument.',
    },
  },
  {
    id: 'what-to-do',
    number: 6,
    icon: 'lifebuoy',
    title: 'What to Do If You Experience Cyberbullying',
    subtitle: 'Your next steps',
    summary:
      'If this is happening to you, you are not in trouble and you did not cause it. These steps help you stay safe and keep control.',
    points: [
      {
        heading: 'Take a breath',
        text: 'Do not reply straight away and do not retaliate. Angry replies often make things worse — and can get you into trouble too.',
      },
      {
        heading: 'Save the evidence',
        text: 'Screenshot the messages and note the date and time, if it is safe to do so. Keep the original messages rather than deleting them.',
      },
      {
        heading: 'Block and mute',
        text: 'Use block and mute so they cannot keep contacting you. You do not owe anyone access to you.',
      },
      {
        heading: 'Report it on the platform',
        text: 'Every app has a report option. Reporting is not “telling tales” — it is exactly what the feature is for.',
      },
      {
        heading: 'Tell a trusted adult',
        text: 'A parent, guardian, teacher or school counsellor can help you decide what to do next and keep you safe.',
      },
      {
        heading: 'Get help quickly if it is serious',
        text: 'If there is a threat, blackmail or private images involved, tell an adult straight away and call 112 or 100.',
      },
    ],
    examples: [
      'Screenshot the chat before blocking, so you still have proof.',
      'Tell a teacher you trust, even if you feel embarrassed.',
      'Ask a friend to sit with you while you report the account.',
      'If someone threatens you, save it and tell an adult the same day.',
    ],
    takeaway:
      'You do not have to handle this alone, and you do not have to be certain it is “serious enough” before telling someone.',
    quiz: {
      question: 'Nasty messages keep arriving from an account you do not know. What should you do first?',
      options: [
        'Reply and tell them to stop.',
        'Screenshot, block, report, and tell a trusted adult.',
        'Post their messages publicly to expose them.',
      ],
      answerIndex: 1,
      explanation:
        'Replying gives them the reaction they want, and posting it yourself can spread the harm. Saving evidence, blocking, reporting and telling an adult keeps you in control.',
    },
  },
]
