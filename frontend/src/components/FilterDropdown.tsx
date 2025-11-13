import { useState, useRef, useEffect } from 'react';
import styles from './FilterDropdown.module.css';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
}

export default function FilterDropdown({ 
  label, 
  options, 
  selected, 
  onSelect 
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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