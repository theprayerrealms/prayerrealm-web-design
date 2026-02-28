import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, RotateCcw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
  showFollowUp?: boolean;
}

const quickButtons = [
  "Submit Prayer Request",
  "Get Encouragement Scripture",
  "Join Live Prayer",
  "Learn About Prayer Realm",
  "How Can I Volunteer?",
  "I Need Someone to Pray With",
];

const scriptures = [
  '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11',
  '"Cast all your anxiety on Him because He cares for you." — 1 Peter 5:7',
  '"The LORD is close to the brokenhearted and saves those who are crushed in spirit." — Psalm 34:18',
  '"I can do all things through Christ who strengthens me." — Philippians 4:13',
  '"Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go." — Joshua 1:9',
  '"Come to me, all you who are weary and burdened, and I will give you rest." — Matthew 11:28',
  '"The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you." — Zephaniah 3:17',
  '"Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight." — Proverbs 3:5-6',
  '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." — Philippians 4:6-7',
  '"When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you." — Isaiah 43:2',
];

// ─── Intent Detection System ────────────────────────────────
type Intent =
  | "crisis" | "threat" | "scripture" | "another_scripture"
  | "prayer_request" | "pray_for_topic" | "events" | "about"
  | "volunteer" | "radio" | "donate" | "greeting" | "thanks"
  | "yes" | "no" | "sad" | "health" | "family" | "finances"
  | "relationship" | "guidance" | "testimony" | "contact" | "unknown";

const intentPatterns: { intent: Intent; keywords: string[] }[] = [
  // 🚨 CRISIS — must be checked FIRST
  {
    intent: "crisis", keywords: [
      "suicide", "suicidal", "kill myself", "end my life", "want to die", "don't want to live",
      "no reason to live", "better off dead", "end it all", "self harm", "self-harm", "cut myself",
      "hurt myself", "take my life", "overdose", "jump off", "hang myself", "hopeless"
    ]
  },
  // ⚠️ THREATS
  {
    intent: "threat", keywords: [
      "kill", "murder", "hurt someone", "revenge", "weapon", "gun", "knife", "bomb",
      "attack", "destroy", "violence", "die", "threat", "shoot"
    ]
  },
  // Standard intents
  { intent: "scripture", keywords: ["scripture", "encouragement", "verse", "bible", "word of god", "psalm", "proverb"] },
  { intent: "another_scripture", keywords: ["another verse", "another scripture", "another one", "one more", "more verse"] },
  { intent: "prayer_request", keywords: ["prayer request", "pray for me", "need prayer", "submit prayer", "someone to pray"] },
  { intent: "events", keywords: ["live prayer", "event", "session", "upcoming", "schedule", "conference", "meeting"] },
  { intent: "about", keywords: ["about", "prayer realm", "who are you", "what is this", "learn more", "tell me about", "ministry"] },
  { intent: "volunteer", keywords: ["volunteer", "serve", "help out", "join the team", "get involved", "sign up"] },
  { intent: "radio", keywords: ["radio", "music", "worship", "listen", "broadcast", "24/7", "live stream"] },
  { intent: "donate", keywords: ["donate", "give", "offering", "seed", "partner", "support", "tithe", "gift"] },
  { intent: "health", keywords: ["sick", "illness", "disease", "hospital", "surgery", "cancer", "diagnosed", "health", "medical", "healing"] },
  { intent: "family", keywords: ["family", "marriage", "husband", "wife", "children", "kids", "parent", "mother", "father", "divorce", "child"] },
  { intent: "finances", keywords: ["money", "financial", "debt", "job", "unemployed", "broke", "rent", "bills", "poverty", "provision", "employment", "career"] },
  { intent: "relationship", keywords: ["relationship", "breakup", "boyfriend", "girlfriend", "lonely", "friend", "heartbreak", "love", "dating", "betrayal"] },
  { intent: "guidance", keywords: ["confused", "lost", "direction", "decision", "guidance", "don't know what to do", "purpose", "calling", "future", "plan"] },
  { intent: "sad", keywords: ["sad", "depress", "lonely", "struggling", "anxious", "worried", "afraid", "fear", "hurting", "pain", "crying", "overwhelmed", "stressed", "angry", "frustrated", "broken"] },
  { intent: "greeting", keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "yo", "greetings", "peace"] },
  { intent: "thanks", keywords: ["thank", "thanks", "god bless", "appreciate", "grateful", "blessed"] },
  { intent: "testimony", keywords: ["testimony", "testify", "god did", "miracle", "breakthrough", "answered prayer"] },
  { intent: "contact", keywords: ["contact", "reach out", "email", "phone", "speak to someone", "talk to"] },
  { intent: "yes", keywords: [] }, // handled separately
  { intent: "no", keywords: [] },  // handled separately
];

const detectIntent = (text: string): Intent => {
  const lower = text.toLowerCase().trim();

  // Exact match for yes/no
  if (["yes", "yeah", "sure", "yep", "ok", "okay", "absolutely", "of course"].includes(lower)) return "yes";
  if (["no", "nope", "not now", "no thanks", "nah", "not really"].includes(lower)) return "no";

  // Check keyword patterns in priority order (crisis first!)
  for (const { intent, keywords } of intentPatterns) {
    if (keywords.some(kw => lower.includes(kw))) return intent;
  }
  return "unknown";
};

// ─── Prayer Generation Engine ───────────────────────────────
const topicScriptures: Record<string, string[]> = {
  health: [
    '"He heals the brokenhearted and binds up their wounds." — Psalm 147:3',
    '"By His stripes we are healed." — Isaiah 53:5',
    '"Dear friend, I pray that you may enjoy good health and that all may go well with you, even as your soul is getting along well." — 3 John 1:2',
  ],
  family: [
    '"As for me and my household, we will serve the LORD." — Joshua 24:15',
    '"Children are a heritage from the LORD, offspring a reward from him." — Psalm 127:3',
    '"Love is patient, love is kind. It does not envy, it does not boast." — 1 Corinthians 13:4',
  ],
  finances: [
    '"And my God will meet all your needs according to the riches of his glory in Christ Jesus." — Philippians 4:19',
    '"The LORD will open the heavens, the storehouse of his bounty, to send rain on your land in season and to bless all the work of your hands." — Deuteronomy 28:12',
    '"Give, and it will be given to you. A good measure, pressed down, shaken together and running over." — Luke 6:38',
  ],
  relationship: [
    '"Above all, love each other deeply, because love covers over a multitude of sins." — 1 Peter 4:8',
    '"Two are better than one, because they have a good return for their labor." — Ecclesiastes 4:9',
    '"Be completely humble and gentle; be patient, bearing with one another in love." — Ephesians 4:2',
  ],
  guidance: [
    '"Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight." — Proverbs 3:5-6',
    '"For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11',
    '"Your word is a lamp for my feet, a light on my path." — Psalm 119:105',
  ],
  general: scriptures,
};

const generatePrayer = (topic: string, userText: string): string => {
  const prayers: Record<string, string[]> = {
    health: [
      "Heavenly Father, we lift up this precious soul before You. Touch them with Your healing hand, Lord. Restore their body, strengthen their spirit, and let them feel Your presence in every moment. In Jesus' name, Amen. 🙏",
      "Lord God, the Great Physician, we ask for Your healing power over this situation. We declare healing, wholeness, and restoration. Surround them with Your peace and comfort. In Jesus' mighty name, Amen. 🙏",
    ],
    family: [
      "Father God, we bring this family before Your throne. Cover them with Your love, restore broken bonds, and fill their home with peace and unity. Let Your will be done in their household. In Jesus' name, Amen. 🙏",
      "Lord, You are the author of family. We ask for Your wisdom, patience, and love to flow through this family. Heal what is broken and strengthen what remains. In Jesus' name, Amen. 🙏",
    ],
    finances: [
      "Father, You are Jehovah Jireh, our Provider. We trust You to open doors of provision and opportunity. Bless the works of their hands and let them lack nothing. In Jesus' name, Amen. 🙏",
      "Lord, we declare Your abundance over this financial situation. Break every chain of lack and open windows of blessing. Give wisdom in stewardship and peace in the waiting. In Jesus' name, Amen. 🙏",
    ],
    relationship: [
      "Lord, we bring these hearts before You. Heal the wounds, mend what is broken, and let Your love be the foundation. Grant wisdom, patience, and grace in every interaction. In Jesus' name, Amen. 🙏",
    ],
    guidance: [
      "Father, You know the plans You have for us. We ask for clarity, direction, and peace in this decision. Illuminate the path ahead and give confidence to walk in it. In Jesus' name, Amen. 🙏",
      "Lord, remove every confusion and replace it with divine clarity. Order their steps in Your Word and let Your will be clear. In Jesus' mighty name, Amen. 🙏",
    ],
    general: [
      "Heavenly Father, we lift this need before You. You know every detail, every tear, every silent cry. We trust You to move mightily in this situation. In Jesus' name, Amen. 🙏",
      "Lord, we stand in agreement with this precious soul. Whatever they are going through, You are greater. Let Your power and love surround them today. In Jesus' name, Amen. 🙏",
    ],
  };

  const topicPrayers = prayers[topic] || prayers.general;
  return topicPrayers[Math.floor(Math.random() * topicPrayers.length)];
};

// ─── Main Reply Generator ───────────────────────────────────
const generateReply = (userText: string, messageHistory: Message[]): string => {
  const intent = detectIntent(userText);
  const conversationLength = messageHistory.filter(m => m.role === "user").length;

  switch (intent) {
    // 🚨 CRISIS — sensitive, caring, with helpline info
    case "crisis":
      return "I can see you're going through an incredibly difficult time, and I want you to know that YOUR LIFE MATTERS. God loves you deeply and so do we. 💛\n\nPlease reach out to someone who can help right now:\n\n🆘 International Suicide Hotline: 988 (US) / 116 123 (UK)\n🆘 Crisis Text Line: Text HOME to 741741\n🆘 Befrienders Worldwide: befrienders.org\n\nYou are not alone. We are praying for you:\n\n\"The LORD is close to the brokenhearted and saves those who are crushed in spirit.\" — Psalm 34:18\n\n👉 [Submit a Prayer Request](#/prayer-wall) and our global team will intercede for you. 🙏";

    // ⚠️ THREAT detection
    case "threat":
      return "I sense some strong emotions in your message. Whatever you're going through, please know that God offers a better way — a way of peace, healing, and restoration. 🙏\n\nIf you or someone else is in danger, please reach out for help:\n🆘 Emergency: Dial 911 (US) / 999 (UK) / 112 (EU)\n🆘 Crisis Line: 988 (US)\n\n\"Vengeance is mine, I will repay, says the Lord.\" — Romans 12:19\n\nLet us pray with you:\n👉 [Submit Prayer Request](#/prayer-wall)\n\nGod can turn any situation around. 💛";

    case "scripture":
      return `Here's a word from Scripture for you:\n\n${scriptures[Math.floor(Math.random() * scriptures.length)]}\n\nWould you like another verse, or tell me what you're going through and I can find a specific scripture for you?`;

    case "another_scripture":
      return `Here's another one for you:\n\n${scriptures[Math.floor(Math.random() * scriptures.length)]}\n\nGod's Word never runs out! Want another, or is there anything else I can help with?`;

    case "prayer_request":
      return "We would be honored to pray with you! 🙏\n\nYou can submit your prayer request here:\n👉 [Go to Prayer Wall](#/prayer-wall)\n\nOur intercessors across 54+ nations will stand with you in prayer.\n\nOr tell me what you need prayer for and I'll pray with you right here! 🙏";

    case "events":
      return "Our live prayer sessions bring believers together from around the world! 🌍\n\nCheck upcoming schedules and register here:\n👉 [View Events](#/events)\n\nYou can also tune in to our 24/7 Prayer Radio:\n👉 [Listen to Radio](#/radio)\n\nWould you like to know more?";

    case "about":
      return "Prayer Realm is a global prayer ministry dedicated to raising altars of prayer across nations. 🌍🙏\n\nWe operate in 54+ countries, hosting prayer sessions, worship broadcasts, and community outreach.\n\n👉 [Learn More About Us](#/about)\n\nWant to know how you can get involved?";

    case "volunteer":
      return "We'd love to have you on the team! 🎉\n\nYou can volunteer as a Prayer Intercessor, Worship Leader, Media/Tech Volunteer, Outreach Coordinator, and more.\n\nApply here and our coordinator will reach out within 3-5 days:\n👉 [Join as Volunteer](#/volunteer)\n\nIs there a specific role that interests you?";

    case "radio":
      return "Our 24/7 Prayer Radio plays continuous worship music, sermons, prayers, and announcements — like a live global broadcast! 📻✨\n\nYou can listen from any page using the mini player, or go to the full experience:\n👉 [Open Prayer Radio](#/radio)\n\nWould you like to know anything else?";

    case "donate":
      return "Thank you for your generous heart! 💛\n\nYou can sow a seed using Paystack or PayPal, including monthly partnership options:\n👉 [Give Now](#/give)\n\nEvery seed helps us reach more nations with prayer. Would you like to know more about how your donations are used?";

    case "greeting": {
      const greetings = [
        "Hello! 👋 Welcome to Prayer Realm! How can I help you today? You can ask about our ministry, prayer requests, events, volunteering, or I can share a scripture or even pray with you!",
        "Hi there! 🌟 Glad you're here. How can we serve you today? Feel free to ask me anything!",
        "Hey! 🙏 Welcome to the Prayer Realm family. What can I help you with today?",
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    case "thanks":
      return "God bless you abundantly! 🙏✨ It's a joy to connect with you. Is there anything else you'd like to know or any way we can pray with you?";

    case "yes":
      return "Great! 😊 Here are some things I can help with:\n\n📖 Say \"scripture\" for encouragement\n🙏 [Submit a Prayer Request](#/prayer-wall)\n🌍 [View Upcoming Events](#/events)\n🤝 [Volunteer With Us](#/volunteer)\n📻 [Listen to 24/7 Radio](#/radio)\n💛 [Partner / Give](#/give)\n\nOr tell me what's on your heart and I can pray with you right here! 🙏";

    case "no":
      return "No worries at all! 😊 Remember, God loves you and we're always here for you. Feel free to come back anytime you need prayer, encouragement, or just someone to talk to. God bless you! 🙏";

    // ─── Topic-specific prayer + scripture ─────────
    case "health": {
      const s = topicScriptures.health[Math.floor(Math.random() * topicScriptures.health.length)];
      const prayer = generatePrayer("health", userText);
      return `I'm so sorry to hear about this health situation. God is the Great Healer and He is with you. 💛\n\nLet me pray for you right now:\n\n${prayer}\n\n📖 ${s}\n\nWould you like to submit this to our Prayer Wall so our global intercessors can join in prayer?\n👉 [Submit Prayer Request](#/prayer-wall)`;
    }
    case "family": {
      const s = topicScriptures.family[Math.floor(Math.random() * topicScriptures.family.length)];
      const prayer = generatePrayer("family", userText);
      return `Family is so close to God's heart, and He cares deeply about yours. 💛\n\nLet me pray with you:\n\n${prayer}\n\n📖 ${s}\n\nWould you like our prayer team to intercede for your family?\n👉 [Submit Prayer Request](#/prayer-wall)`;
    }
    case "finances": {
      const s = topicScriptures.finances[Math.floor(Math.random() * topicScriptures.finances.length)];
      const prayer = generatePrayer("finances", userText);
      return `God is Jehovah Jireh — your Provider. He sees your situation and He is already working. 💛\n\nLet me pray for you:\n\n${prayer}\n\n📖 ${s}\n\nOur prayer warriors can stand with you:\n👉 [Submit Prayer Request](#/prayer-wall)`;
    }
    case "relationship": {
      const s = topicScriptures.relationship[Math.floor(Math.random() * topicScriptures.relationship.length)];
      const prayer = generatePrayer("relationship", userText);
      return `Relationships can be so challenging, but God is the mender of broken hearts. 💛\n\nLet me pray with you:\n\n${prayer}\n\n📖 ${s}\n\nLet our community pray with you:\n👉 [Submit Prayer Request](#/prayer-wall)`;
    }
    case "guidance": {
      const s = topicScriptures.guidance[Math.floor(Math.random() * topicScriptures.guidance.length)];
      const prayer = generatePrayer("guidance", userText);
      return `When we feel lost, God promises to make our paths straight. He has a plan for you! 💛\n\nLet me pray for direction:\n\n${prayer}\n\n📖 ${s}\n\nWant our prayer team praying too?\n👉 [Submit Prayer Request](#/prayer-wall)`;
    }

    case "sad": {
      const comfortScripture = scriptures[Math.floor(Math.random() * scriptures.length)];
      const prayer = generatePrayer("general", userText);
      return `I'm so sorry you're going through this. You are not alone — God sees you, loves you, and is with you right now. 💛\n\nLet me pray for you:\n\n${prayer}\n\n📖 ${comfortScripture}\n\nLet our global team intercede for you:\n👉 [Submit Prayer Request](#/prayer-wall)\n\nWould you like more scriptures or to talk about what's on your heart?`;
    }

    case "testimony":
      return "Praise God! 🙌✨ We love hearing testimonies of what God is doing!\n\nFeel free to share your testimony right here, or you can submit it on our Testimonies page so it encourages others worldwide:\n👉 [Share Testimony](#/testimonies)\n\nGod is good, always!";

    case "contact":
      return "We'd love to hear from you! 💌\n\nYou can reach our team directly:\n👉 [Contact Us](#/contact)\n\nOr tell me what you need and I'll do my best to help right here!";

    // ─── Fallback with conversation awareness ────
    default: {
      // Try to generate a prayer if user seems to be sharing something personal
      if (userText.length > 30) {
        const prayer = generatePrayer("general", userText);
        return `Thank you for sharing that with us. Let me pray with you right now:\n\n${prayer}\n\n${scriptures[Math.floor(Math.random() * scriptures.length)]}\n\nIs there anything specific you'd like to explore?\n📖 Say "scripture" for more encouragement\n🙏 [Submit Prayer Request](#/prayer-wall)\n🌍 [View Events](#/events)\n🤝 [Volunteer](#/volunteer)\n📻 [Radio](#/radio)\n💛 [Give](#/give)`;
      }

      if (conversationLength <= 1) {
        return "Thank you for reaching out! 🙏 I'm here to help however I can.\n\nHere's what I can do:\n📖 Say \"scripture\" for encouragement\n🙏 [Submit a Prayer Request](#/prayer-wall)\n🌍 [View Events](#/events)\n🤝 [Volunteer](#/volunteer)\n📻 [Listen to Radio](#/radio)\n💛 [Give / Partner](#/give)\n\nOr tell me what's on your heart and I'll pray with you! ✨";
      } else if (conversationLength <= 3) {
        return "I appreciate you reaching out! 😊\n\nCould you tell me more about what you're going through? I can:\n\n🙏 Pray with you right here\n📖 Share scriptures on any topic\n👉 [Prayer Wall](#/prayer-wall) | [Events](#/events) | [Volunteer](#/volunteer)\n👉 [Radio](#/radio) | [Give](#/give) | [Contact](#/contact)\n\nJust let me know! 💛";
      } else {
        const randomScripture = scriptures[Math.floor(Math.random() * scriptures.length)];
        const prayer = generatePrayer("general", userText);
        return `Thank you for this conversation! 🙏 Here's a prayer and a word for you:\n\n${prayer}\n\n📖 ${randomScripture}\n\nI'm here for as long as you need. What else can I help with?`;
      }
    }
  }
};

// Render message text with clickable links
// Supports markdown-style: [Link Text](#/route)
const renderMessageWithLinks = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\((#\/[^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the link as a styled anchor
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        className="font-semibold underline underline-offset-2 decoration-1"
        style={{ color: "#c8a45e" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  text: "Welcome to Prayer Realm 🌍 How can we pray with you today? You can tap one of the options below or type your own message!"
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addReply = (userText: string) => {
    const userMsg: Message = { role: "user", text: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    // Simulate a small typing delay for realism
    const typingDelay = 600 + Math.random() * 800;
    setTimeout(() => {
      const reply = generateReply(userText, updatedMessages);
      const assistantMsg: Message = { role: "assistant", text: reply, showFollowUp: true };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    addReply(input.trim());
    setInput("");
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setIsTyping(false);
    setInput("");
  };

  // Check if quick buttons should show (show at beginning or after a reset)
  const userMessageCount = messages.filter(m => m.role === "user").length;
  const showQuickButtons = userMessageCount === 0;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7
        }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-gold flex items-center justify-center shadow-lg"
        aria-label="Open chat"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-card rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col"
            style={{ height: "520px" }}
          >
            {/* Header */}
            <div className="gradient-navy px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌍</span>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-primary-foreground">Prayer Realm</h3>
                  <p className="text-xs text-primary-foreground/50">Online • Ready to pray</p>
                </div>
              </div>
              <button
                onClick={resetChat}
                title="Start new conversation"
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              >
                <RotateCcw size={14} className="text-primary-foreground/60" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-line ${msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-secondary-foreground rounded-bl-sm"
                      }`}
                  >
                    {renderMessageWithLinks(msg.text)}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary rounded-xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}

              {/* "Ask another question" prompt */}
              {!isTyping && userMessageCount >= 2 && messages[messages.length - 1]?.role === "assistant" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center pt-2"
                >
                  <button
                    onClick={resetChat}
                    className="text-xs px-4 py-2 rounded-full border border-accent/30 text-accent hover:bg-accent/10 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw size={12} />
                    Ask another question
                  </button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Buttons */}
            {showQuickButtons && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickButtons.map((btn) => (
                  <button
                    key={btn}
                    onClick={() => addReply(btn)}
                    className="text-xs px-3 py-1.5 rounded-full border border-accent/40 text-accent-foreground hover:bg-accent/10 transition-colors"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                disabled={isTyping}
                className="flex-1 bg-secondary rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="btn-gold p-2 rounded-md disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;