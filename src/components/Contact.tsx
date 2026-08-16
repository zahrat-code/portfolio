"use client";

import { motion } from "framer-motion";
import { Send, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useDictionary, useLocale } from "@/i18n/DictionaryProvider";

export function Contact() {
  const dictionary = useDictionary();
  const locale = useLocale();
  const { contact } = dictionary;

  return (
    <footer id="contact" className="bg-muted/30 pt-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">{contact.title}</h2>
          {contact.subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {contact.subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form (UI Only) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card p-8 rounded-2xl border border-border shadow-sm"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    {contact.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder={contact.form.name_placeholder}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    {contact.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder={contact.form.email_placeholder}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  {contact.form.message}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                  placeholder={contact.form.message_placeholder}
                />
              </div>
              <button
                type="button"
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <span>{contact.form.submit}</span>
                <Send className={`w-4 h-4 rtl:-scale-x-100`} />
              </button>
            </form>
          </motion.div>

          {/* Social Links and Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col justify-center space-y-8 lg:pl-12 rtl:lg:pl-0 rtl:lg:pr-12"
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">{contact.info.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {contact.info.desc}
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:alialzahrat387@gmail.com"
                className="flex items-center gap-4 text-foreground hover:text-primary transition-colors p-4 bg-background rounded-xl border border-border group"
              >
                <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{contact.info.email_label}</p>
                  <p className="font-bold font-mono">alialzahrat387@gmail.com</p>
                </div>
              </a>

              <div className="flex gap-4">
                <a
                  href="https://github.com/zahrat-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 p-4 bg-background rounded-xl border border-border text-foreground hover:text-primary transition-colors group"
                >
                  <FaGithub className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/ali-al-zahrat-714bb2202/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 p-4 bg-background rounded-xl border border-border text-foreground hover:text-[#0a66c2] transition-colors group"
                >
                  <FaLinkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-border mt-12 py-6 text-center text-sm text-muted-foreground" dir="ltr">
        <p>© {new Date().getFullYear()} {dictionary.hero.name.replace('.', '')}. {contact.footer.rights}</p>
        <p className="mt-1">{contact.footer.built_with}</p>
      </div>
    </footer>
  );
}
