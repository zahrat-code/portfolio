"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type EditType = 'text' | 'textarea' | 'image' | 'file' | 'project' | 'skill' | 'experience';

interface EditConfig {
  path: string[];
  type: EditType;
  title?: string;
  fileName?: string;
  isNew?: boolean;
}

interface AdminContextProps {
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
  openEditor: (config: EditConfig) => void;
  closeEditor: () => void;
  editConfig: EditConfig | null;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editConfig, setEditConfig] = useState<EditConfig | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.includes('/admin/dashboard')) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [pathname]);

  const openEditor = (config: EditConfig) => {
    setEditConfig(config);
  };

  const closeEditor = () => {
    setEditConfig(null);
  };

  return (
    <AdminContext.Provider value={{ isEditMode, setIsEditMode, openEditor, closeEditor, editConfig }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
