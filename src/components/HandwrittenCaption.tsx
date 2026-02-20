import React from 'react';

interface HandwrittenCaptionProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const HandwrittenCaption: React.FC<HandwrittenCaptionProps> = ({
    value,
    onChange,
    placeholder = "Write a memory...",
    className = ""
}) => {
    return (
        <div className={`relative ${className}`}>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border-none outline-none font-typewriter text-[#2A2A2A]/80 resize-none min-h-[60px] p-0 text-center text-sm leading-relaxed placeholder:text-[#2A2A2A]/20"
                maxLength={100}
            />
            <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#2A2A2A]/10 scale-x-75 mx-auto" />
        </div>
    );
};
