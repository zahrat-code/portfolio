"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Key } from "lucide-react";

export default function AdminLogin() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const locale = params.lang as string;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال.");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
      });
      const data = await res.json();
      
      if (res.ok) {
        router.push(`/${locale}/admin/dashboard`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center relative z-10"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">لوحة التحكم الآمنة</h1>
        <p className="text-muted-foreground text-sm mb-8">
          {step === 1 ? "أدخل الإيميل وكلمة المرور للمتابعة" : "أدخل رمز التحقق المرسل لبريدك"}
        </p>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOTP} 
              className="space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 px-10 text-foreground text-center focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="password" 
                  placeholder="كلمة المرور" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 px-10 text-foreground text-center focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "جاري الإرسال..." : "طلب رمز الدخول (OTP)"}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyOTP} 
              className="space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="رمز التحقق (6 أرقام)" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full bg-background border border-border rounded-xl py-3 px-10 text-foreground text-center tracking-widest text-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "جاري التحقق..." : "تسجيل الدخول"}
              </button>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-sm text-muted-foreground hover:text-primary mt-4"
              >
                العودة
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
