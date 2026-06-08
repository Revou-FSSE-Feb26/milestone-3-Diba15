
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    label?: string;
    type?: string;
    className?: string;
}

export default function Input({
    placeholder,
    label,
    type = "text",
    className = "",
    ...props
}: InputProps) {
    const baseClasses = "w-full px-3 py-2 rounded-md focus:outline-none transition-all duration-300 border-1 border-gray-200 focus:border-accent ";

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-foreground">
                    {label}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                className={`${baseClasses} ${className}`}
                {...props}
            />
        </div>
    );
}