import styles from "./Error.module.css";

interface ErrorProps {
  /** Error message to display - defaults to generic error text */
  message?: string;
  /** Optional request/trace ID for debugging */
  requestId?: string;
}

/**
 * Error display component for showing user-friendly error messages
 * Displays custom or default error text with optional request ID for support
 */
export default function Error({ message, requestId }: ErrorProps) {
  return (
    <div className={styles.error}>
      <h1>Error</h1>
      <h2>{message ?? "An error occurred while processing your request."}</h2>
      {requestId && (
        <p>
          <strong>Reference ID:</strong> <code>{requestId}</code>
        </p>
      )}
      <h3>Developer Information (production only)</h3>
      <p>Contact system administrator. This information has been logged.</p>
    </div>
  );
}
