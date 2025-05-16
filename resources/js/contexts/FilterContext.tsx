// contexts/FilterContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface FilterContextType {
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <FilterContext.Provider value={{
      searchValue,
      setSearchValue,
      selectedFilters,
      setSelectedFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
