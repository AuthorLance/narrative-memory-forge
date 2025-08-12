import { useState, useEffect } from 'react';
import { WritingEntry, EntryType } from '@/types/writing';

const STORAGE_KEY = 'writing-assistant-entries';

export function useWritingStorage() {
  const [entries, setEntries] = useState<WritingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveEntries = (newEntries: WritingEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Failed to save entries:', error);
    }
  };

  const addEntry = (entry: Omit<WritingEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: WritingEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveEntries([...entries, newEntry]);
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<WritingEntry>) => {
    const updatedEntries = entries.map(entry =>
      entry.id === id
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    );
    saveEntries(updatedEntries);
  };

  const deleteEntry = (id: string) => {
    const filteredEntries = entries.filter(entry => entry.id !== id);
    saveEntries(filteredEntries);
  };

  const getEntriesByType = (type: EntryType) => {
    return entries.filter(entry => entry.type === type);
  };

  const searchEntries = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return entries.filter(entry =>
      entry.name.toLowerCase().includes(lowercaseQuery) ||
      entry.description.toLowerCase().includes(lowercaseQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByType,
    searchEntries,
  };
}