import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Brain, ArrowUpRight } from "lucide-react";
import { cn } from "../../utils/cn";

const quickLinks = [
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/research", label: "Research" },
  { to: "/contact", label: "Contact" },
];

const legalLinks = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/disclaimer", label: "Disclaimer" },
];

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="relative border-t border-border/50 bg-surface-warm">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-14">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-deep-teal to-deep-teal-light text-white flex items-center justify-center">
                <Brain size={16} />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-navy-dark">Sah</span>
                <span className="text-deep-teal">ara</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              AI-powered vocal biomarker analysis for early cognitive screening.
              Backed by peer-reviewed research.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-[0.15em] mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1 text-sm text-text-secondary hover:text-deep-teal transition-colors duration-200"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-[0.15em] mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1 text-sm text-text-secondary hover:text-deep-teal transition-colors duration-200"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-[0.15em] mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-text-muted mb-4 leading-relaxed">
              Get the latest insights on vocal biomarker research and cognitive
              health.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="flex-1 h-10 px-4 rounded-lg border border-border bg-surface text-sm placeholder:text-text-muted/60 focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/10 outline-none transition-all duration-200"
              />
              <button
                type="submit"
                className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-r from-deep-teal to-deep-teal-light text-white flex items-center justify-center hover:shadow-glow transition-shadow duration-300 cursor-pointer"
                aria-label="Subscribe"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* Disclaimer + Bottom */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-[11px] text-text-muted/70 leading-relaxed max-w-4xl mb-4">
            <strong className="font-semibold text-text-muted">
              Disclaimer:
            </strong>{" "}
            Sahara is a screening tool and is not a substitute for professional
            medical advice, diagnosis, or treatment. Always seek the advice of a
            qualified healthcare provider. If you are in crisis, contact your
            local emergency services immediately.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-[11px] text-text-muted/50">
              © {new Date().getFullYear()} Sahara. All rights reserved.
            </p>
            <p className="text-[11px] text-text-muted/40">
              Made with care for families everywhere.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";
export { Footer };
export default Footer;
