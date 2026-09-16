"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Edit3, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Sparkles 
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Navbar } from "@/components/Navbar";
import { useDictionary, useLocale } from "@/i18n/DictionaryProvider";
import { useAdmin } from "@/components/AdminContext";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lang = (params.lang as string) || "ar";
  const projectId = params.id as string;
  const dictionary = useDictionary();
  const { projects } = dictionary;
  const { isEditMode, openEditor } = useAdmin();

  // Find the project data
  const project = projects?.items?.[projectId];

  // Gallery state
  const allImages: string[] = [];
  if (Array.isArray(project?.images) && project.images.length > 0) {
    allImages.push(...project.images);
  } else if (project?.image) {
    allImages.push(project.image);
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!project) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Navbar />
        <div className="max-w-md p-8 bg-card border border-border rounded-2xl shadow-xl mt-20">
          <Code2 className="w-16 h-16 text-primary mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold text-foreground mb-3">المشروع غير موجود / Project Not Found</h2>
          <p className="text-muted-foreground mb-6">
            تعذر العثور على هذا المشروع، قد يكون تم نقله أو حذفه.
          </p>
          <Link
            href={`/${lang}#projects`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg"
          >
            {lang === "ar" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{projects?.back_to_projects || "العودة للمشاريع"}</span>
          </Link>
        </div>
      </main>
    );
  }

  const nextImage = () => {
    if (allImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    if (allImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link
              href={`/${lang}#projects`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors bg-card border border-border px-4 py-2 rounded-full shadow-sm"
            >
              {lang === "ar" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{projects?.back_to_projects || (lang === "ar" ? "العودة للمشاريع" : "Back to Projects")}</span>
            </Link>

            {isEditMode && (
              <button
                onClick={() => openEditor({ 
                  path: ['projects', 'items', projectId], 
                  type: 'project', 
                  title: `Edit ${project.title}` 
                })}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary/90 transition-all shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span>تعديل المشروع / Edit Project</span>
              </button>
            )}
          </div>

          {/* Project Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
              {project.title}
            </h1>

            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {project.description}
            </p>

            {/* Action Buttons (Links) */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-card border border-border rounded-xl font-bold text-foreground hover:text-primary hover:border-primary transition-all shadow-sm group"
                >
                  <FaGithub className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{projects?.view_code || "الكود المصدري"}</span>
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>{projects?.live_demo || "معاينة حية"}</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Interactive Image Gallery */}
          {allImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-14"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border bg-muted/20 shadow-xl group">
                
                {/* Main Active Image Display */}
                <div 
                  className="relative aspect-video max-h-[550px] w-full flex items-center justify-center bg-black/5 dark:bg-black/40 overflow-hidden cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={allImages[activeImageIndex]}
                    alt={`${project.title} - Image ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain md:object-cover transition-all duration-300"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 sm:p-6 text-white pointer-events-none">
                    <span className="text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      {activeImageIndex + 1} / {allImages.length}
                    </span>
                    <span className="text-sm font-bold flex items-center gap-1.5 bg-primary px-3.5 py-1.5 rounded-lg shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                      <span>{lang === "ar" ? "تكبير الصورة" : "Enlarge Photo"}</span>
                    </span>
                  </div>
                </div>

                {/* Left / Right Carousel Controls */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition-all shadow-lg hover:scale-110 z-10 opacity-80 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition-all shadow-lg hover:scale-110 z-10 opacity-80 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shadow-sm ${
                        activeImageIndex === idx 
                          ? "border-primary ring-2 ring-primary/30 scale-105" 
                          : "border-border opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Project Details Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Main Column: Overview & Features */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Detailed Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {projects?.overview || (lang === "ar" ? "نظرة عامة عن المشروع" : "Project Overview")}
                  </h2>
                </div>

                <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                  {project.longDescription || project.description}
                </div>
              </motion.div>

              {/* Key Features */}
              {Array.isArray(project.features) && project.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      {projects?.features_title || (lang === "ar" ? "الميزات الرئيسية" : "Key Features")}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {project.features.map((feat: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-foreground text-sm leading-relaxed font-medium">
                          {feat}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>

            {/* Sidebar Column: Tech Specs & Summary Card */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6"
              >
                <div className="flex items-center gap-2.5 pb-4 border-b border-border">
                  <Layers className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg text-foreground">
                    {projects?.tech_stack_title || (lang === "ar" ? "التقنيات المستخدمة" : "Technologies")}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag: string) => (
                    <div
                      key={tag}
                      className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold text-foreground flex items-center gap-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Info */}
                <div className="pt-4 border-t border-border space-y-3 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">{lang === "ar" ? "عدد الصور" : "Screenshots"}</span>
                    <span className="font-bold text-foreground">{allImages.length}</span>
                  </div>
                  {project.github && (
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">GitHub</span>
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">
                        {lang === "ar" ? "مستودع الكود" : "Repository"}
                      </a>
                    </div>
                  )}
                  {project.live && (
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">{lang === "ar" ? "الرابط المباشر" : "Live URL"}</span>
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">
                        {lang === "ar" ? "معاينة حية" : "Visit Site"}
                      </a>
                    </div>
                  )}
                </div>

                {/* Return Button */}
                <Link
                  href={`/${lang}#projects`}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-muted hover:bg-muted/80 text-foreground text-sm font-bold rounded-xl transition-colors"
                >
                  <span>{projects?.back_to_projects || "العودة للمشاريع"}</span>
                </Link>
              </motion.div>
            </div>

          </div>

        </div>
      </div>

      {/* Lightbox Modal for Fullscreen Image View */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image View */}
            <div 
              className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={allImages[activeImageIndex]}
                alt="Enlarged screenshot"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute -left-12 sm:left-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-black text-white rounded-full transition-all shadow-xl"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute -right-12 sm:right-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-black text-white rounded-full transition-all shadow-xl"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
                {activeImageIndex + 1} / {allImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
