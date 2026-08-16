"use client";

import { createContext, useContext, ReactNode } from "react";

type Dictionary = any; // In a real large app we would type this fully based on ar.json

const DictionaryContext = createContext<Dictionary | null>(null);
const LocaleContext = createContext<string>("ar");

export default function DictionaryProvider({
  dictionary,
  locale,
  children,
}: {
  dictionary: Dictionary;
  locale: string;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>
      <DictionaryContext.Provider value={dictionary}>
        {children}
      </DictionaryContext.Provider>
    </LocaleContext.Provider>
  );
}

export function useDictionary() {
  const dictionary = useContext(DictionaryContext);
  if (!dictionary) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return dictionary;
}

export function useLocale() {
  return useContext(LocaleContext);
}
