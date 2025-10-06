import React from 'react';
import { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Language, User, Visit } from '../types';
import { USERS, INITIAL_VISITS } from '../constants';
import { en } from '../localization/en';
import { ar } from '../localization/ar';

type Translations = typeof en;

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations) => string;
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, pass: string) => User | null;
  logout: () => void;
  users: User[];
  visits: Visit[];
  addVisit: (visit: Omit<Visit, 'id'>) => void;
  removeUser: (userId: number) => void;
  updateUser: (userId: number, data: Partial<User>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations = {
  [Language.EN]: en,
  [Language.AR]: ar,
};

// Helper function to get data from localStorage or fallback to initial data
const getInitialState = <T,>(key: string, initialData: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        // If the item doesn't exist, initialize it in localStorage
        if (item === null) {
            window.localStorage.setItem(key, JSON.stringify(initialData));
            return initialData;
        }
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return initialData;
    }
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Initialize state from localStorage or constants file
  const [users, setUsers] = useState<User[]>(() => getInitialState<User[]>('sales_tracker_users', USERS));
  const [visits, setVisits] = useState<Visit[]>(() => getInitialState<Visit[]>('sales_tracker_visits', INITIAL_VISITS));

  // --- Persistence Effects ---
  // Save users to localStorage whenever they change
  useEffect(() => {
    try {
        window.localStorage.setItem('sales_tracker_users', JSON.stringify(users));
    } catch (error) {
        console.error('Error saving users to localStorage:', error);
    }
  }, [users]);
  
  // Save visits to localStorage whenever they change
  useEffect(() => {
    try {
        window.localStorage.setItem('sales_tracker_visits', JSON.stringify(visits));
    } catch (error) {
        console.error('Error saving visits to localStorage:', error);
    }
  }, [visits]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: keyof Translations): string => {
    return translations[language][key] || key;
  }, [language]);

  const login = useCallback((username: string, pass: string): User | null => {
    const foundUser = users.find((u) => u.username === username);
    if (foundUser && foundUser.password === pass) {
      setUser(foundUser);
      setIsAuthenticated(true);
      return foundUser;
    }
    return null;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);
  
  const addVisit = useCallback((visit: Omit<Visit, 'id'>) => {
    const newVisit: Visit = {
      ...visit,
      id: `v${new Date().getTime()}`,
    };
    setVisits(prev => [newVisit, ...prev]);
  }, []);

  const removeUser = useCallback((userId: number) => {
    // Remove the user
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Remove all visits associated with that user
    setVisits(prev => prev.filter(v => v.repId !== userId));
  }, []);
  
  const updateUser = useCallback((userId: number, data: Partial<User>) => {
    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id === userId) {
          const updatedUser = { ...u, ...data };
          // Do not update password if it's an empty string
          if (data.password === '') {
            delete updatedUser.password;
          }
          return updatedUser;
        }
        return u;
      })
    );
  }, []);
  
  const addUser = useCallback((user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: new Date().getTime(), // simple id generation
    };
    setUsers(prev => [...prev, newUser]);
  }, []);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    isAuthenticated,
    user,
    login,
    logout,
    users,
    visits,
    addVisit,
    removeUser,
    updateUser,
    addUser,
  }), [
    language, setLanguage, t, isAuthenticated, user, login, logout, users, visits, 
    addVisit, removeUser, updateUser, addUser
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};