"use client";

import { useAdmin } from "./AdminContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export function GlobalEditModal() {
  const { isEditMode, editConfig, closeEditor } = useAdmin();
  const [allDicts, setAllDicts] = useState<{ ar: any; en: any; tr: any } | null>(null);
  const [values, setValues] = useState<{ en: any; ar: any; tr: any }>({ en: "", ar: "", tr: "" });
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
    }
  }, [editConfig, allDicts]);

  if (!isEditMode || !editConfig) return null;

  const handleTextChange = (loc: string, val: string) => {
    setValues((prev) => ({ ...prev, [loc]: val }));
  };

  const updateProjectField = (field: string, val: any, isTranslatable: boolean, loc?: string) => {
    setValues((prev) => {
      const updated = { ...prev };
      if (isTranslatable && loc) {
        const currentObj = typeof updated[loc] === 'object' && updated[loc] !== null ? updated[loc] : {};
        updated[loc] = { ...currentObj, [field]: val };
      } else {
        // Sync non-translatable fields across all languages
        ['en', 'ar', 'tr'].forEach((l) => {
          const currentObj = typeof updated[l] === 'object' && updated[l] !== null ? updated[l] : {};
          updated[l] = { ...currentObj, [field]: val };
        });
      }
      return updated;
    });
  };

  const updateExperienceField = (field: string, val: any, isTranslatable: boolean, loc?: string) => {
    setValues((prev) => {
      const updated = { ...prev };
      if (isTranslatable && loc) {
        const currentObj = typeof updated[loc] === 'object' && updated[loc] !== null ? updated[loc] : {};
        updated[loc] = { ...currentObj, [field]: val };
      } else {
        // Sync non-translatable fields across all languages
        ['en', 'ar', 'tr'].forEach((l) => {
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
        await fetch('/api/update-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: editConfig.path,
            values
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
          className="relative bg-card border border-border shadow-2xl rounded-2xl w-full max-w-lg p-6 flex flex-col gap-4 z-10"
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
                  <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
                    {/* Non-translatable fields first */}
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
                    {/* Translatable fields next */}
                    {['en', 'ar', 'tr'].map((loc) => (
                      <div key={loc} className="p-4 bg-muted/20 border border-border/50 rounded-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                          <span className="text-xs font-bold uppercase text-primary">
                            {loc === 'en' ? 'English' : loc === 'ar' ? 'العربية' : 'Türkçe'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Project Title</label>
                          <input 
                            type="text" 
                            value={values[loc as keyof typeof values]?.title || ""} 
                            onChange={(e) => updateProjectField('title', e.target.value, true, loc)} 
                            className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
                          <textarea 
                            rows={3} 
                            value={values[loc as keyof typeof values]?.description || ""} 
                            onChange={(e) => updateProjectField('description', e.target.value, true, loc)} 
                            className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none text-sm" 
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
                    {['en', 'ar', 'tr'].map((loc) => (
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
