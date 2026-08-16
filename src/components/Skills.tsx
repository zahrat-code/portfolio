"use client";

import { motion } from "framer-motion";
import { Code2, Database, Terminal, Edit3 } from "lucide-react";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { useAdmin } from "./AdminContext";

export function Skills() {
  const dictionary = useDictionary();
  const { skills } = dictionary;
  const { isEditMode, openEditor } = useAdmin();

  const skillCategories = [
    {
      id: 'languages',
      title: skills.categories.languages,
      icon: <Code2 className="w-6 h-6" />,
      items: skills.items?.languages || [],
    },
    {
      id: 'backend',
      title: skills.categories.backend,
      icon: <Database className="w-6 h-6" />,
      items: skills.items?.backend || [],
    },
    {
      id: 'tools',
      title: skills.categories.tools,
      icon: <Terminal className="w-6 h-6" />,
      items: skills.items?.tools || [],
    },
  ];

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative group inline-block w-full"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4 inline-block relative">
            {skills.title}
            {isEditMode && (
              <button onClick={() => openEditor({ path: ['skills', 'title'], type: 'text', title: 'Edit Section Title' })} className="absolute -left-10 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group/card relative"
            >
              {isEditMode && (
                <button onClick={() => openEditor({ path: ['skills', 'items', category.id], type: 'text', title: `Edit ${category.title} (Comma Separated)` })} className="absolute top-4 right-4 z-10 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-md opacity-0 group-hover/card:opacity-100">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <div className="p-6 border-b border-border bg-muted/30 flex items-center gap-4">
                <div className="p-3 bg-background rounded-lg text-primary shadow-sm group-hover/card:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground">{category.title}</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(category.items) ? category.items.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium border border-border"
                    >
                      {skill}
                    </span>
                  )) : (typeof category.items === 'string' ? category.items.split(',').map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium border border-border"
                    >
                      {skill.trim()}
                    </span>
                  )) : null)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
