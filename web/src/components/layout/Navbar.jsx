import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import Button from "../ui/Button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/learn", label: "How It Works" },
  { to: "/demo", label: "For Clinics" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface/85 backdrop-blur-xl shadow-md border-b border-border/40"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto max-w-[1280px] flex items-center justify-between h-[72px] px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-deep-teal to-deep-teal-light text-white shadow-sm group-hover:shadow-glow transition-shadow duration-300">
            <Brain size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-navy-dark">Sah</span>
            <span className="text-deep-teal">ara</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5 bg-muted/80 border border-border/50 rounded-full px-1.5 py-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-deep-teal bg-surface shadow-sm"
                    : "text-text-secondary hover:text-text-primary",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth/login")}
          >
            Doctor Login
          </Button>
          <Button
            size="sm"
            className="shadow-sm hover:shadow-glow transition-shadow duration-300 px-5"
            onClick={() => navigate("/demo")}
          >
            Request Demo
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:bg-muted transition-colors cursor-pointer"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-navy-dark/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              className="absolute top-0 right-0 w-[280px] h-full bg-surface shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-5 h-[72px] border-b border-border/50">
                <span className="text-lg font-bold">
                  <span className="text-navy-dark">Echo</span>
                  <span className="text-deep-teal">Mind</span>
                </span>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 px-4 py-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "block px-4 py-3 rounded-lg text-[15px] font-medium transition-colors duration-150",
                          isActive
                            ? "text-deep-teal bg-deep-teal/6"
                            : "text-text-secondary hover:text-text-primary hover:bg-muted",
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <div className="px-4 pb-6 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/auth/login");
                  }}
                >
                  Doctor Login
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/demo");
                  }}
                >
                  Request Demo
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

Navbar.displayName = "Navbar";
export { Navbar };
export default Navbar;
