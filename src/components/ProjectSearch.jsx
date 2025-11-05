import React, { useState, useEffect } from 'react';
import { Search, X, Spinner } from 'lucide-react';

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function ProjectSearch({ onSearchResults, onFiltersChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    minBudget: '',
    maxBudget: '',
    status: 'All',
    sort: 'newest'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    // Notify parent of filter changes
    if (onFiltersChange) {
      onFiltersChange({
        query: debouncedSearch,
        ...filters
      });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: 'All',
      minBudget: '',
      maxBudget: '',
      status: 'All',
      sort: 'newest'
    });
  };

  const hasActiveFilters =
    searchQuery ||
    filters.category !== 'All' ||
    filters.minBudget ||
    filters.maxBudget ||
    filters.status !== 'All';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search projects by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        {isLoading && (
          <Spinner className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin" size="sm" />
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
        >
          <option value="All">All Categories</option>
          <option value="Writing & Content">Writing & Content</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Music & Audio">Music & Audio</option>
          <option value="Video & Animation">Video & Animation</option>
          <option value="Programming & Tech">Programming & Tech</option>
          <option value="Marketing">Marketing</option>
          <option value="Other">Other</option>
        </select>

        {/* Budget Range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min (ETH)"
            value={filters.minBudget}
            onChange={(e) => handleFilterChange('minBudget', e.target.value)}
            className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            step="0.01"
            min="0"
          />
          <span className="text-slate-400">to</span>
          <input
            type="number"
            placeholder="Max (ETH)"
            value={filters.maxBudget}
            onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
            className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            step="0.01"
            min="0"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="budget-high">Highest Budget</option>
          <option value="budget-low">Lowest Budget</option>
          <option value="deadline">Deadline</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition text-sm"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-slate-600">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="hover:bg-slate-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
              {filters.category}
              <button
                onClick={() => handleFilterChange('category', 'All')}
                className="hover:bg-emerald-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.minBudget && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full">
              Min: {filters.minBudget} ETH
              <button
                onClick={() => handleFilterChange('minBudget', '')}
                className="hover:bg-cyan-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.maxBudget && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">
              Max: {filters.maxBudget} ETH
              <button
                onClick={() => handleFilterChange('maxBudget', '')}
                className="hover:bg-amber-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.status !== 'All' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
              Status: {filters.status}
              <button
                onClick={() => handleFilterChange('status', 'All')}
                className="hover:bg-slate-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
