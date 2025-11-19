import { createContext, useContext, useReducer, type ReactNode } from "react";
import api from "../api";
import type { AxiosError } from "axios";

// Shape of a Quiz returned from the API
export interface Quiz {
  id: number;
  title: string;
  description: string;
  createdAt: string; // Dates are usually strings in JSON
  imageUrl: string;
  difficulty: string; // "easy" | "medium" | "hard" (kept as string for flexibility)
  categoryId: number;
  // You can add more fields here if you need them (category, user, questions, etc.)
}

// Payload for creating a new quiz
export interface CreateQuizPayload {
  title: string;
  description: string;
  imageUrl: string;
  difficulty: string;
  categoryId: number;
}

// State stored in the QuizContext
interface QuizState {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
}

// All possible actions for the reducer
type QuizAction =
  | { type: "START_LOADING" }
  | { type: "SET_QUIZZES"; payload: Quiz[] }
  | { type: "ADD_QUIZ"; payload: Quiz }
  | { type: "REMOVE_QUIZ"; payload: number } // quiz id
  | { type: "SET_ERROR"; payload: string | null };

// Initial state for the reducer
const initialState: QuizState = {
  quizzes: [],
  loading: false,
  error: null,
};

// Reducer function to manage quiz-related state
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
      // Exhaustive check (should never happen)
      return state;
  }
}

// What the context will expose to components
export interface QuizContextValue extends QuizState {
  fetchQuizzes: () => Promise<void>;
  createQuiz: (data: CreateQuizPayload) => Promise<void>;
  deleteQuiz: (id: number) => Promise<void>;
}

// Create the context (undefined until provided by QuizProvider)
const QuizContext = createContext<QuizContextValue | undefined>(undefined);

// Helper to extract a readable error message
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

// Provider component that wraps parts of the app that need quiz state
export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Fetch all quizzes from the API
  const fetchQuizzes = async () => {
    try {
      dispatch({ type: "START_LOADING" });

      const response = await api.get<Quiz[]>("/api/quizzes"); // ✅ Added /api

      dispatch({ type: "SET_QUIZZES", payload: response.data });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Failed to fetch quizzes:", message);
      dispatch({ type: "SET_ERROR", payload: message });
    }
  };

  // Create a new quiz via the API
  const createQuiz = async (data: CreateQuizPayload) => {
    try {
      dispatch({ type: "START_LOADING" });

      const response = await api.post<Quiz>("/api/quizzes", data); // ✅ Added /api

      dispatch({ type: "ADD_QUIZ", payload: response.data });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Failed to create quiz:", message);
      dispatch({ type: "SET_ERROR", payload: message });
    }
  };

  // Delete a quiz by id
  const deleteQuiz = async (id: number) => {
    try {
      dispatch({ type: "START_LOADING" });

      await api.delete(`/api/quizzes/${id}`); // ✅ Added /api

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

// Custom hook to use the QuizContext in components
export function useQuizContext(): QuizContextValue {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }

  return context;
}

export { QuizContext };