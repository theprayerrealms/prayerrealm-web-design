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
      <SectionWrapper className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Meet Our <span className="red-text">Founder</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A man of prayer raised to ignite altars across nations.
          </p>
        </div>

        {/* Founder Profile */}
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start max-w-5xl mx-auto">
          {/* Founder Image */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-4 ring-primary/20">
              <img
                src="/images/team/founder.png"
                alt="Prophet Akintunde Hezekiah"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="mt-5 text-center">
              <h3 className="font-heading text-2xl font-bold">Prophet Akintunde Hezekiah</h3>
              <p className="text-primary font-semibold text-sm mt-1 gold-text">Founder, PrayerRealms Global</p>
            </div>
          </div>

          {/* Bio & Ministry Description */}
          <div className="flex-1 space-y-6 text-muted-foreground leading-relaxed">
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                About the <span className="gold-text">Founder</span>
              </h3>
              <p>
                {/* Replace this with the founder's biography */}
                The journey of Akintunde Hezekiah is a powerful testament to the transformative power of a life yielded to the Prayer Mantle of Deliverance. From his early life, God began a deep work in him, graciously saving his soul from what he describes as the "torrents of wickedness" and preserving him to fulfill a distinct heavenly mandate. This early encounter with the divine laid the foundation for a man whose heart would eventually beat in sync with God's burden for a generation.
              </p>
              <p className="mt-4">
                {/* Additional personal details */}
                As he matured in faith, God placed an intense burden for prayer on his heart—a spiritual weight that sought the liberation of destinies held captive. This vision, rooted in effectual fervent prayer, eventually gave birth to PrayerRealms Global. The ministry was birthed not as a mere organization, but as a revival movement designed to bring many to the revelational knowledge of Christ’s authority.Key milestones in his ministry, such as the WRESTLE revival movements across Nigerian campuses and cities like Lagos and Osogbo, reflect his character, a blend of deep humility and fierce dedication to spiritual warfare. Hezekiah remains a vessel through which spontaneous songs in the night and prophetic chants are birthed, always pointing his followers back to the secret place of intimacy with the Father.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8">
            Our <span className="gold-text">Mission</span>
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              Prayerrealms is God's end-time agenda for the rebirth of revival across the nations. 
              Prayerrealms is a prophetic prayer movement that cuts across denominational walls, doctrinal believes, and barriers.
            </p>
            <p>
              Prayerrealms is a ministry expression where people gather to prayerfully undo every evil work, exercising the authority of Christ over all the powers of the enemy.
            </p>
            <p>
              Prayerrealms is a Christian battle cry, a deliverance prayer altar marked by the HolyGhost fireworks and the emergence of an end-time kingdom army.
            </p>
          </div>
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
