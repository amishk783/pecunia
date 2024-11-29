import { cn } from "@/lib/utils";
import ReactDOM from "react-dom";

export const Modal: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const modalRoot = document.getElementById("portal") as Element;

  return ReactDOM.createPortal(
    <div
      className={cn(
        "fixed inset-0 flex md:items-start pt-20 justify-center bg-gray-900 bg-opacity-50 z-50",
        className
      )}
    >
      {children}
    </div>,
    modalRoot
  );
};
