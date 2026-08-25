import { useEffect, useRef } from "react";

interface PopInfoProps {
    children?: React.ReactNode;
    active: boolean;
    onClose: () => void;
}

export function DialogInfo({ children, active, onClose }: PopInfoProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (!dialogRef.current) return;

        if (active) {
            if (!dialogRef.current.open) {
                dialogRef.current.showModal(); // Abre el diálogo
            }
        } else {
            if (dialogRef.current.open) {
                dialogRef.current.close(); // Cierra el diálogo
            }
        }
    }, [active]);

    return (
        <dialog
            ref={dialogRef}
            className="bg-sand w-full max-w-5xl h-full px-6 sm:px-8 py-4 mx-4 rounded-t-[2rem] shadow-2xl shadow-dark-tertiary/30 overflow-y-scroll bottom-0 top-auto left-1/2 transform -translate-x-1/2"
            onCancel={onClose}
        >
            <header className="flex justify-end sticky top-0 pt-2 pb-2 bg-sand">
                <button
                    onClick={onClose}
                    className="cursor-pointer size-9 rounded-full bg-dark-tertiary/10 hover:bg-dark-tertiary/20 flex items-center justify-center transition-colors text-dark-tertiary"
                >
                    ✕
                </button>
            </header>
            {children}
        </dialog>
    );
}

export default DialogInfo;