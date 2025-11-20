import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export default function Modal({ open, onOpenChange, trigger, title, children, isProtected = false }) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
                <Dialog.Content
                    onInteractOutside={(e) => {
                        if (isProtected) e.preventDefault();
                    }}
                    onEscapeKeyDown={(e) => {
                        if (isProtected) {
                            if (!window.confirm("Are you sure you want to close this?")) {
                                e.preventDefault();
                            }
                        }
                    }}
                    className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-[#141414] border border-[#2B2B2B] shadow-xl focus:outline-none z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#2B2B2B] bg-[#1A1A1A]">
                        <Dialog.Title className="text-sm font-bold text-white red-hat-text">
                            {title}
                        </Dialog.Title>
                        <Dialog.Close
                            onClick={(e) => {
                                if (isProtected) {
                                    if (!window.confirm("Are you sure you want to close this?")) {
                                        e.preventDefault();
                                    }
                                }
                            }}
                            className="text-gray-400 hover:text-white transition-colors cursor-pointer outline-none">
                            <X className="w-4 h-4" />
                        </Dialog.Close>
                    </div>
                    <div className="p-4 text-gray-300 red-hat-text">
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

