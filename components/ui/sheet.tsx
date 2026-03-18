"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SheetContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

export function useSheet() {
    const context = React.useContext(SheetContext);
    if (!context) {
        throw new Error("useSheet must be used within a Sheet");
    }
    return context;
}

interface SheetProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function Sheet({ children, open: controlledOpen, onOpenChange }: SheetProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    const setOpen = React.useCallback(
        (newOpen: boolean) => {
            if (onOpenChange) {
                onOpenChange(newOpen);
            }
            if (!isControlled) {
                setUncontrolledOpen(newOpen);
            }
        },
        [isControlled, onOpenChange]
    );

    return (
        <SheetContext.Provider value={{ open, setOpen }}>
            {children}
        </SheetContext.Provider>
    );
}

export function SheetTrigger({ children }: { children: React.ReactNode, asChild?: boolean }) {
    const { setOpen } = useSheet();
    // Simplified for now, just wrapping logic
    return (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
            {children}
        </div>
    );
}

export function SheetContent({ children, className }: { children: React.ReactNode; className?: string }) {
    const { open, setOpen } = useSheet();

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/30"
                        onClick={() => setOpen(false)}
                    />
                    {/* Panel — no built-in close button; consumers render their own */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed inset-y-0 right-0 z-50 h-full w-full bg-background shadow-2xl sm:max-w-md",
                            className
                        )}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function SheetHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}>
            {children}
        </div>
    );
}

export function SheetTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h2 className={cn("text-lg font-semibold text-foreground italic uppercase tracking-wider", className)}>
            {children}
        </h2>
    );
}
