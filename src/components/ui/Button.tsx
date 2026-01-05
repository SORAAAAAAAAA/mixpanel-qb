import { variantStyles } from "@/lib/constants";
import { ButtonVariant } from "@/types/ui/index";


export default function Button({ children, onClick, variant }: { children: React.ReactNode; onClick: () => void, variant: ButtonVariant }) {
  return (
    <button
      onClick={onClick}
      className={`${variantStyles[variant]} font-bold py-2 px-4 rounded`}
    >
      {children}
    </button>
  );
}