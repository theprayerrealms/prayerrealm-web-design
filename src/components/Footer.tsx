import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="gradient-navy text-primary-foreground">
      <div className="container-narrow py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
            <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/LOGO 2.png" alt="Prayer Realm" className="h-auto w-auto" />
              
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Raising Global Altars of Prayer. Connecting nations through the power of prayer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 gold-text">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "About Us", path: "/about" },
                { label: "Prayer Request", path: "/prayer-request" },
                { label: "Prayer Wall", path: "/prayer-wall" },
                { label: "Events", path: "/events" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Ministry */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 gold-text">Get Involved</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Volunteer", path: "/volunteer" },
                { label: "Testimonies", path: "/testimonies" },
                { label: "Sermons", path: "/sermons" },
                { label: "Give", path: "/give" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 gold-text">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/60">
              <p>info@prayerrealm.org</p>
              <p>WhatsApp: +1 (555) 000-0000</p>
              <div className="flex gap-3 mt-3">
                <span className="hover:text-accent cursor-pointer transition-colors">Facebook</span>
                <span className="hover:text-accent cursor-pointer transition-colors">YouTube</span>
                <span className="hover:text-accent cursor-pointer transition-colors">Instagram</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Prayer Realm International. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
