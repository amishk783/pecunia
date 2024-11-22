import React, { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
interface ConfirmDeleteProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  handleDelete: () => void;
  handleClose: () => void;
}

export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  isOpen,
  children,
  className,
  handleDelete,
  handleClose,
}) => {
  return (
    <>
      {isOpen && (
        <Modal>
          <div className="w-auto h-min  flex flex-col items-center rounded-lg">
            <div className={cn("w-full", className)}>
              {children}

              <div className="flex w-full h-min items-center justify-end gap-4">
                <Button
                  className="rounded-lg px-7 py-3 text-blue-700"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  className="px-7 py-3 rounded-lg "
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
          ;
        </Modal>
      )}
    </>
  );
};
