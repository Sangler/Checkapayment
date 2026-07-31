import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, type ReactNode } from "react";
import { getFeeItems } from "../../lib/fees";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  accountType?: "business" | "personal";
  children?: ReactNode;
}

export function Modal({ isOpen, onClose, title, description, accountType, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

const feeItems = getFeeItems(accountType);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Fee overview
            </div>
            <div className="text-lg font-semibold text-foreground">{title}</div>
            {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label="Close fee details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
          {children ?? (
            <ul className="space-y-2">
              {feeItems.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
