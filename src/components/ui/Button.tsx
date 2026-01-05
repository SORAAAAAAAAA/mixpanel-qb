import { variantStyles } from "@/lib/constants";
import { ButtonVariant } from "@/types/ui/index";


export default function Button({ children, onClick, variant, disabled = false }: { children: React.ReactNode; onClick: () => void, variant: ButtonVariant, disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${variantStyles[variant]} font-bold px-3 rounded py-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}