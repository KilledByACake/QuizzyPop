import { useState, useRef, useEffect } from 'react';
import styles from './FilterDropdown.module.css';

interface FilterDropdownProps {
  // Button label text when nothing is selected
  label: string;
  // Available filter options to display
  options: string[];
  // Currently selected option (if any)
  selected?: string;
  // Callback fired when an option is selected
  onSelect: (value: string) => void;
}

/**
 * Dropdown filter component for selecting from a list of options
 * Used on the quiz browse page for difficulty/category filtering
 * Closes automatically when clicking outside the dropdown
 */
export default function FilterDropdown({ 
  label, 
  options, 
  selected, 
  onSelect 
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button 
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {selected || label} ▼
      </button>
      
      {isOpen && (
        <ul className={styles.menu}>
          {options.map((option) => (
            <li 
              key={option}
              className={styles.item}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}