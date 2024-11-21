import ReactDOM from "react-dom";

export const Modal: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const modalRoot = document.getElementById("portal") as Element;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-start pt-20 justify-center bg-gray-900 bg-opacity-50 z-50">
      {children}
    </div>,
    modalRoot
  );
};
