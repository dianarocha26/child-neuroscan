import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getChildren, type Child } from '../lib/api/children';
import { logger } from '../lib/logger';

type ChildrenContextType = {
  /** The signed-in parent's child profiles, oldest first */
  childList: Child[];
  /** False until the first successful load for the current user */
  loaded: boolean;
  refresh: () => Promise<void>;
};

const ChildrenContext = createContext<ChildrenContextType | undefined>(undefined);

export function ChildrenProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [childList, setChildList] = useState<Child[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      setChildList(await getChildren(userId));
      setLoaded(true);
    } catch (err) {
      // Stay "not loaded" so a network error never looks like "no children"
      logger.error('Failed to load children', err);
    }
  }, [userId]);

  useEffect(() => {
    setChildList([]);
    setLoaded(false);
    void refresh();
  }, [refresh]);

  return (
    <ChildrenContext.Provider value={{ childList, loaded, refresh }}>
      {children}
    </ChildrenContext.Provider>
  );
}

export function useChildren() {
  const context = useContext(ChildrenContext);
  if (context === undefined) {
    throw new Error('useChildren must be used within a ChildrenProvider');
  }
  return context;
}
