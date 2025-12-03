import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Button from './Button';
import styles from './LoginPromptModal.module.css';

interface LoginPromptModalProps {
  // Controls modal visibility
  isOpen: boolean;
  // Callback to close the modal
  onClose: () => void;
  // Optional callback to save draft data before navigating to login/register
  onSaveDraft?: () => void;
}

/**
 * Modal that prompts unauthenticated users to log in or sign up
 * Displayed when attempting to create/publish a quiz without authentication
 * Saves draft progress to localStorage before redirecting
 */
export default function LoginPromptModal({ isOpen, onClose, onSaveDraft }: LoginPromptModalProps) {
  const navigate = useNavigate();

  // Navigate to login page and save draft
  const handleLogin = () => {
    if (onSaveDraft) {
      onSaveDraft(); // Save form data to localStorage
    }
    navigate('/login', { state: { from: window.location.pathname } });
  };

  // Navigate to registration page and save draft
  const handleSignUp = () => {
    if (onSaveDraft) {
      onSaveDraft(); // Save form data to localStorage
    }
    navigate('/register', { state: { from: window.location.pathname } });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save Your Quiz"
      footer={
        <>
          <Button variant="gray" onClick={onClose}>
            Continue Editing
          </Button>
          <Button variant="secondary" onClick={handleSignUp}>
            Sign Up
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Log In
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <p className={styles.message}>
          To save and publish your quiz, you need to log in or create an account.
        </p>
        <p className={styles.assurance}>
          ✨ Don't worry! Your progress will be saved and you can continue right where you left off.
        </p>
      </div>
    </Modal>
  );
}