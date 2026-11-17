// CyberQuest: fictional scenarios for school students. Each option has feedback.
export const quest = [
  {
    id: 'group-chat-insults',
    situation:
      'Someone in your class group chat keeps posting insulting comments about another student. Other people are laughing and adding emojis. What should you do?',
    options: [
      {
        text: 'Join the conversation and make fun of them too.',
        correct: false,
        feedback:
          'Joining in adds to the harm and makes the target feel even more alone. Even a laughing emoji encourages the person posting.',
      },
      {
        text: 'Forward the messages to other groups so people know what is happening.',
        correct: false,
        feedback:
          'Forwarding spreads the humiliation to more people. It also shares someone else’s bullying without their permission.',
      },
      {
        text: 'Avoid joining in, support the student, and report the behaviour to a trusted adult.',
        correct: true,
        feedback:
          'This is the strongest choice. You are not adding to the harm, the student knows they are not alone, and an adult can step in.',
      },
    ],
    explanation:
      'Doing nothing is not the only alternative to joining in. Sending a private “that wasn’t okay, are you alright?” message is a small action that helps a lot, and a trusted adult can stop the pattern.',
  },
  {
    id: 'fake-account',
    situation:
      'Someone creates a fake account using a classmate’s photo and name. The account is posting rude comments as if it were really them. What should you do?',
    options: [
      {
        text: 'Message the fake account and argue with them.',
        correct: false,
        feedback:
          'Arguing gives the account attention and can lead to more targeting — including of you. You also cannot reason with someone pretending to be someone else.',
      },
      {
        text: 'Report the account to the platform, tell the real classmate, and let a teacher know.',
        correct: true,
        feedback:
          'Exactly. Impersonation breaks most platforms’ rules. Reporting it, telling the person being impersonated and getting an adult involved is the right combination.',
      },
      {
        text: 'Assume it is a joke and ignore it completely.',
        correct: false,
        feedback:
          'Impersonation can damage someone’s reputation and friendships. It is not harmless, and the classmate may not even know it is happening.',
      },
    ],
    explanation:
      'Screenshot the fake profile before reporting so there is a record. Platforms usually remove impersonation accounts once reported.',
  },
  {
    id: 'rumour',
    situation:
      'A rumour about a student is spreading through a school WhatsApp group. People keep asking “is it true?”. You do not know if it is. What should you do?',
    options: [
      {
        text: 'Pass it on with “not sure if true” so people can decide for themselves.',
        correct: false,
        feedback:
          '“Not sure if true” still spreads it. Once a rumour is forwarded, it grows and the person being talked about cannot stop it.',
      },
      {
        text: 'Do not repeat it, and politely say the group should stop sharing it.',
        correct: true,
        feedback:
          'Right choice. You are not spreading the story, and you are giving other people permission to stop too. A short “we don’t actually know, let’s drop it” is often enough.',
      },
      {
        text: 'Ask the student in front of everyone whether it is true.',
        correct: false,
        feedback:
          'Putting someone on the spot in a group is humiliating, even if you mean well. If you are worried about them, message them privately.',
      },
    ],
    explanation:
      'Rumours are a form of bullying even when nobody is sure of the facts. Not forwarding is the simplest way to slow it down.',
  },
  {
    id: 'private-screenshot',
    situation:
      'A friend shows you screenshots of a private chat between two classmates. They want to post them in the class group because it is “funny”. What do you do?',
    options: [
      {
        text: 'Say you are not comfortable with it and ask them not to post it.',
        correct: true,
        feedback:
          'That is the right call. Private messages are private, and sharing them can embarrass someone in front of the whole class.',
      },
      {
        text: 'Let them post it but do not react.',
        correct: false,
        feedback:
          'Staying quiet lets it happen. It is okay to say “I don’t think you should” — it is a simple way to protect someone who is not in the room.',
      },
      {
        text: 'Ask them to send you the screenshots first.',
        correct: false,
        feedback:
          'That still spreads private messages and makes you part of it. Private chats should stay private.',
      },
    ],
    explanation:
      'Sharing private messages without permission is a common form of cyberbullying. You can be a good friend by being the person who says “let’s not”.',
  },
  {
    id: 'threat-message',
    situation:
      'An unknown account sends you a message saying “I know where you live, watch out”. You feel scared. What should you do?',
    options: [
      {
        text: 'Reply and tell them you are not scared.',
        correct: false,
        feedback:
          'Replying confirms your account is active and gives them a reaction. Do not engage with an account that threatens you.',
      },
      {
        text: 'Screenshot it, block and report the account, and tell a trusted adult immediately.',
        correct: true,
        feedback:
          'Correct, and do it today. A threat is serious even if the person is “joking” or bluffing. An adult can help you report it properly.',
      },
      {
        text: 'Delete the message and try to forget about it.',
        correct: false,
        feedback:
          'Deleting it removes the evidence you may need. Save it first, then block and report — and tell someone you trust.',
      },
    ],
    explanation:
      'Threats can be reported to the platform and to the police. In India you can call 112 (emergency) or 100 (police), or report on cybercrime.gov.in.',
  },
  {
    id: 'supporting-a-friend',
    situation:
      'A friend tells you they are being targeted online and asks you not to tell anyone. They seem really upset. What is the best response?',
    options: [
      {
        text: 'Promise to keep it completely secret no matter what.',
        correct: false,
        feedback:
          'You can be supportive without promising total secrecy — especially if they are unsafe. A promise you may have to break can make things harder later.',
      },
      {
        text: 'Listen, take it seriously, and help them tell a trusted adult.',
        correct: true,
        feedback:
          'This is the right balance. You are not carrying it alone, and you are helping them get real support rather than taking over.',
      },
      {
        text: 'Tell them to just block the person and move on.',
        correct: false,
        feedback:
          'Blocking can help, but it does not deal with how they feel, and it may not stop the person. Listening first matters more than a quick fix.',
      },
    ],
    explanation:
      'You do not have to solve it for them. Listening, believing them, and helping them talk to an adult is powerful support.',
  },
  {
    id: 'phone-number-shared',
    situation:
      'Someone posts your phone number in a group chat without asking you. People start messaging you. What should you do?',
    options: [
      {
        text: 'Ask the person to delete it, screenshot the post, and tell a trusted adult.',
        correct: true,
        feedback:
          'Right. Saving the post is important evidence, and an adult can help get it removed and deal with the messages.',
      },
      {
        text: 'Post their number too so it is fair.',
        correct: false,
        feedback:
          'Getting revenge spreads the harm and could get you into trouble. Two wrongs do not make you safer.',
      },
      {
        text: 'Change nothing and hope people stop messaging.',
        correct: false,
        feedback:
          'It may keep spreading. Ask for it to be removed, report the post, and tell someone who can help.',
      },
    ],
    explanation:
      'Sharing someone’s personal information without permission is called doxxing. It is a serious form of online harm and can be reported to the platform and the police.',
  },
  {
    id: 'stranger-photos',
    situation:
      'A stranger you met in an online game asks for your photos and wants to move the chat to a private app. They say they will send you game credits. What should you do?',
    options: [
      {
        text: 'Send one photo to see if they are real, then decide.',
        correct: false,
        feedback:
          'Do not send anything. Once a photo is sent you cannot get it back, and the offer of credits is a common trick.',
      },
      {
        text: 'Stop replying, do not send anything, and tell a trusted adult.',
        correct: true,
        feedback:
          'Exactly right. Asking for photos and pushing for a private chat are warning signs. You do not owe a stranger anything.',
      },
      {
        text: 'Keep chatting but do not share anything personal.',
        correct: false,
        feedback:
          'Even “safe” chatting with a stranger who asks for photos is risky. The safest move is to stop and tell an adult.',
      },
    ],
    explanation:
      'Gifts, credits and “just one photo” are common grooming tricks. Block the account, report it, and talk to an adult you trust.',
  },
]
