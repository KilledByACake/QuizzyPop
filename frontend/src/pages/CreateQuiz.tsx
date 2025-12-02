import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { createQuizSchema, type CreateQuizFormData } from '../schemas/quizSchemas';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import LoginPromptModal from '../components/LoginPromptModal';
import TagInput from '../components/TagInput';
import styles from './CreateQuiz.module.css';

/** localStorage key for saving quiz draft */
const DRAFT_STORAGE_KEY = 'quiz_draft';

/**
 * Quiz creation page - first step in quiz creation flow
 * Collects quiz metadata: title, description, category, difficulty, image, tags
 * Saves draft to localStorage if user is not authenticated
 * Redirects to AddQuestions page after successful creation
 * Note: Currently sends FormData but backend expects two-step (JSON quiz + separate image upload)
 */
export default function CreateQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<CreateQuizFormData>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      difficulty: 'easy',
      tags: []
    }
  });

  // Restore draft from localStorage after returning from login
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draft && location.state?.fromLogin) {
      try {
        const parsedDraft = JSON.parse(draft);
        reset(parsedDraft);
        
        // Restore image preview if exists
        if (parsedDraft.imagePreviewData) {
          setImagePreview(parsedDraft.imagePreviewData);
        }
        
        // Clear the draft after restoring
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (err) {
        console.error('Failed to restore draft:', err);
      }
    }
  }, [location.state, reset]);

  /** Handle image file selection and preview generation */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file);
      // Generate base64 preview for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /** Save current form state to localStorage as draft */
  const saveDraft = () => {
    const formData = watch();
    const draft = {
      ...formData,
      imagePreviewData: imagePreview, // Store preview separately
      image: undefined // Can't serialize File object
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  };

  /** Handle form submission - create quiz or prompt login */
  const onSubmit = async (data: CreateQuizFormData) => {
    // If not authenticated, save draft and show login modal
    if (!isAuthenticated) {
      saveDraft();
      setShowLoginModal(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for file upload
      // TODO: Backend expects two-step: JSON quiz creation then separate image upload
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('categoryId', data.categoryId);
      formData.append('difficulty', data.difficulty);
      
      if (data.image) {
        formData.append('image', data.image);
      }

      if (data.tags && data.tags.length) {
        formData.append('tags', JSON.stringify(data.tags));
      }

      const response = await api.post('/api/quizzes', formData);

      // Clear any saved draft
      localStorage.removeItem(DRAFT_STORAGE_KEY);

      // Navigate to add questions page
      navigate(`/quiz/${response.data.id}/questions`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create quiz. Please try again.');
      console.error('Create quiz error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock categories - replace with API call when backend is ready
  const categories = [
    { value: '', label: 'Select a category' },
    { value: '1', label: 'Math' },
    { value: '2', label: 'Science' },
    { value: '3', label: 'History' },
    { value: '4', label: 'Geography' },
    { value: '5', label: 'Entertainment' },
  ];

  const difficulties = [
    { value: '', label: 'Select difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create a New Quiz</h1>
        <p className={styles.subtitle}>Fill in the details below to get started</p>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Quiz Title"
          placeholder="Enter quiz title"
          error={errors.title?.message}
          hint="Give your quiz a catchy title"
          {...register('title')}
          required
        />

        <Textarea
          label="Description"
          placeholder="Describe what your quiz is about..."
          rows={4}
          error={errors.description?.message}
          hint="Help people understand what they'll learn"
          {...register('description')}
          required
        />

        <Select
          label="Category"
          options={categories}
          error={errors.categoryId?.message}
          {...register('categoryId')}
          required
        />

        <Select
          label="Difficulty Level"
          options={difficulties}
          error={errors.difficulty?.message}
          {...register('difficulty')}
          required
        />

        <TagInput
          label="Tags"
          hint="Short keywords (e.g. math, algebra, grade-5). Press Enter or comma to add."
          value={watch('tags') || []}
          onChange={(tags) => setValue('tags', tags, { shouldValidate: true })}
          error={errors.tags?.message}
        />

        <div className={styles.imageUpload}>
          <label className={styles.imageLabel}>
            Quiz Cover Image
            <span className={styles.optional}>(Optional)</span>
          </label>
          
          <div className={styles.imagePreviewContainer}>
            {imagePreview ? (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Quiz cover preview" />
                <button
                  type="button"
                  className={styles.removeImage}
                  onClick={() => {
                    setImagePreview(null);
                    setValue('image', undefined);
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className={styles.uploadBox}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
                <div className={styles.uploadContent}>
                  <span className={styles.uploadIcon}>📷</span>
                  <span className={styles.uploadText}>Click to upload image</span>
                  <span className={styles.uploadHint}>PNG, JPG, WEBP up to 5MB</span>
                </div>
              </label>
            )}
          </div>
          
          {errors.image && (
            <span className={styles.errorText}>{errors.image.message}</span>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="gray"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Quiz & Add Questions'}
          </Button>
        </div>
      </form>

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSaveDraft={saveDraft}
      />
    </div>
  );
}