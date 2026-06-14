
import React from "react";

interface InputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { label: string; value: string }[];
    className?: string;
}

export default function SelectInput({
    label,
    className = "",
    options,
    ...props
}: InputProps) {
    const baseClasses = "w-full px-3 py-2 text-sm rounded-md focus:outline-none transition-all duration-300 border-1 border-gray-200 focus:border-accent ";

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label htmlFor={label} className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {label}
                </label>
            )}
            <select
                id={label}
                className={`${baseClasses} ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}