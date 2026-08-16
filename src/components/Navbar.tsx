"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@wrksz/themes/client";
import { Menu, X, Moon, Sun, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDictionary, useLocale } from "@/i18n/DictionaryProvider";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "./AdminContext";
import { Edit3 } from "lucide-react";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dictionary = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isEditMode, setIsEditMode } = useAdmin();

  useEffect(() => setMounted(true), []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: dictionary.navbar.home, href: "#home" },
    { name: dictionary.navbar.about, href: "#about" },
    { name: dictionary.navbar.skills, href: "#skills" },
    { name: dictionary.navbar.projects, href: "#projects" },
    { name: dictionary.navbar.experience, href: "#experience" },
    { name: dictionary.navbar.contact, href: "#contact" },
  ];

  const switchLanguage = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale; 
    router.push(segments.join('/'));
  };

  return (
    <div className="fixed top-4 w-full z-50 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-7xl mx-auto bg-background/90 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 transition-all duration-300">
        <div className="flex items-center justify-between h-16">
          {/* Language Switcher */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <div className="flex bg-muted/50 rounded-lg p-1" dir="ltr">
              <button 
                onClick={() => switchLanguage('ar')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${locale === 'ar' ? 'bg-primary text-white shadow-sm' : 'text-foreground hover:bg-muted'}`}
              >
                AR
              </button>
              <button 
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${locale === 'en' ? 'bg-primary text-white shadow-sm' : 'text-foreground hover:bg-muted'}`}
              >
                EN
              </button>
              <button 
                onClick={() => switchLanguage('tr')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${locale === 'tr' ? 'bg-primary text-white shadow-sm' : 'text-foreground hover:bg-muted'}`}
              >
                TR
              </button>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-baseline gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {mounted ? (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative inline-flex h-8 w-16 items-center rounded-full bg-slate-200 dark:bg-slate-800 border border-border shadow-inner transition-colors focus:outline-none"
                dir="ltr"
                aria-label="Toggle Dark Mode"
              >
                <span className="absolute left-1 flex h-6 w-6 items-center justify-center">
                  <Sun className="h-3.5 w-3.5 text-orange-500" />
                </span>
                <span className="absolute right-1 flex h-6 w-6 items-center justify-center">
                  <Moon className="h-3.5 w-3.5 text-slate-400" />
                </span>
                <span
                  className={`${
                    theme === "dark" ? "translate-x-8 bg-slate-700" : "translate-x-1 bg-white shadow-md"
                  } inline-block h-6 w-6 transform rounded-full transition-transform duration-300 z-10 flex items-center justify-center`}
                >
                </span>
              </button>
            ) : (
              <div className="h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            )}
            {pathname?.includes('/admin/dashboard') && (
              <button
                onClick={() => {
                  router.push(`/${locale}`);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
              >
                <Edit3 className="w-4 h-4" />
                <span>خروج من التعديل</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {mounted ? (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative inline-flex h-8 w-16 items-center rounded-full bg-slate-200 dark:bg-slate-800 border border-border shadow-inner transition-colors focus:outline-none"
                dir="ltr"
                aria-label="Toggle Dark Mode"
              >
                <span className="absolute left-1 flex h-6 w-6 items-center justify-center">
                  <Sun className="h-3.5 w-3.5 text-orange-500" />
                </span>
                <span className="absolute right-1 flex h-6 w-6 items-center justify-center">
                  <Moon className="h-3.5 w-3.5 text-slate-400" />
                </span>
                <span
                  className={`${
                    theme === "dark" ? "translate-x-8 bg-slate-700" : "translate-x-1 bg-white shadow-md"
                  } inline-block h-6 w-6 transform rounded-full transition-transform duration-300 z-10 flex items-center justify-center`}
                >
                </span>
              </button>
            ) : (
              <div className="h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            )}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-foreground hover:bg-muted transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border border-border/50 shadow-lg rounded-2xl mt-2 overflow-hidden mx-auto max-w-7xl"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:text-primary hover:bg-muted block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
