"use client";

import { useAdmin } from "./AdminContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Upload, Trash2, Image as ImageIcon, Plus, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export function GlobalEditModal() {
  const { isEditMode, editConfig, closeEditor } = useAdmin();
  const [allDicts, setAllDicts] = useState<{ ar: any; en: any; tr: any } | null>(null);
  const [values, setValues] = useState<{ en: any; ar: any; tr: any }>({ en: "", ar: "", tr: "" });
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string>("");
  const [galleryItems, setGalleryItems] = useState<{ id: string; url: string; file?: File }[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const locale = params.lang as string;

  // Fetch all dictionaries when the modal opens
  useEffect(() => {
    if (editConfig && isEditMode) {
      if (editConfig.type === 'image' || editConfig.type === 'file') {
        setValues({ en: null, ar: null, tr: null });
        setAllDicts(null);
      } else {
        setLoading(true);
        fetch('/api/get-dictionaries')
          .then((res) => res.json())
          .then((data) => {
            setAllDicts(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            alert("Failed to load multilingual data.");
            setLoading(false);
          });
      }
    } else {
      setAllDicts(null);
    }
  }, [editConfig, isEditMode]);

  // Extract current values for all three languages
  useEffect(() => {
    if (editConfig && allDicts) {
      const initialValues: any = { en: "", ar: "", tr: "" };
      const localesList = ['en', 'ar', 'tr'];
      
      localesList.forEach((loc) => {
        let current = allDicts[loc as keyof typeof allDicts];
        for (const p of editConfig.path) {
          if (current) current = current[p];
        }
        initialValues[loc] = current || "";
      });
      
      setValues(initialValues);

      if (editConfig.type === 'project') {
        (['en', 'ar', 'tr'] as const).forEach((loc) => {
          if (typeof initialValues[loc] !== 'object' || initialValues[loc] === null) {
            initialValues[loc] = {
              title: "",
              description: "",
              longDescription: "",
              features: [],
              tags: [],
              github: "",
              live: "",
              image: "",
              images: []
            };
          }
        });

        setProjectImageFile(null);
        const existingImg = initialValues.en?.image || initialValues.ar?.image || initialValues.tr?.image || "";
        setProjectImagePreview(existingImg);

        const existingGallery: string[] = initialValues.en?.images || initialValues.ar?.images || initialValues.tr?.images || [];
        const combined = Array.from(new Set([
          ...(existingImg ? [existingImg] : []),
          ...(Array.isArray(existingGallery) ? existingGallery : [])
        ]));
        setGalleryItems(combined.map((url, i) => ({
          id: `existing_${i}_${Date.now()}`,
          url
        })));
        setNewGalleryUrl("");
      }
    }
  }, [editConfig, allDicts]);

  if (!isEditMode || !editConfig) return null;

  const handleTextChange = (loc: 'en' | 'ar' | 'tr', val: string) => {
    setValues((prev) => ({ ...prev, [loc]: val }));
  };

  const updateProjectField = (field: string, val: any, isTranslatable: boolean, loc?: 'en' | 'ar' | 'tr') => {
    setValues((prev) => {
      const updated = { ...prev };
      if (isTranslatable && loc) {
        const currentObj = typeof updated[loc] === 'object' && updated[loc] !== null ? updated[loc] : {};
        updated[loc] = { ...currentObj, [field]: val };
      } else {
        // Sync non-translatable fields across all languages
        (['en', 'ar', 'tr'] as const).forEach((l) => {
          const currentObj = typeof updated[l] === 'object' && updated[l] !== null ? updated[l] : {};
          updated[l] = { ...currentObj, [field]: val };
        });
      }
      return updated;
    });
  };

  const handleAddGalleryFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems = Array.from(files).map((file, idx) => ({
      id: `file_${Date.now()}_${idx}`,
      url: URL.createObjectURL(file),
      file
    }));
    setGalleryItems((prev) => {
      const updated = [...prev, ...newItems];
      if (!projectImagePreview && newItems.length > 0) {
        setProjectImagePreview(newItems[0].url);
        setProjectImageFile(newItems[0].file || null);
      }
      return updated;
    });
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const url = newGalleryUrl.trim();
    const newItem = {
      id: `url_${Date.now()}`,
      url
    };
    setGalleryItems((prev) => {
      const updated = [...prev, newItem];
      if (!projectImagePreview) {
        setProjectImagePreview(url);
        setProjectImageFile(null);
        updateProjectField('image', url, false);
      }
      return updated;
    });
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryItem = (id: string) => {
    setGalleryItems((prev) => {
      const toRemove = prev.find((it) => it.id === id);
      const filtered = prev.filter((it) => it.id !== id);
      if (toRemove && toRemove.url === projectImagePreview) {
        if (filtered.length > 0) {
          setProjectImagePreview(filtered[0].url);
          setProjectImageFile(filtered[0].file || null);
          if (!filtered[0].file) {
            updateProjectField('image', filtered[0].url, false);
          }
        } else {
          setProjectImagePreview("");
          setProjectImageFile(null);
          updateProjectField('image', "", false);
        }
      }
      return filtered;
    });
  };

  const handleSetCover = (item: { id: string; url: string; file?: File }) => {
    setProjectImagePreview(item.url);
    setProjectImageFile(item.file || null);
    if (!item.file) {
      updateProjectField('image', item.url, false);
    }
  };

  const updateExperienceField = (field: string, val: any, isTranslatable: boolean, loc?: 'en' | 'ar' | 'tr') => {
    setValues((prev) => {
      const updated = { ...prev };
      if (isTranslatable && loc) {
        const currentObj = typeof updated[loc] === 'object' && updated[loc] !== null ? updated[loc] : {};
        updated[loc] = { ...currentObj, [field]: val };
      } else {
        // Sync non-translatable fields across all languages
        (['en', 'ar', 'tr'] as const).forEach((l) => {
          const currentObj = typeof updated[l] === 'object' && updated[l] !== null ? updated[l] : {};
          updated[l] = { ...currentObj, [field]: val };
        });
      }
      return updated;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editConfig.type === 'image' || editConfig.type === 'file') {
        const fileVal = values.en || values.ar || values.tr;
        if (!fileVal) return closeEditor(); // No file selected
        const formData = new FormData();
        formData.append('file', fileVal);
        formData.append('fileName', editConfig.fileName || 'file.jpg');
        
        await fetch('/api/upload-file', {
          method: 'POST',
          body: formData,
        });
      } else {
        const finalValues = { ...values };

        // Handle project image & gallery upload
        if (editConfig.type === 'project') {
          const projectId = editConfig.path[editConfig.path.length - 1] || 'project';

          let finalCoverUrl = projectImagePreview;
          const uploadedFileMap = new Map<File, string>();

          if (projectImageFile) {
            const formData = new FormData();
            formData.append('file', projectImageFile);
            const ext = projectImageFile.name.split('.').pop() || 'jpg';
            formData.append('fileName', `projects/${projectId}_cover_${Date.now()}.${ext}`);

            const uploadRes = await fetch('/api/upload-file', {
              method: 'POST',
              body: formData,
            });
            const uploadData = await uploadRes.json();
            if (uploadData.url) {
              finalCoverUrl = uploadData.url;
              uploadedFileMap.set(projectImageFile, uploadData.url);
            }
          }

          // Upload any new gallery files
          const finalGalleryUrls: string[] = [];
          for (let i = 0; i < galleryItems.length; i++) {
            const item = galleryItems[i];
            if (item.file) {
              if (uploadedFileMap.has(item.file)) {
                const url = uploadedFileMap.get(item.file)!;
                finalGalleryUrls.push(url);
                if (item.url === projectImagePreview && !projectImageFile) {
                  finalCoverUrl = url;
                }
              } else {
                const formData = new FormData();
                formData.append('file', item.file);
                const ext = item.file.name.split('.').pop() || 'jpg';
                formData.append('fileName', `projects/${projectId}_gallery_${i}_${Date.now()}.${ext}`);

                const uploadRes = await fetch('/api/upload-file', {
                  method: 'POST',
                  body: formData,
                });
                const uploadData = await uploadRes.json();
                if (uploadData.url) {
                  finalGalleryUrls.push(uploadData.url);
                  uploadedFileMap.set(item.file, uploadData.url);
                  if (item.url === projectImagePreview) {
                    finalCoverUrl = uploadData.url;
                  }
                }
              }
            } else if (item.url && !item.url.startsWith('blob:')) {
              finalGalleryUrls.push(item.url);
            }
          }

          if (!finalCoverUrl && finalGalleryUrls.length > 0) {
            finalCoverUrl = finalGalleryUrls[0];
          }

          if (finalCoverUrl && !finalGalleryUrls.includes(finalCoverUrl)) {
            finalGalleryUrls.unshift(finalCoverUrl);
          }

          (['en', 'ar', 'tr'] as const).forEach((l) => {
            const cur = typeof finalValues[l] === 'object' && finalValues[l] !== null ? { ...finalValues[l] } : {};
            if (finalCoverUrl) {
              cur.image = finalCoverUrl;
            } else {
              delete cur.image;
            }
            cur.images = finalGalleryUrls;

            if (Array.isArray(cur.features)) {
              cur.features = cur.features.map((f: string) => f.trim()).filter(Boolean);
            }

            finalValues[l] = cur;
          });
        }

        await fetch('/api/update-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: editConfig.path,
            values: finalValues
          })
        });
      }
      
      router.refresh(); // Reload data
      closeEditor();
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
    setLoading(false);
  };

  // Show inline loading spinner inside the modal card if still fetching dictionaries
  const isFetchingDicts = loading && !allDicts && editConfig.type !== 'image' && editConfig.type !== 'file';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeEditor}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative bg-card border border-border shadow-2xl rounded-2xl w-full ${editConfig.type === 'project' ? 'max-w-3xl' : 'max-w-lg'} p-6 flex flex-col gap-4 z-10`}
        >
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="text-xl font-bold text-foreground">
              {editConfig.title || "Edit Content"}
            </h3>
            <button onClick={closeEditor} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4">
            {isFetchingDicts ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Loading multilingual content...</span>
              </div>
            ) : (
              <>
                {editConfig.type === 'text' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">English</span>
                      <input 
                        type="text" 
                        value={values.en || ""} 
                        onChange={(e) => handleTextChange('en', e.target.value)}
                        className="mt-1 w-full bg-background border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">العربية</span>
                      <input 
                        type="text" 
                        value={values.ar || ""} 
                        onChange={(e) => handleTextChange('ar', e.target.value)}
                        className="mt-1 w-full bg-background border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">Türkçe</span>
                      <input 
                        type="text" 
                        value={values.tr || ""} 
                        onChange={(e) => handleTextChange('tr', e.target.value)}
                        className="mt-1 w-full bg-background border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                )}

                {editConfig.type === 'textarea' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">English</span>
                      <textarea 
                        rows={3}
                        value={values.en || ""} 
                        onChange={(e) => handleTextChange('en', e.target.value)}
                        className="mt-1 w-full bg-background border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">العربية</span>
                      <textarea 
                        rows={3}
                        value={values.ar || ""} 
                        onChange={(e) => handleTextChange('ar', e.target.value)}
                        className="mt-1 w-full bg-background border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">Türkçe</span>
                      <textarea 
                        rows={3}
                        value={values.tr || ""} 
                        onChange={(e) => handleTextChange('tr', e.target.value)}
                        className="mt-1 w-full bg-background border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {(editConfig.type === 'image' || editConfig.type === 'file') && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Upload New File</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        onChange={(e) => setValues({ en: e.target.files?.[0] || null, ar: e.target.files?.[0] || null, tr: e.target.files?.[0] || null })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium text-foreground">
                        {(values.en || values.ar || values.tr) ? (values.en || values.ar || values.tr).name : "Click or drag file here"}
                      </span>
                    </div>
                  </div>
                )}

                {editConfig.type === 'project' && (
                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Project Cover & Gallery Management */}
                    <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-xs font-bold uppercase text-primary">
                            معرض صور المشروع والغلاف / Project Gallery & Cover
                          </label>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            يمكنك رفع عدة صور للمشروع، وتحديد صورة الغلاف الرئيسية بنجمة
                          </p>
                        </div>
                      </div>

                      {/* Main Cover Preview */}
                      {projectImagePreview ? (
                        <div className="relative h-48 w-full rounded-xl overflow-hidden border-2 border-primary/40 group/preview bg-muted/30 shadow-sm">
                          <img 
                            src={projectImagePreview} 
                            alt="Cover Preview" 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute top-2 left-2 bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3 fill-current" />
                            <span>الغلاف الرئيسي / Cover Image</span>
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="cursor-pointer bg-primary text-white text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 hover:bg-primary/90 shadow-lg transition-all">
                              <Upload className="w-3.5 h-3.5" /> تغيير الغلاف
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setProjectImageFile(file);
                                    const blobUrl = URL.createObjectURL(file);
                                    setProjectImagePreview(blobUrl);
                                    setGalleryItems((prev) => [
                                      { id: `cover_${Date.now()}`, url: blobUrl, file },
                                      ...prev.filter((it) => it.url !== projectImagePreview)
                                    ]);
                                  }
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setProjectImageFile(null);
                                setProjectImagePreview("");
                                updateProjectField('image', "", false);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-lg transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> حذف الغلاف
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 flex flex-col items-center justify-center bg-background/50 hover:bg-muted/30 transition-colors cursor-pointer group">
                          <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                          <span className="text-xs font-bold text-foreground mb-1">رفع صورة الغلاف / Upload Cover Image</span>
                          <span className="text-[11px] text-muted-foreground">PNG, JPG, WebP</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setProjectImageFile(file);
                                const blobUrl = URL.createObjectURL(file);
                                setProjectImagePreview(blobUrl);
                                setGalleryItems((prev) => [
                                  { id: `cover_${Date.now()}`, url: blobUrl, file },
                                  ...prev
                                ]);
                              }
                            }}
                          />
                        </label>
                      )}

                      {/* Add Gallery Photos Bar */}
                      <div className="space-y-2.5 pt-2 border-t border-border/50">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-primary" />
                            <span>صور المعرض ({galleryItems.length})</span>
                          </span>

                          <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors border border-primary/20">
                            <Plus className="w-3.5 h-3.5" />
                            <span>إضافة عدة صور / Upload Photos</span>
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleAddGalleryFiles(e.target.files)}
                            />
                          </label>
                        </div>

                        {/* Add by URL input */}
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            placeholder="أو أضف رابط صورة (https://... or /projects/photo.jpg)"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddGalleryUrl();
                              }
                            }}
                            className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddGalleryUrl}
                            disabled={!newGalleryUrl.trim()}
                            className="px-3 py-1.5 bg-card border border-border hover:border-primary text-xs font-bold rounded-lg transition-colors disabled:opacity-40"
                          >
                            إضافة رابط
                          </button>
                        </div>

                        {/* Gallery Thumbnails List */}
                        {galleryItems.length > 0 ? (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                            {galleryItems.map((item) => {
                              const isCover = item.url === projectImagePreview;
                              return (
                                <div 
                                  key={item.id} 
                                  className={`relative group rounded-lg overflow-hidden border bg-muted/40 aspect-video flex items-center justify-center ${
                                    isCover ? 'border-primary ring-2 ring-primary/40' : 'border-border'
                                  }`}
                                >
                                  <img 
                                    src={item.url} 
                                    alt="Gallery item" 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  {isCover && (
                                    <div className="absolute top-1 right-1 bg-primary text-white p-1 rounded-full shadow-sm">
                                      <Star className="w-2.5 h-2.5 fill-current" />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                                    {!isCover && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetCover(item)}
                                        className="p-1.5 bg-primary hover:bg-primary/90 text-white rounded-md text-[10px] font-bold shadow flex items-center"
                                        title="تعيين كصورة رئيسية / Set as Cover"
                                      >
                                        <Star className="w-3 h-3" />
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveGalleryItem(item.id)}
                                      className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-[10px] font-bold shadow flex items-center"
                                      title="حذف الصورة / Remove"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-xs text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border/50">
                            لا توجد صور إضافية في المعرض حالياً
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Non-translatable fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Tags (comma separated)</label>
                        <input 
                          type="text" 
                          value={values.en?.tags?.join(', ') || ""} 
                          onChange={(e) => updateProjectField('tags', e.target.value.split(',').map((t: string) => t.trim()), false)} 
                          className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">GitHub Link</label>
                        <input 
                          type="text" 
                          value={values.en?.github || ""} 
                          onChange={(e) => updateProjectField('github', e.target.value, false)} 
                          className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none text-sm" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Live Demo Link</label>
                      <input 
                        type="text" 
                        value={values.en?.live || ""} 
                        onChange={(e) => updateProjectField('live', e.target.value, false)} 
                        className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none text-sm" 
                      />
                    </div>

                    <hr className="border-border/60" />

                    {/* Translatable fields */}
                    {(['en', 'ar', 'tr'] as const).map((loc) => (
                      <div key={loc} className="p-4 bg-muted/20 border border-border/50 rounded-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                          <span className="text-xs font-bold uppercase text-primary">
                            {loc === 'en' ? 'English' : loc === 'ar' ? 'العربية' : 'Türkçe'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">
                            {loc === 'ar' ? 'عنوان المشروع' : loc === 'tr' ? 'Proje Başlığı' : 'Project Title'}
                          </label>
                          <input 
                            type="text" 
                            value={values[loc as keyof typeof values]?.title || ""} 
                            onChange={(e) => updateProjectField('title', e.target.value, true, loc)} 
                            className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">
                            {loc === 'ar' ? 'الوصف المختصر (يظهر في البطاقة)' : loc === 'tr' ? 'Kısa Açıklama' : 'Short Description (Card summary)'}
                          </label>
                          <textarea 
                            rows={2} 
                            value={values[loc as keyof typeof values]?.description || ""} 
                            onChange={(e) => updateProjectField('description', e.target.value, true, loc)} 
                            className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">
                            {loc === 'ar' ? 'الوصف المفصل (يظهر في صفحة المشروع)' : loc === 'tr' ? 'Detaylı Açıklama' : 'Detailed Overview (Project page)'}
                          </label>
                          <textarea 
                            rows={4} 
                            value={values[loc as keyof typeof values]?.longDescription || ""} 
                            onChange={(e) => updateProjectField('longDescription', e.target.value, true, loc)} 
                            placeholder={loc === 'ar' ? 'شرح كامل ومفصل عن فكرة المشروع والهدف منه...' : 'Detailed project overview and context...'}
                            className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">
                            {loc === 'ar' ? 'ميزات المشروع (ميزة واحدة في كل سطر)' : loc === 'tr' ? 'Önemli Özellikler (Her satıra bir özellik)' : 'Key Features (One feature per line)'}
                          </label>
                          <textarea 
                            rows={4} 
                            value={
                              Array.isArray(values[loc as keyof typeof values]?.features) 
                                ? values[loc as keyof typeof values].features.join('\n') 
                                : (values[loc as keyof typeof values]?.features || "")
                            } 
                            onChange={(e) => updateProjectField('features', e.target.value.split('\n'), true, loc)} 
                            placeholder={loc === 'ar' ? "ميزة 1\nميزة 2\nميزة 3" : "Feature 1\nFeature 2\nFeature 3"}
                            className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none font-mono text-xs" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {editConfig.type === 'experience' && (
                  <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Date / Period</label>
                      <input 
                        type="text" 
                        value={values.en?.date || ""} 
                        onChange={(e) => updateExperienceField('date', e.target.value, false)} 
                        className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none text-sm" 
                      />
                    </div>
                    <hr className="border-border/60" />
                    {/* Translatable fields next */}
                    {(['en', 'ar', 'tr'] as const).map((loc) => (
                      <div key={loc} className="p-4 bg-muted/20 border border-border/50 rounded-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                          <span className="text-xs font-bold uppercase text-primary">
                            {loc === 'en' ? 'English' : loc === 'ar' ? 'العربية' : 'Türkçe'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Role / Title</label>
                          <input 
                            type="text" 
                            value={values[loc as keyof typeof values]?.title || ""} 
                            onChange={(e) => updateExperienceField('title', e.target.value, true, loc)} 
                            className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Organization / Company</label>
                          <input 
                            type="text" 
                            value={values[loc as keyof typeof values]?.org || ""} 
                            onChange={(e) => updateExperienceField('org', e.target.value, true, loc)} 
                            className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
                          <textarea 
                            rows={3} 
                            value={values[loc as keyof typeof values]?.desc || ""} 
                            onChange={(e) => updateExperienceField('desc', e.target.value, true, loc)} 
                            className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none text-sm" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div>
              {!editConfig.isNew && (editConfig.type === 'project' || editConfig.type === 'experience') && !isFetchingDicts && (
                <button 
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this item?")) {
                      setLoading(true);
                      await fetch('/api/update-content', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: editConfig.path, action: 'delete' })
                      });
                      router.refresh();
                      closeEditor();
                    }
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={closeEditor} className="px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors text-foreground">
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading || isFetchingDicts}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
