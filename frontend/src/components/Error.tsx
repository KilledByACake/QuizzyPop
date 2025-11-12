import styles from "./Error.module.css";

interface ErrorProps {
  message?: string;
  requestId?: string;
}

export default function Error({ message, requestId }: ErrorProps) {
  return (
    <div className={styles.error}>
      <h1>Feil</h1>
      <h2>{message ?? "Det har oppstått en feil under behandling av din forespørsel."}</h2>
      {requestId && (
        <p>
          <strong>Referanse-ID:</strong> <code>{requestId}</code>
        </p>
      )}
      <h3>Utviklerinformasjon (kun i produksjon)</h3>
      <p>Kontakt systemadministrator. Denne informasjonen er logget.</p>
    </div>
  );
}
