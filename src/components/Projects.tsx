"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code, Edit3 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useDictionary } from "@/i18n/DictionaryProvider";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdmin } from "./AdminContext";

export function Projects() {
  const dictionary = useDictionary();
  const { projects } = dictionary;
  const params = useParams();
  const lang = params.lang as string;
  const { isEditMode, openEditor } = useAdmin();

  // Convert the items object into an array
  const projectList = Object.entries(projects.items || {}).map(([key, value]: [string, any]) => ({
    id: key,
    ...value
  }));

  return (
    <section id="projects" className="py-20 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative group inline-block w-full"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4 inline-block relative">
            {projects.title}
            {isEditMode && (
              <button onClick={() => openEditor({ path: ['projects', 'title'], type: 'text', title: 'Edit Section Title' })} className="absolute -left-10 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {projectList.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative group/card"
            >
              {isEditMode && (
                <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity backdrop-blur-sm">
                  <button onClick={() => openEditor({ path: ['projects', 'items', project.id], type: 'project', title: 'Edit Project' })} className="bg-primary text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-xl">
                    <Edit3 className="w-5 h-5" /> Edit Project
                  </button>
                </div>
              )}

              {/* Project Image */}
              <Link 
                href={`/${lang}/projects/${project.id}`}
                className={`h-48 w-full bg-gradient-to-tr ${project.color || 'from-blue-500/20 to-indigo-500/20'} flex items-center justify-center relative overflow-hidden block group/img`}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Code className="w-16 h-16 text-foreground/20 group-hover/card:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3.5 py-1.5 bg-background/90 text-foreground text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                    {projects.view_details || "عرض التفاصيل"}
                  </span>
                </div>
              </Link>

              {/* Project Content */}
              <div className="p-6 flex flex-col flex-1">
                <Link href={`/${lang}/projects/${project.id}`} className="hover:text-primary transition-colors">
                  <h3 className="text-xl font-bold text-foreground mb-3">{project.title}</h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <FaGithub className="w-3.5 h-3.5" />
                        <span>{projects.view_code}</span>
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{projects.live_demo}</span>
                      </a>
                    )}
                  </div>
                  <Link
                    href={`/${lang}/projects/${project.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>{projects.view_details || "التفاصيل"}</span>
                    <span className="rtl:rotate-180">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Add New Project Button */}
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border-2 border-dashed border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center min-h-[400px] cursor-pointer hover:bg-muted/50 group"
              onClick={() => openEditor({ path: ['projects', 'items', `new_project_${Date.now()}`], type: 'project', title: 'Add New Project', isNew: true })}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <Edit3 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Add New Project</h3>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
