import { useState } from 'react';

const MultiSelectTags = ({ 
  options = [], 
  selectedValues = [], 
  onSelectionChange, 
  placeholder = "Type to add tags...",
  maxTags = 20,
  allowCustom = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedValues.includes(option)
  );

  const addTag = (tag) => {
    if (selectedValues.includes(tag) || selectedValues.length >= maxTags) return;
    onSelectionChange([...selectedValues, tag]);
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    onSelectionChange(selectedValues.filter(tag => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (allowCustom || options.includes(inputValue.trim())) {
        addTag(inputValue.trim());
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedValues.length > 0) {
      removeTag(selectedValues[selectedValues.length - 1]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative">
      {/* Tags Display & Input */}
      <div 
        className="min-h-[2.75rem] border border-slate-200 rounded-xl px-3 py-2 flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all cursor-text"
        onClick={() => document.getElementById('tag-input').focus()}
      >
        {selectedValues.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        
        <input
          id="tag-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder={selectedValues.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
          disabled={selectedValues.length >= maxTags}
        />
      </div>

      {/* Dropdown Options */}
      {showDropdown && inputValue && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => addTag(option)}
                className="w-full text-left px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-sm first:rounded-t-xl last:rounded-b-xl"
              >
                {option}
              </button>
            ))
          ) : allowCustom && inputValue.trim() && !options.includes(inputValue.trim()) ? (
            <button
              onClick={() => addTag(inputValue.trim())}
              className="w-full text-left px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-sm rounded-xl"
            >
              Add "{inputValue.trim()}"
            </button>
          ) : (
            <div className="px-3 py-2 text-sm text-slate-500 rounded-xl">
              No matching options
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      <div className="flex justify-between items-center mt-1">
        <p className="text-xs text-slate-500">
          {allowCustom && 'Press Enter to add custom tags, or '}Select from dropdown
        </p>
        <p className="text-xs text-slate-500">
          {selectedValues.length}/{maxTags}
        </p>
      </div>
    </div>
  );
};

export default MultiSelectTags;