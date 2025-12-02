import { useEffect, type ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback fired when modal should close */
  onClose: () => void;
  /** Optional modal title displayed in header */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Optional footer content (typically action buttons) */
  footer?: ReactNode;
}

/**
 * Reusable modal dialog component with backdrop overlay
 * Handles body scroll lock, Escape key closing, and click-outside-to-close
 * Used by LoginPromptModal and other dialog interactions
 */
export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* Stop propagation prevents closing when clicking inside modal */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        
        <div className={styles.body}>
          {children}
        </div>
        
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}