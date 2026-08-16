"use client";

import { motion } from "framer-motion";
import { Code } from "lucide-react";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { useAdmin } from "./AdminContext";
import { Edit3 } from "lucide-react";

export function Hero() {
  const dictionary = useDictionary();
  const { hero } = dictionary;
  const { isEditMode, openEditor } = useAdmin();

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-24 relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/40 rounded-full blur-[100px] z-0 opacity-80 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/30 rounded-full blur-[100px] z-0 opacity-80 -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-tight tracking-tight relative group">
              {hero.greeting} <br />
              <span className="text-primary inline-block mt-2">{hero.name}</span>
              {isEditMode && (
                <button onClick={() => openEditor({ path: ['hero', 'name'], type: 'text', title: 'Edit Name' })} className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
            </h1>
            <h2 className="text-xl md:text-2xl text-secondary font-bold mb-6 relative group inline-block">
              {hero.role}
              {isEditMode && (
                <button onClick={() => openEditor({ path: ['hero', 'role'], type: 'text', title: 'Edit Role' })} className="absolute -left-10 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed font-medium relative group">
              {hero.description}
              {isEditMode && (
                <button onClick={() => openEditor({ path: ['hero', 'description'], type: 'textarea', title: 'Edit Description' })} className="absolute -left-10 top-0 p-1.5 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                {hero.view_projects}
              </a>
              <a
                href="#contact"
                className="bg-background text-foreground px-8 py-3.5 rounded-full font-bold border-2 border-border hover:border-secondary hover:text-secondary transition-all shadow-sm"
              >
                {hero.contact_me}
              </a>
            </div>
          </motion.div>

          {/* Visual Content (Avatar & Backdrop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end mt-12 lg:mt-0"
          >
            {/* Geometric Network Pattern (3D connecting lines) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 rtl:left-auto rtl:right-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] pointer-events-none z-0 [mask-image:linear-gradient(to_left,black_20%,transparent_60%)] rtl:[mask-image:linear-gradient(to_right,black_20%,transparent_60%)] opacity-80">
              <svg className="w-full h-full text-slate-300 dark:text-slate-600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="3d-lines" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
                    <g stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M-50,-50 L100,75 L250,-25 L350,100" />
                      <path d="M-50,350 L75,225 L200,300 L350,350" />
                      <path d="M100,75 L75,225 L175,150 Z" />
                      <path d="M250,-25 L175,150 L300,125 Z" />
                      <path d="M300,125 L200,300 L350,100" />
                      <path d="M75,225 L-50,150 L100,75" />
                      <path d="M200,300 L175,150" />
                      <path d="M300,125 L350,100" />
                    </g>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#3d-lines)" />
              </svg>
            </div>

            <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center mt-8 md:mt-0">
              
              {/* Outer Blue Circle Background (Thin elegant ring) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/80 to-blue-400/50 rounded-full shadow-2xl opacity-100" />
              
              {/* Profile Image container */}
              <div className="absolute inset-2 rounded-full overflow-hidden shadow-inner bg-card z-10 border-2 border-background group/img">
                <img 
                  src="/profile.jpg" 
                  alt="علي الزهرات"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://ui-avatars.com/api/?name=علي+الزهرات&size=512&background=random";
                  }}
                />
                {isEditMode && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <button onClick={() => openEditor({ path: [], type: 'image', title: 'Upload Profile Image', fileName: 'profile.jpg' })} className="bg-primary text-white p-3 rounded-full flex items-center gap-2 font-bold shadow-lg">
                      <Edit3 className="w-5 h-5" /> Change Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Floating Orange Code Icon (</>) */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-4 left-4 md:left-10 bg-primary w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 border-4 border-background z-20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                  <line x1="14" y1="4" x2="10" y2="20"></line>
                </svg>
              </motion.div>

              {/* Floating Code Snippet Card */}
              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -top-6 -right-8 md:-right-16 bg-card rounded-xl shadow-xl border border-border p-3 hidden md:block z-20"
                dir="ltr"
              >
                <div className="flex gap-1.5 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <pre className="text-[10px] font-mono text-muted-foreground">
                  <span className="text-purple-500">const</span> <span className="text-blue-500">dev</span> = {"{"}<br/>
                  &nbsp;&nbsp;name: <span className="text-orange-500">'Ali'</span>,<br/>
                  &nbsp;&nbsp;role: <span className="text-orange-500">'Engineer'</span><br/>
                  {"}"};
                </pre>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
