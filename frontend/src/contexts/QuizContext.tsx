import { createContext, useContext, useReducer, type ReactNode } from "react";
import api from "../api";
import type { AxiosError } from "axios";

/** Quiz object shape returned from the API */
export interface Quiz {
  id: number;
  title: string;
  description: string;
  /** ISO date string when quiz was created */
  createdAt: string;
  /** URL path to quiz cover image */
  imageUrl: string;
  /** Difficulty level (easy/medium/hard) */
  difficulty: string;
  /** ID of the category this quiz belongs to */
  categoryId: number;
}

/** Payload for creating a new quiz */
export interface CreateQuizPayload {
  title: string;
  description: string;
  imageUrl: string;
  difficulty: string;
  categoryId: number;
}

/** State stored in the QuizContext */
interface QuizState {
  /** Array of all loaded quizzes */
  quizzes: Quiz[];
  /** Whether an async operation is in progress */
  loading: boolean;
  /** Error message if last operation failed */
  error: string | null;
}

/** All possible actions for the reducer */
type QuizAction =
  | { type: "START_LOADING" }
  | { type: "SET_QUIZZES"; payload: Quiz[] }
  | { type: "ADD_QUIZ"; payload: Quiz }
  | { type: "REMOVE_QUIZ"; payload: number } // quiz id
  | { type: "SET_ERROR"; payload: string | null };

/** Initial state for the reducer */
const initialState: QuizState = {
  quizzes: [],
  loading: false,
  error: null,
};

/**
 * Reducer function to manage quiz-related state
 * Handles loading states, quiz CRUD operations, and error management
 */
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, loading: true, error: null };

    case "SET_QUIZZES":
      return { ...state, quizzes: action.payload, loading: false, error: null };

    case "ADD_QUIZ":
      return {
        ...state,
        quizzes: [...state.quizzes, action.payload],
        loading: false,
        error: null,
      };

    case "REMOVE_QUIZ":
      return {
        ...state,
        quizzes: state.quizzes.filter((quiz) => quiz.id !== action.payload),
        loading: false,
        error: null,
      };

    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

/** Context value exposed to components - combines state with actions */
export interface QuizContextValue extends QuizState {
  /** Fetch all quizzes from API */
  fetchQuizzes: () => Promise<void>;
  /** Create a new quiz */
  createQuiz: (data: CreateQuizPayload) => Promise<void>;
  /** Delete a quiz by ID */
  deleteQuiz: (id: number) => Promise<void>;
}

/** Quiz context - provides quiz state and actions globally */
const QuizContext = createContext<QuizContextValue | undefined>(undefined);

/**
 * Extract readable error message from various error types
 * Handles Axios errors, Error objects, and strings
 */
function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  const axiosError = error as AxiosError<any>;

  // Try to read message from Axios error response
  if (axiosError.response && axiosError.response.data) {
    const data = axiosError.response.data as any;
    if (typeof data === "string") return data;
    if (typeof data.message === "string") return data.message;
  }

  if (error instanceof Error) return error.message;

  return "An unknown error occurred";
}

/**
 * Quiz context provider component
 * Manages global quiz state with useReducer and provides CRUD operations
 * Wrap around components that need access to quiz data
 */
export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  /** Fetch all quizzes from the API and update state */
  const fetchQuizzes = async () => {
    try {
      dispatch({ type: "START_LOADING" });

      const response = await api.get<Quiz[]>("/api/quizzes");

      dispatch({ type: "SET_QUIZZES", payload: response.data });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Failed to fetch quizzes:", message);
      dispatch({ type: "SET_ERROR", payload: message });
    }
  };

  /** Create a new quiz via the API and add to state */
  const createQuiz = async (data: CreateQuizPayload) => {
    try {
      dispatch({ type: "START_LOADING" });

      const response = await api.post<Quiz>("/api/quizzes", data);

      dispatch({ type: "ADD_QUIZ", payload: response.data });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Failed to create quiz:", message);
      dispatch({ type: "SET_ERROR", payload: message });
    }
  };

  /** Delete a quiz by id from API and remove from state */
  const deleteQuiz = async (id: number) => {
    try {
      dispatch({ type: "START_LOADING" });

      await api.delete(`/api/quizzes/${id}`);

      dispatch({ type: "REMOVE_QUIZ", payload: id });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Failed to delete quiz:", message);
      dispatch({ type: "SET_ERROR", payload: message });
    }
  };

  const value: QuizContextValue = {
    ...state,
    fetchQuizzes,
    createQuiz,
    deleteQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

/**
 * Hook to access quiz context
 * Must be used within QuizProvider
 * @throws Error if used outside QuizProvider
 */
export function useQuizContext(): QuizContextValue {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }

  return context;
}

export { QuizContext };