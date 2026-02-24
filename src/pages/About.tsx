import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedCounter from "@/components/AnimatedCounter";
import { impactStats } from "@/data/siteData";
import { BookOpen, Heart, Globe, Users } from "lucide-react";

const values = [
  { icon: BookOpen, title: "Scripture-Centered", text: "Everything we do is rooted in the Word of God." },
  { icon: Heart, title: "Compassion", text: "We approach every prayer request with genuine love and care." },
  { icon: Globe, title: "Global Unity", text: "We transcend borders, cultures, and denominations." },
  { icon: Users, title: "Community", text: "We believe in the power of believers coming together." },
];

const About = () => {
  return (
    <>
      <PageHero title="About Us" subtitle="Discover the heart behind Prayer Realm" />

      <SectionWrapper>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Who We <span className="gold-text">Are</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Prayer Realm is an international, non-denominational prayer ministry with a singular mission: 
            to raise global altars of prayer. Founded on the belief that prayer is the most powerful force 
            available to humanity, we connect believers from every nation to pray, intercede, and seek 
            God's face together.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our team of dedicated intercessors, pastors, and volunteers work around the clock to ensure 
            that no prayer goes unheard. We believe that when the church prays, heaven moves.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-secondary">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-10">
          Our <span className="gold-text">Values</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-card rounded-lg p-6 text-center shadow-sm">
              <v.icon size={32} className="gold-text mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">{v.title}</h3>
              <p className="text-muted-foreground text-sm">{v.text}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper dark>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
          Our <span className="gold-gradient-text">Impact</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {impactStats.map((stat) => (
            <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </SectionWrapper>
    </>
  );
};

export default About;
