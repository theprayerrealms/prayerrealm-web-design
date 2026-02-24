import { useState } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { Shield, Heart } from "lucide-react";

const amounts = [10, 25, 50, 100, 250, 500];
const currencies = ["USD", "GBP", "EUR", "NGN", "KES", "GHS", "ZAR", "CAD", "AUD"];

const Give = () => {
  const [selected, setSelected] = useState<number | null>(50);
  const [custom, setCustom] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [recurring, setRecurring] = useState(false);

  const finalAmount = selected ?? (custom ? Number(custom) : 0);

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

            {/* Currency */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1.5">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Amount Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelected(amt); setCustom(""); }}
                  className={`py-3 rounded-md text-sm font-semibold transition-all border ${
                    selected === amt
                      ? "btn-gold border-transparent"
                      : "border-border hover:border-accent text-foreground"
                  }`}
                >
                  {currency} {amt}
                </button>
              ))}
            </div>

            {/* Custom */}
            <div className="mb-6">
              <input
                type="number"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                placeholder="Custom amount"
                className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Recurring */}
            <label className="flex items-center gap-3 mb-8 cursor-pointer">
              <div
                onClick={() => setRecurring(!recurring)}
                className={`w-10 h-6 rounded-full flex items-center transition-colors cursor-pointer ${
                  recurring ? "bg-accent justify-end" : "bg-secondary justify-start"
                }`}
              >
                <div className="w-5 h-5 bg-card rounded-full shadow mx-0.5" />
              </div>
              <span className="text-sm">Make this a monthly donation</span>
            </label>

            <button className="btn-gold w-full py-3 text-base" disabled={!finalAmount}>
              {finalAmount ? `Give ${currency} ${finalAmount}${recurring ? "/month" : ""}` : "Select an Amount"}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
              <Shield size={14} /> Secure payment processing
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
};

export default Give;
