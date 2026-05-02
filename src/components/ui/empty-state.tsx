import { Button } from "./button";

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
};

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      {icon && (
        <div className="flex justify-center mb-3 text-muted-foreground/50">
          {icon}
        </div>
      )}
      <p className="text-lg font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-sm mt-1">{description}</p>
      )}
      {action && (
        <Button
            variant = "outline"
            size = "sm"
            className="mt-4"
            onClick={action.onClick}
        >
            {action.label}
        </Button>
      )}
    </div>
  );
}
