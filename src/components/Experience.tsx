"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, Award, Edit3 } from "lucide-react";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { useAdmin } from "./AdminContext";

export function Experience() {
  const dictionary = useDictionary();
  const { experience } = dictionary;
  const { isEditMode, openEditor } = useAdmin();

  const experiences = Object.entries(experience.items || {}).map(([key, value]: [string, any]) => ({
    id: key,
    ...value,
    icon: key === 'university' ? <Award className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />
  }));

  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative group inline-block w-full"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4 inline-block relative">
            {experience.title}
            {isEditMode && (
              <button onClick={() => openEditor({ path: ['experience', 'title'], type: 'text', title: 'Edit Section Title' })} className="absolute -left-10 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="relative border-l-2 rtl:border-l-0 rtl:border-r-2 border-border/50 pl-8 rtl:pl-0 rtl:pr-8 mr-4 rtl:mr-0 rtl:ml-4 md:mr-0 md:ml-0 md:pl-0 md:rtl:pr-0 md:border-l-0 md:rtl:border-r-0">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border/50" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="absolute left-[-41px] rtl:left-auto rtl:right-[-41px] md:left-1/2 md:rtl:left-1/2 md:rtl:right-auto transform md:-translate-x-1/2 w-10 h-10 rounded-full bg-background border-4 border-primary flex items-center justify-center text-primary z-10 shadow-sm">
                  {exp.icon}
                </div>

                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pl-12 rtl:md:pl-0 rtl:md:pr-12" : "md:pr-12 rtl:md:pr-0 rtl:md:pl-12"}`}>
                  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative group/card">
                    {isEditMode && (
                      <button onClick={() => openEditor({ path: ['experience', 'items', exp.id], type: 'experience', title: 'Edit Experience' })} className="absolute top-4 right-4 z-10 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-md opacity-0 group-hover/card:opacity-100">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="flex items-center gap-2 text-primary text-sm font-bold mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{exp.title}</h3>
                    <h4 className="text-muted-foreground font-medium mb-4">{exp.org}</h4>
                    <p className="text-foreground/80 text-sm leading-relaxed">{exp.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isEditMode && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={() => openEditor({ path: ['experience', 'items', `new_exp_${Date.now()}`], type: 'experience', title: 'Add New Experience', isNew: true })}
                  className="bg-primary/10 text-primary border-2 border-dashed border-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <Edit3 className="w-5 h-5" /> Add New Experience
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
