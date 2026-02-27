import { useState } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { Shield, Heart, CreditCard, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const amounts = [100, 200, 500, 1000, 2500, 5000];
const currencies = ["USD", "GBP", "EUR", "NGN", "KES", "GHS", "ZAR", "CAD", "AUD"];

const countryCodes = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+234", country: "NG" },
  { code: "+233", country: "GH" },
  { code: "+254", country: "KE" },
  { code: "+27", country: "ZA" },
  { code: "+91", country: "IN" },
  { code: "+61", country: "AU" },
  { code: "+353", country: "IE" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+81", country: "JP" },
  { code: "+971", country: "AE" },
];

const Give = () => {
  const [selected, setSelected] = useState<number | null>(100);
  const [custom, setCustom] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [recurring, setRecurring] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"select" | "processing">("select");
  const [selectedProvider, setSelectedProvider] = useState<"paystack" | "paypal" | null>(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = selected ?? (custom ? Number(custom) : 0);

  const handleGive = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!finalAmount || !email || !phone || !name) {
      setError("Please complete all required fields before proceeding.");
      return;
    }

    setShowPaymentModal(true);
    setPaymentStep("select");
  };

  const processPayment = (provider: "paystack" | "paypal") => {
    setSelectedProvider(provider);
    setPaymentStep("processing");
    setLoading(true);

    // Simulate "Redirecting, Payment processing on provider side, and Feedback"
    setTimeout(() => {
      setLoading(false);
      setShowPaymentModal(false);
      setSubmitted(true);
    }, 3000);
  };

  if (submitted) {
    return (
      <>
        <PageHero title="Thank You" subtitle="Your generosity makes a global impact" />
        <SectionWrapper>
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="gold-text" />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-4">God Bless You!</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Thank you for your seed of <strong>{currency} {finalAmount}</strong>.
              Your partnership enables us to raise global altars of prayer and reach more nations.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-gold">
              Give Again
            </button>
          </div>
        </SectionWrapper>
      </>
    );
  }

  return (
    <>
      <PageHero title="Give" subtitle="Partner with us in raising global altars of prayer" />
      <SectionWrapper>
        <div className="max-w-xl mx-auto">
          <div className="card-elevated p-8">
            <div className="text-center mb-8">
              <Heart size={32} className="gold-text mx-auto mb-3" />
              <h2 className="font-heading text-2xl font-bold mb-2">Support the Ministry</h2>
              <p className="text-muted-foreground text-sm">
                Your generous giving enables us to reach more nations with the power of prayer.
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              {/* Donor Info */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-24 bg-secondary border border-border rounded-md px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.country})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="000 000 0000"
                      className="flex-1 bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Currency */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5">Currency <span className="text-red-500">*</span></label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Amount Grid */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-3">Select Amount <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {amounts.map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => { setSelected(amt); setCustom(""); }}
                      className={`py-3 rounded-md text-sm font-semibold transition-all border ${selected === amt
                        ? "btn-gold border-transparent"
                        : "border-border hover:border-accent text-foreground"
                        }`}
                    >
                      {currency} {amt}
                    </button>
                  ))}
                </div>

                {/* Custom */}
                <div className="mt-4">
                  <input
                    type="number"
                    value={custom}
                    onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                    placeholder="Custom amount"
                    className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Recurring */}
              <label className="flex items-center gap-3 mb-8 cursor-pointer">
                <div
                  onClick={() => setRecurring(!recurring)}
                  className={`w-10 h-6 rounded-full flex items-center transition-colors cursor-pointer ${recurring ? "bg-accent justify-end" : "bg-secondary justify-start"
                    }`}
                >
                  <div className="w-5 h-5 bg-card rounded-full shadow mx-0.5" />
                </div>
                <span className="text-sm">Make this a monthly donation</span>
              </label>

              <button
                type="button"
                onClick={handleGive}
                className="btn-gold w-full py-3 text-base"
                disabled={loading}
              >
                {loading ? "Processing..." : (finalAmount ? `Give ${currency} ${finalAmount}${recurring ? "/month" : ""}` : "Select an Amount")}
              </button>

              {error && (
                <p className="text-red-500 text-xs text-center mt-3 animate-pulse font-medium">
                  {error}
                </p>
              )}
            </form>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
              <Shield size={14} /> Secure payment processing
            </div>
          </div>
        </div >
      </SectionWrapper >

      {/* Payment Selection Modal */}
      < Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal} >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-heading text-xl">Complete Your Donation</DialogTitle>
            <DialogDescription className="text-center">
              Choose your preferred payment method to proceed with your <strong>{currency} {finalAmount}</strong> seed.
            </DialogDescription>
          </DialogHeader>

          {paymentStep === "select" ? (
            <div className="grid gap-4 py-4">
              <button
                onClick={() => processPayment("paystack")}
                className="group flex items-center justify-between p-4 border rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Paystack</div>
                    <div className="text-xs text-muted-foreground">Cards, Bank Transfer, USSD</div>
                  </div>
                </div>
                <div className="gold-text opacity-0 group-hover:opacity-100 transition-opacity">Select &rarr;</div>
              </button>

              <button
                onClick={() => processPayment("paypal")}
                className="group flex items-center justify-between p-4 border rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">PayPal</div>
                    <div className="text-xs text-muted-foreground">International Cards, PayPal Balance</div>
                  </div>
                </div>
                <div className="gold-text opacity-0 group-hover:opacity-100 transition-opacity">Select &rarr;</div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="gold-spinner mb-4" />
              <p className="font-medium animate-pulse">
                Redirecting to {selectedProvider === "paystack" ? "Paystack Secure Checkout" : "PayPal Payment Gateway"}...
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Please do not close this window.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog >
    </>
  );
};

export default Give;
