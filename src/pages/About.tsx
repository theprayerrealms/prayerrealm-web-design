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
            Our <span className="red-text">Leadership</span> Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated individuals who lead our global mission to connect believers in prayer.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Prophet Akintunde Hezekiah", role: "Founder", image: "/images/team/founder.png" },
            { name: "Pastor Craig Femi", role: "Admin (Global)", image: "/images/team/media-director.png" },
            { name: "Minister B", role: "Global Music Director", image: "/images/team/music-director.png" },
            { name: "Pastor Sanmi Ayotunde", role: "Media & Tech Director (Global)", image: "/images/team/admin.png" },
            { name: "Grace Wilson", role: "Prayer Director (Global)", image: "/images/team/tech.png" },
            { name: "Pastor Emmanuel", role: "Project Director (Global)", image: "/images/team/prayer.png" },
          ].map((member, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-heading text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm">{member.role}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6">
                <p className="text-white text-sm font-medium">{member.role}</p>
                <p className="text-white/80 text-xs mt-1">Leading with passion and faith.</p>
              </div>
            </div>
          ))}
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
