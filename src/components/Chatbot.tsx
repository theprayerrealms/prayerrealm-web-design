import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const quickButtons = [
  "Submit Prayer Request",
  "Get Encouragement Scripture",
  "Join Live Prayer",
];

const scriptures = [
  '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11',
  '"Cast all your anxiety on Him because He cares for you." — 1 Peter 5:7',
  '"The LORD is close to the brokenhearted and saves those who are crushed in spirit." — Psalm 34:18',
  '"I can do all things through Christ who strengthens me." — Philippians 4:13',
  '"Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go." — Joshua 1:9',
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Welcome to Prayer Realm 🌍 How can we pray with you today?" },
  ]);
  const [input, setInput] = useState("");

  const addReply = (userText: string) => {
    const newMessages: Message[] = [...messages, { role: "user", text: userText }];

    let reply = "Thank you for reaching out. Our prayer team is here for you. 🙏";

    if (userText.toLowerCase().includes("scripture") || userText.toLowerCase().includes("encouragement")) {
      reply = scriptures[Math.floor(Math.random() * scriptures.length)];
    } else if (userText.toLowerCase().includes("prayer request")) {
      reply = "We would be honored to pray with you. Please visit our Prayer Request page to submit your request, and our team will intercede on your behalf. 🙏";
    } else if (userText.toLowerCase().includes("live prayer") || userText.toLowerCase().includes("join")) {
      reply = "Our next live prayer session is coming up soon! Check our Events page for the schedule and join believers around the world in prayer. 🌍";
    }

    setMessages([...newMessages, { role: "assistant", text: reply }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addReply(input.trim());
    setInput("");
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
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
            style={{ height: "480px" }}
          >
            {/* Header */}
            <div className="gradient-navy px-4 py-3 flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <div>
                <h3 className="font-heading text-sm font-semibold text-primary-foreground">Prayer Realm</h3>
                <p className="text-xs text-primary-foreground/50">Online • Ready to pray</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Buttons */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickButtons.map((btn) => (
                  <button
                    key={btn}
                    onClick={() => addReply(btn)}
                    className="text-xs px-3 py-1.5 rounded-full border border-accent text-accent-foreground hover:bg-accent/10 transition-colors"
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
                className="flex-1 bg-secondary rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button onClick={handleSend} className="btn-gold p-2 rounded-md">
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
