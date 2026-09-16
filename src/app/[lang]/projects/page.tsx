"use client";

import { useDictionary } from "@/i18n/DictionaryProvider";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { ExternalLink, Code, ArrowLeft, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectsPage() {
  const dictionary = useDictionary();
  const { projects } = dictionary;
  const params = useParams();
  const lang = params.lang as string;

  const projectList = Object.entries(projects.items || {}).map(([key, value]: [string, any]) => ({
    id: key,
    ...value
  }));

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <Link 
              href={`/${lang}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{dictionary.navbar.home}</span>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{projects.view_all}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">{projects.subtitle}</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectList.map((project, index) => (
              <motion.div
                key={project.id || project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
              >
                <Link 
                  href={`/${lang}/projects/${project.id}`}
                  className={`h-48 w-full bg-gradient-to-tr ${project.color || 'from-blue-500/20 to-indigo-500/20'} flex items-center justify-center relative overflow-hidden block group/img`}
                >
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Code className="w-16 h-16 text-foreground/20 group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 bg-background/90 text-foreground text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                      {projects.view_details || "عرض التفاصيل"}
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <Link href={`/${lang}/projects/${project.id}`} className="hover:text-primary transition-colors">
                    <h3 className="text-xl font-bold text-foreground mb-3">{project.title}</h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-1">
                    {project.description}
                  </p>

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
          </div>
          
        </div>
      </div>
    </main>
  );
}
