"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useDictionary, useLocale } from "@/i18n/DictionaryProvider";

export function Contact() {
  const dictionary = useDictionary();
  const locale = useLocale();
  const { contact } = dictionary;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setStatus('success');
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = () => {
    if (status === 'success') {
      if (locale === 'ar') return "تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.";
      if (locale === 'tr') return "Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğim.";
      return "Your message has been sent successfully! I will contact you soon.";
    }
    if (status === 'error') {
      if (locale === 'ar') return "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى لاحقاً.";
      if (locale === 'tr') return "Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      return "An error occurred while sending the message. Please try again later.";
    }
    return null;
  };

  const getSubmitButtonText = () => {
    if (loading) {
      if (locale === 'ar') return "جاري الإرسال...";
      if (locale === 'tr') return "Gönderiliyor...";
      return "Sending...";
    }
    return contact.form.submit;
  };

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
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card p-8 rounded-2xl border border-border shadow-sm"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    {contact.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    disabled={loading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50"
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
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50"
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
                  required
                  disabled={loading}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none disabled:opacity-50"
                  placeholder={contact.form.message_placeholder}
                />
              </div>

              {status !== 'idle' && (
                <div className={`p-4 rounded-lg text-sm font-medium ${status === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {getStatusMessage()}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span>{getSubmitButtonText()}</span>
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
      </div>
    </footer>
  );
}
