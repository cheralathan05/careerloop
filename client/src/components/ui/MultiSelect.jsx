import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X } from 'lucide-react';

/**
 * @desc Custom multi-select component for selecting multiple items from a predefined list (e.g., skills, interests).
 * Implements search/filter functionality, max selection limit, and theme-aware styling.
 */
export const MultiSelect = ({
    options = [],
    selected = [],
    onChange,
    label,
    placeholder = 'Select items...',
    maxSelection = Infinity,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const uniqueId = `multiselect-${label.replace(/\s/g, '-')}`;

    // --- Derived State ---
    const filteredOptions = options.filter(option => 
        // 1. Must not already be selected
        !selected.includes(option) && 
        // 2. Must match the search term (case-insensitive)
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Handlers ---
    const toggleOption = useCallback((option) => {
        const isAdding = !selected.includes(option);
        
        const newSelection = isAdding
            ? (selected.length < maxSelection ? [...selected, option] : selected)
            : selected.filter(item => item !== option);
            
        onChange(newSelection);
        setSearchTerm('');
        
        // Close dropdown if max is reached after adding an item
        if (isAdding && newSelection.length >= maxSelection) {
            setIsOpen(false);
        }
    }, [selected, onChange, maxSelection]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus on input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // --- Render ---

    return (
        <div className={`relative mb-4 ${className}`} ref={dropdownRef}>
            {/* Label (Accessibility fix: htmlFor connects to the input) */}
            <label htmlFor={uniqueId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
                {maxSelection !== Infinity && <span className="text-gray-500 text-xs ml-1"> (Max {maxSelection})</span>}
            </label>

            {/* Selector Box */}
            <div 
                className="w-full min-h-[40px] p-2 flex flex-wrap items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-text focus-within:ring-2 focus-within:ring-indigo-500 transition duration-150"
                onClick={() => inputRef.current?.focus()} // Focus input when box is clicked
            >
                {/* Selected Tags */}
                {selected.map(item => (
                    <div 
                        key={item} 
                        className="flex items-center bg-indigo-100 dark:bg-indigo-600 dark:text-white text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full mr-2 mb-1"
                        // Stop propagation to prevent closing the dropdown immediately
                        onClick={(e) => { e.stopPropagation(); toggleOption(item); }} 
                    >
                        {item}
                        <X className="w-3 h-3 ml-1 cursor-pointer" />
                    </div>
                ))}
                
                {/* Search/Filter Input */}
                <input
                    id={uniqueId}
                    ref={inputRef}
                    type="text"
                    placeholder={selected.length === 0 ? placeholder : ''}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow min-w-[100px] border-none focus:ring-0 bg-transparent dark:text-white dark:placeholder-gray-400"
                    onFocus={() => setIsOpen(true)}
                    // Prevents accidental form submission or closing dropdown on 'Enter'
                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} 
                />
                
                {/* Chevron Icon */}
                <ChevronDown className={`w-4 h-4 ml-auto text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <div
                                key={option}
                                className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleOption(option)}
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No matches found.</div>
                    )}
                </div>
            )}
            
            {/* Max Selection Message */}
            {selected.length >= maxSelection && maxSelection !== Infinity && (
                <p className="mt-1 text-xs text-indigo-500 dark:text-indigo-400">Maximum limit reached: {maxSelection} items selected.</p>
            )}
        </div>
    );
};
