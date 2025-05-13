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
            className="bg-white w-full max-w-5xl h-auto p-4 shadow-lg overflow-y-scroll fixed bottom-0 left-1/2 transform -translate-x-1/2"
            onCancel={onClose}
        >
            <header className="flex justify-end">
                <button
                    onClick={onClose}
                    className="cursor-pointer hover:text-red-600"
                >
                    X
                </button>
            </header>
            {children}
        </dialog>
    );
}

export default DialogInfo;