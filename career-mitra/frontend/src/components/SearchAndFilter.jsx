import React, { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export const SearchBar = ({ onSearch, placeholder = 'Search mentors, skills...' }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  return (
    <div className="relative w-full">
      <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-ink-500" size={16} />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-surface-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
      />
      {value && (
        <button
          onClick={() => {
            setValue('');
            onSearch('');
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-500 hover:text-ink-700 transition-colors"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
};

export const FilterPanel = ({ onFilter, isOpen, setIsOpen }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    examCategories: [],
    experience: [],
    priceRange: [0, 5000],
    rating: 0,
  });

  const [categorySearch, setCategorySearch] = useState('');

  const examCategories = [
    'Placement Preparation',
    'Aptitude',
    'DSA & Coding',
    'Technical Interviews',
    'Mock Tests',
    'GATE',
    'CAT',
    'UPSC',
    'SSC',
    'Banking',
    'Railway',
    'Other Competitive Exams'
  ];

  const experienceLevels = [
    { label: '0–2 years', value: '0-2' },
    { label: '2–5 years', value: '2-5' },
    { label: '5–10 years', value: '5-10' },
    { label: '10+ years', value: '10+' },
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...selectedFilters };

    if (filterType === 'examCategories') {
      newFilters.examCategories = newFilters.examCategories.includes(value)
        ? newFilters.examCategories.filter(c => c !== value)
        : [...newFilters.examCategories, value];
    } else if (filterType === 'experience') {
      newFilters.experience = newFilters.experience.includes(value)
        ? newFilters.experience.filter(e => e !== value)
        : [...newFilters.experience, value];
    } else if (filterType === 'rating') {
      newFilters.rating = value;
    }

    setSelectedFilters(newFilters);
    onFilter(newFilters);
  };

  const handlePriceChange = (e, type) => {
    const newRange = [...selectedFilters.priceRange];
    newRange[type === 'min' ? 0 : 1] = parseInt(e.target.value);
    setSelectedFilters({ ...selectedFilters, priceRange: newRange });
    onFilter({ ...selectedFilters, priceRange: newRange });
  };

  const resetFilters = () => {
    const empty = { examCategories: [], experience: [], priceRange: [0, 5000], rating: 0 };
    setSelectedFilters(empty);
    onFilter(empty);
    setCategorySearch('');
  };

  const hasFilters = selectedFilters.examCategories.length > 0 || selectedFilters.experience.length > 0 || selectedFilters.rating > 0;

  const filteredCategories = examCategories.filter(cat =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const FilterContent = () => (
    <>
      {/* Category Search */}
      <div className="relative w-full mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400" size={14} />
        <input
          type="text"
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          placeholder="Search exam categories..."
          className="w-full pl-8 pr-8 py-2.5 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder:text-ink-400 text-ink-900"
        />
        {categorySearch && (
          <button
            onClick={() => setCategorySearch('')}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors p-0.5"
          >
            <FiX size={13} />
          </button>
        )}
      </div>

      {/* Exam Category */}
      <div className="mb-5">
        <h4 className="text-2xs font-bold text-ink-500 uppercase tracking-widest mb-3">EXAM CATEGORY</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {filteredCategories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2.5 cursor-pointer group py-0.5 hover:translate-x-0.5 transition-transform"
            >
              <input
                type="checkbox"
                checked={selectedFilters.examCategories.includes(category)}
                onChange={() => handleFilterChange('examCategories', category)}
                className="w-3.5 h-3.5 rounded border-surface-300 text-brand-600 focus:ring-brand-500/20 focus:ring-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-500"
              />
              <span className="text-xs text-ink-700 group-hover:text-ink-955 font-medium transition-colors">
                {category}
              </span>
            </label>
          ))}
          {filteredCategories.length === 0 && (
            <p className="text-xs text-ink-400 py-2">No categories found</p>
          )}
        </div>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="w-full mt-4 btn-secondary py-2 text-xs font-bold transition-all focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Experience */}
      <div className="mb-5 pt-4 border-t border-surface-100">
        <h4 className="text-2xs font-bold text-ink-500 uppercase tracking-widest mb-3">Experience</h4>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <label key={level.value} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
              <input
                type="checkbox"
                checked={selectedFilters.experience.includes(level.value)}
                onChange={() => handleFilterChange('experience', level.value)}
                className="w-3.5 h-3.5 rounded border-surface-300 text-brand-600 focus:ring-brand-500/20 focus:ring-2 transition-all cursor-pointer"
              />
              <span className="text-xs text-ink-700 group-hover:text-ink-955 font-medium transition-colors">{level.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-5 pt-4 border-t border-surface-100">
        <h4 className="text-2xs font-bold text-ink-500 uppercase tracking-widest mb-3">Price range</h4>
        <div className="space-y-3">
          <div>
            <label className="text-2xs text-ink-600 block mb-1">Min: ₹{selectedFilters.priceRange[0]}</label>
            <input
              type="range"
              min="0"
              max="5000"
              value={selectedFilters.priceRange[0]}
              onChange={(e) => handlePriceChange(e, 'min')}
              className="w-full h-1 bg-surface-200 rounded-full appearance-none cursor-pointer accent-brand-600"
            />
          </div>
          <div>
            <label className="text-2xs text-ink-600 block mb-1">Max: ₹{selectedFilters.priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="5000"
              value={selectedFilters.priceRange[1]}
              onChange={(e) => handlePriceChange(e, 'max')}
              className="w-full h-1 bg-surface-200 rounded-full appearance-none cursor-pointer accent-brand-600"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="pt-4 border-t border-surface-100">
        <h4 className="text-2xs font-bold text-ink-500 uppercase tracking-widest mb-3">Minimum rating</h4>
        <div className="space-y-2">
          {[4, 3.5, 3, 2.5].map((rating) => (
            <label key={rating} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
              <input
                type="radio"
                checked={selectedFilters.rating === rating}
                onChange={() => handleFilterChange('rating', rating)}
                name="rating"
                className="w-3.5 h-3.5 border-surface-300 text-brand-600 focus:ring-brand-500/20 focus:ring-2 transition-all cursor-pointer"
              />
              <span className="text-xs text-ink-700 group-hover:text-ink-955 font-medium transition-colors">
                {rating}+ <span className="text-amber-500">★</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden md:block bg-white border border-surface-200 rounded-xl p-4 h-fit shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-surface-200 mb-4">
          <h3 className="text-sm font-bold text-ink-950 flex items-center gap-1.5">
            <FiFilter size={14} className="text-brand-600" />
            Filters ({selectedFilters.examCategories.length})
          </h3>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-2xs text-brand-600 hover:text-brand-700 font-bold transition-colors focus:underline"
            >
              Reset
            </button>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filter */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/30 z-40 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl z-50 p-5 max-h-[80vh] overflow-y-auto animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-200 mb-4">
              <h3 className="text-sm font-bold text-ink-950 flex items-center gap-1.5">
                <FiFilter size={14} className="text-brand-600" />
                Filters ({selectedFilters.examCategories.length})
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-ink-500 hover:text-ink-700 p-1">
                <FiX size={20} />
              </button>
            </div>

            <FilterContent />

            <button
              onClick={() => setIsOpen(false)}
              className="w-full btn-primary mt-5"
            >
              Apply filters
            </button>
          </div>
        </div>
      )}
    </>
  );
};
