import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X } from 'lucide-react';

/**
 * @desc Custom multi-select component for selecting multiple items from a predefined list (e.g., skills, interests).
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

    const filteredOptions = options.filter(option => 
        !selected.includes(option) && 
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = useCallback((option) => {
        const newSelection = selected.includes(option)
            ? selected.filter(item => item !== option)
            : selected.length < maxSelection
                ? [...selected, option]
                : selected;
        onChange(newSelection);
        setSearchTerm('');
        if (newSelection.length >= maxSelection) setIsOpen(false);
    }, [selected, onChange, maxSelection]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative mb-4 ${className}`} ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>

            <div 
                className="w-full min-h-[40px] p-2 flex flex-wrap items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500 transition duration-150"
                onClick={() => setIsOpen(prev => !prev)}
            >
                {selected.map(item => (
                    <div 
                        key={item} 
                        className="flex items-center bg-indigo-100 dark:bg-indigo-600 dark:text-white text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full mr-2 mb-1"
                        onClick={(e) => { e.stopPropagation(); toggleOption(item); }}
                    >
                        {item}
                        <X className="w-3 h-3 ml-1 cursor-pointer" />
                    </div>
                ))}
                
                <input
                    type="text"
                    placeholder={selected.length === 0 ? placeholder : ''}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow min-w-[100px] border-none focus:ring-0 bg-transparent dark:text-white"
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} 
                />
                <ChevronDown className={`w-4 h-4 ml-auto text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>

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
            
            {selected.length >= maxSelection && maxSelection !== Infinity && (
                <p className="text-xs text-indigo-500 mt-1">Maximum of {maxSelection} items selected.</p>
            )}
        </div>
    );
};