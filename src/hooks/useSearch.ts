import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from './usePerformance';

export interface SearchOptions {
  keys: string[];
  threshold?: number;
  caseSensitive?: boolean;
  fuzzy?: boolean;
}

export function useSearch<T extends Record<string, any>>(
  items: T[],
  options: SearchOptions
) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return items;
    }

    const searchTerm = options.caseSensitive
      ? debouncedQuery
      : debouncedQuery.toLowerCase();

    return items.filter((item) => {
      return options.keys.some((key) => {
        const value = getNestedValue(item, key);
        if (value === null || value === undefined) return false;

        const stringValue = options.caseSensitive
          ? String(value)
          : String(value).toLowerCase();

        if (options.fuzzy) {
          return fuzzyMatch(stringValue, searchTerm);
        }

        return stringValue.includes(searchTerm);
      });
    });
  }, [items, debouncedQuery, options]);

  const highlightMatch = useCallback(
    (text: string): string => {
      if (!debouncedQuery.trim()) return text;

      const searchTerm = options.caseSensitive
        ? debouncedQuery
        : debouncedQuery.toLowerCase();
      const textToSearch = options.caseSensitive ? text : text.toLowerCase();

      const index = textToSearch.indexOf(searchTerm);
      if (index === -1) return text;

      const before = text.substring(0, index);
      const match = text.substring(index, index + searchTerm.length);
      const after = text.substring(index + searchTerm.length);

      return `${before}<mark class="bg-yellow-200 dark:bg-yellow-900 px-1 rounded">${match}</mark>${after}`;
    },
    [debouncedQuery, options.caseSensitive]
  );

  return {
    query,
    setQuery,
    filteredItems,
    highlightMatch,
    isSearching: query !== debouncedQuery,
    resultCount: filteredItems.length
  };
}

export function useFilter<T extends Record<string, any>>(items: T[]) {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredItems = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return items;
    }

    return items.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          return true;
        }

        const itemValue = getNestedValue(item, key);

        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }

        if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          return itemValue >= value.min && itemValue <= value.max;
        }

        return itemValue === value;
      });
    });
  }, [items, filters]);

  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    filteredItems,
    setFilter,
    removeFilter,
    clearFilters,
    activeFilterCount: Object.keys(filters).filter(
      (key) => filters[key] !== null && filters[key] !== undefined && filters[key] !== ''
    ).length
  };
}

export function useSort<T extends Record<string, any>>(items: T[]) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedItems = useMemo(() => {
    if (!sortKey) return items;

    return [...items].sort((a, b) => {
      const aValue = getNestedValue(a, sortKey);
      const bValue = getNestedValue(b, sortKey);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [items, sortKey, sortDirection]);

  const toggleSort = useCallback((key: string) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        return key;
      } else {
        setSortDirection('asc');
        return key;
      }
    });
  }, []);

  const clearSort = useCallback(() => {
    setSortKey(null);
    setSortDirection('asc');
  }, []);

  return {
    sortedItems,
    sortKey,
    sortDirection,
    toggleSort,
    clearSort
  };
}

export function usePagination<T>(items: T[], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.min(Math.max(1, page), totalPages);
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    resetPagination,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: Math.min(currentPage * itemsPerPage, items.length)
  };
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function fuzzyMatch(text: string, pattern: string): boolean {
  let patternIndex = 0;
  let textIndex = 0;

  while (patternIndex < pattern.length && textIndex < text.length) {
    if (pattern[patternIndex] === text[textIndex]) {
      patternIndex++;
    }
    textIndex++;
  }

  return patternIndex === pattern.length;
}
