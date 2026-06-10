import React from "react";

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    placeholder?: string;
    label?: string;
    type?: string;
    className?: string;
}

export default function TextArea({
    placeholder,
    label,
    className = "",
    ...props
}: InputProps) {
    const baseClasses = "w-full px-3 py-2 text-sm rounded-md focus:outline-none transition-all duration-300 border-1 border-gray-200 focus:border-accent resize-none";

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label htmlFor={label} className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {label}
                </label>
            )}
            <textarea
                id={label}
                placeholder={placeholder}
                className={`${baseClasses} ${className}`}
                {...props}
            />
        </div>
    )
}