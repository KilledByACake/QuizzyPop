import { type ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary" // Green solid
    | "secondary" // White with green border
    | "outline" // Transparent with green border
    | "danger" // Red (delete actions)
    | "success" // Bright green (finish/publish)
    | "gray" // Gray (cancel/previous)
    | "link"; // Text-only button
  size?: "small" | "medium" | "large" | "xl" | "icon";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const { disabled, type, ...rest } = props;

  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type ?? "button"} 
      className={classes}
      {...rest}
      disabled={disabled}
      aria-disabled={disabled || undefined}
    >
      {children}
    </button>
  );
}