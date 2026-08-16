"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, Edit3 } from "lucide-react";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { useAdmin } from "./AdminContext";

export function About() {
  const dictionary = useDictionary();
  const { about } = dictionary;
  const { isEditMode, openEditor } = useAdmin();

  return (
    <section id="about" className="py-20 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative group inline-block w-full"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4 inline-block relative">
            {about.title}
            {isEditMode && (
              <button onClick={() => openEditor({ path: ['about', 'title'], type: 'text', title: 'Edit Section Title' })} className="absolute -left-10 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col relative group"
          >
            {isEditMode && (
              <button onClick={() => openEditor({ path: ['about', 'p1'], type: 'textarea', title: 'Edit Story' })} className="absolute top-4 right-4 z-10 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-md opacity-0 group-hover:opacity-100">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">{dictionary.experience?.experience_title || "القصة المهنية"}</h3>
            <p className="text-muted-foreground leading-relaxed flex-1">
              {about.p1}
            </p>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col relative group"
          >
            {isEditMode && (
              <button onClick={() => openEditor({ path: ['about', 'p2'], type: 'textarea', title: 'Edit Education Info' })} className="absolute top-4 right-4 z-10 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-md opacity-0 group-hover:opacity-100">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">{dictionary.experience?.education_title || "التعليم الأكاديمي"}</h3>
            <div className="mb-4">
              <h4 className="font-semibold text-foreground">{dictionary.experience?.items?.university?.title || "بكالوريوس هندسة حاسوب"}</h4>
              <p className="text-sm text-primary mb-2">{dictionary.experience?.items?.university?.org || "[اسم الجامعة] - [سنة التخرج]"}</p>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">
              {about.p2}
            </p>
          </motion.div>

          {/* Leadership */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col md:col-span-2 lg:col-span-1 relative group"
          >
            {isEditMode && (
              <button onClick={() => openEditor({ path: ['about', 'p3'], type: 'textarea', title: 'Edit Leadership Info' })} className="absolute top-4 right-4 z-10 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-md opacity-0 group-hover:opacity-100">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4 relative group/title inline-block">
              {about.subtitle}
              {isEditMode && (
                <button onClick={() => openEditor({ path: ['about', 'subtitle'], type: 'text', title: 'Edit Leadership Title' })} className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-colors opacity-0 group-hover/title:opacity-100">
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </h3>
            <p className="text-muted-foreground leading-relaxed flex-1">
              {about.p3}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
