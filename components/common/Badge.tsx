import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "accent" | "success" | "danger" | "muted";
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  const variantClasses = {
    primary: "bg-theme-primary-light text-theme-primary border border-theme-primary/20",
    secondary: "bg-theme-secondary-light text-theme-secondary border border-theme-secondary/20",
    accent: "bg-amber-500/10 text-theme-accent border border-amber-500/30",
    success: "bg-theme-success text-theme-success border border-emerald-500/20",
    danger: "bg-theme-danger text-theme-danger border border-red-500/20",
    muted: "bg-theme-bg text-theme-muted border border-theme-border",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full uppercase tracking-wider ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;

