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

  const projectList = [
    {
      title: projects.items?.routing?.title || "QoS Routing (RL)",
      description: projects.items?.routing?.description || "RL Project",
      tags: ["Java", "Swing", "Compiler Design", "Architecture"],
      github: "#",
      live: "#",
      color: "from-blue-500/20 to-indigo-500/20",
    },
    {
      title: projects.items?.packaging?.title || "Ambalaj Fabrikası",
      description: projects.items?.packaging?.description || "Packaging Site",
      tags: ["Next.js", "React", "CMS", "Tailwind CSS"],
      github: "#",
      live: null,
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: projects.items?.trendyol?.title || "Trendyol Clone",
      description: projects.items?.trendyol?.description || "E-commerce platform",
      tags: ["Node.js", "Express", "MongoDB Atlas", "REST API"],
      github: "#",
      live: "#",
      color: "from-emerald-500/20 to-teal-500/20",
    },
    // Placeholder for more projects
    {
      title: "Portfolio Website",
      description: "My personal portfolio website with multilingual support and dark mode.",
      tags: ["Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
      github: "#",
      live: "#",
      color: "from-orange-500/20 to-amber-500/20",
    }
  ];

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
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
              >
                <div className={`h-48 w-full bg-gradient-to-tr ${project.color} flex items-center justify-center relative overflow-hidden`}>
                  <Code className="w-16 h-16 text-foreground/20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-3">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-border mt-auto">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <FaGithub className="w-4 h-4" />
                        <span>{projects.view_code}</span>
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{projects.live_demo}</span>
                      </a>
                    )}
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
